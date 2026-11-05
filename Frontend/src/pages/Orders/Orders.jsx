import OrderReviewsIntegration from "../../components/Orders/OrderReviewsIntegration/OrderReviewsIntegration";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { StoreContext } from "../../components/Context/StoreContext";
import { getOrders } from "../../services/services";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaChevronRight,
  FaChevronLeft,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaShippingFast,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaRegCreditCard,
} from "react-icons/fa";
import "./Orders.css";

const Orders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isTrackingAnimating, setIsTrackingAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const orderDetailView = useRef(null);

  // Filtering on the basis of status
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesStatus;
  });

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Placed":
        return <FaRegCreditCard />;
      case "Processing":
        return <FaBox />;
      case "Shipped":
        return <FaTruck />;
      case "Delivered":
        return <FaCheckCircle />;
      case "Cancelled":
        return <FaTimesCircle />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "#996666"; // amber
      case "Processing":
        return "#f59e0b"; // amber
      case "Shipped":
        return "#3b82f6"; // blue
      case "Delivered":
        return "#10b981"; // green
      case "Cancelled":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const scrollToTop = () => {
    if (selectedOrder && orderDetailView.current) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  };

  const getOrdersData = useCallback(async () => {
    try {
      const res = await getOrders(token);
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        console.log("Could not get orders, something went wrong!");
      }
    } catch (error) {
      console.log("Error occurred while getting orders");
      console.log(error);
    }
  }, [token]);

  // Handle track order button click
  const handleTrackOrder = () => {
    scrollToTop();

    // Reset and start animation
    setIsTrackingAnimating(true);
    setAnimationProgress(0);

    setTimeout(() => {
      setAnimationProgress(selectedOrder?.statusProgress);
      setIsTrackingAnimating(false);
    }, 500);
  };

  useEffect(() => {
    if (selectedOrderId && orders.length > 0) {
      const order = orders.find((o) => o._id === selectedOrderId);
      setSelectedOrder(order);
    }
  }, [selectedOrderId, orders]);

  useEffect(() => {
    if (selectedOrderId) {
      handleTrackOrder();
    }
    getOrdersData();
  }, [selectedOrderId, token]);

  return (
    <div className="orders-container" data-aos="fade-up">
      {!selectedOrder ? (
        <div className="orders-list-view">
          <div className="orders-header">
            <h1 className="orders-title">Your Orders</h1>
            {filteredOrders.length !== 0 && (
              <div className="orders-actions">
                <button
                  className="ms-auto filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter />
                  <span>Filter</span>
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="filters-container">
              <div className="filter-group">
                <h3>Order Status</h3>
                <div className="filter-options">
                  <button
                    className={statusFilter === "all" ? "active" : ""}
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={statusFilter === "Processing" ? "active" : ""}
                    onClick={() => setStatusFilter("Processing")}
                  >
                    Processing
                  </button>
                  <button
                    className={statusFilter === "Shipped" ? "active" : ""}
                    onClick={() => setStatusFilter("Shipped")}
                  >
                    Shipped
                  </button>
                  <button
                    className={statusFilter === "Delivered" ? "active" : ""}
                    onClick={() => setStatusFilter("Delivered")}
                  >
                    Delivered
                  </button>
                  <button
                    className={statusFilter === "Cancelled" ? "active" : ""}
                    onClick={() => setStatusFilter("Cancelled")}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredOrders.length === 0 && statusFilter === "all" ? (
            <div className="no-orders">
              <div className="no-orders-icon">
                <FaBox />
              </div>
              <h2>No orders yet.</h2>
              <Link to="/collection/All">
                <button className="luxury-btn">Start Shopping</button>
              </Link>
            </div>
          ) : filteredOrders.length === 0 && statusFilter !== "all" ? (
            <div className="no-orders">
              <div className="no-orders-icon">
                <FaBox />
              </div>
              <h2>No orders found</h2>
              <Link>
                <button
                  className="primary-button"
                  onClick={() => {
                    setStatusFilter("all");
                    setShowFilters(false);
                  }}
                >
                  Clear Filters
                </button>
              </Link>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.toReversed().map((order, index) => (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => setSelectedOrderId(order._id)}
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 50}
                >
                  <div className="order-card-header">
                    <div className="order-id">
                      <span>Order ID</span>
                      <span className="fw-bold fs-6">{`ORD-${order._id.slice(
                        0,
                        5
                      )}...`}</span>
                    </div>
                    <div
                      className="order-status"
                      style={{
                        backgroundColor: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                      }}
                    >
                      {getStatusIcon(order.status)}
                      <span>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="order-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${order.statusProgress}%`,
                          backgroundColor: getStatusColor(order.status),
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="order-items-preview">
                    <div className="order-items-images">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={item._id}
                          className="item-image-container"
                          style={{ zIndex: 10 - index }}
                        >
                          <img
                            src={
                              item.image ||
                              "/placeholder.svg?height=60&width=60"
                            }
                            alt={item.name}
                          />
                          {item.discount && (
                            <span className="item-discount">
                              {item.discount}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="order-meta">
                    <div className="order-date">
                      <FaCalendarAlt />
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className="order-total">
                      <span>&#8377;{order.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    {order.status === "Delivered" &&
                    order.items.some((item) => item.reviewed === false) ? (
                      <button className="view-details-btn">
                        <span>Review</span>
                        <FaChevronRight />
                      </button>
                    ) : null}
                    <button className="view-details-btn">
                      <span>View Details</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Order Detail View
        <div className="order-detail-view" ref={orderDetailView}>
          <div className="order-detail-header">
            <button
              className="back-button"
              onClick={() => {
                setSelectedOrderId(null);
                setSelectedOrder(null);
              }}
            >
              <FaChevronLeft />
              <span>Back to Orders</span>
            </button>
          </div>

          <div className="order-detail-content">
            <div className="order-detail-main">
              <div className="order-summary-card">
                <div className="order-summary-header">
                  <div>
                    <span className="order-summary-header-id">
                      {`ORD-${selectedOrder._id}`}
                    </span>
                    <p className="order-date">
                      {formatDate(selectedOrder.date)}
                    </p>
                  </div>
                  <div
                    className="order-status large"
                    style={{
                      backgroundColor: `${getStatusColor(
                        selectedOrder.status
                      )}20`,
                      color: getStatusColor(selectedOrder.status),
                    }}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    <span>
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-timeline">
                  <div className="timeline-container">
                    <div className="timeline-track">
                      <div
                        className={`timeline-progress ${
                          isTrackingAnimating ? "animating" : ""
                        }`}
                        style={
                          window.innerWidth > 350
                            ? {
                                width: `${
                                  animationProgress ??
                                  selectedOrder.statusProgress
                                }%`,
                                backgroundColor: getStatusColor(
                                  selectedOrder.status
                                ),
                              }
                            : {
                                height: `${
                                  animationProgress ??
                                  selectedOrder.statusProgress
                                }%`,
                                backgroundColor: getStatusColor(
                                  selectedOrder.status
                                ),
                              }
                        }
                      ></div>
                    </div>

                    <div className="timeline-steps">
                      <div
                        className={`timeline-step ${
                          (isTrackingAnimating
                            ? animationProgress
                            : selectedOrder.statusProgress) >= 10
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">
                          <FaBox />
                        </div>
                        <div className="step-label">Order Placed</div>
                      </div>
                      <div
                        className={`timeline-step ${
                          (isTrackingAnimating
                            ? animationProgress
                            : selectedOrder.statusProgress) >= 43
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">
                          <FaBox />
                        </div>
                        <div className="step-label">Processing</div>
                      </div>
                      <div
                        className={`timeline-step ${
                          (isTrackingAnimating
                            ? animationProgress
                            : selectedOrder.statusProgress) >= 66
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">
                          <FaTruck />
                        </div>
                        <div className="step-label">Shipped</div>
                      </div>
                      <div
                        className={`timeline-step ${
                          (isTrackingAnimating
                            ? animationProgress
                            : selectedOrder.statusProgress) == 100
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">
                          <FaCheckCircle />
                        </div>
                        <div className="step-label">Delivered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-actions-track-button">
                {selectedOrder.status !== "Delivered" &&
                  selectedOrder.status !== "Cancelled" && (
                    <button
                      className={`primary-button ${
                        isTrackingAnimating ? "disabled" : ""
                      }`}
                      onClick={handleTrackOrder}
                      disabled={isTrackingAnimating}
                    >
                      <FaTruck />
                      <span>
                        {isTrackingAnimating ? "Tracking..." : "Track Order"}
                      </span>
                    </button>
                  )}
              </div>

              <div className="order-info-grid">
                <div className="info-card">
                  <div className="info-card-header">
                    <FaMapMarkerAlt />
                    <h3>Shipping Address</h3>
                  </div>
                  <div className="info-card-content">
                    <p>{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-header">
                    {selectedOrder.paymentMethod.includes("Card") ? (
                      <FaCreditCard />
                    ) : (
                      <FaMoneyBillWave />
                    )}
                    <h3>Payment Method</h3>
                  </div>
                  <div className="info-card-content">
                    <p>{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-header">
                    <FaShippingFast />
                    <h3>Shipping Method</h3>
                  </div>
                  <div className="info-card-content">
                    <p>
                      {selectedOrder.shippingMethod.charAt(0).toUpperCase() +
                        selectedOrder.shippingMethod.slice(1)}{" "}
                      Shipping
                    </p>
                    {selectedOrder.trackingId && (
                      <p className="tracking-id">
                        <span>Tracking ID:</span> {selectedOrder.trackingId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="order-items-card">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-image">
                        <img
                          src={
                            item.image || "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.name}
                        />
                        {item.discount && (
                          <span className="item-discount">
                            {item.discount}%
                          </span>
                        )}
                      </div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <div className="item-meta">
                          {item.color && (
                            <span className="d-flex gap-2">
                              <div>Color: {item.color}</div>
                              <div
                                className={`cart-item-color-circle`}
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
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder && (
                <OrderReviewsIntegration
                  order={selectedOrder}
                  setOrders={setOrders}
                />
              )}
            </div>

            <div className="order-detail-sidebar">
              <div className="price-summary-card">
                <h3>Price Details</h3>
                <div className="price-summary">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>
                      &#8377;
                      {selectedOrder.shippingMethod === "express"
                        ? (selectedOrder.amount - 120).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })
                        : (selectedOrder.amount - 60).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                    </span>
                  </div>
                  <div className="price-row">
                    <span>Shipping</span>
                    <span>
                      &#8377;
                      {selectedOrder.shippingMethod === "express"
                        ? (120).toFixed(2)
                        : (60).toFixed(2)}
                    </span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>
                      &#8377;
                      {selectedOrder.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="help-card">
                <h3>Need Help?</h3>
                <p>
                  If you have any questions about your order, please contact our
                  customer support.
                </p>
                <button className="text-button">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
