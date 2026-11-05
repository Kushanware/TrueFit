import { cloudinary } from "../configs/cloud.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";

const addProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    gender,
    price,
    colors,
    sizes,
    features,
    discount,
    tags,
    stock,
    margin,
  } = req.body;

  const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);
  const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
  const parsedFeatures = Array.isArray(features)
    ? features
    : JSON.parse(features);
  const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);

  const imagesData = req.files.map((currFile) => {
    return { url: currFile.path, filename: currFile.filename };
  });

  if (
    !name ||
    !description ||
    !category ||
    !parsedColors ||
    !parsedSizes ||
    !parsedFeatures ||
    !parsedTags
  ) {
    return res.json({ success: false, message: "Something went wrong" });
  }

  const stockNumber = Number(stock);
  let status = "";

  if (stockNumber === 0) {
    status = "Out of Stock";
  } else if (stockNumber > 0 && stockNumber <= 10) {
    status = "Low Stock";
  } else {
    status = "Active";
  }

  try {
    const newProduct = new productModel({
      name: name,
      description: description,
      category: category,
      gender: gender,
      price: price,
      category: category,
      discount: discount,
      tags: parsedTags,
      colors: parsedColors,
      sizes: parsedSizes,
      features: parsedFeatures,
      stock: stock,
      margin: margin,
      status: status,
      images: imagesData,
    });

    await newProduct.save();
    return res.json({ success: true, message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Something went wrong while adding the product.",
    });
  }
};

const updateProduct = async (req, res) => {
  const {
    id,
    name,
    description,
    category,
    gender,
    price,
    colors,
    sizes,
    features,
    discount,
    tags,
    stock,
    margin,
    sale,
    profit,
    existingImages,
  } = req.body;

  let product = await productModel.findById(id);

  if (!product) {
    return res.json({ success: false, message: "Product not found!" });
  }

  const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);
  const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
  const parsedFeatures = Array.isArray(features)
    ? features
    : JSON.parse(features);
  const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);

  if (
    !name ||
    !description ||
    !category ||
    !parsedColors ||
    !parsedSizes ||
    !parsedFeatures ||
    !parsedTags
  ) {
    return res.json({ success: false, message: "Something went wrong" });
  }

  const stockNumber = Number(stock);
  let status = "";

  if (stockNumber === 0) {
    status = "Out of Stock";
  } else if (stockNumber > 0 && stockNumber <= 10) {
    status = "Low Stock";
  } else {
    status = "Active";
  }

  // Ensure images is correctly parsed
  let parsedImages = JSON.parse(existingImages);

  // Keep only valid image objects
  const imagesToKeep = parsedImages.filter((img) => img._id);

  // Upload new images to Cloudinary
  const newImages = req.files.map((currFile) => {
    return { url: currFile.path, filename: currFile.filename };
  });

  // Images to be deleted
  const imagesToBeRemoved = product.images.filter(
    (img) =>
      !imagesToKeep.some((existing) => existing._id === img._id.toString())
  );

  if (imagesToBeRemoved.length > 0) {
    try {
      await Promise.all(
        imagesToBeRemoved.map((currImage) =>
          cloudinary.uploader.destroy(currImage.filename)
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  try {
    // Combine old and new images
    const updatedImages = [...imagesToKeep, ...newImages];

    product.name = name;
    product.description = description;
    product.category = category;
    product.gender = gender;
    product.price = price;
    product.discount = discount;
    product.colors = parsedColors;
    product.features = parsedFeatures;
    product.sizes = parsedSizes;
    product.tags = parsedTags;
    product.status = status;
    product.stock = stock;
    product.margin = margin;
    product.sale = sale;
    product.profit = profit;
    product.images = updatedImages;

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Could not update product" });
  }
};

const removeProduct = async (req, res) => {
  const { id } = req.body;

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Could not find the product",
      });
    }

    const productImages = product.images.map((currImage) => currImage.filename);

    if (productImages.length > 0) {
      try {
        await Promise.all(
          productImages.map((currImage) =>
            cloudinary.uploader.destroy(currImage)
          )
        );
      } catch (error) {
        console.log(error);
      }
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong while removing the product from DB",
    });
  }
};

const listAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel
      .find({})
      .populate({ path: "reviews", populate: { path: "author" } });
    res.json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong while getting all products",
    });
  }
};

const getRevenue = async (req, res) => {
  try {
    const products = await productModel.find({});

    let profit = 0;

    for (const product of products) {
      if (product.sale > 0) {
        profit += product.profit;
      }
    }

    res.json({ success: true, profit: Math.round(profit * 100) / 100 });
  } catch (error) {
    console.log("Error while calculating revenue");
    console.log(error);
    res.json({ success: false, message: "Error while calculating revenue" });
  }
};

const getProductsCount = async (req, res) => {
  try {
    const products = await productModel.find({});
    const totalProducts = products.length;

    res.json({ success: true, totalProducts });
  } catch (error) {
    console.log("Error while getting products count");
    console.log(error);
    res.json({
      success: false,
      message: "Error while getting products count!",
    });
  }
};

const addProductReview = async (req, res) => {
  const { userId, orderId, productId, rating, review } = req.body;

  if (!userId || !orderId || !productId) {
    return res.json({ success: false, message: "Missing data fields." });
  }

  try {
    const product = await productModel.findById(productId).populate("reviews");
    const order = await orderModel.findById(orderId);

    if (!product) {
      return res.json({ success: false, message: "Product not found!" });
    }
    if (!order) {
      return res.json({ success: false, message: "Order not found!" });
    }

    const alreadyReviewed = order.items.find((currProduct) => {
      if (currProduct.productId.toString() === productId) {
        return currProduct.reviewed;
      }
    });

    if (alreadyReviewed) {
      return res.json({
        success: false,
        message: "You have already reviewed this item.",
      });
    }

    let newReview = new reviewModel({
      review,
      rating,
      author: userId,
    });

    product.reviews.push(newReview);

    for (const item of order.items) {
      if (item.productId.toString() === productId) {
        item.reviewed = true;
      }
    }

    order.markModified("items");

    let totalRating = product.reviews.reduce((sum, rev) => {
      return sum + rev.rating;
    }, 0);

    let newRating =
      Math.round((totalRating / product.reviews.length) * 10) / 10;

    product.rating = newRating || 0;

    await newReview.save();
    await product.save();
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while adding review." });
  }
};

const deleteProductReview = async (req, res) => {
  const { productId, reviewId } = req.body;

  if (!productId || !reviewId) {
    return res.json({
      success: false,
      message: "Missing product or review id.",
    });
  }

  try {
    const product = await productModel.findById(productId).populate("reviews");

    if (!product) {
      return res.json({ success: false, message: "Product not found!" });
    }

    const filteredReviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    product.reviews = filteredReviews;

    let totalRating = filteredReviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    let newRating =
      Math.round((totalRating / filteredReviews.length) * 10) / 10;

    product.rating = newRating || 0;

    await product.save();
    await reviewModel.findByIdAndDelete(reviewId);

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

export {
  addProduct,
  updateProduct,
  listAllProducts,
  getProductsCount,
  removeProduct,
  getRevenue,
  addProductReview,
  deleteProductReview,
};
