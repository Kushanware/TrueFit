import { useContext, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaThumbsUp,
  FaRegThumbsUp,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import "./ProductReviewSection.css";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import { deleteProductReview } from "../../../services/services";

const ProductReviewSection = ({
  product,
  setProduct,
  reviewsRef,
  expanded,
  setExpanded,
}) => {
  const { user, token } = useContext(StoreContext);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [helpfulReviews, setHelpfulReviews] = useState({});

  // Handle marking a review as helpful
  const handleHelpfulClick = (reviewId) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter reviews based on active filter
  const getFilteredReviews = () => {
    if (!product?.reviews) return [];

    return product.reviews.filter((review) => {
      if (reviewFilter === "all") return true;
      if (reviewFilter === "positive") return review.rating >= 4;
      if (reviewFilter === "critical") return review.rating <= 2;
      return true;
    });
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    return (
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    );
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    if (!product?.reviews) return [0, 0, 0, 0, 0];

    const distribution = [0, 0, 0, 0, 0];
    product.reviews.forEach((review) => {
      const ratingIndex = Math.floor(review.rating) - 1;
      if (ratingIndex >= 0 && ratingIndex < 5) {
        distribution[ratingIndex]++;
      }
    });

    return distribution.reverse(); // 5 stars first
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }

    return stars;
  };

  const handleDeleteReview = async (reviewId) => {
    if (user?.role !== "Admin") {
      toast.error("!Access Denied!");
      return;
    }

    toast.promise(
      deleteProductReview(token, product._id, reviewId).then(async (res) => {
        if (res.data.success) {
          setProduct((prevProduct) => ({
            ...prevProduct,
            reviews: prevProduct.reviews.filter(
              (review) => review._id !== reviewId
            ),
          }));
        } else {
          return Promise.reject(
            new Error(res.data.message || "Error while deleting review.")
          );
        }
        return res.data;
      }),
      {
        pending: "Deleting review...",
        success: "Review deleted.",
        error: "Could not delete review.",
      }
    );
  };

  return (
    <div className="product-review-section" ref={reviewsRef}>
      <div className="review-header" onClick={() => setExpanded(!expanded)}>
        <div className="review-header-left">
          <h3>Reviews</h3>
          <div className="reviews-summary">
            {/* <div className="stars">{renderStars(product?.rating || 0)}</div> */}
            {/* <span className="review-count">
              ({product?.reviews?.length || 0} reviews)
            </span> */}
          </div>
        </div>
        <div className="review-header-icon">
          <FaChevronDown
            className={`accordion-icon ${expanded ? "active" : ""}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="review-content">
          {product?.reviews && product.reviews.length > 0 ? (
            <>
              <div className="reviews-summary-section">
                <div className="rating-overview">
                  <div className="average-rating">
                    <span className="rating-number">
                      {getAverageRating().toFixed(1)}
                    </span>
                    <div className="rating-stars-large">
                      {renderStars(getAverageRating())}
                    </div>
                    <span className="rating-count-text">
                      {product.reviews.length} reviews
                    </span>
                  </div>

                  <div className="rating-bars">
                    {getRatingDistribution().map((count, index) => {
                      const starNumber = 5 - index;
                      const percentage =
                        product.reviews.length > 0
                          ? (count / product.reviews.length) * 100
                          : 0;

                      return (
                        <div key={starNumber} className="rating-bar-row">
                          <span className="star-label">{starNumber} star</span>
                          <div className="rating-bar-container">
                            <div
                              className="rating-bar-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="rating-percentage">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="review-filters">
                  <h4>Filter Reviews</h4>
                  <div className="filter-buttons">
                    <button
                      className={reviewFilter === "all" ? "active" : ""}
                      onClick={() => setReviewFilter("all")}
                    >
                      All
                    </button>
                    <button
                      className={reviewFilter === "positive" ? "active" : ""}
                      onClick={() => setReviewFilter("positive")}
                    >
                      Positive
                    </button>
                    <button
                      className={reviewFilter === "critical" ? "active" : ""}
                      onClick={() => setReviewFilter("critical")}
                    >
                      Critical
                    </button>
                  </div>
                </div>
              </div>

              <div className="reviews-list">
                {getFilteredReviews().map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-card-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review?.author?.profileImage?.url ? (
                            <img
                              src={
                                review?.author?.profileImage?.url ||
                                "/placeholder.svg"
                              }
                              alt={review?.author?.name}
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              <FaUser />
                            </div>
                          )}
                        </div>
                        <div className="reviewer-details">
                          <div className="reviewer-name">
                            {review?.author?.name}
                            {/* {review.author.verified && (
                              <span
                                className="verified-badge"
                                title="Verified User"
                              >
                                <FaCheck />
                              </span>
                            )} */}
                          </div>
                          <div className="review-date">
                            {review.createdAt
                              ? formatDate(review?.createdAt)
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review?.rating)}
                      </div>
                    </div>

                    {/* {review.verified && (
                      <div className="verified-purchase">
                        <FaCheck />
                        <span>Verified Purchase</span>
                      </div>
                    )} */}

                    {/* {review.title && (
                      <h4 className="review-title">{review.title}</h4>
                    )} */}

                    <p className="review-comment">{review.review}</p>

                    {/* {review?.images && review?.images.length > 0 && (
                      <div className="review-images">
                        {review.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="review-image">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Review image ${imgIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    )} */}

                    <div className="review-actions">
                      {user?.role === "Admin" && (
                        <button
                          className="review-delete-btn"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      )}

                      <button
                        className={`helpful-button ms-auto ${
                          helpfulReviews[review._id] ? "active" : ""
                        }`}
                        onClick={() => handleHelpfulClick(review._id)}
                      >
                        {helpfulReviews[review._id] ? (
                          <FaThumbsUp />
                        ) : (
                          <FaRegThumbsUp />
                        )}
                        <span>
                          Helpful (
                          {(review.helpful || 0) +
                            (helpfulReviews[review._id] ? 1 : 0)}
                          )
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-reviews">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
