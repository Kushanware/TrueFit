import {
  getOtpForSignup,
  login,
  loginWithGoogle,
  verifyOtpAndSignup,
} from "../../services/services";
import { StoreContext } from "../../components/Context/StoreContext";
import { useGoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "./LoginSignup.css";

const LoginSignup = () => {
  const { loadWishlistData, loadCartData, setToken, setUser } =
    useContext(StoreContext);
  const [isLogin, setIsLogin] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetOtp = async () => {
    toast.promise(
      getOtpForSignup(userData.email).then(async (res) => {
        if (res.data.success) {
          setOtpSent(true);
        } else {
          toast.error(
            res.data.message || "Something went wrong, please try again later."
          );
          return Promise.reject(
            new Error(res.data.message || "An error occurred")
          ); // Reject promise to prevent success toast
        }
        return res.data;
      }),
      {
        pending: "Generating OTP...",
        success: `OTP sent to '${userData.email}'`,
      }
    );
  };

  const handleVerifyOtpAndSignup = async () => {
    try {
      toast.promise(
        verifyOtpAndSignup(userData, otp).then(async (res) => {
          if (res.data.success) {
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            await loadCartData(res.data.token);
            await loadWishlistData(res.data.token);
            navigate(-1);
            setUserData({
              name: "",
              email: "",
              password: "",
            });
            setOtp("");
            setOtpSent(false);
          } else {
            toast.error(
              res.data.message || "Something went wrong, could not signup."
            );
            return Promise.reject(
              new Error(res.data.message || "An error occurred")
            ); // Reject promise to prevent success toast
          }
          return res.data;
        }),
        {
          pending: "Verifying OTP, please wait...",
          success: "Welcome to TrueFit!",
        }
      );
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    if (isLogin) {
      toast.promise(
        login(userData).then(async (res) => {
          if (res.data.success) {
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            await loadCartData(res.data.token);
            await loadWishlistData(res.data.token);
            navigate(-1);
            setUserData({
              name: "",
              email: "",
              password: "",
            });
          } else {
            toast.error(res.data.message || "Something went wrong");
            return Promise.reject(
              new Error(res.data.message || "An error occurred")
            ); // Reject promise to prevent success toast
          }
          return res.data;
        }),
        {
          pending: "Logging in, please wait...",
          success: "Welcome back!",
          error: "Failed to login. Please try again.",
        }
      );
    } else {
      if (!otpSent) {
        return handleGetOtp(); // First step: send OTP
      } else {
        return handleVerifyOtpAndSignup(); // Second step: verify & signup
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const responseGoogle = async (authResult) => {
    try {
      const code = authResult["code"];

      if (code) {
        toast.promise(
          loginWithGoogle(code).then(async (res) => {
            if (res.data.success) {
              localStorage.setItem("token", res.data.token);
              setToken(res.data.token);
              setUser(res.data.user);
              await loadCartData(res.data.token);
              await loadWishlistData(res.data.token);
              navigate(-1);
            } else {
              toast.error(res.data.message || "Something went wrong");
              return Promise.reject(
                new Error(res.data.message || "An error occurred")
              ); // Reject promise to prevent success toast
            }
            return res.data;
          }),
          {
            pending: `${
              isLogin
                ? "Logging in, please wait..."
                : "Signing in, please wait..."
            }`,
            error: "Could not sign in.",
          }
        );
      }
    } catch (error) {
      console.log("Error while requesting google code : ", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="login-signup-container">
      <div className="login-signup-card" data-aos="fade-up">
        <div className="login-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>
            {isLogin ? "Login to your account" : "Sign up for a new account"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="login-signup-form needs-validation"
        >
          {!isLogin && (
            <div
              className="login-form-group"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              {/* <label
                htmlFor="name"
                className="login-form-input-label form-label"
              >
                <FaUser />
              </label> */}
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                className="form-control"
                value={userData.name}
                onChange={handleInputChange}
                minLength={3}
                required={!isLogin}
              />
              <div className="invalid-feedback">Please enter your name.</div>
            </div>
          )}

          <div
            className="login-form-group"
            data-aos="fade-down"
            data-aos-delay={isLogin ? "100" : "200"}
          >
            {/* <label
              htmlFor="email"
              className="login-form-input-label form-label"
            >
              Email :
            </label> */}
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="form-control"
              value={userData.email}
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback">Please enter your email.</div>
          </div>
          <div
            className="login-form-group"
            data-aos="fade-down"
            data-aos-delay={isLogin ? "200" : "300"}
          >
            {/* <label
              htmlFor="password"
              className="login-form-input-label form-label"
            >
              <FaLock />
            </label> */}
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={userData.password}
              onChange={handleInputChange}
              minLength={8}
              maxLength={20}
              required
            />
            <div className="invalid-feedback">Please enter your password.</div>
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {!isLogin && otpSent && (
            <div
              className="login-form-group"
              data-aos="fade-down"
              data-aos-delay="350"
            >
              {/* <label
                htmlFor="otp"
                className="login-form-input-label form-label"
              >
                🔒
              </label> */}
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                minLength={6}
                maxLength={6}
                required={!isLogin && otpSent}
              />
              <div className="invalid-feedback">Please enter OTP.</div>
            </div>
          )}
          <button
            type="submit"
            className="submit-btn"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            {isLogin
              ? "Login"
              : otpSent
              ? "Verify OTP & Sign Up"
              : "Get OTP for Sign Up"}
          </button>
        </form>

        <div
          className="login-signup-divider"
          data-aos="fade-in"
          data-aos-delay="500"
        >
          <span>or</span>
        </div>

        <div className="social-login" data-aos="fade-up" data-aos-delay="500">
          <button className="social-btn google" onClick={handleGoogleLogin}>
            <FcGoogle />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="toggle-mode" data-aos="fade-in" data-aos-delay="500">
          <p>
            {isLogin
              ? "Don't have an account ? "
              : "Already have an account ? "}
            <button onClick={toggleMode}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
