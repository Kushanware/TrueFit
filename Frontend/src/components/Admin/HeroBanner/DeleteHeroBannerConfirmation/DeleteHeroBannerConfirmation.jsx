import { deleteHeroBanner } from "../../AdminServices/AdminServices";
import { StoreContext } from "../../../Context/StoreContext";
import { FiAlertTriangle } from "react-icons/fi";
import "./DeleteHeroBannerConfirmation.css";
import { toast } from "react-toastify";
import { useContext } from "react";

const DeleteHeroBannerConfirmation = ({ banner, onCancel, onConfirm }) => {
  const { token } = useContext(StoreContext);
  const handleBannerDeletion = async (id) => {
    toast.promise(
      deleteHeroBanner(token, id).then((res) => {
        if (res.data.success) {
          onConfirm();
        } else {
          console.log(
            res.data.message || "An error occurred while deleting banner."
          );
          return Promise.reject(
            new Error(res.data.message || "An error occurred")
          );
        }
        return res.data;
      }),
      {
        pending: "Deleting banner...",
        success: "Banner deleted successfully.",
        error: "Could not delete banner",
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
          Are you sure you want to delete hero banner with Tag{" "}
          <strong>{banner?.tag}</strong>? This action cannot be undone.
        </p>
        <div className="delete-modal-actions">
          <button className="delete-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="delete-modal-confirm"
            onClick={() => {
              handleBannerDeletion(banner._id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteHeroBannerConfirmation;
