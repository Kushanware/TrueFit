import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FaExclamationTriangle />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="back-home-btn">
            <FaHome /> Go to Homepage
          </Link>
          <button onClick={() => window.history.back()} className="go-back-btn">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
