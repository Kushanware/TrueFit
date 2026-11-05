import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { StoreContext } from "../../Context/StoreContext";
import { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import "./ProductsRegularOrListView.css";
import { Link } from "react-router-dom";

const ProductsRegularOrListView = () => {
  const {
    viewMode,
    products,
    wishlistData,
    toggleWishlist,
    cartData,
    toggleCart,
    clearAllFilters,
  } = useContext(StoreContext);

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 1000); // delay 1s
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={`gridOrList-products-grid ${
          viewMode === "list" ? "list-view" : ""
        }`}
        data-aos="fade-up"
      >
        {products?.map((product, index) => (
          <div
            key={product._id}
            className="gridOrList-product-card luxury-card"
          >
            <div className="gridOrList-product-image">
              <LazyLoadImage
                id="collectionOrShop-image"
                alt={product.name}
                src={showImage ? product?.images?.[0]?.url : null}
                placeholderSrc="/images/Lazy-Image.png"
                effect="opacity"
                delayTime={1000}
                wrapperClassName="collectionOrShop-image-wrapper"
              />
              {product.stock === 0 ? (
                <span className="collection-card-image-out-of-stock-badge">
                  Out of Stock
                </span>
              ) : null}
              {product.tags.includes("New") && product.stock !== 0 ? (
                <span className="collection-card-image-new-badge">New</span>
              ) : null}
              <button
                className={`favorite-btn ${
                  wishlistData[product._id] ? "active" : ""
                }`}
                onClick={() => toggleWishlist(product._id)}
                aria-label={
                  wishlistData[product._id]
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {wishlistData[product._id] ? <FaHeart /> : <FaRegHeart />}
              </button>
              {product.discount ? (
                <div className="gridOrList-discount-badge">
                  -{product.discount}%
                </div>
              ) : (
                <></>
              )}

              <div className="gridOrList-rating-badge">
                <span>★</span> {product.rating}
              </div>
            </div>
            <div className="gridOrList-product-info">
              <h3 className="gridOrList-product-name">{product.name}</h3>
              <div className="gridOrList-product-price">
                {product.discount ? (
                  <span className="gridOrList-current-price">
                    &#8377;
                    {Math.floor(
                      product.price - (product.price * product.discount) / 100
                    ).toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="gridOrList-current-price">
                    &#8377;
                    {product.price.toLocaleString("en-IN")}
                  </span>
                )}
                {product.discount ? (
                  <span className="gridOrList-original-price">
                    &#8377;
                    {Math.floor(product.price).toLocaleString("en-IN")}
                  </span>
                ) : (
                  <></>
                )}
              </div>
              <div className="gridOrList-review-count">
                {product.reviews.length} &nbsp;
                {product.reviews.length === 1 ? "review" : "reviews"}
              </div>
              <div className="gridOrList-product-actions">
                <Link
                  to={`/product/${product._id}`}
                  className="gridOrList-view-product-btn luxury-btn"
                >
                  View Product
                </Link>
                {product.stock > 0 ? (
                  <button
                    className={`gridOrList-add-to-cart-btn ${
                      cartData[product._id] ? "in-cart" : ""
                    }`}
                    onClick={() => toggleCart(product._id)}
                  >
                    <FiShoppingCart />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products?.length === 0 && (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          <button
            className="reset-filters-btn luxury-btn"
            onClick={() => {
              clearAllFilters();
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
};

export default ProductsRegularOrListView;
