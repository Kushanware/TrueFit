import { FaHeart, FaRegHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { StoreContext } from "../../Context/StoreContext";
import { useContext, useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./SimilarProducts.css";

const SimilarProducts = ({ category }) => {
  const { allProducts, wishlistData, toggleWishlist, toggleCart, cartData } =
    useContext(StoreContext);

  const [SimilarProducts, setSimilarProducts] = useState([]);
  const [showImage, setShowImage] = useState(false);

  const getSimilarProducts = () => {
    setSimilarProducts(
      allProducts?.filter((currProduct) => currProduct.category === category)
    );
  };

  const scrollLeft = () => {
    document.querySelector(".product-slider").scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.querySelector(".product-slider").scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    getSimilarProducts();
    const timer = setTimeout(() => setShowImage(true), 1000); // delay 1s
    return () => clearTimeout(timer);
  }, [allProducts, category]);

  if (SimilarProducts?.length === 0) {
    return null;
  }

  return (
    <section className="flash-sale">
      <div className="flash-sale-header">
        <div>
          <h2 className="similarProducts-heading mb-0">Similar Products</h2>
        </div>
        <div className="slider-controls">
          <button className="slider-control" onClick={scrollLeft}>
            <FaArrowLeft />
          </button>
          <button className="slider-control" onClick={scrollRight}>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="product-slider">
        {SimilarProducts?.map((product) => (
          <div
            className="flash-sale-product-card luxury-card"
            key={product._id}
          >
            <div className="flash-sale-product-image">
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
                <span className="card-image-out-of-stock-badge">
                  Out of Stock
                </span>
              ) : null}
              {product.tags.includes("New") && product.stock !== 0 ? (
                <span className="card-image-new-badge">New</span>
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
                <div className="discount-badge">-{product.discount}%</div>
              ) : (
                <></>
              )}

              <div className="rating-badge">
                <span>★</span> {product.rating}
              </div>
            </div>
            <div className="flash-sale-product-info">
              <h3 className="flash-sale-product-name">{product.name}</h3>
              <div className="product-price">
                {product.discount ? (
                  <span className="current-price">
                    &#8377;
                    {Math.floor(
                      product.price - (product.price * product.discount) / 100
                    ).toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="current-price">
                    &#8377;
                    {product.price.toLocaleString("en-IN")}
                  </span>
                )}
                {product.discount ? (
                  <span className="original-price">
                    &#8377;
                    {Math.floor(product.price).toLocaleString("en-IN")}
                  </span>
                ) : (
                  <></>
                )}
              </div>
              <div className="review-count">
                {product.reviews.length} &nbsp;
                {product.reviews.length === 1 ? "review" : "reviews"}
              </div>
              <div className="product-actions">
                <Link
                  to={`/product/${product._id}`}
                  className="buy-now-btn luxury-btn"
                >
                  View Product
                </Link>
                {product.stock > 0 ? (
                  <button
                    className={`add-to-cart-btn ${
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
    </section>
  );
};

export default SimilarProducts;
