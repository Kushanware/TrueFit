import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import "./CouponModal.css";

const CouponModal = ({ coupon, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    _id: coupon?._id || null,
    code: coupon?.code || "",
    type: coupon?.type || "Percentage",
    value: coupon?.value || "",
    minPurchase: coupon?.minPurchase || "",
    // maxDiscount: coupon?.maxDiscount || "",
    // startDate: coupon?.startDate || "",
    // endDate: coupon?.endDate || "",
    status: coupon?.status || "Active",
    usageLimit: coupon?.usageLimit || "",
    usageCount: coupon?.usageCount || 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Set current date as default for new coupons
    if (!coupon) {
      // const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        // startDate: today,
        // endDate: "",
      }));
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code =
        "Code must contain only uppercase letters, numbers, underscores, and hyphens";
    }

    if (
      !formData.value ||
      isNaN(formData.value) ||
      Number.parseFloat(formData.value) <= 0
    ) {
      newErrors.value = "Value must be a positive number";
    } else if (
      formData.type === "Percentage" &&
      Number.parseFloat(formData.value) > 100
    ) {
      newErrors.value = "Percentage cannot exceed 100%";
    }

    if (
      formData.minPurchase &&
      (isNaN(formData.minPurchase) ||
        Number.parseFloat(formData.minPurchase) < 0)
    ) {
      newErrors.minPurchase = "Minimum purchase must be a non-negative number";
    }

    // if (
    //   formData.maxDiscount &&
    //   (isNaN(formData.maxDiscount) ||
    //     Number.parseFloat(formData.maxDiscount) <= 0)
    // ) {
    //   newErrors.maxDiscount = "Maximum discount must be a positive number";
    // }

    // if (!formData.startDate) {
    //   newErrors.startDate = "Start date is required";
    // }

    // if (!formData.endDate) {
    //   newErrors.endDate = "End date is required";
    // } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
    //   newErrors.endDate = "End date must be after start date";
    // }

    if (
      !formData.usageLimit ||
      isNaN(formData.usageLimit) ||
      Number.parseInt(formData.usageLimit) <= 0
    ) {
      newErrors.usageLimit = "Usage limit must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert numeric strings to numbers
      const processedData = {
        ...formData,
        value: Number.parseFloat(formData.value),
        minPurchase: formData.minPurchase
          ? Number.parseFloat(formData.minPurchase)
          : 0,
        // maxDiscount: formData.maxDiscount
        //   ? Number.parseFloat(formData.maxDiscount)
        //   : null,
        usageLimit: Number.parseInt(formData.usageLimit),
      };

      onSave(processedData);
    }
  };

  return (
    <div className="coupon-modal-overlay">
      <div className="coupon-modal">
        <div className="coupon-modal-header">
          <h3>{coupon ? "Edit Coupon" : "Add New Coupon"}</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="coupon-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="code">Coupon Code*</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={errors.code ? "error" : ""}
                placeholder="e.g. SUMMER20"
              />
              {errors.code && (
                <div className="error-message">{errors.code}</div>
              )}
              <div className="form-hint">
                Use uppercase letters, numbers, underscores, and hyphens only.
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Discount Type*</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="value">Value*</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.value ? "error" : ""}
                  placeholder="0"
                />
                <span className="input-suffix">
                  {formData.type === "Percentage" ? "%" : "₹"}
                </span>
              </div>
              {errors.value && (
                <div className="error-message">{errors.value}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minPurchase">Minimum Purchase</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="minPurchase"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.minPurchase ? "error" : ""}
                  placeholder="0"
                />
                <span className="input-suffix">₹</span>
              </div>
              {errors.minPurchase && (
                <div className="error-message">{errors.minPurchase}</div>
              )}
            </div>

            {/* <div className="form-group">
              <label htmlFor="maxDiscount">Maximum Discount</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="maxDiscount"
                  name="maxDiscount"
                  value={formData.maxDiscount || ""}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.maxDiscount ? "error" : ""}
                  placeholder="No limit"
                  disabled={formData.type === "Fixed"}
                />
                <span className="input-suffix">₹</span>
              </div>
              {errors.maxDiscount && (
                <div className="error-message">{errors.maxDiscount}</div>
              )}
              <div className="form-hint">
                Leave empty for no maximum discount limit.
              </div>
            </div> */}
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date*</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? "error" : ""}
              />
              {errors.startDate && (
                <div className="error-message">{errors.startDate}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date*</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? "error" : ""}
              />
              {errors.endDate && (
                <div className="error-message">{errors.endDate}</div>
              )}
            </div>
          </div> */}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status*</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                {/* <option value="Scheduled">Scheduled</option> */}
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="usageLimit">Usage Limit*</label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="1"
                className={errors.usageLimit ? "error" : ""}
                placeholder="1"
              />
              {errors.usageLimit && (
                <div className="error-message">{errors.usageLimit}</div>
              )}
            </div>
          </div>

          <div className="coupon-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {coupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
