import HeroBannerManagement from "./components/Admin/HeroBanner/HeroBannerManagement/HeroBannerManagement";
import ProductManagement from "./components/Admin/ProductManagement/ProductManagement/ProductManagement";
import CouponManagement from "./components/Admin/CouponManagement/CouponManagement/CouponManagement";
import OrderManagement from "./components/Admin/OrderManagement/OrderManagement/OrderManagement";
import { AdminConetxtProvider } from "./components/Admin/AdminContext/AdminContext";
import DashboardHome from "./components/Admin/AdminDashboard/DashboardHome";
import AdminAuthorizer from "./components/AdminAuthorizer/AdminAuthorizer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import AddProduct from "./components/Admin/AddProduct/AddProduct";
import AdminSignup from "./pages/AdminSignup/AdminSignup";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import LoginSignup from "./pages/LoginSignup/LoginSignup";
import PageNotFound from "./pages/NotFound/PageNotFound";
import Collection from "./pages/Collection/Collection";
import ContactUs from "./pages/ContactUs/ContactUs";
import Checkout from "./pages/Checkout/Checkout";
import Wishlist from "./pages/Wishlist/Wishlist";
import Layout from "./components/Layout/Layout";
import ShopNow from "./pages/ShopNow/ShopNow";
import Profile from "./pages/Profile/Profile";
import AboutUs from "./pages/AboutUs/AboutUs";
import Orders from "./pages/Orders/Orders";
import Coupons from "./pages/Coupons/Coupons";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

const App = () => {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      offset: 50,
    });
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/shop/:tag/:category",
          element: <ShopNow />,
        },
        {
          path: "/collection/:category",
          element: <Collection />,
        },
        {
          path: "/about",
          element: <AboutUs />,
        },
        {
          path: "/contact",
          element: <ContactUs />,
        },
        {
          path: "/login",
          element: <LoginSignup />,
        },
        {
          path: "/product/:id",
          element: <ViewProduct />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
        {
          path: "/coupons",
          element: <Coupons />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/adminSignup",
          element: <AdminSignup />,
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
    // Admin routes
    {
      path: "/admin",
      element: (
        <AdminAuthorizer>
          <AdminConetxtProvider>
            <AdminLayout />
          </AdminConetxtProvider>
        </AdminAuthorizer>
      ),
      children: [
        {
          path: "",
          element: <DashboardHome />,
        },
        {
          path: "products",
          element: <ProductManagement />,
        },
        {
          path: "add-product",
          element: <AddProduct />,
        },
        {
          path: "orders",
          element: <OrderManagement />,
        },
        {
          path: "coupons",
          element: <CouponManagement />,
        },
        {
          path: "banners",
          element: <HeroBannerManagement />,
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
