import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: serverUrl,
});

// Product requests
export const getProducts = () => {
  return api.get("/api/products/list");
};

export const getProductsCount = () => {
  return api.get("/api/products/count");
};

// Needs to be Admin
export const addProduct = (token, product) => {
  return api.post("/api/products/add", product, {
    headers: {
      "Content-Type": "multipart/form-data",
      token,
    },
  });
};

// Needs to be Admin
export const editProduct = (token, product) => {
  return api.put("/api/products/edit", product, {
    headers: {
      "Content-Type": "multipart/form-data",
      token,
    },
  });
};

// Needs to be Admin
export const deleteProduct = (token, id) => {
  return api.post("/api/products/remove", { id }, { headers: { token } });
};

// Needs to be Admin
export const getTotalProfit = (token) => {
  return api.get("/api/products/revenue", { headers: { token } });
};

// Order requests
// Needs to be Admin
export const getOrders = (token) => {
  return api.get("/api/order/list", { headers: { token } });
};

// Needs to be Admin
export const getOrdersCount = (token) => {
  return api.get("api/order/count", { headers: { token } });
};

// Needs to be Admin
export const updateOrderStatue = (token, orderId, newStatus) => {
  return api.post(
    "/api/order/update",
    { orderId, newStatus },
    { headers: { token } }
  );
};

// Coupon requests
// Needs to be Admin
export const getCoupons = (token) => {
  return api.get("/api/coupon/list", { headers: { token } });
};

// Needs to be Admin
export const addNewCoupon = (token, couponData) => {
  return api.post("/api/coupon/add", { couponData }, { headers: { token } });
};

// Needs to be Admin
export const editCoupon = (token, coupon) => {
  return api.put("/api/coupon/edit", coupon, { headers: { token } });
};

// Needs to be Admin
export const deleteCoupon = (token, id) => {
  return api.post(
    "/api/coupon/delete",
    {
      data: { couponId: id },
    },
    { headers: { token } }
  );
};

// User requests
// Needs to be Admin
export const getUsersCount = (token) => {
  return api.get("/api/user/count", { headers: { token } });
};

// Hero requests
export const getHeroBanners = () => {
  return api.get("/api/hero/listBanners");
};

// Needs to be Admin
export const addNewHeroBanner = (token, banner) => {
  return api.post("/api/hero/addNewBanner", banner, {
    headers: {
      "Content-Type": "multipart/form-data",
      token,
    },
  });
};

// Needs to be Admin
export const deleteHeroBanner = (token, id) => {
  return api.post("/api/hero/deleteBanner", { id }, { headers: { token } });
};

// Needs to be Admin
export const editHeroBanner = (token, updatedBanner) => {
  return api.put("/api/hero/editBanner", updatedBanner, { headers: { token } });
};

// Needs to be Admin
export const updateHeroBannersOrder = (token, banners) => {
  return api.post("/api/hero/swap", { banners }, { headers: { token } });
};

// Needs to be Admin
export const getTagsList = () => {
  return api.get("/api/hero/tags");
};
