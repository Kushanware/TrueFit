import { deleteProduct } from "../../AdminServices/AdminServices";
import { StoreContext } from "../../../Context/StoreContext";
import { FiAlertTriangle } from "react-icons/fi";
import "./DeleteProductConfirmation.css";
import { toast } from "react-toastify";
import { useContext } from "react";

const DeleteProductConfirmation = ({ product, onCancel, onConfirm }) => {
  const { token } = useContext(StoreContext);
  const handleProductDeletion = async (id) => {
    toast.promise(
      deleteProduct(token, id).then((res) => {
        if (res.data.success) {
          onConfirm();
        } else {
          console.log(
            res.data.message || "An error occurred while deleting product."
          );
          return Promise.reject(
            new Error(res.data.message || "An error occurred")
          );
        }
        return res.data;
      }),
      {
        pending: "Deleting product...",
        success: "Product deleted successfully.",
        error: "Could not delete product",
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
          Are you sure you want to delete <strong>{product.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="delete-modal-actions">
          <button className="delete-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="delete-modal-confirm"
            onClick={() => {
              handleProductDeletion(product._id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductConfirmation;
