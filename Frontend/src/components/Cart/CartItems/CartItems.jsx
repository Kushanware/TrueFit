import { StoreContext } from "../../Context/StoreContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import "./CartItems.css";

const CartItems = ({ cartItems, removeFromCart, clearCart }) => {
  const { productsToOrder, setProductsToOrder } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCartDataToOrder = (key, value, id) => {
    setProductsToOrder(
      productsToOrder.map((curr) => {
        if (curr._id === id) {
          return { ...curr, [key]: value };
        } else {
          return curr;
        }
      })
    );
  };

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;

    const orderItems = cartItems
      .filter((item) => item.stock > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        discount: item.discount,
        images: item.images,
        quantity: item.quantity,
        color: item.colors?.[0],
        size: item.sizes?.[0],
      }));

    setProductsToOrder(orderItems);
  }, [cartItems]);

  return (
    <div
      className="cart-items-container"
      data-aos="fade-up"
      data-aos-delay={100 * 50}
    >
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items-header">
            <span className="product-col">Product</span>
            <span className="color-col">Colors</span>
            <span className="size-col">Sizes</span>
            <span className="price-col">Price</span>
            <span className="quantity-col">Quantity</span>
            <span className="total-col">Total</span>
            <span className="action-col"></span>
          </div>

          <div className="cart-items">
            {cartItems.map((item, mainIndex) => (
              <div className="cart-item" key={item._id}>
                <div className="product-col">
                  <div className="cart-item-image">
                    <img
                      src={item.images[0].url || "/placeholder.svg"}
                      alt={item.name}
                    />
                    {/* {item.stock === 0 ? (
                      <span className="out-of-stock">
                        <span>Out of Stock</span>
                      </span>
                    ) : null} */}
                    {item.stock !== 0 && item.discount && (
                      <span className="discount-badge">-{item.discount}%</span>
                    )}
                  </div>
                  <div className="cart-product-details">
                    <h3>{item.name}</h3>
                    <div className="product-meta">
                      <span className="d-flex large-screen-product-colors">
                        <span className="me-2">Color:</span>
                        <div className="product-colors">
                          {/* <h3>Color</h3> */}
                          <div className="cart-item-color-options">
                            {item &&
                              item.colors &&
                              item.colors.map((color, index) => (
                                <button
                                  key={color}
                                  className={`cart-item-color-option ${
                                    productsToOrder[mainIndex]?.color === color
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleCartDataToOrder(
                                      "color",
                                      color,
                                      item._id
                                    )
                                  }
                                  disabled={item.stock === 0}
                                >
                                  <div
                                    className={`cart-item-color-circle`}
                                    style={{ backgroundColor: color }}
                                  ></div>
                                  <span>{color}</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      </span>
                      <span className="d-flex large-screen-product-sizes">
                        <span className="me-2">Size:</span>
                        <div className="cart-item-product-sizes">
                          {/* <h3>Size</h3> */}
                          <div className="size-options">
                            {item &&
                              item.sizes &&
                              item.sizes.map((size) => (
                                <button
                                  key={size}
                                  className={`cart-item-size-option ${
                                    productsToOrder[mainIndex]?.size === size
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleCartDataToOrder(
                                      "size",
                                      size,
                                      item._id
                                    )
                                  }
                                  disabled={item.stock === 0}
                                >
                                  {size}
                                </button>
                              ))}
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="color-col">
                  <span className="small-screen-product-colors">
                    {/* <span className="me-2">Color:</span> */}
                    <div className="product-colors">
                      {/* <h3>Color</h3> */}
                      <div className="cart-item-color-options">
                        {item &&
                          item.colors &&
                          item.colors.map((color) => (
                            <button
                              key={color}
                              className={`cart-item-color-option ${
                                productsToOrder[mainIndex]?.color === color
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleCartDataToOrder("color", color, item._id)
                              }
                              disabled={item.stock === 0}
                            >
                              <div
                                className={`cart-item-color-circle`}
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="color-name">{color}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </span>
                </div>
                <div className="size-col">
                  <span className="small-screen-product-sizes">
                    {/* <span className="me-2">Size:</span> */}
                    <div className="cart-item-product-sizes">
                      {/* <h3>Size</h3> */}
                      <div className="size-options">
                        {item &&
                          item.sizes &&
                          item.sizes.map((size) => (
                            <button
                              key={size}
                              className={`cart-item-size-option ${
                                productsToOrder[mainIndex]?.size === size
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleCartDataToOrder("size", size, item._id)
                              }
                              disabled={item.stock === 0}
                            >
                              {size}
                            </button>
                          ))}
                      </div>
                    </div>
                  </span>
                </div>

                <div className="price-col">
                  <div className="cart-item-price">
                    {item.discount ? (
                      <span className="cart-item-current-price">
                        &#8377;
                        {Math.floor(
                          item.price - (item.price * item.discount) / 100
                        ).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="cart-item-current-price">
                        &#8377;
                        {item.price.toLocaleString("en-IN")}
                      </span>
                    )}
                    {item.discount ? (
                      <span className="original-price">
                        &#8377;
                        {Math.floor(item.price).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="cart-quantity-col">
                  <div className="cart-quantity-control">
                    <button
                      className="cart-quantity-btn minus"
                      onClick={() =>
                        handleCartDataToOrder(
                          "quantity",
                          productsToOrder[mainIndex]?.quantity - 1,
                          item._id
                        )
                      }
                      disabled={
                        productsToOrder[mainIndex]?.quantity <= 1 ||
                        item.stock === 0
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={productsToOrder[mainIndex]?.quantity || 1}
                      onChange={(e) =>
                        handleCartDataToOrder(
                          "quantity",
                          e.target.value || 1,
                          item._id
                        )
                      }
                      disabled={true}
                      min="1"
                    />
                    <button
                      className="cart-quantity-btn plus"
                      onClick={() =>
                        handleCartDataToOrder(
                          "quantity",
                          productsToOrder[mainIndex]?.quantity + 1,
                          item._id
                        )
                      }
                      disabled={
                        productsToOrder[mainIndex]?.quantity >= item.stock ||
                        item.stock === 0
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-col">
                  <span className="item-total">
                    &#8377;
                    {Math.floor(
                      (item.price - (item.price * item.discount) / 100) *
                        (productsToOrder[mainIndex]?.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="action-col">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            {/* <Link to="/"> */}
            <button className="continue-shopping" onClick={handleBack}>
              <FaArrowLeft />
              Continue Shopping
            </button>
            {/* </Link> */}
            <button className="clear-cart" onClick={clearCart}>
              <FaTrash />
              Clear Cart
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default CartItems;
