import { FaBoxOpen, FaRupeeSign, FaUsers } from "react-icons/fa";
import { AdminConetxt } from "../AdminContext/AdminContext";
import { useContext, useEffect, useState } from "react";
import { GiClothes } from "react-icons/gi";
import "./DashboardHome.css";
import { Link } from "react-router-dom";

// Dashboard Home Component
const DashboardHome = () => {
  const {
    products,
    totalProducts,
    orders,
    totalOrders,
    totalUsers,
    totalProfit,
    getStatusIcon,
  } = useContext(AdminConetxt);

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      change: "+12%",
      icon: <GiClothes />,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      change: "+5%",
      icon: <FaBoxOpen />,
    },
    {
      title: "Profit",
      value: `₹${totalProfit}`,
      change: "+8%",
      icon: <FaRupeeSign />,
    },
    {
      title: "Customers",
      value: totalUsers,
      change: "+15%",
      icon: <FaUsers />,
    },
  ];

  useEffect(() => {
    const sortedProducts = [...products]
      .sort((a, b) => b.sale - a.sale)
      .slice(0, 5);
    setTopProducts(sortedProducts.filter((product) => product.sale > 0));

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentOrders(recentOrders);
  }, [products, orders]);

  return (
    <div className="admin-dashboard">
      <h2 className="section-title">Dashboard</h2>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-change">{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-orders">
          <div className="dashboard-card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all">
              View All
            </Link>
          </div>
          <div className="dashboard-card-content">
            <table className="dashboard-table">
              <thead>
                <tr>
                  {/* <th>Order ID</th> */}
                  <th className="text-center">Customer</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    {/* <td>{order.id}</td> */}
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
                    <td className="text-center">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card top-products">
          <div className="dashboard-card-header">
            <h3>Top Selling Products</h3>
            <Link to="/admin/products" className="view-all">
              View All
            </Link>
          </div>
          <div className="dashboard-card-content">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th className="text-center">Product</th>
                  <th className="text-center">Sales</th>
                  <th className="text-center">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="text-center">{product.name}</td>
                    <td className="text-center">{product.sale}</td>
                    <td className="text-center">
                      ₹{product.profit.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
