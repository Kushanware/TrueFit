import { StoreContext } from "../../components/Context/StoreContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useContext, useEffect, useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const {
    toggleWishlist,
    toggleCart,
    cartData,
    wishlistData,
    getWishlistProducts,
    wishlistProducts,
  } = useContext(StoreContext);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    getWishlistProducts();
    const timer = setTimeout(() => setShowImage(true), 1000);
    return () => clearTimeout(timer);
  }, [wishlistData]);

  return (
    <div className="wishlist-container" data-aos="fade-up">
      <h1 className="wishlist-title ">Your Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">
            <FaHeart />
          </div>
          <h2>Your wishlist is empty.</h2>
          <Link to="/collection/All">
            <button className="luxury-btn">Start Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistProducts.map((item, index) => (
            <div
              key={item._id}
              className="product-card luxury-card"
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <div className="product-image">
                <LazyLoadImage
                  id="collectionOrShop-image"
                  alt={item.name}
                  src={showImage ? item?.images?.[0]?.url : null}
                  placeholderSrc="/images/Lazy-Image.png"
                  effect="opacity"
                  delayTime={1000}
                  wrapperClassName="collectionOrShop-image-wrapper"
                />
                {item.stock === 0 ? (
                  <span className="card-image-out-of-stock-badge">
                    Out of Stock
                  </span>
                ) : null}
                <button
                  className={`favorite-btn active`}
                  onClick={() => toggleWishlist(item._id)}
                >
                  <FaTrash />
                </button>
                {item.discount ? (
                  <div className="discount-badge">-{item.discount}%</div>
                ) : null}
                <div className="rating-badge">
                  <span>★</span> {item.rating}
                </div>
              </div>
              <div className="product-info">
                <h3 className="wishlist-product-name">{item.name}</h3>
                <div className="wishlist-product-price">
                  {item.discount ? (
                    <span className="current-price">
                      &#8377;
                      {Math.floor(
                        item.price - (item.price * item.discount) / 100
                      ).toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <span className="current-price">
                      &#8377;
                      {item.price.toLocaleString("en-IN")}
                    </span>
                  )}
                  {item.discount ? (
                    <span className="original-price">
                      &#8377;
                      {Math.floor(item.price).toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="review-count">
                  {item.reviews.length} &nbsp;
                  {item.reviews.length === 1 ? "review" : "reviews"}
                </div>
                <div className="product-actions">
                  <Link
                    to={`/product/${item._id}`}
                    className="view-product-btn luxury-btn"
                  >
                    View Product
                  </Link>
                  {item.stock > 0 ? (
                    <button
                      className={`add-to-cart-btn ${
                        cartData[item._id] ? "in-cart" : ""
                      }`}
                      onClick={() => toggleCart(item._id)}
                    >
                      <FiShoppingCart />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
