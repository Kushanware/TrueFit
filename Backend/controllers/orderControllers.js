import razorpay from "../configs/razorpay.js";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { generateTrackingId } from "../utils/generateTrackingId.js";
import { log } from "console";
import couponModel from "../models/couponModel.js";
import productModel from "../models/productModel.js";

const placeOrderByCOD = async (req, res) => {
  const { userId, orderData, coupon } = req.body;
  const { userData, items, amount, shippingMethod } = orderData;

  try {
    const paymentMethod = "Cash on Delivery";
    const payment = "Pending";

    let trackingId = await generateTrackingId();

    const deliveryAddress = [
      userData?.apartment,
      userData.address,
      userData.city,
      userData.state,
      userData.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    let customer = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
    };

    const newOrder = new orderModel({
      userId: `${userId}`,
      amount,
      deliveryAddress,
      shippingMethod,
      paymentMethod,
      trackingId,
      payment,
      customer,
      items,
    });

    let foundCoupon = {};
    if (coupon && Object.keys(coupon).length > 0) {
      const code = coupon.code;
      foundCoupon = await couponModel.findOne({ code });

      if (!foundCoupon) {
        return res.json({ success: false, message: "Coupon not found!" });
      } else if (foundCoupon.status === "Expired") {
        return res.json({ success: false, message: "Coupon expired!" });
      }

      foundCoupon.usageCount += 1;

      if (foundCoupon.usageCount === foundCoupon.usageLimit) {
        foundCoupon.status = "Expired";
      }
    }

    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.json({
          success: false,
          message: "Ordered product not found!",
        });
      }

      if (product.stock < item.quantity) {
        return res.json({
          success: false,
          message: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
        });
      }
    }

    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.json({
          success: false,
          message: "Ordered product not found!",
        });
      }

      // Calculate quantity sold
      const quantitySold = item.quantity;

      // Update sale
      product.sale += quantitySold;
      if (product.stock >= quantitySold) {
        if (product.stock === quantitySold) {
          product.status = "Out of Stock";
        }
        product.stock -= quantitySold;
      } else {
        return res.json({ success: false, message: "Not enough stock!" });
      }

      // Calculate sale price after discount (if any)
      const discountedPrice = item.price - (item.price * item.discount) / 100;

      // Total revenue from this item
      const revenue = discountedPrice * quantitySold;

      // Profit: revenue * (margin / 100)
      const profitFromSale =
        Math.round(revenue * (product.margin / 100) * 100) / 100;

      // Add profit to existing
      product.profit += profitFromSale;

      await product.save();
    }

    if (Object.keys(foundCoupon).length > 0) {
      await foundCoupon.save();
    }
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Notifying on telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const sendTelegramNotification = async (newOrder, items) => {
      const message = `
        ! New Order Placed !

        Order Details :-
        ID : ${newOrder._id}
        Tracking Id : ${newOrder.trackingId}
        Total Amount : ₹${newOrder.amount}
        Payment Method : ${newOrder.paymentMethod}

        Customer Information :-
        Name : ${newOrder.customer.name}
        Email : ${newOrder.customer.email}
        Phone : ${newOrder.customer.phone}

        Shipping Details :-
        Method : ${newOrder.shippingMethod}
        Address : ${newOrder.deliveryAddress}

        Items Ordered :-
        ${items
          .map(
            (item) =>
              `- ${item.name} (Color: ${item.color}) (Size: ${item.size}) (Quantity: ${item.quantity})`
          )
          .join("\n")}
      `;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.ok) {
          // console.log("Notification sent successfully!");
        } else {
          console.error("Failed to send notification:", result);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    sendTelegramNotification(newOrder, items);
    res.json({ success: true });
  } catch (error) {
    console.log("Something went wrong while placing order!");
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong!, order not placed.",
    });
  }
};

const placeOrder = async (req, res) => {
  const { amount, orderItems } = req.body;

  for (const item of orderItems) {
    const product = await productModel.findById(item.productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Ordered product not found!",
      });
    }

    if (product.stock < item.quantity) {
      return res.json({
        success: false,
        message: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
      });
    }
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log("Error while creating order");
    console.log(error);
    res.json({ success: false, message: error });
  }
};

const verifyPayment = async (req, res) => {
  const { userId, orderData, razorpayData, coupon } = req.body;
  const { userData, items, amount, shippingMethod } = orderData;
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    razorpayData;

  //   Generating server-side signature
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  // verifying the signature
  if (generated_signature === razorpay_signature) {
    try {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

      if (!paymentDetails) {
        res.json({ success: false, message: "Payment not found!" });
      }

      let paymentMethod = "";
      let payment = "";
      if (paymentDetails.method === "upi") {
        paymentMethod = "UPI";
        payment = "Paid";
      } else if (paymentDetails.method === "card") {
        if (paymentDetails.card.type === "credit") {
          paymentMethod = `Credit, ${paymentDetails.card.network} (Ending with ...${paymentDetails.card.last4})`;
          payment = "Paid";
        } else {
          paymentMethod = `Debit, ${paymentDetails.card.network} (Ending with ...${paymentDetails.card.last4})`;
          payment = "Paid";
        }
      } else if (paymentDetails.method === "netbanking") {
        paymentMethod = `Netbanking by ${paymentDetails.bank}`;
        payment = "Paid";
      } else if (paymentDetails.method === "wallet") {
        paymentMethod = `Wallet by ${paymentDetails.wallet}`;
        payment = "Paid";
      } else if (paymentDetails.method === "paylater") {
        paymentMethod = `Paylater by ${paymentDetails.wallet}`;
        payment = "Pending";
      }

      let trackingId = await generateTrackingId();

      const deliveryAddress = [
        userData?.apartment,
        userData.address,
        userData.city,
        userData.state,
        userData.zipCode,
      ]
        .filter(Boolean)
        .join(", ");

      let customer = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
      };

      const newOrder = new orderModel({
        userId: `${userId}`,
        amount,
        deliveryAddress,
        shippingMethod,
        paymentMethod,
        trackingId,
        payment,
        customer,
        items,
      });

      let foundCoupon = {};
      if (coupon && Object.keys(coupon).length > 0) {
        const code = coupon.code;
        foundCoupon = await couponModel.findOne({ code });

        if (!foundCoupon) {
          return res.json({ success: false, message: "Coupon not found!" });
        } else if (foundCoupon.status === "Expired") {
          return res.json({ success: false, message: "Coupon expired!" });
        }

        foundCoupon.usageCount += 1;

        if (foundCoupon.usageCount === foundCoupon.usageLimit) {
          foundCoupon.status = "Expired";
        }
      }

      for (const item of items) {
        const product = await productModel.findById(item.productId);

        if (!product) {
          return res.json({
            success: false,
            message: "Ordered product not found!",
          });
        }

        if (product.stock < item.quantity) {
          return res.json({
            success: false,
            message: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
          });
        }
      }

      for (const item of items) {
        const product = await productModel.findById(item.productId);

        if (!product) {
          return res.json({
            success: false,
            message: "Ordered product not found!",
          });
        }

        // Calculate quantity sold
        const quantitySold = item.quantity;

        // Update sale
        product.sale += quantitySold;
        if (product.stock >= quantitySold) {
          if (product.stock === quantitySold) {
            product.status = "Out of Stock";
          }
          product.stock -= quantitySold;
        } else {
          return res.json({ success: false, message: "Not enough stock!" });
        }

        // Calculate sale price after discount (if any)
        const discountedPrice = item.price - (item.price * item.discount) / 100;

        // Total revenue from this item
        const revenue = discountedPrice * quantitySold;

        // Profit: revenue * (margin / 100)
        const profitFromSale =
          Math.round(revenue * (product.margin / 100) * 100) / 100;

        // Add profit to existing
        product.profit += profitFromSale;

        await product.save();
      }

      if (Object.keys(foundCoupon).length > 0) {
        await foundCoupon.save();
      }
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      // Notifying on telegram
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      const sendTelegramNotification = async (newOrder, items) => {
        const message = `
        ! New Order Placed !

        Order Details :-
        ID : ${newOrder._id}
        Tracking Id : ${newOrder.trackingId}
        Total Amount : ₹${newOrder.amount}
        Payment Method : ${newOrder.paymentMethod}

        Customer Information :-
        Name : ${newOrder.customer.name}
        Email : ${newOrder.customer.email}
        Phone : ${newOrder.customer.phone}

        Shipping Details :-
        Method : ${newOrder.shippingMethod}
        Address : ${newOrder.deliveryAddress}

        Items Ordered :-
        ${items
          .map(
            (item) =>
              `- ${item.name} (Color: ${item.color}) (Size: ${item.size}) (Quantity: ${item.quantity})`
          )
          .join("\n")}
      `;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
          message
        )}`;

        try {
          const response = await fetch(url);
          const result = await response.json();
          if (result.ok) {
            // console.log("Notification sent successfully!");
          } else {
            console.error("Failed to send notification:", result);
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

      sendTelegramNotification(newOrder, items);

      res.json({ success: true });
    } catch (error) {
      console.log("Something went wrong after payment verification");
      console.log(error);
      res.json({
        success: false,
        message: "Payment verification failed!, order not placed.",
      });
    }
  } else {
    console.log("Payment verification failed");
    res.json({ success: false, message: "Payment verification failed" });
  }
};

const listAllOrders = async (req, res) => {
  try {
    const allOrders = await orderModel.find({});
    res.json({ success: true, data: allOrders });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong while getting all orders",
    });
  }
};

const getOrdersCount = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    const totalOrders = orders.length;

    res.json({ success: true, totalOrders });
  } catch (error) {
    console.log("Error occurred while getting orders count!");
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred while getting orders count!",
    });
  }
};

const listUserOrders = async (req, res) => {
  const { userId } = req.body;

  try {
    const orders = await orderModel.find({ userId: userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error while getting user orders from DB");
    console.log(error);
    res.json({
      success: false,
      message: "Error while getting user orders from DB",
    });
  }
};

const updateOrderStatue = async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found!" });
    }

    order.status = newStatus;

    if (newStatus === "Placed") {
      order.statusProgress = 10;
    } else if (newStatus === "Processing") {
      order.statusProgress = 43;
    } else if (newStatus === "Shipped") {
      order.statusProgress = 66;
    } else if (newStatus === "Delivered") {
      order.statusProgress = 100;
      order.payment = "Paid";
    } else if (newStatus === "Cancelled") {
      order.statusProgress = 0;
    }

    await order.save();

    res.json({ success: true });
  } catch (error) {
    console.log("Error while updating users order status.");
    console.log(error);
    return res.json({
      success: false,
      message: "Error while updating users order status.",
    });
  }
};

export {
  placeOrderByCOD,
  placeOrder,
  verifyPayment,
  listAllOrders,
  getOrdersCount,
  listUserOrders,
  updateOrderStatue,
};
