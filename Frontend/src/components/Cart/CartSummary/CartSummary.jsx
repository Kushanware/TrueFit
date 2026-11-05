import { StoreContext } from "../../Context/StoreContext";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCcMastercard } from "react-icons/fa";
import { FaCcPaypal } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import "./CartSummary.css";
import { toast } from "react-toastify";

const CartSummary = () => {
  const { token, productsToOrder, shippingCost, subtotal, setSubtotal } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const total = shippingCost + subtotal;

  const formatPrice = (price) => {
    return price?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const handleGoToCheckout = () => {
    if (!token) {
      toast.info("Please login to proceed to checkout.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const getSubtotal = () => {
    const calSubtotal = productsToOrder.reduce(
      (sum, item) =>
        item.discount
          ? sum +
            (item.price - (item.price * item.discount) / 100) * item.quantity
          : sum + item.price * item.quantity,
      0
    );

    setSubtotal(calSubtotal);
  };

  useEffect(() => {
    getSubtotal();
  }, [productsToOrder]);

  return (
    <div
      className="cart-summary"
      data-aos="fade-up"
      data-aos-delay={100 + 2 * 50}
    >
      <h2 className="summary-title">Order Summary</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatPrice(Math.floor(subtotal))}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>
          {subtotal !== 0 ? formatPrice(shippingCost) : formatPrice(0)}
        </span>
      </div>
      <div className="summary-row">
        <span>Total</span>
        <span>
          {subtotal !== 0 ? formatPrice(Math.floor(total)) : formatPrice(0)}
        </span>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <span>
          {subtotal !== 0
            ? formatPrice(Math.floor(subtotal + shippingCost))
            : formatPrice(0)}
        </span>
      </div>
      <button
        className="checkout-btn"
        disabled={subtotal === 0}
        onClick={handleGoToCheckout}
      >
        <FaLock /> Secure Checkout
      </button>
      <div className="payment-methods">
        <FaCcVisa />
        <FaCcMastercard />
        <FaCcPaypal />
      </div>
    </div>
  );
};

export default CartSummary;
