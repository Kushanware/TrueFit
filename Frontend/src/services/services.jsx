import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: serverUrl,
});

// Products requests
export const getProducts = () => {
  return api.get("/api/products/list");
};

export const addProductReview = (token, orderId, productId, rating, review) => {
  return api.post(
    "/api/products/review",
    { orderId, productId, rating, review },
    { headers: { token } }
  );
};

export const deleteProductReview = (token, productId, reviewId) => {
  return api.post(
    "/api/products/delete-review",
    { productId, reviewId },
    { headers: { token } }
  );
};

// Cart requests
export const getCartData = (token) => {
  return api.get("/api/cart/get", { headers: { token } });
};

export const toggleProductInCart = (itemId, token) => {
  return api.post("/api/cart/toggle", { itemId }, { headers: { token } });
};

export const emptyCart = (token) => {
  return api.post("/api/cart/empty", {}, { headers: { token } });
};

// Wishlist requests
export const getWishlistData = (token) => {
  return api.get("/api/wishlist/get", { headers: { token } });
};

export const toggleProductInwishlist = (itemId, token) => {
  return api.post("/api/wishlist/toggle", { itemId }, { headers: { token } });
};

// User requests
export const login = (data) => {
  return api.post("/api/user/login", data);
};

export const loginWithGoogle = (code) => {
  return api.get(`/auth/google?code=${code}`);
};

export const getOtpForSignup = (email) => {
  return api.post("/api/user/get-otp", { email });
};

export const verifyOtpAndSignup = (userData, otp) => {
  return api.post("/api/user/verify-otp-signup", { userData, otp });
};

export const getUserData = (token) => {
  return api.get("/api/user/get", { headers: { token } });
};

export const updateUserProfile = (token, userData) => {
  return api.post("/api/user/update", userData, {
    headers: { "Content-Type": "multipart/form-data", token },
  });
};

export const adminSignup = (token, formData) => {
  return api.post("/api/user/adminSignup", formData, { headers: { token } });
};

// Order requests
export const createOrder = (token, amount, orderItems) => {
  return api.post(
    "/api/order/place",
    { amount, orderItems },
    { headers: { token } }
  );
};

export const handlePaymentVerification = (
  token,
  orderData,
  razorpayData,
  coupon
) => {
  return api.post(
    "/api/order/verify",
    { orderData, razorpayData, coupon },
    { headers: { token } }
  );
};

export const getOrders = (token) => {
  return api.get("/api/order/user", { headers: { token } });
};

export const placeOrderCOD = (token, orderData, coupon) => {
  return api.post(
    "/api/order/orderByCOD",
    { orderData, coupon },
    { headers: { token } }
  );
};

export const verifyPromoCode = (code) => {
  return api.post("/api/coupon/verify", { code });
};

export const getAvailableCoupons = () => {
  return api.get("/api/coupon/available");
};

// Hero requests
export const getHeroBanners = () => {
  return api.get("/api/hero/listBanners");
};
