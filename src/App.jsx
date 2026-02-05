import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./components/home/HomePage";
import NotFoundPage from "./components/ui/NotFoundPage";
import ProductPage from "./components/product/ProductPage";
import CartPage from "./components/cart/CartPage";
import { useState, useEffect } from "react";
import api from "./api";
import CheckoutPage from "./components/checkout/CheckoutPage";
import LoginPage from "./components/user/LoginPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import UserProfilePage from "./components/user/UserProfilePage";
import PaymentStatusPage from "./components/checkout/PaymentStatusPage";

const App = () => {
  const [numCartItems, setNumberCartItems] = useState(0);
  
  // Initialize cart on first load
  useEffect(() => {
    let cart_code = localStorage.getItem("cart_code");
    if (!cart_code) {
      // Generate random cart code
      cart_code = "cart_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("cart_code", cart_code);
      console.log("New cart created:", cart_code);
    }
  }, []);

  const cart_code = localStorage.getItem("cart_code");

  const updateCartCount = () => {
    if (cart_code) {
      api
        .get(`get_cart/?cart_code=${cart_code}`)
        .then((res) => {
          // Check if items exists and is an array
          if (res.data && res.data.items && Array.isArray(res.data.items)) {
            setNumberCartItems(res.data.items.length);
          } else {
            // Cart doesn"t exist or has no items
            setNumberCartItems(0);
          }
        })
        .catch((err) => {
          console.log(err.message);
          setNumberCartItems(0);
        });
    } else {
      setNumberCartItems(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [cart_code]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout numCartItems={numCartItems} />}>
            <Route index element={<HomePage />} />
            <Route
              path="products/:slug"
              element={<ProductPage updateCartCount={updateCartCount} />}
            />
            <Route
              path="cart"
              element={<CartPage updateCartCount={updateCartCount} />}
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="payment-status" element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;