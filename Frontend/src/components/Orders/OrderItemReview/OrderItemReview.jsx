import ProductReview from "../ProductReview/ProductReview";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./OrderItemReview.css";

const OrderItemReview = ({ item, orderId, setOrders }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className="order-item-review">
      <div className="review-order-item">
        <div className="item-image">
          <img
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
          />
          {item.discount && (
            <span className="item-discount">{item.discount}%</span>
          )}
        </div>
        <div className="item-details">
          <h4>{item.name}</h4>
          <div className="item-meta">
            {item.color && (
              <span className="d-flex gap-2">
                <div>Color: {item.color}</div>
                <div
                  className="cart-item-color-circle"
                  style={{ backgroundColor: item.color }}
                ></div>
              </span>
            )}
            {item.size && <span>Size: {item.size}</span>}
            <span>Qty: {item.quantity}</span>
          </div>
        </div>
        <div className="item-price">
          {item.discount ? (
            <span className="current-price me-0">
              &#8377;
              {Math.floor(
                item.price - (item.price * item.discount) / 100
              ).toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="current-price me-0">
              &#8377;
              {item.price.toLocaleString("en-IN")}
            </span>
          )}
          {item.discount ? (
            <span className="original-price me-0">
              &#8377;
              {Math.floor(item.price).toLocaleString("en-IN")}
            </span>
          ) : null}

          {!item.reviewed ? (
            <button
              className="review-button"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          ) : (
            <Link
              to={`/product/${item.productId}`}
              className="btn btn-sm btn-success"
            >
              Reviewed
            </Link>
          )}
        </div>
      </div>

      {showReviewForm && (
        <div className="review-form-wrapper">
          <ProductReview
            setOrders={setOrders}
            orderId={orderId}
            productId={item.productId}
            setShowReviewForm={setShowReviewForm}
            showReviewForm={showReviewForm}
          />
        </div>
      )}
    </div>
  );
};

export default OrderItemReview;
