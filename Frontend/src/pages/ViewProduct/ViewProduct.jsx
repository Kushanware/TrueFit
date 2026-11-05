import ProductReviewSection from "../../components/ViewProduct/ProductReviewSection/ProductReviewSection";
import SimilarProducts from "../../components/ViewProduct/SimilarProducts/SimilarProducts";
import TodaysForYou from "../../components/Home/TodaysForYou/TodaysForYou";
import { StoreContext } from "../../components/Context/StoreContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { MdLocalShipping } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import { toast } from "react-toastify";
import "./ViewProduct.css";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaChevronDown,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ViewProduct = () => {
  const {
    allProducts,
    cartData,
    toggleCart,
    wishlistData,
    toggleWishlist,
    setSubtotal,
    productsToOrder,
    setProductsToOrder,
    token,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const reviewsRef = useRef(null);

  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [activeSection, setActiveSection] = useState("description");
  const [expanded, setExpanded] = useState(false);

  const handleQuantityChange = (change) => {
    const newQuantity = productsToOrder[0]?.quantity + change;
    if (newQuantity > 0) {
      setProductsToOrder((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          quantity: newQuantity, // <-- Only this field is changed
        };
        return updated;
      });
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setProductsToOrder((prev) => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        color: color, // <-- Only this field is changed
      };
      return updated;
    });
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setProductsToOrder((prev) => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        size: size, // <-- Only this field is changed
      };
      return updated;
    });
  };

  const handleScrollToReviews = () => {
    const offset = 80;
    const element = reviewsRef.current;
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: y, behavior: "smooth" });

    setExpanded(true);
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.info("Please login to proceed to checkout.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      // Ensure data is available before searching
      const foundProduct = allProducts.find(
        (currProduct) => currProduct._id == id
      );

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]);
        setSelectedSize(foundProduct.sizes[0]);
        setProductsToOrder([
          {
            _id: foundProduct._id,
            name: foundProduct.name,
            price: foundProduct.price,
            discount: foundProduct.discount,
            images: foundProduct.images,
            quantity: 1,
            color: foundProduct.colors?.[0],
            size: foundProduct.sizes?.[0],
          },
        ]);
      }

      if (!foundProduct) {
        navigate(-1);
        toast.error("No such product exists!");
      }
    }
  }, [allProducts, id]); // Depend on allProducts and id

  const getSubtotal = () => {
    const calSubtotal = productsToOrder.reduce(
      (sum, item) =>
        item.discount
          ? sum +
            (item.price - (item.price * item.discount) / 100) * item.quantity
          : sum + item.price * item.quantity,
      0
    );

    setSubtotal(calSubtotal);
  };

  useEffect(() => {
    getSubtotal();
  }, [productsToOrder]);

  return (
    <div className="product-view-container">
      <div className="product-content">
        <div className="product-gallery">
          <div className="main-image luxury-card">
            {product && product.images && (
              <img src={product.images[mainImage].url} alt={product.name} />
            )}
            {product.discount ? (
              <div className="discount-badge">-{product.discount}%</div>
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
            {mainImage !== 0 ? (
              <button
                className="view-page-image-left-button"
                onClick={() => setMainImage(mainImage - 1)}
              >
                <FaChevronLeft />
              </button>
            ) : null}
            {mainImage !== product?.images?.length - 1 ? (
              <button
                className="view-page-image-right-button"
                onClick={() => setMainImage(mainImage + 1)}
              >
                <FaChevronRight />
              </button>
            ) : null}
          </div>
          <div className="thumbnail-container">
            {product &&
              product.images &&
              product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail luxury-card ${
                    mainImage === index ? "active" : ""
                  }`}
                  onClick={() => setMainImage(index)}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="product-details">
          <h1 className="view-product-title ">{product.name}</h1>
          {product.status === "Low Stock" ? (
            <h2 className="view-product-low-stock">
              Hurry up, only {product.stock} left!
            </h2>
          ) : null}

          <div className="product-rating" onClick={handleScrollToReviews}>
            <div className="stars-container">
              <div className="stars me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(product?.rating) ? "star filled" : "star"
                    }
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating}</span>
            </div>
            <span className="review-count mb-0">
              ({product.reviews?.length} reviews)
            </span>
          </div>

          <div className="product-price">
            {product.discount ? (
              <span className="current-price gold-text">
                &#8377;
                {Math.floor(
                  product.price - (product.price * product.discount) / 100
                ).toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="current-price gold-text">
                &#8377;
                {product?.price?.toLocaleString("en-IN")}
              </span>
            )}
            {product.discount ? (
              <span className="original-price">
                &#8377;
                {Math.floor(product.price).toLocaleString("en-IN")}
              </span>
            ) : null}
            {product.discount ? (
              <span className="discount">{product.discount}% OFF</span>
            ) : null}
          </div>

          <div className="product-colors">
            <h3>Color</h3>
            <div className="color-options">
              {product &&
                product.colors &&
                product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    onClick={() => handleSelectColor(color)}
                    disabled={product.stock === 0}
                  >
                    <div
                      className={`color-circle`}
                      style={{ backgroundColor: color }}
                    ></div>
                    <span>{color}</span>
                  </button>
                ))}
            </div>
          </div>

          <div className="product-sizes">
            <h3>Size</h3>
            <div className="size-options">
              {product &&
                product.sizes &&
                product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => handleSelectSize(size)}
                    disabled={product.stock === 0}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </div>

          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div
              className={`quantity-controls ${
                product.stock === 0 ? "disabled" : ""
              }`}
            >
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={productsToOrder[0]?.quantity <= 1}
              >
                <IoMdRemove />
              </button>
              <span className="quantity-value">
                {productsToOrder[0]?.quantity}
              </span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  productsToOrder[0]?.quantity >= product.stock ||
                  product.stock === 0
                }
              >
                <IoMdAdd />
              </button>
            </div>
          </div>

          <div className="view-product-action-buttons desktop-buttons">
            {product.stock > 0 ? (
              <button
                className={`view-page-buy-now-btn `}
                // onClick={() => navigate("/checkout")}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            ) : (
              <button
                className={`view-page-buy-now-btn-out-of-stock `}
                disabled={true}
              >
                Out of Stock
              </button>
            )}
            {product.stock > 0 ? (
              <button
                className="view-page-add-cart-btn"
                onClick={() => toggleCart(product._id)}
              >
                <FaShoppingCart className="view-product-cart-icon" />
                {cartData[product._id] ? "Remove from Cart" : "Add to Cart"}
              </button>
            ) : null}
          </div>

          <div className="product-info-accordion">
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection("description")}
              >
                <h3>Product Description</h3>
                <FaChevronDown
                  className={`accordion-icon ${
                    activeSection === "description" ? "active" : ""
                  }`}
                />
              </button>
              {activeSection === "description" && (
                <div className="accordion-content">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleSection("features")}
              >
                <h3>Features</h3>
                <FaChevronDown
                  className={`accordion-icon ${
                    activeSection === "features" ? "active" : ""
                  }`}
                />
              </button>
              {activeSection === "features" && (
                <div className="accordion-content">
                  <ul className="feature-list">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <ProductReviewSection
              product={product}
              setProduct={setProduct}
              reviewsRef={reviewsRef}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </div>

          <div className="delivery-info">
            <div className="delivery-item luxury-card">
              <MdLocalShipping className="delivery-icon" />
              <div className="delivery-text">
                <h4>Free Shipping</h4>
                <p>On orders over &#8377;2,000</p>
              </div>
            </div>
            <div className="delivery-item luxury-card">
              <TbTruckReturn className="delivery-icon" />
              <div className="delivery-text">
                <h4>Easy Returns</h4>
                <p>7 day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProducts category={product.category} />
      <TodaysForYou />
      <div className="mobile-action-buttons">
        {product.stock > 0 ? (
          <button
            className={`view-page-buy-now-btn `}
            // onClick={() => navigate("/checkout")}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        ) : (
          <button
            className={`view-page-buy-now-btn-out-of-stock `}
            disabled={true}
          >
            Out of Stock
          </button>
        )}
        {product.stock > 0 ? (
          <button
            className="view-page-add-cart-btn"
            onClick={() => toggleCart(product._id)}
          >
            <FaShoppingCart className="view-product-cart-icon" />
            {cartData[product._id] ? "Remove" : "Add to Cart"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ViewProduct;
