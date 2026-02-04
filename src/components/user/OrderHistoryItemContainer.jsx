import OrderHistoryItem from "./OrderHistoryItem";

const OrderHistoryItemContainer = ({orderItems}) => {
  return (
    <div className="row" style={{ height: "400px", overflow: "auto" }}>
      <div className="col-md-12">
        <div className="card">
          <div
            className="car-header"
            style={{ backgroundColor: "#6050DC", color: "white" }}
          >
            <h5>Order History</h5>
          </div>

          {orderItems.map(item => <OrderHistoryItem key={item.id} item={item}/>)}

        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItemContainer;
