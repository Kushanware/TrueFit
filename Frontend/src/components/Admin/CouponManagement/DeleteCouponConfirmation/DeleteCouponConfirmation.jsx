import "../../ProductManagement/DeleteProductConfirmation/DeleteProductConfirmation";
import { deleteCoupon } from "../../AdminServices/AdminServices";
import { StoreContext } from "../../../Context/StoreContext";
import { FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useContext } from "react";

const DeleteCouponConfirmation = ({ coupon, onCancel, onConfirm }) => {
  const { token } = useContext(StoreContext);
  const handleProductDeletion = async (id) => {
    toast.promise(
      deleteCoupon(token, id).then(async (res) => {
        if (res.data.success) {
          onConfirm();
        } else {
          return Promise.reject(
            new Error(
              res.data.message || "An error occurred while deleting the coupon."
            )
          ); // Reject promise to prevent success toast
        }
        return res.data;
      }),
      {
        pending: "Deleting the coupon...",
        success: "Coupon deleted successfully.",
        error: "Could not delete the coupon",
      }
    );
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-icon">
          <FiAlertTriangle />
        </div>
        <h3 className="delete-modal-title">Confirm Deletion</h3>
        <p className="delete-modal-message">
          Are you sure you want to delete <strong>{coupon.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="delete-modal-actions">
          <button className="delete-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="delete-modal-confirm"
            onClick={() => {
              handleProductDeletion(coupon.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCouponConfirmation;
