import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { StoreContext } from "../../components/Context/StoreContext";
import { Navigate, useNavigate } from "react-router-dom";
import { adminSignup } from "../../services/services";
import { useState, useContext } from "react";
import "../LoginSignup/LoginSignup.css";
import { toast } from "react-toastify";

const AdminSignup = () => {
  const { token, setUser } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    token: "",
    secret: "",
  });
  const [showToken, setShowToken] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.info("You must be logged in.");
      return navigate("/login");
    }

    const form = e.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    toast.promise(
      adminSignup(token, formData).then(async (res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setFormData({
            token: "",
            secret: "",
          });
          navigate("/");
        } else {
          return Promise.reject(
            new Error(res.data.message || "An error occurred")
          ); // Reject promise to prevent success toast
        }
        return res.data;
      }),
      {
        pending: "Signing up as admin...",
        success: "Signed up as admin.",
        error: "!Access Denied!",
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowToken(!showToken);
  };

  return (
    <div className="login-signup-container">
      <div className="login-signup-card" data-aos="fade-up">
        <div className="login-header">
          <h2>Sign up for Admin</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="admin-login-signup-form needs-validation"
        >
          <div
            className="login-form-group"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {/* <label htmlFor="token" className="login-form-input-label">
              <FaEnvelope />
            </label> */}
            <input
              type="text"
              id="token"
              name="token"
              placeholder="Admin token"
              className="form-control"
              value={formData.token}
              onChange={handleInputChange}
              minLength={12}
              maxLength={12}
              required
            />
            <div className="invalid-feedback">Please enter admin token.</div>
          </div>

          <div
            className="login-form-group"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {/* <label htmlFor="secret" className="login-form-input-label">
              <FaLock />
            </label> */}
            <input
              type={showToken ? "text" : "password"}
              id="secret"
              name="secret"
              placeholder="Admin secret"
              className="form-control"
              value={formData.secret}
              onChange={handleInputChange}
              minLength={12}
              maxLength={12}
              required
            />
            <div className="invalid-feedback">Please enter admin secret.</div>
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showToken ? "Hide token" : "Show token"}
            >
              {showToken ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="submit-btn"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
