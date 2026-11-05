import { FaHeart, FaRegHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { StoreContext } from "../../Context/StoreContext";
import { useState, useEffect, useContext } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./FlashSale.css";

const FlashSale = () => {
  const {
    allProducts,
    wishlistData,
    toggleWishlist,
    toggleCart,
    cartData,
    flashSaleProducts,
    getFlashSaleProducts,
    noFlashSale,
  } = useContext(StoreContext);
  const [showImage, setShowImage] = useState(false);

  const scrollLeft = () => {
    document.querySelector(".flash-product-slider").scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.querySelector(".flash-product-slider").scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    getFlashSaleProducts();
    const timer = setTimeout(() => setShowImage(true), 1000);
    return () => clearTimeout(timer);
  }, [allProducts]);

  if (noFlashSale) {
    return null;
  }

  return (
    <section className="flash-sale" data-aos="fade-up">
      {!noFlashSale && flashSaleProducts.length ? (
        <>
          <div className="flash-sale-header">
            <div className="">
              <h2 className="flashsale-heading mb-0">Flash Sale</h2>
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

          <div className="flash-product-slider">
            {flashSaleProducts?.map((product, index) => (
              <div
                className="flash-sale-product-card luxury-card"
                key={product._id}
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
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
                          product.price -
                            (product.price * product.discount) / 100
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
        </>
      ) : (
        <div className="flash-sale-loader">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="line-3"></div>
            <div className="line-4"></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FlashSale;
