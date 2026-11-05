import OrderItemReview from "../OrderItemReview/OrderItemReview";
import { FaChevronDown } from "react-icons/fa";
import "./OrderReviewsIntegration.css";
import { useState } from "react";

const OrderReviewsIntegration = ({ order, setOrders }) => {
  const [expandReviews, setExpandReviews] = useState(false);

  // Only show review option for delivered orders
  if (order.status !== "Delivered") {
    return null;
  }

  return (
    <div className="order-reviews-section">
      <div className="order-reviews-header">
        <h3>Product Reviews</h3>
        <p>Share your experience with the products you purchased</p>

        <button
          className="toggle-reviews-button"
          onClick={() => setExpandReviews(!expandReviews)}
        >
          {expandReviews ? "Hide Review Forms" : "Write Reviews"}
          <FaChevronDown
            style={{
              transform: expandReviews ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
      </div>

      {expandReviews && (
        <div className="order-reviews-items">
          {order.items.map((item) => (
            <OrderItemReview
              key={item._id}
              item={item}
              orderId={order._id}
              setOrders={setOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderReviewsIntegration;
