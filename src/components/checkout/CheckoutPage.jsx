import OrderSummary from "./OrderSummary";
import PaymentSection from "./PaymentSection";
import Spinner from "../ui/Spinner";
import useCartData from "../../hooks/useCartData";

const CheckoutPage = () => {
  const {
    cartItems,
    setCartItems,
    cartTotal,
    setCartTotal,
    loading,
    tax,
    error,
  } = useCartData();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container my-3">
        <div className="alert alert-danger" role="alert">
          Error loading cart: {error}
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container my-3">
        <div className="alert alert-info" role="alert">
          Your cart is empty. Please add items before checking out.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-3">
      <div className="row">
        <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax}/>
        <PaymentSection />
      </div>
    </div>
  );
};

export default CheckoutPage;
