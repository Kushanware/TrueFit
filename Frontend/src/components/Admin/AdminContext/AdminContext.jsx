import { createContext, useContext, useEffect, useState } from "react";
import {
  getCoupons,
  getHeroBanners,
  getOrders,
  getOrdersCount,
  getProducts,
  getProductsCount,
  getTagsList,
  getTotalProfit,
  getUsersCount,
} from "../AdminServices/AdminServices";
import { toast } from "react-toastify";
import {
  FaBox,
  FaCheckCircle,
  FaRegCreditCard,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext";

export const AdminConetxt = createContext();

export const AdminConetxtProvider = ({ children }) => {
  const { token } = useContext(StoreContext);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Placed":
        return <FaRegCreditCard className="status-icon placed" />;
      case "Processing":
        return <FaBox className="status-icon processing" />;
      case "Shipped":
        return <FaTruck className="status-icon shipped" />;
      case "Delivered":
        return <FaCheckCircle className="status-icon delivered" />;
      case "Cancelled":
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const fetchProductsData = async () => {
    const responce = await getProducts();
    if (responce.data.success) {
      setProducts(responce.data.data);
      setAllProducts(responce.data.data);
    } else {
      toast.error(responce.data.message || "Could not get products!");
    }
  };

  const fetchOrdersData = async () => {
    const responce = await getOrders(token);
    if (responce.data.success) {
      setOrders(responce.data.data);
    } else {
      toast.error(responce.data.message || "Could not get products!");
    }
  };

  const fetchCouponsData = async () => {
    const responce = await getCoupons(token);
    if (responce.data.success) {
      setCoupons(responce.data.coupons);
    } else {
      toast.error(responce.data.message || "Could not get coupons.");
    }
  };

  const fetchHeroBannersData = async () => {
    const responce = await getHeroBanners();
    if (responce.data.success) {
      setBanners(responce.data.banners.sort((a, b) => a.order - b.order));
    } else {
      toast.error(responce.data.message || "Could not get hero banners!");
    }
  };

  const fetchProductsCount = async () => {
    const responce = await getProductsCount();
    if (responce.data.success) {
      setTotalProducts(responce.data.totalProducts);
    } else {
      toast.error(responce.data.message || "Could not get products count!");
    }
  };

  const fetchOrdersCount = async () => {
    const responce = await getOrdersCount(token);
    if (responce.data.success) {
      setTotalOrders(responce.data.totalOrders);
    } else {
      toast.error(responce.data.message || "Could not get orders count!");
    }
  };

  const fetchUsersCount = async () => {
    const response = await getUsersCount(token);
    if (response.data.success) {
      setTotalUsers(response.data.userCount);
    } else {
      toast.error(response.data.message || "Could not get users count!");
    }
  };

  const fetchTotalProfit = async () => {
    const response = await getTotalProfit(token);
    if (response.data.success) {
      setTotalProfit(response.data.profit);
    } else {
      toast.error(response.data.message || "Could not get total revenue!");
    }
  };

  const fetchTagsList = async () => {
    const responce = await getTagsList();
    if (responce.data.success) {
      setTagsList((prev) => [
        ...responce.data.tags,
        "Flash Sale",
        "Todays For You",
        "New",
      ]);
    } else {
      console.log(responce.data.error);
      toast.error("Could not get tags!");
    }
  };

  useEffect(() => {
    fetchProductsData();
    fetchProductsCount();
    fetchOrdersData();
    fetchOrdersCount();
    fetchUsersCount();
    fetchTotalProfit();
    fetchCouponsData();
    fetchHeroBannersData();
  }, []);

  const adminContextData = {
    products,
    setProducts,
    allProducts,
    setAllProducts,
    fetchProductsData, //
    fetchProductsCount,
    fetchOrdersData,
    fetchOrdersCount,
    fetchUsersCount,
    fetchTotalProfit,
    fetchCouponsData,
    fetchHeroBannersData, //
    totalProducts,
    orders,
    setOrders,
    totalOrders,
    totalUsers,
    totalProfit,
    coupons,
    setCoupons,
    getStatusIcon,
    banners,
    setBanners,
    fetchTagsList,
    tagsList,
    setTagsList,
  };

  return (
    <AdminConetxt.Provider value={adminContextData}>
      {children}
    </AdminConetxt.Provider>
  );
};
