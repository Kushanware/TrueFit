import { addProductReview } from "../../../services/services";
import { StoreContext } from "../../Context/StoreContext";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "./ProductReview.css";

const ProductReview = ({
  orderId,
  setOrders,
  productId,
  showReviewForm,
  setShowReviewForm,
}) => {
  const { token } = useContext(StoreContext);
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateOrderItems = (orderId, newOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order._id === orderId ? newOrder : order))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setLoading(true);

    toast.promise(
      addProductReview(token, orderId, productId, rating, review).then(
        async (res) => {
          if (res.data.success) {
            setLoading(false);
            setSubmitted(true);
            updateOrderItems(orderId, res.data.order);
            setTimeout(() => {
              setShowReviewForm(!showReviewForm);
            }, 3000);
          } else {
            setTimeout(() => {
              setLoading(false);
            }, 1000);
            toast.error(
              res.data.message || "Something went wrong! Review not sent."
            );
            return Promise.reject(
              new Error(res.data.message || "Could not add new product.")
            );
          }
          return res.data;
        }
      ),
      {
        // pending: "Submitting review...",
        // success: "Review submitted.",
        error: "Could not submit review.",
      }
    );
  };

  if (submitted) {
    return (
      <div className="review-form-container">
        <div className="review-success">
          <div className="review-success-icon">
            <FaCheckCircle size={24} />
          </div>
          <h3>Thank you for your review!</h3>
          <p>Your feedback helps other shoppers make better decisions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <form onSubmit={handleSubmit} className="review-form ">
        <div className="review-rating-container">
          <label>
            Your Rating <span className="required"></span>
          </label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${
                  star <= (hoverRating || rating) ? "active" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} stars out of 5`}
              >
                <FaStar className="star-icon" />
              </button>
            ))}
          </div>
        </div>

        <div className="review-input-group">
          <label htmlFor="review-content ">Your Review</label>
          <textarea
            id="review-content"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you like or dislike about this product? How was the quality, fit, and comfort?"
            className="review-textarea"
            rows={5}
            required
          />
        </div>

        <div className="review-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductReview;
