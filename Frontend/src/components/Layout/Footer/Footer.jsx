import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-banner">
        <h2 className="footer-banner-text mb-0">
          "Let's Shop Beyond Boundaries"
        </h2>
      </div>

      <div className="footer-content">
        <div className="container footer-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-column-title">TrueFit</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/about">About TrueFit</Link>
                </li>
                <li>
                  <Link to="">Career</Link>
                </li>
                <li>
                  <Link to="">Mitra Blog</Link>
                </li>
                <li>
                  <Link to="">B2B Digital</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Buy</h3>
              <ul className="footer-links">
                <li>
                  <Link to="">Bill & Top Up</Link>
                </li>
                <li>
                  <Link to="">TrueFit COD</Link>
                </li>
                <li>
                  <Link to="">Brand Index</Link>
                </li>
                <li>
                  <Link to="">Promo</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Sell</h3>
              <ul className="footer-links">
                <li>
                  <Link to="">Seller Education Center</Link>
                </li>
                <li>
                  <Link to="">Register Official Store</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Guide and Help</h3>
              <ul className="footer-links">
                <li>
                  <Link to="">TrueFit Care</Link>
                </li>
                <li>
                  <Link to="">Terms and Condition</Link>
                </li>
                <li>
                  <Link to="">Privacy</Link>
                </li>
                <li>
                  <Link to="">Mitra</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-logo">
              <h2>
                TrueFit<span>.com</span>
              </h2>
              <p className="footer-tagline">"Let's Shop Beyond Boundaries"</p>
            </div>

            <div className="footer-social">
              <Link to="" className="social-link">
                <FaFacebookF />
              </Link>
              <Link to="" className="social-link">
                <FaTwitter />
              </Link>
              <Link to="" className="social-link">
                <FaInstagram />
              </Link>
              <Link to="" className="social-link">
                <FaYoutube />
              </Link>
            </div>
          </div>

          <div className="footer-copyright">
            <p>© 2025 TrueFit.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
