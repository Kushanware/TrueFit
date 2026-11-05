import { Link, Outlet, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { ToastContainer } from "react-toastify";
import { useContext, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaPager } from "react-icons/fa";
import "./AdminLayout.css";
import {
  FiPackage,
  FiPlusCircle,
  FiShoppingBag,
  FiTag,
  FiMenu,
  FiLogOut,
  FiSettings,
  FiHome,
} from "react-icons/fi";
import { AdminConetxt } from "../AdminContext/AdminContext";

const AdminLayout = () => {
  const { user } = useContext(StoreContext);
  const {
    fetchProductsData,
    fetchProductsCount,
    fetchOrdersData,
    fetchOrdersCount,
    fetchUsersCount,
    fetchTotalProfit,
    fetchCouponsData,
    fetchHeroBannersData,
  } = useContext(AdminConetxt);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);

    fetchProductsData();
    fetchProductsCount();
    fetchOrdersData();
    fetchOrdersCount();
    fetchUsersCount();
    fetchTotalProfit();
    fetchCouponsData();
    fetchHeroBannersData();
  };

  const navItems = [
    { path: "/admin", icon: <FiHome />, label: "Dashboard" },
    { path: "/admin/products", icon: <FiPackage />, label: "Products" },
    {
      path: "/admin/add-product",
      icon: <FiPlusCircle />,
      label: "Add Product",
    },
    { path: "/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
    { path: "/admin/coupons", icon: <FiTag />, label: "Coupons" },
    { path: "/admin/banners", icon: <FaPager />, label: "Hero Banners" },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <div className="d-flex">
          <button className="admin-menu-toggle" onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <h1 className="admin-mobile-title mb-0">Admin Panal</h1>
        </div>
        <div className="refresh-btn">
          <IoMdRefresh
            onClick={handleRefresh}
            className={refreshing ? "refreshing" : ""}
          />
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-logo mb-0">
            TrueFit<span className="gold-text">.com</span>
          </h2>
          <span className="close-admin-sidebar" onClick={toggleSidebar}>
            <RxCross2 />
          </span>
        </div>

        <nav className="admin-nav">
          <ul className="admin-nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="admin-nav-item">
                <Link
                  to={item.path}
                  className={`admin-nav-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  onClick={toggleSidebar}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            {user?.profileImage.url ? (
              <div className="admin-user-avatar">
                <img src={user.profileImage.url} alt="" />
              </div>
            ) : (
              <div className="admin-user-avatar">{user.name.charAt(0)}</div>
            )}
            <div className="admin-user-info">
              <h4 className="admin-user-name">{user?.name}</h4>
              <p className="admin-user-role mb-0">Administrator</p>
            </div>
          </div>

          <div className="admin-footer-actions">
            <button className="admin-footer-btn">
              <FiSettings />
              <span>Settings</span>
            </button>
            <Link to="/" className="admin-footer-btn">
              <FiLogOut />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <main className="admin-main">
        <ToastContainer />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
