import OrderDetailsModal from "../OrderDetailsModal/OrderDetailsModal";
import { updateOrderStatue } from "../../AdminServices/AdminServices";
import { AdminConetxt } from "../../AdminContext/AdminContext";
import { StoreContext } from "../../../Context/StoreContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "./OrderManagement.css";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiEye,
} from "react-icons/fi";

const OrderManagement = () => {
  const { orders, setOrders, getStatusIcon } = useContext(AdminConetxt);
  const { token } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status options for filter
  const statuses = [
    "All",
    "Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const paymentStatuses = ["All", "Paid", "Pending", "Refunded"];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    toast.promise(
      updateOrderStatue(token, orderId, newStatus).then(async (res) => {
        if (res.data.success) {
          if (newStatus === "Delivered") {
            setOrders(
              orders.map((order) =>
                order._id === orderId
                  ? { ...order, status: newStatus, payment: "Paid" }
                  : order
              )
            );
          } else {
            setOrders(
              orders.map((order) =>
                order._id === orderId ? { ...order, status: newStatus } : order
              )
            );
          }
        } else {
          return Promise.reject(
            new Error(res.data.message || "An error occurred")
          ); // Reject promise to prevent success toast
        }
        return res.data;
      }),
      {
        pending: "Updating order status.",
        success: "Order status updated successfully.",
        error: "Could not update order status.",
      }
    );
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || order.status === selectedStatus;
      const matchesPayment =
        selectedPayment === "All" || order.payment === selectedPayment;

      const orderDate = new Date(order.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      const matchesDateRange =
        (!fromDate || orderDate >= fromDate) &&
        (!toDate || orderDate <= toDate);

      return (
        matchesSearch && matchesStatus && matchesPayment && matchesDateRange
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }

      if (sortConfig.key === "total") {
        return sortConfig.direction === "ascending"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="order-management">
      <div className="order-management-header">
        <h2 className="section-title">Order Management</h2>
        <p className="order-count">{filteredOrders.length} orders</p>
      </div>

      <div className="admin-order-actions">
        <div className="search-container">
          {/* <FiSearch className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <button className="filter-button" onClick={toggleFilter}>
          <FiFilter />
          <span>Filter</span>
          {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Order Status:</label>
            <div className="filter-options">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={`filter-option ${
                    selectedStatus === status ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Payment Status:</label>
            <div className="filter-options">
              {paymentStatuses.map((status) => (
                <button
                  key={status}
                  className={`filter-option ${
                    selectedPayment === status ? "active" : ""
                  }`}
                  onClick={() => setSelectedPayment(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Date Range:</label>
            <div className="date-range">
              <div className="date-input-group">
                <label>From:</label>
                <input
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleDateChange}
                />
              </div>
              <div className="date-input-group">
                <label>To:</label>
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              {/* <th
                onClick={() => requestSort("id")}
                className={getClassNamesFor("id")}
              >
                Order ID
                <span className="sort-indicator"></span>
              </th> */}
              <th
                onClick={() => requestSort("customer")}
                className={`${getClassNamesFor("customer")} text-center`}
              >
                Customer
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("date")}
                className={`${getClassNamesFor("date")} text-center`}
              >
                Date
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("total")}
                className={`${getClassNamesFor("total")} text-center`}
              >
                Total
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("status")}
                className={`${getClassNamesFor("status")} text-center`}
              >
                Status
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("payment")}
                className={`${getClassNamesFor("payment")} text-center`}
              >
                Payment
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  {/* <td>{order._id}</td> */}
                  <td className="text-center">
                    <div className="customer-info">
                      <span className="customer-name">
                        {order.customer.name}
                      </span>
                      <span className="customer-email">
                        {order.customer.email}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="text-center">₹{order.amount.toFixed(2)}</td>
                  <td>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span
                        className={`status-text ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`payment-status ${order.payment.toLowerCase()}`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td>
                    <div className="order-table-action-buttons">
                      <button
                        className="order-table-preview-btn"
                        title="View Order Details"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <FiEye />
                      </button>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-coupons">
                  {orders?.length === 0
                    ? "No orders have placed yet!"
                    : "No orders found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {detailsModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setDetailsModalOpen(false)}
          onUpdateStatus={(status) => {
            updateOrderStatus(selectedOrder._id, status);
            setDetailsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
