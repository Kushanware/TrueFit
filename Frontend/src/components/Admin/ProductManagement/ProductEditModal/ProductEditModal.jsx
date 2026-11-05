import { editProduct } from "../../AdminServices/AdminServices";
import { genders } from "../../../../assets/data.js";
import { AdminConetxt } from "../../AdminContext/AdminContext";
import { StoreContext } from "../../../Context/StoreContext";
import { useContext, useEffect, useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import "./ProductEditModal.css";

const ProductEditModal = ({ product, onCancel, onSave }) => {
  const { fetchTagsList, tagsList } = useContext(AdminConetxt);
  const { token } = useContext(StoreContext);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [errors, setErrors] = useState({});

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Limit the total images to 5
    if (editedProduct.images.length + files.length > 5) {
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

    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...newImages],
    }));
  };
  const removeImage = (index) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, i) => i !== index),
    }));
  };

  const [tagIsOpen, setTagIsOpen] = useState(false);
  const handleTagChange = (tag) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      tags: prevProduct.tags.includes(tag)
        ? prevProduct.tags.filter((t) => t !== tag)
        : [...prevProduct.tags, tag],
    }));
  };

  const [colorIsOpen, setColorIsOpen] = useState(false);
  const colorsList = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "Orange",
    "Khaki",
    "Beige",
    "Silver",
    "Gold",
    "Tan",
    "Brown",
    "Navy",
    "Gray",
    "Olive",
    "White",
  ];
  const handleColorChange = (color) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      colors: prevProduct.colors.includes(color)
        ? prevProduct.colors.filter((t) => t !== color)
        : [...prevProduct.colors, color],
    }));
  };

  const [sizeIsOpen, setSizeIsOpen] = useState(false);
  const sizesList = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];
  const handleSizeChange = (size) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      sizes: prevProduct.sizes.includes(size)
        ? prevProduct.sizes.filter((t) => t !== size)
        : [...prevProduct.sizes, size],
    }));
  };

  const [featureInput, setFeatureInput] = useState("");
  const handleAddFeature = () => {
    if (editedProduct.features.length < 10 && featureInput.trim() !== "") {
      setEditedProduct({
        ...editedProduct,
        features: [...editedProduct.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };
  const handleRemoveFeature = (index) => {
    setEditedProduct({
      ...editedProduct,
      features: editedProduct.features.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]:
        name === "price" || name === "stock" ? Number.parseFloat(value) : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (editedProduct.colors.length === 0) {
      newErrors.colors = "At least one color must be selected";
    }

    if (editedProduct.images.length === 0) {
      newErrors.images = "At least one image is required.";
    } else if (editedProduct.images.length > 5) {
      newErrors.images = "You can only upload max 5 images.";
    }

    if (editedProduct.sizes.length === 0) {
      newErrors.sizes = "At least one size must be selected";
    }

    if (editedProduct.features.length === 0) {
      newErrors.features = "At least one feature is required";
    } else if (editedProduct.features.length > 10) {
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
      formData.append("id", editedProduct._id);
      formData.append("name", editedProduct.name);
      formData.append("description", editedProduct.description);
      formData.append("price", editedProduct.price);
      formData.append("category", editedProduct.category);
      formData.append("gender", editedProduct.gender);
      formData.append("discount", editedProduct.discount);
      formData.append("stock", editedProduct.stock);
      formData.append("margin", editedProduct.margin);
      formData.append("sale", editedProduct.sale);
      formData.append("profit", editedProduct.profit);

      // Convert arrays to JSON strings and append
      formData.append("tags", JSON.stringify(editedProduct.tags));
      formData.append("colors", JSON.stringify(editedProduct.colors));
      formData.append("sizes", JSON.stringify(editedProduct.sizes));
      formData.append("features", JSON.stringify(editedProduct.features));

      // Send only the existing images' _id to backend
      const existingImages = editedProduct.images.filter(
        (currImage) => currImage._id
      ); // Images already stored in DB
      const newImages = editedProduct.images.filter(
        (currImage) => currImage.file
      ); // Newly uploaded images

      // Append existing images as JSON
      formData.append("existingImages", JSON.stringify(existingImages));

      // Append only new images as files
      newImages.forEach((image) => {
        formData.append("newImages", image.file);
      });

      toast.promise(
        editProduct(token, formData).then(async (res) => {
          if (res.data.success) {
            onSave(res.data.product);
          } else {
            return Promise.reject(
              new Error(res.data.message || "Product not edited.")
            );
          }
          return res.data;
        }),
        {
          pending: "Editing product...",
          success: "Product edited successfully.",
          error: "Error while editing product.",
        }
      );
    }
  };

  useEffect(() => {
    fetchTagsList();
  }, []);

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Edit Product</h3>
          <button className="edit-modal-close" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="edit-form needs-validation"
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Product Name :
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedProduct.name}
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
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description :
            </label>
            <textarea
              id="description"
              name="description"
              value={editedProduct.description}
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price :
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={editedProduct.price}
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

            {/* <div className="form-row"> */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={editedProduct.category}
                onChange={handleChange}
                className={errors.category ? "error" : ""}
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
              {errors.category && (
                <div className="error-message">{errors.category}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender :
              </label>
              <select
                id="gender"
                name="gender"
                value={editedProduct.gender || "Unisex"}
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
                value={editedProduct.discount}
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

            <div className="form-group">
              <label htmlFor="stock">Stock : </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={editedProduct.stock}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="margin">Margin : </label>
              <input
                type="number"
                id="margin"
                name="margin"
                value={editedProduct.margin}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label htmlFor="margin">Sales : </label>
              <input
                type="number"
                id="sales"
                name="sale"
                value={editedProduct.sale}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="margin">Profit : </label>
              <input
                type="number"
                id="profit"
                name="profit"
                value={editedProduct.profit}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
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
                  {editedProduct?.tags?.length > 0
                    ? editedProduct?.tags?.join(", ")
                    : "Select Tags"}
                  <span className="arrow">{tagIsOpen ? "▲" : "▼"}</span>
                </button>
                {tagIsOpen && (
                  <div className="dropdown-content">
                    {tagsList.map((tag) => (
                      <label key={tag} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={editedProduct?.tags?.includes(tag)}
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
                  {editedProduct?.colors?.length > 0
                    ? editedProduct?.colors?.join(", ")
                    : "Select at least one color"}
                  <span className="arrow">{tagIsOpen ? "▲" : "▼"}</span>
                </button>
                {errors.colors && (
                  <p className="error-message">{errors.colors}</p>
                )}
                {colorIsOpen && (
                  <div className="dropdown-content">
                    {colorsList.map((color) => (
                      <label key={color} className="dropdown-item form-label">
                        <input
                          type="checkbox"
                          checked={editedProduct?.colors?.includes(color)}
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
                  {editedProduct?.sizes?.length > 0
                    ? editedProduct?.sizes?.join(", ")
                    : "Select at least one size"}
                  <span className="arrow">{sizeIsOpen ? "▲" : "▼"}</span>
                </button>
                {errors.sizes && (
                  <p className="error-message">{errors.sizes}</p>
                )}
                {sizeIsOpen && (
                  <div className="dropdown-content">
                    {sizesList.map((size) => (
                      <label key={size} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={editedProduct?.sizes?.includes(size)}
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
              {editedProduct?.features?.map((feature, index) => (
                <li key={index} className="feature-item">
                  {feature}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Product Image</label>
              <div className="image-preview-container">
                {editedProduct.images.map((currImage, index) => (
                  <div className="image-preview" key={index}>
                    <img
                      src={currImage.url || "/placeholder.svg"}
                      alt={currImage.filename}
                    />
                    <span
                      className="admin-product-image-remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      <FiX />
                    </span>
                  </div>
                ))}
                {editedProduct.images.length < 5 ? (
                  <label
                    htmlFor="image-upload"
                    className="image-upload-placeholder form-label"
                  >
                    <div className="upload-button">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        hidden
                        accept="image/png, image/jpg, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className={`${errors.images ? "required" : ""}`}
                      />
                      <FiUpload />
                      <span>Upload Image</span>
                    </div>
                    {errors.images && (
                      <div className="text-danger">{errors.images}</div>
                    )}
                  </label>
                ) : null}
              </div>
            </div>
          </div>

          <div className="edit-modal-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
