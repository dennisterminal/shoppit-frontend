import { useState } from "react";
import styles from "./PaymentSection.module.css";
import api from "../../api";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const BASE_URL = "http://127.0.0.1:8000/";

// Replace with your actual PayPal Client ID (sandbox for testing)
// Best practice: store in .env as REACT_APP_PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_SANDBOX_CLIENT_ID_HERE";

const PaymentSection = () => {
  const cart_code = localStorage.getItem("cart_code");
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Helper to refresh token and retry a request
  const refreshTokenAndRetry = async (originalRequestFn) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available. Please log in again.");
    }

    try {
      const refreshRes = await axios.post(`${BASE_URL}api/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = refreshRes.data.access;
      localStorage.setItem("accessToken", newAccessToken);

      // Retry the original request with new token
      return await originalRequestFn(newAccessToken);
    } catch (refreshErr) {
      console.error(
        "Token refresh failed:",
        refreshErr.response?.data || refreshErr.message,
      );
      throw new Error("Session expired. Please log in again.");
    }
  };

  // PayPal: Create order (calls backend to create PayPal order and return order_id)
  const createOrder = async () => {
    setPaypalLoading(true);
    setError(null);

    const requestFn = async (token) => {
      const res = await api.post(
        "initiate-paypal-payment/", // ← Adjust to your actual PayPal initiate endpoint (e.g., if renamed)
        { cart_code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const { order_id } = res.data;
      if (!order_id) throw new Error("No order ID received");
      return order_id;
    };

    try {
      return await requestFn(localStorage.getItem("accessToken"));
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.data?.code === "token_not_valid"
      ) {
        console.warn("Access token expired, refreshing...");
        return await refreshTokenAndRetry(requestFn);
      }
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to create PayPal order";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setPaypalLoading(false);
    }
  };

  // PayPal: Capture approved order
  const onApprove = async (data) => {
    setPaypalLoading(true);
    setError(null);

    const requestFn = async (token) => {
      const res = await api.post(
        "capture-paypal-payment/", // ← Adjust to your actual PayPal capture endpoint
        { order_id: data.orderID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.message?.toLowerCase().includes("success")) {
        setSuccess(true);
        alert("Payment successful! Thank you for your purchase.");
        // Optional: redirect to success page
        // window.location.href = "/payment-success";
      } else {
        throw new Error("Capture failed");
      }
    };

    try {
      await requestFn(localStorage.getItem("accessToken"));
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.data?.code === "token_not_valid"
      ) {
        console.warn("Access token expired, refreshing...");
        await refreshTokenAndRetry(requestFn);
      } else {
        const errorMsg =
          err.response?.data?.error || err.message || "Payment capture failed";
        setError(errorMsg);
        console.error("Capture error:", err);
        alert(`Payment failed: ${errorMsg}`);
      }
    } finally {
      setPaypalLoading(false);
    }
  };

  const onCancel = () => {
    setError("Payment was cancelled by user");
  };

  const onPaypalError = (err) => {
    console.error("PayPal SDK error:", err);
    setError("An error occurred with PayPal. Please try again.");
  };

  // Existing Flutterwave payment function (unchanged except minor cleanup)
async function makePayment() {
  setLoading(true);
  setError(null);

  const requestFn = async (token) => {
    const res = await api.post(
      "initiate_payment/",
      { cart_code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Payment response:", res.data);
    window.location.href = res.data.data.link;
  };

  try {
    await requestFn(localStorage.getItem("accessToken"));
  } catch (err) {
    if (
      err.response?.status === 401 ||
      err.response?.data?.code === "token_not_valid"
    ) {
      console.warn("Access token expired, refreshing...");
      await refreshTokenAndRetry(requestFn);
    } else {
      const backendError = err.response?.data?.error || err.response?.data || err.message;
      console.error("Full Flutterwave backend error:", backendError);
      const errorMsg = backendError || "Payment error";
      setError(errorMsg);
      console.error("Payment error:", err);
    }
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="col-md-4">
      <div className={`card ${styles.card}`}>
        <div
          className="card-header"
          style={{ backgroundColor: "#6050DC", color: "#fff" }}
        >
          <h5>Payment Options</h5>
        </div>
        <div className="card-body">
          {error && <p className="text-danger mb-3">{error}</p>}
          {success && (
            <p className="text-success mb-3">Payment Completed Successfully!</p>
          )}

          {/* PayPal Payment Section */}
          <div className="mb-3">
            <PayPalScriptProvider
              options={{
                "client-id": PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal",
                  height: 48,
                }}
                disabled={paypalLoading || loading || success}
                createOrder={createOrder}
                onApprove={onApprove}
                onCancel={onCancel}
                onError={onPaypalError}
              />
            </PayPalScriptProvider>
          </div>

          {/* Flutterwave Payment Button (unchanged) */}
          <button
            className={`btn btn-warning w-100 ${styles.flutterwaveButton}`}
            onClick={makePayment}
            id="flutterwave-button"
            disabled={loading || success}
          >
            <i className="bi bi-credit-card"></i>{" "}
            {loading ? "Processing..." : "Pay with Flutterwave"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
