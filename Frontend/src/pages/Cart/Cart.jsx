import TodaysForYou from "../../components/Home/TodaysForYou/TodaysForYou";
import { emptyCart, toggleProductInCart } from "../../services/services";
import CartSummary from "../../components/Cart/CartSummary/CartSummary";
import { StoreContext } from "../../components/Context/StoreContext";
import CartHeader from "../../components/Cart/CartHeader/CartHeader";
import CartItems from "../../components/Cart/CartItems/CartItems";
import EmptyCart from "../../components/Cart/EmptyCart/EmptyCart";
import { useEffect, useContext, useState } from "react";
import "./Cart.css";

const Cart = () => {
  const { cartData, setCartData, cartProducts, getCartProducts, token } =
    useContext(StoreContext);

  useEffect(() => {
    getCartProducts();
  }, [cartData]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartData((prev) => {
      const updatedCartData = { ...prev };

      updatedCartData[id] = newQuantity;

      return updatedCartData;
    });
  };

  // Remove item
  const removeFromCart = async (id) => {
    setCartData((prev) => {
      const updatedCartData = { ...prev };

      delete updatedCartData[id];

      return updatedCartData;
    });

    // Removing item from users DB cart
    if (token) {
      try {
        const res = await toggleProductInCart(id, token);
        if (!res.data.success) {
          console.log("Could not toggle product to Db wishlist");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCartData({});

    // Making the cart empty in db
    if (token) {
      try {
        const res = await emptyCart(token);
        if (!res.data.success) {
          console.log("Could not toggle product to Db wishlist");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (cartProducts.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-container" data-aos="fade-up">
      <CartHeader />
      <div className="cart-content">
        <div className="cart-items">
          <CartItems
            cartItems={cartProducts}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        </div>
        <div className="cart-sidebar">
          <CartSummary />
        </div>
      </div>
      <TodaysForYou />
    </div>
  );
};

export default Cart;
