import ScrollToTop from "../../assets/utils/ScrollToTop";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "../../App.css";

const Layout = () => {
  return (
    <section className="applayout">
      <ScrollToTop />
      <ToastContainer />
      <Header />
      <Outlet />
      <Footer />
    </section>
  );
};

export default Layout;
