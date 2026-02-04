import { BASE_URL } from "../../api";
import styles from "./OrderHistoryItem.module.css";

const OrderHistoryItem = ({ item }) => {
  return (
    <div className="card-body">
      <div className={`order-item mb-3 ${styles.orderItem}`}>
        <div className="row">
          <div className="col-md-2">
            <img
              src={`${BASE_URL}${item.product.image}`}
              alt="Order Item"
              className="image-fluid me-3"
              style={{
                borderRadius: "5px",
                width: "80px",
                height: "80px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="col-md-6">
            <h6>{item.product.name}</h6>
            <p>{`Order Date: ${item.order_date}`}</p>
            <p>{`Order ID: ${item.order_id}`}</p>
          </div>
          <div className="col-md-2 text-center">
            <h6 className="text-muted">{`Quantity: ${item.quantity}`}</h6>
          </div>
          <div className="col-md-2 text-center">
            <h6 className="text-muted">{`$${item.product.price}`}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
