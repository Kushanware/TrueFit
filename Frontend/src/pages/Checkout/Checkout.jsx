import { useState, useEffect, useContext, memo, useMemo } from "react";
import { StoreContext } from "../../components/Context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
import {
  FaLock,
  FaCheck,
  FaArrowRight,
  FaCreditCard,
  FaMoneyBillWave,
  FaTruck,
  FaShippingFast,
} from "react-icons/fa";
import "./Checkout.css";
import {
  createOrder,
  handlePaymentVerification,
  placeOrderCOD,
  verifyPromoCode,
} from "../../services/services";

const Checkout = () => {
  const {
    productsToOrder,
    subtotal,
    shippingCost,
    expressShippingCost,
    token,
  } = useContext(StoreContext);
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [deliverySpeed, setDeliverySpeed] = useState("Standard");
  const [appliedPromo, setAppliedPromo] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [focused, setFocused] = useState({});
  const [total, setTotal] = useState();
  const [shipping, setShipping] = useState();
  const [discount, setDiscount] = useState(0);
  const [validations, setValidations] = useState({
    email: false,
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    phone: false,
  });
  const [redirectingIn, setRedirectingIn] = useState(3);

  const deliveryFees = {
    Standard: shippingCost,
    Express: expressShippingCost,
  };

  const getDiscount = () => {
    if (promoApplied) {
      let disc = appliedPromo.value;
      if (appliedPromo.type === "Percentage") {
        disc = (subtotal * appliedPromo.value) / 100;
      }
      setDiscount(disc);
    }
  };

  useMemo(() => getDiscount(), [promoApplied]);

  const formatCurrency = (amount) => {
    return amount?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handlePromoCode = async () => {
    try {
      const res = await verifyPromoCode(promoCode);
      if (res.data.success) {
        setAppliedPromo(res.data.coupon);
        setPromoApplied(true);
      } else {
        toast.error(res.data.message || "Invalid promo code!");
        setPromoCode("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    if (token) {
      if (paymentMethod === "online") {
        let orderItems = [];
        productsToOrder.map((currItem) => {
          const item = {
            productId: currItem._id,
            name: currItem.name,
            image: currItem.images[0].url,
            price: currItem.price,
            discount: currItem.discount,
            color: currItem.color,
            size: currItem.size,
            quantity: currItem.quantity,
          };

          orderItems.push(item);
        });

        // Opening razorpay
        const { data } = await createOrder(
          token,
          Math.floor(total),
          orderItems
        );

        if (!data.success) {
          toast.error(
            data.message || "Failed to create order. Please try again."
          );
          return;
        }

        // Order data to be sent while payment verification
        let orderData = {
          userData: formData,
          items: orderItems,
          amount: Math.floor(total),
          shippingMethod: deliverySpeed,
        };

        // Load Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        const options = {
          key: razorpayKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "TrueFit",
          description: "TrueFit online payment",
          image: "/images/Logo.png",
          order_id: data.order.id,
          handler: async (razorpayData) => {
            toast.promise(
              handlePaymentVerification(
                token,
                orderData,
                razorpayData,
                appliedPromo
              ).then(async (res) => {
                if (res.data.success) {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setOrderComplete(true);

                  let countdown = 4;
                  const interval = setInterval(() => {
                    if (countdown === 0) {
                      clearInterval(interval);
                      setOrderComplete(false);
                      navigate("/orders");
                    } else {
                      setRedirectingIn((prev) => (prev ? prev - 1 : 0));
                      countdown--;
                    }
                  }, 1000);
                } else {
                  toast.error(
                    res.data.message ||
                      "Something went wrong!. Order not placed."
                  );
                  return Promise.reject(
                    new Error(res.data.message || "An error occurred")
                  ); // Reject promise to prevent success toast
                }
                return res.data;
              }),
              {
                pending: "Verifying payment...",
                success: "Payment verified and order placed.",
              }
            );
          },
          theme: {
            color: "#0a1f44", //navy-blue
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
        };

        script.onload = () => {
          if (typeof window.Razorpay === "undefined") {
            toast.error("Razorpay SDK failed to load.");
            return;
          }
          const razor = new window.Razorpay(options);
          razor.open();
        };
        script.onerror = () => {
          toast.error("Failed to load Razorpay. Check your connection.");
        };
        document.body.appendChild(script);
      } else {
        let orderItems = [];
        productsToOrder.map((currItem) => {
          const item = {
            productId: currItem._id,
            name: currItem.name,
            image: currItem.images[0].url,
            price: currItem.price,
            discount: currItem.discount,
            color: currItem.color,
            size: currItem.size,
            quantity: currItem.quantity,
          };

          orderItems.push(item);
        });

        let orderData = {
          userData: formData,
          items: orderItems,
          amount: Math.floor(total),
          shippingMethod: deliverySpeed,
        };

        toast.promise(
          placeOrderCOD(token, orderData, appliedPromo).then(async (res) => {
            if (res.data.success) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOrderComplete(true);

              let countdown = 4;
              const interval = setInterval(() => {
                if (countdown === 0) {
                  clearInterval(interval);
                  setOrderComplete(false);
                  navigate("/orders");
                } else {
                  setRedirectingIn((prev) => (prev ? prev - 1 : 0));
                  countdown--;
                }
              }, 1000);
            } else {
              toast.error(
                res.data.message || "Something went wrong!. Order not placed."
              );
              return Promise.reject(
                new Error(res.data.message || "An error occurred")
              ); // Reject promise to prevent success toast
            }
            return res.data;
          }),
          {
            pending: "Placing order...",
            success: "Order placed.",
          }
        );
      }
    }
  };

  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Check if address form is valid
  const isAddressFormValid = () => {
    return (
      validations.email &&
      validations.firstName &&
      validations.lastName &&
      validations.address &&
      validations.city &&
      validations.state &&
      validations.zipCode &&
      validations.phone
    );
  };

  const getTotalAmount = () => {
    setTotal(subtotal + shipping - discount);
  };

  const getShipping = () => {
    setShipping(deliveryFees[deliverySpeed]);
  };

  useEffect(() => getShipping(), [deliverySpeed]);
  useEffect(() => getTotalAmount(), [shipping, discount]);
  useEffect(() => {
    if (productsToOrder.length === 0) {
      navigate("/cart");
    }

    if (!token) {
      navigate("/cart");
    }
  }, [token, productsToOrder]);

  useEffect(() => {
    const newValidations = {
      email: /^\S+@\S+\.\S+$/.test(formData.email),
      firstName: formData.firstName.length > 1,
      lastName: formData.lastName.length > 1,
      address: formData.address.length > 5,
      city: formData.city.length > 2,
      state: formData.state.length > 3,
      zipCode: /^\d{6}$/.test(formData.zipCode),
      phone: /^\d{10}$/.test(formData.phone.replace(/\D/g, "")),
    };

    setValidations(newValidations);
  }, [formData]);

  if (orderComplete) {
    return (
      <div className="streamlined-checkout-container">
        <div
          className="order-success"
          data-aos="fade-up"
          data-aos-delay={100 + 2 * 50}
        >
          <div className="success-icon">
            <FaCheck />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been confirmed and will be shipped soon.</p>
          <div className="order-details">
            {/* <div className="order-detail-item">
              <span>Order Number:</span>
              <span>#{Math.floor(100000 + Math.random() * 900000)}</span>
            </div> */}
            <div className="order-detail-item">
              <span>Order Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="order-detail-item">
              <span>Total Amount:</span>
              <span>{formatCurrency(Math.floor(total))}</span>
            </div>
            <div className="order-detail-item">
              <span>Payment Method:</span>
              <span>
                {paymentMethod === "online"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </span>
            </div>
            <div className="order-detail-item">
              <span>Shipping Speed:</span>
              <span>{deliverySpeed}</span>
            </div>
            <div className="order-detail-item">
              <span>Promo Code:</span>
              <span>{appliedPromo?.code || "No promo code applied."}</span>
            </div>
          </div>
          <p>Redirecting to orders page in {redirectingIn}s</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container" data-aos="fade-up">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-header">
        <div
          className="checkout-steps"
          data-aos="fade-up"
          data-aos-delay={100 + 2 * 50}
        >
          <div
            className={`step ${activeStep >= 1 ? "active" : ""} ${
              activeStep > 1 ? "completed" : ""
            }`}
          >
            <div className="step-number">
              {activeStep > 1 ? <FaCheck /> : 1}
            </div>
            <span>Shipping</span>
          </div>
          <div className="step-connector"></div>
          <div
            className={`step ${activeStep >= 2 ? "active" : ""} ${
              activeStep > 2 ? "completed" : ""
            }`}
          >
            <div className="step-number">
              {activeStep > 2 ? <FaCheck /> : 2}
            </div>
            <span>Delivery</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${activeStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div
        className="checkout-content"
        data-aos="fade-up"
        data-aos-delay={100 + 5 * 50}
      >
        <div className="checkout-main">
          {activeStep === 1 && (
            <div className="checkout-step shipping-step">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <div
                  className={`floating-input ${
                    focused.email || formData.email ? "has-value" : ""
                  } ${validations.email && formData.email ? "is-valid" : ""}`}
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    required
                  />
                  <label htmlFor="email">Email Address</label>
                  {validations.email && formData.email && (
                    <FaCheck className="valid-icon" />
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.firstName || formData.firstName ? "has-value" : ""
                    } ${
                      validations.firstName && formData.firstName
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      onFocus={() => handleFocus("firstName")}
                      onBlur={() => handleBlur("firstName")}
                      required
                    />
                    <label htmlFor="firstName">First Name</label>
                    {validations.firstName && formData.firstName && (
                      <FaCheck className="valid-icon" />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.lastName || formData.lastName ? "has-value" : ""
                    } ${
                      validations.lastName && formData.lastName
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      onFocus={() => handleFocus("lastName")}
                      onBlur={() => handleBlur("lastName")}
                      required
                    />
                    <label htmlFor="lastName">Last Name</label>
                    {validations.lastName && formData.lastName && (
                      <FaCheck className="valid-icon" />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div
                  className={`floating-input ${
                    focused.address || formData.address ? "has-value" : ""
                  } ${
                    validations.address && formData.address ? "is-valid" : ""
                  }`}
                >
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    onFocus={() => handleFocus("address")}
                    onBlur={() => handleBlur("address")}
                    required
                  />
                  <label htmlFor="address">Street Address</label>
                  {validations.address && formData.address && (
                    <FaCheck className="valid-icon" />
                  )}
                </div>
              </div>

              <div className="form-group">
                <div
                  className={`floating-input ${
                    focused.apartment || formData.apartment ? "has-value" : ""
                  }`}
                >
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleFormChange}
                    onFocus={() => handleFocus("apartment")}
                    onBlur={() => handleBlur("apartment")}
                  />
                  <label htmlFor="apartment">
                    Apartment, Suite, etc. (Optional)
                  </label>
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.city || formData.city ? "has-value" : ""
                    } ${validations.city && formData.city ? "is-valid" : ""}`}
                  >
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      onFocus={() => handleFocus("city")}
                      onBlur={() => handleBlur("city")}
                      required
                    />
                    <label htmlFor="city">City</label>
                    {validations.city && formData.city && (
                      <FaCheck className="valid-icon" />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.state || formData.state ? "has-value" : ""
                    } ${validations.state && formData.state ? "is-valid" : ""}`}
                  >
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      onFocus={() => handleFocus("state")}
                      onBlur={() => handleBlur("state")}
                      required
                    />
                    <label htmlFor="state">State</label>
                    {validations.state && formData.state && (
                      <FaCheck className="valid-icon" />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.zipCode || formData.zipCode ? "has-value" : ""
                    } ${
                      validations.zipCode && formData.zipCode ? "is-valid" : ""
                    }`}
                  >
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleFormChange}
                      onFocus={() => handleFocus("zipCode")}
                      onBlur={() => handleBlur("zipCode")}
                      required
                      maxLength="6"
                    />
                    <label htmlFor="zipCode">PIN Code</label>
                    {validations.zipCode && formData.zipCode && (
                      <FaCheck className="valid-icon" />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div
                  className={`floating-input ${
                    focused.phone || formData.phone ? "has-value" : ""
                  } ${validations.phone && formData.phone ? "is-valid" : ""}`}
                >
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    onFocus={() => handleFocus("phone")}
                    onBlur={() => handleBlur("phone")}
                    // placeholder="Enter phone no. without +91"
                    maxLength="10"
                    required
                  />
                  <label htmlFor="phone">Phone Number without +91</label>
                  {validations.phone && formData.phone && (
                    <FaCheck className="valid-icon" />
                  )}
                </div>
              </div>

              <div className="step-actions">
                <Link to="/cart">
                  <button className="prev-step-btn">Go Back</button>
                </Link>
                <button
                  className="next-step-btn"
                  onClick={nextStep}
                  disabled={!isAddressFormValid()}
                >
                  Continue to Delivery <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="checkout-step delivery-step">
              <h2>Delivery Options</h2>
              <div className="delivery-options">
                <label
                  className={`delivery-option ${
                    deliverySpeed === "Standard" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySpeed"
                    value="Standard"
                    checked={deliverySpeed === "Standard"}
                    onChange={() => setDeliverySpeed("Standard")}
                  />
                  <div className="delivery-option-content">
                    <div className="delivery-icon-container">
                      <FaTruck className="delivery-icon" />
                    </div>
                    <div className="delivery-info">
                      <h3>Standard Delivery</h3>
                      <p>Delivery in 5-7 business days</p>
                      <div className="delivery-estimate">
                        <span>Estimated Delivery:</span>
                        <span>
                          {(() => {
                            const date = new Date();
                            date.setDate(date.getDate() + 5);
                            return date.toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            });
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="delivery-price">₹60.00</div>
                  </div>
                </label>

                <label
                  className={`delivery-option ${
                    deliverySpeed === "Express" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySpeed"
                    value="Express"
                    checked={deliverySpeed === "Express"}
                    onChange={() => setDeliverySpeed("Express")}
                  />
                  <div className="delivery-option-content">
                    <div className="delivery-icon-container">
                      <FaShippingFast className="delivery-icon" />
                    </div>
                    <div className="delivery-info">
                      <h3>Express Delivery</h3>
                      <p>Delivery in 2-3 business days</p>
                      <div className="delivery-estimate">
                        <span>Estimated Delivery:</span>
                        <span>
                          {(() => {
                            const date = new Date();
                            date.setDate(date.getDate() + 2);
                            return date.toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            });
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="delivery-price">₹120.00</div>
                  </div>
                </label>
              </div>

              <div className="step-actions">
                <button className="prev-step-btn" onClick={prevStep}>
                  Back
                </button>
                <button className="next-step-btn" onClick={nextStep}>
                  Continue to Payment <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="checkout-step payment-step">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "online" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <div className="payment-option-content">
                    <div className="payment-icon-container">
                      <FaCreditCard className="payment-icon" />
                    </div>
                    <div className="payment-info">
                      <h3>Pay Online</h3>
                      <p>Pay securely with Razorpay</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "cod" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div className="payment-option-content">
                    <div className="payment-icon-container">
                      <FaMoneyBillWave className="payment-icon" />
                    </div>
                    <div className="payment-info">
                      <h3>Cash on Delivery</h3>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === "online" && (
                <div className="payment-note">
                  <p>
                    You'll be redirected to Razorpay's secure payment gateway
                    after placing your order.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="payment-note">
                  <p>
                    Please have the exact amount ready at the time of delivery.
                  </p>
                  <p className="note-warning">
                    Note: Cash on Delivery may not be available for orders above
                    ₹10,000.
                  </p>
                </div>
              )}

              <div className="step-actions">
                <button className="prev-step-btn" onClick={prevStep}>
                  Back
                </button>
                <button
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  // disabled={isLoading}
                >
                  Place Order <FaLock />
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="checkout-sidebar"
          data-aos="fade-up"
          data-aos-delay={100 + 8 * 50}
        >
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="checkout-cart-items">
              {productsToOrder?.map((item, index) => (
                <div className="checkout-cart-item" key={index}>
                  <div className="item-image">
                    <img
                      src={
                        item.images[0].url ||
                        "/placeholder.svg?height=60&width=60"
                      }
                      alt={item.name}
                    />
                    {item.discount && (
                      <span className="discount-badge">-{item.discount}%</span>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-meta">
                      <div className="d-flex flex-column">
                        <span className="item-quantity">
                          Qty: {item.quantity}
                        </span>
                        <span className="item-quantity d-flex">
                          Color: {item.color}
                          <div
                            className={`order-item-color-circle`}
                            style={{ backgroundColor: item.color }}
                          ></div>
                        </span>
                        <span className="item-quantity">Size: {item.size}</span>
                      </div>
                      {item.discount ? (
                        <div>
                          <span className="item-price">
                            &#8377;
                            {Math.floor(
                              item.price - (item.price * item.discount) / 100
                            )}
                          </span>
                          <span className="original-price me-0">
                            &#8377;
                            {item.price}
                          </span>
                        </div>
                      ) : (
                        <span className="item-price">
                          &#8377;{Math.floor(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="promo-code">
              {promoApplied ? (
                <div className="promo-applied">
                  <FaCheck className="promo-check" />
                  <span>Promo code "{appliedPromo.code}" applied!</span>
                </div>
              ) : (
                <div className="promo-input">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handlePromoCode} disabled={!promoCode}>
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="summary-calculations">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(Math.floor(subtotal))}</span>
              </div>

              {promoApplied && (
                <div className="summary-row discount">
                  {/* <span>Discount (15%)</span> */}
                  <span>
                    Discount&nbsp;&nbsp;
                    {appliedPromo.type === "Percentage"
                      ? appliedPromo.value + "%"
                      : "₹" + appliedPromo.value}
                  </span>
                  <span>-{formatCurrency(Math.floor(discount))}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>

              {/* <div className="summary-row">
                <span>Taxes</span>
                <span>{formatCurrency(taxes)}</span>
              </div> */}

              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(Math.floor(total))}</span>
              </div>
            </div>

            <div className="secure-checkout-badge">
              <FaLock />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
