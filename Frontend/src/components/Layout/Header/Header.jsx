import { useState, useEffect, useContext, memo } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Header.css";

const Header = memo(() => {
  const {
    wishlistData,
    cartData,
    setWishlistData,
    setCartData,
    search,
    setSearch,
    token,
    setToken,
    user,
    setUser,
  } = useContext(StoreContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (search) {
      navigate("/collection/All");
    } else {
      console.log("Empty search");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser({
      name: "",
      email: "",
      profileImage: { url: "", filename: "" },
      _id: "",
    });
    setCartData({});
    setWishlistData({});
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header`}>
      <div className={`main-header`}>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <span className="brand-name">TrueFit</span>
              <span className="domain">.com</span>
            </Link>
          </div>

          <div className="search-bar">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search product here..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="search-btn" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="header-icons">
            <Link to="/wishlist" className="icon-link wishlist-icon">
              <FaRegHeart className="fs-6 nav-wishlist" />
              {Object.keys(wishlistData).length ? (
                <span className="wishlist-count">
                  {Object.keys(wishlistData).length}
                </span>
              ) : (
                <></>
              )}
            </Link>
            <Link to="/cart" className="icon-link cart-icon">
              <FiShoppingCart className="fs-5 nav-cart" />
              {Object.keys(cartData).length ? (
                <span className="cart-count">
                  {Object.keys(cartData).length}
                </span>
              ) : (
                <></>
              )}
            </Link>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {token && user?.profileImage?.url && !imageError ? (
              <div className="profileImage">
                <img
                  src={user.profileImage.url}
                  alt="Profile"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : token ? (
              <div className="no-profile-img sidebar-btn">
                <span>{user?.name?.charAt(0)}</span>
              </div>
            ) : (
              <FaBars className="fs-5 sidebar-btn" />
            )}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <Link to="/" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="brand-name">TrueFit</span>
              <span className="domain">.com</span>
            </Link>
          </div>
          <button
            className="close-menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <RxCross2 className="nav-sidebar-cross" />
          </button>
        </div>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search product or brand here..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="search-btn" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
          <nav className="mobile-nav">
            <Link to="/" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              Home
            </Link>
            <Link
              to="collection/All"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              View Collection
            </Link>
            <Link to="" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              Flash Sale
            </Link>
            <Link to="" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              Today's For You
            </Link>
            <Link
              to="orders"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              My Orders
            </Link>
            <Link
              to="profile"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              Profile
            </Link>
            <Link
              to="about"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              About Us
            </Link>
            <Link
              to="contact"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              Contact
            </Link>
            {user?.role === "Admin" ? (
              <Link
                to="admin"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                Admin Dashboard
              </Link>
            ) : null}

            {!token ? (
              <Link
                to="login"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <button className="luxury-btn w-100">Login / Signup</button>
              </Link>
            ) : (
              <Link
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  handleLogout();
                }}
              >
                <button className="luxury-btn w-100">Logout</button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
