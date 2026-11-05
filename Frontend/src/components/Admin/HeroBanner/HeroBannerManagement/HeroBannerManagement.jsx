import DeleteHeroBannerConfirmation from "../DeleteHeroBannerConfirmation/DeleteHeroBannerConfirmation";
import { AdminConetxt } from "../../AdminContext/AdminContext";
import { StoreContext } from "../../../Context/StoreContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiSave,
  FiX,
  FiImage,
  FiEye,
  FiUpload,
} from "react-icons/fi";
import {
  addNewHeroBanner,
  editHeroBanner,
  updateHeroBannersOrder,
} from "../../AdminServices/AdminServices";
import "./HeroBannerManagement.css";

const HeroBannerManagement = () => {
  const { banners, setBanners } = useContext(AdminConetxt);
  const { token } = useContext(StoreContext);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    tag: "",
    title: "",
    discount: "",
    description: "",
    image: "",
    imageFile: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});

  const handleEdit = (banner) => {
    setEditingBanner({
      ...banner,
      imagePreview: banner.image,
    });
  };

  const handlePreview = (banner) => {
    setPreviewBanner(banner);
  };

  const handleDelete = (banner) => {
    setSelectedBanner(banner);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setBanners((prevBanners) =>
      prevBanners.filter((b) => b._id !== selectedBanner._id)
    );
    setDeleteModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setNewBanner({
      tag: "",
      title: "",
      discount: "",
      description: "",
      image: "",
      imageFile: null,
      imagePreview: null,
    });
    setErrors({});
    setIsAddModalOpen(true);
  };

  const validateAddForm = () => {
    const newErrors = {};

    if (!newBanner.tag.trim()) {
      newErrors.tag = "Tag is required";
    }

    if (!newBanner.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!newBanner.discount.trim()) {
      newErrors.discount = "Discount text is required";
    }

    if (!newBanner.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!newBanner.imagePreview) {
      newErrors.image = "Banner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editingBanner.tag.trim()) {
      newErrors.editTag = "Tag is required";
    }

    if (!editingBanner.title.trim()) {
      newErrors.editTitle = "Title is required";
    }

    if (!editingBanner.discount.trim()) {
      newErrors.editDiscount = "Discount text is required";
    }

    if (!editingBanner.description.trim()) {
      newErrors.editDescription = "Description is required";
    }

    if (!editingBanner.imagePreview) {
      newErrors.editImage = "Banner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = () => {
    if (validateEditForm()) {
      const updatedBanner = {
        _id: editingBanner._id,
        tag: editingBanner.tag,
        title: editingBanner.title,
        discount: editingBanner.discount,
        description: editingBanner.description,
      };

      toast.promise(
        editHeroBanner(token, updatedBanner).then(async (res) => {
          if (res.data.success) {
            setBanners(
              banners.map((banner) =>
                banner._id === updatedBanner._id ? res.data.banner : banner
              )
            );
            setEditingBanner(null);
          } else {
            console.log(res.data.message || "Could not edit hero banner!");
            return Promise.reject(
              new Error(res.data.message || "An error occurred!")
            );
          }
          return res.data;
        }),
        {
          pending: "Editing banner...",
          success: "Successfully edited banner.",
          error: "Could not edit banner!",
        }
      );
    }
  };

  const handleSaveNew = async () => {
    if (validateAddForm()) {
      const banner = {
        tag: newBanner.tag,
        title: newBanner.title,
        discount: newBanner.discount,
        description: newBanner.description,
        image: newBanner.imageFile,
      };
      try {
        toast.promise(
          addNewHeroBanner(token, banner).then((res) => {
            if (res.data.success) {
              setBanners([...banners, res.data.newBanner]);
              setIsAddModalOpen(false);
            } else {
              toast.error(
                res.data.message || "Error while adding hero banner."
              );
              setIsAddModalOpen(false);
              return Promise.reject(
                new Error(res.data.message || "An error occurred")
              );
            }
            return res.data;
          }),
          {
            pending: "Adding new hero banner...",
            success: "New hero banner added successfully.",
            // error: "New hero banner not added.",
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBanner(null);
    setErrors({});
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setErrors({});
  };

  const handleMove = async (id, direction) => {
    const index = banners.findIndex((banner) => banner._id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < banners.length - 1)
    ) {
      const newBanners = [...banners];

      const newIndex = direction === "up" ? index - 1 : index + 1;

      [newBanners[index], newBanners[newIndex]] = [
        newBanners[newIndex],
        newBanners[index],
      ];

      const updatedBanners = newBanners.map((banner, index) => ({
        ...banner,
        order: index,
      }));

      toast.promise(
        updateHeroBannersOrder(
          token,
          updatedBanners.map(({ _id, order }) => ({ _id, order }))
        ).then(async (res) => {
          if (res.data.success) {
            setBanners(updatedBanners);
          } else {
            console.log(res.data.message || "Error while swapping banners");
            return Promise.reject(
              new Error(res.data.message || "An error occurred")
            );
          }
          return res.data;
        }),
        { pending: "Swapping banners...", success: "Banners swapped." }
      );
    }
  };

  const handleEditChange = (e) => {
    if (editingBanner) {
      setEditingBanner({
        ...editingBanner,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNewBannerChange = (e) => {
    setNewBanner({
      ...newBanner,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: "Image size should not exceed 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBanner({
          ...newBanner,
          imageFile: file,
          imagePreview: reader.result,
        });

        // Clear error if it exists
        if (errors.image) {
          const updatedErrors = { ...errors };
          delete updatedErrors.image;
          setErrors(updatedErrors);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePreviewImage = () => {
    setNewBanner({ ...newBanner, imageFile: null, imagePreview: null });
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          editImage: "Image size should not exceed 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingBanner({
          ...editingBanner,
          imageFile: file,
          imagePreview: reader.result,
        });

        // Clear error if it exists
        if (errors.editImage) {
          const updatedErrors = { ...errors };
          delete updatedErrors.editImage;
          setErrors(updatedErrors);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="hero-management">
      <div className="hero-management-header">
        <h2 className="section-title">Hero Banner Management</h2>
        <p className="hero-count">{banners.length} banners</p>
      </div>

      <div className="hero-actions">
        <button onClick={handleOpenAddModal} className="add-banner-btn">
          <FiPlus />
          Add New Banner
        </button>
      </div>

      {/* Preview Modal */}
      {previewBanner && (
        <div className="admin-hero-modal-overlay">
          <div className="admin-hero-modal">
            {/* <div className="hero-background"></div> */}
            <div className="admin-hero-modal-header">
              <h2 className="admin-hero-modal-title">Banner Preview</h2>
              <button
                onClick={() => setPreviewBanner(null)}
                className="admin-hero-modal-close"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="admin-hero-content">
              <div className="hero-text">
                <span className="hero-tag">{previewBanner.tag}</span>
                <h1 className="hero-title">{previewBanner.title}</h1>
                <h2 className="hero-subtitle">{previewBanner.discount}</h2>
                <p className="hero-description">{previewBanner.description}</p>

                <div className="hero-buttons">
                  <button className="shop-now-btn luxury-btn">Shop Now</button>
                  <button className="view-collection-btn">
                    View Collection
                  </button>
                </div>
              </div>

              <div className="hero-image-container">
                <div className={`hero-image`}>
                  <img
                    src={previewBanner.image.url || "/placeholder.svg"}
                    alt="Fashion items"
                    className="slide-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="admin-hero-modal-overlay">
          <div className="admin-hero-modal">
            <div className="admin-hero-modal-header">
              <h2 className="admin-hero-modal-title">Edit Banner</h2>
              <button
                onClick={handleCancelEdit}
                className="admin-hero-modal-close"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="admin-hero-modal-content">
              <form
                className="admin-hero-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="admin-hero-form-grid">
                  <div className="admin-hero-form-column">
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">Tag</label>
                      <input
                        type="text"
                        name="tag"
                        value={editingBanner.tag || ""}
                        onChange={handleEditChange}
                        className={`admin-hero-form-input ${
                          errors.editTag ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="e.g. #Summer Collection"
                        maxLength="20"
                      />
                      {errors.editTag && (
                        <div className="admin-hero-error-message">
                          {errors.editTag}
                        </div>
                      )}
                    </div>
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editingBanner.title || ""}
                        onChange={handleEditChange}
                        className={`admin-hero-form-input ${
                          errors.editTitle ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="e.g. New Arrivals!"
                        maxLength="20"
                      />
                      {errors.editTitle && (
                        <div className="admin-hero-error-message">
                          {errors.editTitle}
                        </div>
                      )}
                    </div>
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">
                        Discount Text
                      </label>
                      <input
                        type="text"
                        name="discount"
                        value={editingBanner.discount || ""}
                        onChange={handleEditChange}
                        className={`admin-hero-form-input ${
                          errors.editDiscount ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="e.g. Up to 30% OFF!"
                        maxLength="20"
                      />
                      {errors.editDiscount && (
                        <div className="admin-hero-error-message">
                          {errors.editDiscount}
                        </div>
                      )}
                    </div>
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editingBanner.description || ""}
                        onChange={handleEditChange}
                        rows={4}
                        className={`admin-hero-form-textarea ${
                          errors.editDescription ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="Enter a compelling description for your banner..."
                        maxLength="100"
                      />
                      {errors.editDescription && (
                        <div className="admin-hero-error-message">
                          {errors.editDescription}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="admin-hero-form-column">
                    {/* {!editingBanner.imagePreview ? (
                      <div className="admin-hero-form-group">
                        <label className="admin-hero-form-label">
                          Banner Image
                        </label>
                        <div
                          className={`admin-hero-image-upload-area ${
                            errors.editImage ? "admin-hero-form-error" : ""
                          }`}
                        >
                          <label
                            htmlFor="edit-image-upload"
                            className="admin-hero-image-upload-label"
                          >
                            <FiUpload className="admin-hero-upload-icon" />
                            <p>Drag & drop image here or click to browse</p>
                            <span>Supports JPG, JPEG, PNG, WEBP (Max 5MB)</span>
                            <input
                              type="file"
                              id="edit-image-upload"
                              hidden
                              accept="image/png, image/jpg, image/jpeg, image/webp"
                              onChange={handleEditImageUpload}
                            />
                          </label>
                        </div>
                        {errors.editImage && (
                          <div className="admin-hero-error-message">
                            {errors.editImage}
                          </div>
                        )}
                      </div>
                    ) : null} */}
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">
                        Image Preview
                      </label>
                      <div className="admin-hero-image-preview">
                        {editingBanner.imagePreview ? (
                          <img
                            src={
                              editingBanner.imagePreview.url ||
                              "/placeholder.svg"
                            }
                            alt="Banner preview"
                            className="admin-hero-preview-img"
                          />
                        ) : (
                          <div className="admin-hero-no-image">
                            <FiImage className="admin-hero-no-image-icon" />
                            <p>No image selected</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="admin-hero-form-info">
                      <FiImage className="admin-hero-info-icon" />
                      <p>
                        To change the image, delete the existing banner and
                        recreate it with new image.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="admin-hero-form-actions">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="admin-hero-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="admin-hero-save-btn"
                  >
                    <FiSave className="admin-hero-icon" />
                    Update Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add New Banner Modal */}
      {isAddModalOpen && (
        <div className="admin-hero-modal-overlay">
          <div className="admin-hero-modal">
            <div className="admin-hero-modal-header admin-hero-add-modal-header">
              <h2 className="admin-hero-modal-title">Add New Banner</h2>
              <button
                onClick={handleCancelAdd}
                className="admin-hero-modal-close"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="admin-hero-modal-content">
              <form
                className="admin-hero-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="admin-hero-form-grid">
                  <div className="admin-hero-form-column">
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">Tag</label>
                      <input
                        type="text"
                        name="tag"
                        value={newBanner.tag || ""}
                        onChange={handleNewBannerChange}
                        className={`admin-hero-form-input ${
                          errors.tag ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="e.g. #Summer Collection"
                      />
                      {errors.tag && (
                        <div className="admin-hero-error-message">
                          {errors.tag}
                        </div>
                      )}
                    </div>
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={newBanner.title || ""}
                        onChange={handleNewBannerChange}
                        className={`admin-hero-form-input ${
                          errors.title ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="e.g. New Arrivals!"
                      />
                      {errors.title && (
                        <div className="admin-hero-error-message">
                          {errors.title}
                        </div>
                      )}
                    </div>
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">
                        Discount Text
                      </label>
                      <input
                        type="text"
                        name="discount"
                        value={newBanner.discount || ""}
                        onChange={handleNewBannerChange}
                        className={`admin-hero-form-input ${
                          errors.discount ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="e.g. Up to 30% OFF!"
                      />
                      {errors.discount && (
                        <div className="admin-hero-error-message">
                          {errors.discount}
                        </div>
                      )}
                    </div>
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newBanner.description || ""}
                        onChange={handleNewBannerChange}
                        rows={4}
                        className={`admin-hero-form-textarea ${
                          errors.description ? "admin-hero-form-error" : ""
                        }`}
                        placeholder="Enter a compelling description for your banner..."
                      />
                      {errors.description && (
                        <div className="admin-hero-error-message">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="admin-hero-form-column">
                    {!newBanner.imagePreview ? (
                      <div className="admin-hero-form-group">
                        <label className="admin-hero-form-label">
                          Banner Image
                        </label>
                        <div
                          className={`admin-hero-image-upload-area ${
                            errors.image ? "admin-hero-form-error" : ""
                          }`}
                        >
                          <label
                            htmlFor="new-image-upload"
                            className="admin-hero-image-upload-label"
                          >
                            <FiUpload className="admin-hero-upload-icon" />
                            <p>Drag & drop image here or click to browse</p>
                            <span>Supports JPG, JPEG, PNG, WEBP (Max 5MB)</span>
                            <input
                              type="file"
                              id="new-image-upload"
                              hidden
                              accept="image/png, image/jpg, image/jpeg, image/webp"
                              onChange={handleNewImageUpload}
                            />
                          </label>
                        </div>
                        {errors.image && (
                          <div className="admin-hero-error-message">
                            {errors.image}
                          </div>
                        )}
                      </div>
                    ) : null}
                    <div className="admin-hero-form-group">
                      <label className="admin-hero-form-label">
                        Image Preview
                      </label>
                      <div className="admin-hero-image-preview">
                        {newBanner.imagePreview ? (
                          <div className="admin-hero-preview-img-container-container">
                            <span onClick={handleRemovePreviewImage}>
                              <FiX />
                            </span>
                            <div className="admin-hero-preview-img-container">
                              <img
                                src={
                                  newBanner.imagePreview || "/placeholder.svg"
                                }
                                alt="Banner preview"
                                className="admin-hero-preview-img"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="admin-hero-no-image">
                            <FiImage className="admin-hero-no-image-icon" />
                            <p>No image selected</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="admin-hero-form-info">
                      <FiImage className="admin-hero-info-icon" />
                      <p>
                        For best results, use high-quality images with a 16:9
                        aspect ratio. Recommended minimum size: 1200x675 pixels.
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="admin-hero-banner-preview">
                  <h3 className="admin-hero-preview-heading">Banner Preview</h3>
                  <div className="admin-hero-live-preview">
                    <div className="admin-hero-live-preview-background"></div>
                    <div className="admin-hero-live-preview-content">
                      <div className="admin-hero-live-preview-text">
                        <span className="admin-hero-live-preview-tag">
                          {newBanner.tag || "#Tag"}
                        </span>
                        <h2 className="admin-hero-live-preview-title">
                          {newBanner.title || "Banner Title"}
                        </h2>
                        <h3 className="admin-hero-live-preview-discount">
                          {newBanner.discount || "Discount Text"}
                        </h3>
                        <p className="admin-hero-live-preview-description">
                          {newBanner.description ||
                            "Banner description will appear here."}
                        </p>
                        <div className="admin-hero-live-preview-buttons">
                          <button className="admin-hero-live-preview-shop-btn">
                            Shop Now
                          </button>
                          <button className="admin-hero-live-preview-collection-btn">
                            View Collection
                          </button>
                        </div>
                      </div>
                      <div className="admin-hero-live-preview-image-container">
                        {newBanner.imagePreview ? (
                          <img
                            src={newBanner.imagePreview || "/placeholder.svg"}
                            alt="Banner preview"
                            className="admin-hero-live-preview-image"
                          />
                        ) : (
                          <div className="admin-hero-live-preview-placeholder">
                            <FiImage />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="admin-hero-form-actions">
                  <button
                    type="button"
                    onClick={handleCancelAdd}
                    className="admin-hero-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNew}
                    className="admin-hero-save-btn"
                  >
                    <FiPlus className="admin-hero-icon" />
                    Add Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="admin-hero-table-container">
        <table className="admin-hero-table">
          <thead>
            <tr>
              <th className="text-center">Preview</th>
              <th className="text-center">Tag</th>
              <th className="text-center">Title</th>
              <th className="text-center">Discount</th>
              <th className="text-center">Order</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner._id}>
                <td className="admin-hero-table-image-container">
                  <div className="admin-hero-table-image">
                    <img
                      src={banner.image.url || "/placeholder.svg"}
                      alt={banner.title}
                    />
                  </div>
                </td>
                <td className="text-center">{banner.tag}</td>
                <td className="text-center">{banner.title}</td>
                <td className="text-center">{banner.discount}</td>
                <td>
                  <div className="admin-hero-order-buttons">
                    <button
                      onClick={() => handleMove(banner._id, "up")}
                      disabled={index === 0}
                      className={`admin-hero-order-btn ${
                        index === 0 ? "disabled" : ""
                      }`}
                    >
                      <FiArrowUp />
                    </button>
                    <button
                      onClick={() => handleMove(banner._id, "down")}
                      disabled={index === banners.length - 1}
                      className={`admin-hero-order-btn ${
                        index === banners.length - 1 ? "disabled" : ""
                      }`}
                    >
                      <FiArrowDown />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="admin-hero-action-buttons">
                    <button
                      className="admin-hero-preview-btn"
                      title="Preview"
                      onClick={() => handlePreview(banner)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="admin-hero-edit-btn"
                      title="Edit"
                      onClick={() => handleEdit(banner)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="admin-hero-delete-btn"
                      title={`${banners.length > 1 ? "Delete" : ""}`}
                      onClick={() => handleDelete(banner)}
                      disabled={banners.length === 1}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteHeroBannerConfirmation
          banner={selectedBanner}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default HeroBannerManagement;
