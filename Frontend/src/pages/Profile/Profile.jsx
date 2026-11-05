import { StoreContext } from "../../components/Context/StoreContext";
import { useState, useRef, useEffect, useContext } from "react";
import { updateUserProfile } from "../../services/services";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSignOutAlt,
  FaCheck,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserAltSlash,
} from "react-icons/fa";
import "./Profile.css";
import CartHeader from "../../components/Cart/CartHeader/CartHeader";
import { FiLogIn } from "react-icons/fi";

const Profile = () => {
  const { token, user, setUser, setWishlistData, setCartData, setToken } =
    useContext(StoreContext);
  const [updatedProfileData, setUpdatedProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validations, setValidations] = useState({
    name: true,
    phone: true,
    address: true,
  });
  const [focused, setFocused] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      if (isFormValid()) {
        const formData = new FormData();

        formData.append("newName", updatedProfileData.name);
        if (updatedProfileData.phone) {
          formData.append("newPhone", updatedProfileData.phone);
        }
        if (updatedProfileData.address) {
          formData.append("newAddress", updatedProfileData.address);
        }
        if (selectedFile) {
          formData.append("image", selectedFile);
        }

        toast.promise(
          updateUserProfile(token, formData).then(async (res) => {
            if (res.data.success) {
              setUser(res.data.user);
              setIsEditing(false);
            } else {
              console.log(res.data.message);
              return Promise.reject(
                new Error(res.data.message || "Could not update profile.")
              );
            }
            return res.data;
          }),
          {
            pending: "Updating profile...",
            success: "Successfully updated profile.",
            error: "Could not update profile.",
          }
        );
      }
    } else {
      // Start editing
      setUpdatedProfileData({ ...user });
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfileData({
      ...updatedProfileData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let isValid = true;

    switch (name) {
      case "name":
        isValid = value.trim().length >= 3;
        break;
      case "phone":
        isValid = /^\d{10}$/.test(value.replace(/\D/g, ""));
        break;
      case "address":
        isValid = value.trim().length >= 5;
        break;
      default:
        break;
    }

    setValidations({
      ...validations,
      [name]: isValid,
    });
  };

  const isFormValid = () => {
    return Object.values(validations).every((valid) => valid);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleCancel = () => {
    setUpdatedProfileData({ ...user }); // reset edits
    setIsEditing(false); // exit edit mode
    setPreviewUrl(null); // clear preview image
    setSelectedFile(null); // clear file input
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser({
      name: "",
      email: "",
      profileImage: { url: "", filename: "" },
      _id: "",
    });
    setCartData({});
    setWishlistData({});
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      setUpdatedProfileData({ ...user });
    }
  }, [token, user]);

  if (!token) {
    return (
      <div className="cart-container" data-aos="fade-up">
        <div className="cart-header">
          <h1 className="cart-title">Your Profile</h1>
        </div>
        <div className="cart-empty">
          <div className="empty-cart-icon">
            <FaUserAltSlash />
          </div>
          <h2>You're not signed in.</h2>
          <Link to="/login">
            <button className="luxury-btn">Login/Signup</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-image-container">
              {isEditing && previewUrl ? (
                <img src={previewUrl} alt="Profile" className="profile-image" />
              ) : user?.profileImage?.url && !imageError ? (
                <img
                  src={
                    isEditing && previewUrl
                      ? previewUrl
                      : user?.profileImage?.url || null
                  }
                  alt="Profile"
                  onError={() => setImageError(true)}
                  className="profile-image"
                />
              ) : (
                <div className="profile-no-image">
                  <span>{user?.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <div className="profile-info">
              {user?.email ? (
                <div className="profile-info-item">
                  <FaEnvelope className="profile-info-icon" />
                  <span>{user?.email}</span>
                </div>
              ) : null}
              {user?.phone ? (
                <div className="profile-info-item">
                  <FaPhone className="profile-info-icon" />
                  <span>{user?.phone}</span>
                </div>
              ) : null}
              {user?.address ? (
                <div className="profile-info-item">
                  <FaMapMarkerAlt className="profile-info-icon" />
                  <span>{user?.address}</span>
                </div>
              ) : null}
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
        <div className="profile-main">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-form">
              {/* <div className="form-row"> */}
              <div className="form-group">
                <div
                  className={`floating-input ${
                    focused.name || updatedProfileData.name ? "has-value" : ""
                  } ${
                    validations.name && updatedProfileData.name
                      ? "is-valid"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updatedProfileData?.name || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={() => handleBlur("name")}
                    disabled={!isEditing}
                    required
                  />
                  <label htmlFor="name">name</label>
                  {validations.name && updatedProfileData.name && isEditing && (
                    <FaCheck className="valid-icon" />
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.phone || updatedProfileData.phone
                        ? "has-value"
                        : ""
                    } ${
                      validations.phone && updatedProfileData.phone
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={updatedProfileData?.phone || ""}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("phone")}
                      onBlur={() => handleBlur("phone")}
                      disabled={!isEditing}
                      maxLength="10"
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                    {validations.phone &&
                      updatedProfileData.phone &&
                      isEditing && <FaCheck className="valid-icon" />}
                  </div>
                </div>

                <div className="form-group">
                  <div
                    className={`floating-input ${
                      focused.address || updatedProfileData.address
                        ? "has-value"
                        : ""
                    } ${
                      validations.address && updatedProfileData.address
                        ? "is-valid"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={updatedProfileData?.address || ""}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("address")}
                      onBlur={() => handleBlur("address")}
                      disabled={!isEditing}
                      required
                    />
                    <label htmlFor="address">Address</label>
                    {validations.address &&
                      updatedProfileData.address &&
                      isEditing && <FaCheck className="valid-icon" />}
                  </div>
                </div>
              </div>

              <div className="form-group profile-picture-group">
                <label className="profile-section-label">Profile Picture</label>
                {isEditing ? (
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="profileImage"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                      className="file-input"
                    />
                    <button
                      className="file-upload-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Choose File
                    </button>
                    <span className="file-name">
                      {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>
                  </div>
                ) : (
                  <div className="profile-field">
                    {isEditing && previewUrl
                      ? "Profile picture uploaded"
                      : "No profile picture"}
                  </div>
                )}
              </div>

              <div className="profile-actions">
                <button
                  className={
                    isEditing ? "save-profile-btn" : "edit-profile-btn"
                  }
                  onClick={handleEditToggle}
                  disabled={isEditing && !isFormValid()}
                >
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
                {isEditing && (
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
