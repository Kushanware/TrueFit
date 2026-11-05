import { colorsList, sizesList, genders } from "../../../assets/data.js";
import { addProduct } from "../AdminServices/AdminServices";
import { AdminConetxt } from "../AdminContext/AdminContext";
import { StoreContext } from "../../Context/StoreContext";
import { useContext, useEffect, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddProduct.css";

const AddProduct = () => {
  const { fetchTagsList, tagsList } = useContext(AdminConetxt);
  const { token } = useContext(StoreContext);
  const [tagIsOpen, setTagIsOpen] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Jackets",
    gender: "Unisex",
    discount: 0,
    tags: ["Todays For You"],
    colors: [],
    sizes: [],
    features: [],
    images: [],
    stock: "10",
    margin: "0",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Limit the total images to 5
    if (product.images.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    // Convert files to previewable URLs
    const newImages = files.map((file) => {
      return {
        file,
        url: URL.createObjectURL(file),
      };
    });

    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...newImages],
    }));
  };
  const removeImage = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    fetchTagsList();
  }, []);

  const handleTagChange = (tag) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      tags: prevProduct.tags.includes(tag)
        ? prevProduct.tags.filter((t) => t !== tag)
        : [...prevProduct.tags, tag],
    }));
  };

  const [colorIsOpen, setColorIsOpen] = useState(false);
  const colorsListData = colorsList;
  // const colorsList = [
  //   "Red",
  //   "Blue",
  //   "Green",
  //   "Black",
  //   "Orange",
  //   "Khaki",
  //   "Beige",
  //   "Silver",
  //   "Gold",
  //   "Tan",
  //   "Brown",
  //   "Navy",
  //   "Gray",
  //   "Olive",
  //   "White",
  // ];
  const handleColorChange = (color) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      colors: prevProduct.colors.includes(color)
        ? prevProduct.colors.filter((t) => t !== color)
        : [...prevProduct.colors, color],
    }));
  };

  const [sizeIsOpen, setSizeIsOpen] = useState(false);
  const sizesListData = sizesList;
  // const sizesList = [
  //   "XS",
  //   "S",
  //   "M",
  //   "L",
  //   "XL",
  //   "XXL",
  //   "6",
  //   "7",
  //   "8",
  //   "9",
  //   "10",
  // ];
  const handleSizeChange = (size) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: prevProduct.sizes.includes(size)
        ? prevProduct.sizes.filter((t) => t !== size)
        : [...prevProduct.sizes, size],
    }));
  };

  const [featureInput, setFeatureInput] = useState("");
  const handleAddFeature = () => {
    if (product.features.length < 10 && featureInput.trim() !== "") {
      setProduct({
        ...product,
        features: [...product.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };
  const handleRemoveFeature = (index) => {
    setProduct({
      ...product,
      features: product.features.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // if (!product.name.trim()) newErrors.name = "Product name is required";

    // if (
    //   !product.price ||
    //   isNaN(product.price) ||
    //   Number.parseFloat(product.price) <= 0
    // ) {
    //   newErrors.price = "Price must be a positive number";
    // }

    // if (!product.description.trim())
    //   newErrors.description = "Description is required";

    if (product.colors.length === 0) {
      newErrors.colors = "At least one color must be selected";
    } else if (product.colors.length >= 5) {
      newErrors.colors = "Max 5 colors can be selected.";
    }

    if (product.sizes.length === 0) {
      newErrors.sizes = "At least one size must be selected";
    } else if (product.sizes.length >= 5) {
      newErrors.sizes = "Max 5 sizes can be selected.";
    }

    if (product.images.length === 0) {
      newErrors.images = "At least one image is required.";
    } else if (product.images.length > 5) {
      newErrors.images = "Max 5 can be selected.";
    }

    if (product.features.length === 0) {
      newErrors.features = "At least one feature is required";
    } else if (product.features.length > 10) {
      newErrors.features = "Features should not exceed 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    if (validateForm()) {
      const formData = new FormData();

      // Append text fields
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", Number(product.price));
      formData.append("category", product.category);
      formData.append("gender", product.gender);
      formData.append("discount", Number(product.discount));
      formData.append("stock", Number(product.stock));
      formData.append("margin", Number(product.margin));

      // Convert arrays to JSON strings and append
      formData.append("tags", JSON.stringify(product.tags));
      formData.append("colors", JSON.stringify(product.colors));
      formData.append("sizes", JSON.stringify(product.sizes));
      formData.append("features", JSON.stringify(product.features));

      // Append images
      product.images.forEach((img) => {
        formData.append("images", img.file);
      });

      toast.promise(
        addProduct(token, formData).then(async (res) => {
          if (res.data.success) {
            navigate("/admin/products");
          } else {
            return Promise.reject(
              new Error(res.data.message || "Could not add new product.")
            );
          }
          return res.data;
        }),
        {
          pending: "Adding new product...",
          success: "New product added successfully.",
          error: "Could not add new product.",
        }
      );
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-header">
        <h2 className="section-title">Add New Product</h2>
        <p className="add-product-subtitle">
          Create a new product to add to your inventory
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="add-product-form needs-validation"
      >
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>

          {/* <div className="form-row"> */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name :
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              className="form-control"
              onChange={handleChange}
              placeholder="Enter product name"
              minLength={5}
              maxLength={50}
              required
            />
            <div className="invalid-feedback">
              Please enter a valid product name.
            </div>
          </div>
          {/* </div> */}

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description :
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="form-control"
              rows="2"
              placeholder="Enter product description"
              minLength={5}
              maxLength={200}
              required
            ></textarea>
            <div className="invalid-feedback">
              Please enter a valid product description.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price :
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="form-control"
              min={0}
              max={1000000}
              placeholder="Enter product price"
              required
            />
            <div className="invalid-feedback">
              Please enter a valid product price.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Select category : </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Jackets" defaultValue>
                Jackets
              </option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Shoes">Shoes</option>
              <option value="Bags">Bags</option>
              <option value="Watches">Watches</option>
              <option value="Caps">Caps</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Select gender : </label>
            <select
              id="gender"
              name="gender"
              value={product.gender}
              onChange={handleChange}
              className="form-control"
            >
              {genders
                .filter((gender) => gender.id !== "none")
                .map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discount" className="form-label">
              Discount :
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              className="form-control"
              min={0}
              max={100}
              placeholder="Enter discount without '%'"
            />
            <div className="invalid-feedback">
              Discount must be between 0 to 100.
            </div>
          </div>

          <div className="d-flex flex-column">
            <div className="multiselect-dropdown">
              <label className="multiselect-label">Select Tags :</label>
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-btn"
                  onClick={() => setTagIsOpen(!tagIsOpen)}
                >
                  {product?.tags?.length > 0
                    ? product?.tags?.join(", ")
                    : "Select Tags"}
                  <span className="arrow">{tagIsOpen ? "▲" : "▼"}</span>
                </button>
                {tagIsOpen && (
                  <div className="dropdown-content">
                    {tagsList.map((tag) => (
                      <label key={tag} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={product?.tags?.includes(tag)}
                          onChange={() => handleTagChange(tag)}
                        />
                        {tag}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="multiselect-dropdown">
              <label className="multiselect-label">Select Colors :</label>
              <div className="dropdown">
                <button
                  type="button"
                  className={`dropdown-btn ${errors.colors ? "required" : ""}`}
                  onClick={() => setColorIsOpen(!colorIsOpen)}
                >
                  {product?.colors?.length > 0
                    ? product?.colors?.join(", ")
                    : "Select at least one color"}
                  <span className="arrow">{tagIsOpen ? "▲" : "▼"}</span>
                </button>
                {errors.colors && (
                  <p className="error-message">{errors.colors}</p>
                )}
                {colorIsOpen && (
                  <div className="dropdown-content">
                    {colorsListData.map((color) => (
                      <label key={color} className="dropdown-item form-label">
                        <input
                          type="checkbox"
                          checked={product?.colors?.includes(color)}
                          onChange={() => handleColorChange(color)}
                        />
                        {color}
                        <div
                          className="addproduct-color-sample"
                          style={{ backgroundColor: color }}
                        ></div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="multiselect-dropdown">
              <label className="multiselect-label form-label">
                Select Sizes :
              </label>
              <div className="dropdown">
                <button
                  type="button"
                  className={`dropdown-btn ${errors.sizes ? "required" : ""}`}
                  onClick={() => setSizeIsOpen(!sizeIsOpen)}
                >
                  {product?.sizes?.length > 0
                    ? product?.sizes?.join(", ")
                    : "Select at least one size"}
                  <span className="arrow">{sizeIsOpen ? "▲" : "▼"}</span>
                </button>
                {errors.sizes && (
                  <p className="error-message">{errors.sizes}</p>
                )}
                {sizeIsOpen && (
                  <div className="dropdown-content">
                    {sizesListData.map((size) => (
                      <label key={size} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={product?.sizes?.includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Features:</label>
            <div className="feature-input">
              <input
                type="text"
                className={`${errors.features ? "required" : ""}`}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Enter a feature"
              />
              <button
                type="button"
                className="luxury-btn"
                onClick={handleAddFeature}
              >
                Add
              </button>
            </div>
            {errors.features && (
              <div className="text-danger">{errors.features}</div>
            )}

            <ul className="feature-list">
              {product?.features?.map((feature, index) => (
                <li key={index} className="feature-item">
                  {feature}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock" className="form-label">
                Stock :
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="form-control"
              />
              <div className="invalid-feedback">
                Please enter stock quantity.
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="margin" className="form-label">
                Margin :
              </label>
              <input
                type="number"
                id="margin"
                name="margin"
                value={product.margin}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min={0.0}
                max={100.0}
                required
                className="form-control"
              />
              <div className="invalid-feedback">
                Please enter a valid margin.
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Product Images</h3>

          {product?.images?.length <= 4 ? (
            <div className="image-upload-area">
              <label
                htmlFor="image-upload"
                className="image-upload-placeholder form-label"
              >
                <FiUpload className="upload-icon" />
                <p>Drag & drop images here or click to browse</p>
                <span>Supports JPG, PNG, WEBP (Max 5MB each)</span>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  hidden
                  accept="image/png, image/jpg, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className={`${errors.images ? "required" : ""}`}
                />
                {errors.images && (
                  <div className="text-danger">{errors.images}</div>
                )}
              </label>
            </div>
          ) : null}
          <div className="image-preview-container">
            {product?.images?.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img.url} alt={`Upload ${index + 1}`} />
                <button
                  className="admin-product-image-remove-btn"
                  onClick={() => removeImage(index)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-product-btn">
            Cancel
          </button>
          <button type="submit" className="save-product-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
