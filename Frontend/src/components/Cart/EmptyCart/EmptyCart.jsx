import FlashSale from "../../Home/FlashSale/FlashSale";
import CartHeader from "../CartHeader/CartHeader";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./EmptyCart.css";

const EmptyCart = () => {
  return (
    <div className="cart-container" data-aos="fade-up">
      <CartHeader />
      <div className="cart-empty">
        <div className="empty-cart-icon">
          <FiShoppingCart />
        </div>
        <h2>Your cart is empty.</h2>
        <Link to="/collection/All">
          <button className="luxury-btn">Start Shopping</button>
        </Link>
      </div>
      <FlashSale />
    </div>
  );
};

export default EmptyCart;
