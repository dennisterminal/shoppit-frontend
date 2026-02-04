import { useState, useEffect } from "react";
import api from "../api";

function useCartData() {
  const cart_code = localStorage.getItem("cart_code");
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0.0);
  const tax = 4.0;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cart_code) {
      console.log("No cart code found");
      setLoading(false);
      setError("No cart code found");
      return;
    }

    setLoading(true);
    setError(null);

    api
      .get(`get_cart?cart_code=${cart_code}`)
      .then((res) => {
        console.log("Cart data fetched:", res.data);
        setCartItems(res.data.items || []);
        setCartTotal(res.data.sum_total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [cart_code]);

  return {
    cartItems,
    setCartItems,
    cartTotal,
    setCartTotal,
    loading,
    tax,
    error,
  };
}
export default useCartData;
