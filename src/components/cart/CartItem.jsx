import api, { BASE_URL } from "../../api";
import { useState } from "react";
import { toast } from "react-toastify";

const CartItem = ({
  item,
  setCartTotal,
  setCartItems,
  cartItems,
  updateCartCount, // Changed from setNumberCartItems to updateCartCount
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const itemData = { quantity: quantity, item_id: item.id };
  const itemID = { item_id: item.id };

  function deleteCartItem() {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item from the cart?",
    );
    if (confirmDelete) {
      setLoading(true);
      api
        .post("delete_cartitem/", itemID)
        .then((res) => {
          console.log(res.data);
          toast.success("Item removed from cart successfully!");
          const updatedCartItems = cartItems.filter(
            (cartitem) => cartitem.id !== item.id,
          );
          setCartItems(updatedCartItems);

          // Recalculate cart total
          setCartTotal(
            updatedCartItems.reduce((acc, curr) => {
              const total =
                curr.total || curr.product?.price * curr.quantity || 0;
              return acc + (Number(total) || 0);
            }, 0),
          );

          // Call updateCartCount instead of setNumberCartItems
          if (updateCartCount && typeof updateCartCount === 'function') {
            updateCartCount();
          }

          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
          toast.error("Failed to remove item from cart!");
        });
    }
  }

  function updateCartItem() {
    setLoading(true);
    api
      .patch("update_quantity/", itemData)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        toast.success("Cart item updated successfully!");
        
        const updatedItem = res.data.data;
        
        // Update the item in cart
        const updatedCartItems = cartItems.map((cartitem) =>
          cartitem.id === item.id ? { ...cartitem, ...updatedItem } : cartitem
        );
        
        setCartItems(updatedCartItems);

        // Recalculate cart total
        setCartTotal(
          updatedCartItems.reduce((acc, curr) => {
            const total =
              curr.total || curr.product?.price * curr.quantity || 0;
            return acc + (Number(total) || 0);
          }, 0),
        );

        // Call updateCartCount instead of setNumberCartItems
        if (updateCartCount && typeof updateCartCount === 'function') {
          updateCartCount();
        }
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        toast.error("Failed to update item!");
      });
  }

  return (
    <div className="col-md-12">
      {/* Cart Item */}
      <div
        className="cart-item d-flex align-items-center mb-3 p-3"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
      >
        <img
          src={`${BASE_URL}${item.product.image}`}
          alt="Product Image"
          className="img-fluid"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
        <div className="ms-3 flex-grow-1">
          <h5 className="mb-1">{item.product.name}</h5>
          <p className="mb-0 text-muted">{`$${item.product.price}`}</p>
        </div>
        <div className="d-flex align-items-center">
          <input
            type="number"
            className="form-control me-3"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            style={{ width: "70px" }}
          />
          <button
            className="btn btn-sm mx-2"
            onClick={updateCartItem}
            style={{ backgroundColor: "#4b3bcb", color: "white" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button className="btn btn-danger btn-sm" onClick={deleteCartItem}>
            Remove
          </button>
        </div>
      </div>
      {/* End of Cart Item */}
    </div>
  );
};

export default CartItem;