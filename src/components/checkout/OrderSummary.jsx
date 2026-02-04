import OrderItem from "./OrderItem";
import Styles from "./OrderSummary.module.css";

const OrderSummary = ({ cartItems, cartTotal, tax }) => {
  const total = (cartTotal + tax).toFixed(2);

  return (
    <div className="col-md-8">
      <div className={`card mb-4 ${Styles.card}`}>
        <div
          className="card-header"
          style={{ backgroundColor: "#6050DC", color: "#fff" }}
        >
          <h5>Order Summary</h5>
        </div>
        <div className="card-body">
          <div className="px-3" style={{ height: "300px", overflowY: "auto" }}>
            {/* Order items will be dynamically rendered here */}

            {cartItems.map((cartitem) => (
              <OrderItem key={cartitem.id} cartitem={cartitem} />
            ))}

            <hr />
            <div className="d-flex justify-content-between">
              <h6>Subtotal</h6>
              <h6>{`$${total}`}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
