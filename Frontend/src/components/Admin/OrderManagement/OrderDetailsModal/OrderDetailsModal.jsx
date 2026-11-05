import { FiX } from "react-icons/fi";
import "./OrderDetailsModal.css";
import {
  FaBox,
  FaCheckCircle,
  FaRegCreditCard,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  return (
    <div className="order-details-overlay">
      <div className="order-details-modal">
        <div className="order-details-header">
          <h3>Order Details</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="order-details-content">
          <div className="order-details-section">
            <h4>Customer Information:</h4>
            <div className="admin-customer-details">
              <p>
                <strong>Name:</strong> {order.customer.name}
              </p>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p>
                <strong>Phone:</strong>+91{order.customer.phone}
              </p>
            </div>
          </div>

          <div className="order-details-section">
            <h4>Shipping Address: </h4>
            <div className="admin-address-details">
              <p>{order.shippingMethod} Delivery</p>
              <p>{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="order-details-section">
            <h4>Order Summary: </h4>
            <div className="admin-order-summary">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Tracking Id:</strong> {order.trackingId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-text ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`payment-status ${order.payment.toLowerCase()}`}
                >
                  {order.payment}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                <span className="payment-status">{order.paymentMethod}</span>
              </p>
            </div>
          </div>

          <div className="order-details-section scroll">
            <h4>Order Items: </h4>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>{item.discount}%</td>
                    <td>
                      <div className="d-flex">
                        <div className="me-auto">{item.color}</div>
                        <div
                          className={`order-item-color-circle`}
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                    </td>
                    <td>{item.size}</td>
                    <td>{item.quantity}</td>
                    {item.discount ? (
                      <td className="text-end">
                        ₹
                        {Math.floor(
                          (item.price - (item.price * item.discount) / 100) *
                            item.quantity
                        ).toFixed(2)}
                      </td>
                    ) : (
                      <td className="text-end">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="order-total-label">
                    Shipping:
                  </td>
                  <td className="order-total-value text-end">
                    ₹
                    {(order.shippingMethod === "Standard" ? 60 : 120).toFixed(
                      2
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className="order-total-label">
                    Total:
                  </td>
                  <td className="order-total-value text-end">
                    ₹{order.amount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="order-details-section">
            <h4>Update Order Status: </h4>
            <div className="status-update-options">
              <button
                className={`status-update-btn ${
                  order.status === "Placed" ? "active" : ""
                }`}
                onClick={() => onUpdateStatus("Placed")}
              >
                <FaRegCreditCard />
                <span>Placed</span>
              </button>
              <button
                className={`status-update-btn ${
                  order.status === "Processing" ? "active" : ""
                }`}
                onClick={() => onUpdateStatus("Processing")}
              >
                <FaBox />
                <span>Processing</span>
              </button>
              <button
                className={`status-update-btn ${
                  order.status === "Shipped" ? "active" : ""
                }`}
                onClick={() => onUpdateStatus("Shipped")}
              >
                <FaTruck />
                <span>Shipped</span>
              </button>
              <button
                className={`status-update-btn ${
                  order.status === "Delivered" ? "active" : ""
                }`}
                onClick={() => onUpdateStatus("Delivered")}
              >
                <FaCheckCircle />
                <span>Delivered</span>
              </button>
              <button
                className={`status-update-btn cancel-btn ${
                  order.status === "Cancelled" ? "active" : ""
                }`}
                onClick={() => onUpdateStatus("Cancelled")}
              >
                <FaTimesCircle />
                <span>Cancelled</span>
              </button>
            </div>
          </div>
        </div>

        <div className="order-details-footer">
          <button className="close-details-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
