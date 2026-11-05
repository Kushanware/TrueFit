import DeleteCouponConfirmation from "../DeleteCouponConfirmation/DeleteCouponConfirmation";
import { addNewCoupon, editCoupon } from "../../AdminServices/AdminServices";
import { AdminConetxt } from "../../AdminContext/AdminContext";
import { StoreContext } from "../../../Context/StoreContext";
import CouponModal from "../CouponModal/CouponModal";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import "./CouponManagement.css";

const CouponManagement = () => {
  const { coupons, setCoupons } = useContext(AdminConetxt);
  const { token } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "_id",
    direction: "ascending",
  });

  // Status options for filter
  const statuses = ["All", "Active", "Expired"];
  const types = ["All", "Percentage", "Fixed"];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setCoupons(coupons.filter((c) => c._id !== selectedCoupon._id));
    setDeleteModalOpen(false);
  };

  const handleSaveCoupon = async (couponData) => {
    if (editingCoupon) {
      // Update existing coupon

      toast.promise(
        editCoupon(token, couponData).then(async (res) => {
          if (res.data.success) {
            setCoupons(
              coupons.map((c) => (c._id === couponData._id ? couponData : c))
            );
          } else {
            return Promise.reject(
              new Error(res.data.message || "An error occurred")
            ); // Reject promise to prevent success toast
          }
          return res.data;
        }),
        {
          pending: "Editing coupon...",
          success: "Coupon edited successfully.",
          error: "could not edit couopon",
        }
      );
    } else {
      // Add new coupon
      toast.promise(
        addNewCoupon(token, couponData).then(async (res) => {
          if (res.data.success) {
            setCoupons([...coupons, res.data.newCoupon]);
          } else {
            return Promise.reject(
              new Error(res.data.message || "An error occurred")
            ); // Reject promise to prevent success toast
          }
          return res.data;
        }),
        {
          pending: "Adding new coupon.",
          success: "New coupon added successfully.",
          error: "could not add new couopon",
        }
      );
    }
    setModalOpen(false);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Filter and sort coupons
  const filteredCoupons = coupons
    .filter((coupon) => {
      const matchesSearch = coupon.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || coupon.status === selectedStatus;
      const matchesType =
        selectedType === "All" || coupon.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="coupon-management">
      <div className="coupon-management-header">
        <h2 className="section-title">Coupon Management</h2>
        <p className="coupon-count">{filteredCoupons.length} coupons</p>
      </div>

      <div className="coupon-actions">
        <div className="search-container">
          {/* <FiSearch className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="coupon-action-buttons">
          <button className="filter-button" onClick={toggleFilter}>
            <FiFilter />
            <span>Filter</span>
            {filterOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          <button className="add-coupon-btn" onClick={openAddModal}>
            <FiPlus />
            <span>Add New Coupon</span>
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Status:</label>
            <div className="filter-options">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={`filter-option ${
                    selectedStatus === status ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <div className="filter-options">
              {types.map((type) => (
                <button
                  key={type}
                  className={`filter-option ${
                    selectedType === type ? "active" : ""
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="coupon-table-container">
        <table className="coupon-table">
          <thead>
            <tr>
              {/* <th
                onClick={() => requestSort("_id")}
                className={getClassNamesFor("_id")}
              >
                ID
                <span className="sort-indicator"></span>
              </th> */}
              <th
                onClick={() => requestSort("code")}
                className={`${getClassNamesFor("code")} text-center`}
              >
                Code
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("type")}
                className={`${getClassNamesFor("type")} text-center`}
              >
                Type
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("value")}
                className={`${getClassNamesFor("value")} text-center`}
              >
                Value
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("minPurchase")}
                className={`${getClassNamesFor("minPurchase")} text-center`}
              >
                Min Purchase
                <span className="sort-indicator"></span>
              </th>
              {/* <th
                onClick={() => requestSort("startDate")}
                className={getClassNamesFor("startDate")}
              >
                Start Date
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("endDate")}
                className={getClassNamesFor("endDate")}
              >
                End Date
                <span className="sort-indicator"></span>
              </th> */}
              <th
                onClick={() => requestSort("status")}
                className={`${getClassNamesFor("status")} text-center`}
              >
                Status
                <span className="sort-indicator"></span>
              </th>
              <th
                onClick={() => requestSort("usageCount")}
                className={`${getClassNamesFor("usageCount")} text-center`}
              >
                Usage
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <tr key={coupon._id}>
                  {/* <td>{coupon._id}</td> */}
                  <td className="text-center">
                    <span className="coupon-code">{coupon.code}</span>
                  </td>
                  <td className="text-center">{coupon.type}</td>
                  <td className="text-center">
                    {coupon.type === "Percentage"
                      ? `${coupon.value}%`
                      : `₹${coupon.value}`}
                  </td>
                  <td className="text-center">
                    {coupon.minPurchase > 0 ? `₹${coupon.minPurchase}` : "None"}
                  </td>
                  {/* <td>{new Date(coupon.startDate).toLocaleDateString()}</td> */}
                  {/* <td>{new Date(coupon.endDate).toLocaleDateString()}</td> */}
                  <td className="text-center">
                    <span
                      className={`status-badge ${coupon.status.toLowerCase()}`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="usage-info">
                      <div className="usage-text">
                        {coupon.usageCount} / {coupon.usageLimit}
                      </div>
                      <div className="usage-bar">
                        <div
                          className="usage-progress"
                          style={{
                            width: `${
                              (coupon.usageCount / coupon.usageLimit) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="coupon-table-action-buttons">
                      <button
                        className="coupon-table-edit-btn"
                        title="Edit Coupon"
                        onClick={() => openEditModal(coupon)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="coupon-table-delete-btn"
                        title="Delete Coupon"
                        onClick={() => handleDelete(coupon)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-coupons">
                  {coupons?.length === 0
                    ? "You have not created any coupons yet."
                    : "No coupons found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Coupon Modal */}
      {modalOpen && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCoupon}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteCouponConfirmation
          coupon={{
            name: `Coupon: ${selectedCoupon.code}`,
            id: selectedCoupon._id,
          }}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default CouponManagement;
