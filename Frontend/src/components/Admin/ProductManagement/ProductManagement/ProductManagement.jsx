import DeleteProductConfirmation from "../DeleteProductConfirmation/DeleteProductConfirmation";
import ProductEditModal from "../ProductEditModal/ProductEditModal";
import { AdminConetxt } from "../../AdminContext/AdminContext";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useContext, useState } from "react";
import "./ProductManagement.css";

const ProductManagement = () => {
  const { products, setProducts, allProducts } = useContext(AdminConetxt);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = (e) => {
    let search = e.target.value;
    setSearchTerm(search);

    const searchedProducts = allProducts.filter((currProduct) =>
      currProduct.name.toLowerCase().includes(search.toLowerCase())
    );

    setProducts(searchedProducts);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p._id !== selectedProduct._id)
    );
    setDeleteModalOpen(false);
  };

  const handleSaveEdit = (editedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p._id === editedProduct._id ? editedProduct : p))
    );
    setEditModalOpen(false);
  };

  return (
    <div className="product-management">
      <div className="product-management-header">
        <h2 className="section-title">Product Management</h2>
        <p className="product-count">{products?.length} products</p>
      </div>

      <div className="admin-product-actions">
        <div className="search-container">
          {/* <FiSearch className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="text-center">Image</th>
              <th className="text-center">
                Product Name
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Category
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Price
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Discount
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Current Margin
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Sale
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Total profit earned
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Stock
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">
                Status
                <span className="sort-indicator"></span>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 ? (
              products?.map((product) => {
                return (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-image">
                        <img
                          src={product.images[0].url || "/placeholder.svg"}
                          alt={product.name}
                        />
                      </div>
                    </td>
                    <td className="text-center">{product.name}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">
                      ₹
                      {Math.floor(
                        product.price - (product.price * product.discount) / 100
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="text-center">{product.discount}%</td>
                    <td className="text-center">{product.margin}%</td>
                    <td className="text-center">{product.sale}</td>
                    <td className="text-center">
                      ₹{product.profit.toLocaleString("en-IN")}
                    </td>
                    <td className="text-center">{product.stock}</td>
                    <td className="text-center">
                      <span
                        className={`status-badge ${product.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="products-table-edit-btn"
                          title="Edit Product"
                          onClick={() => handleEdit(product)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="products-table-delete-btn"
                          title="Delete Product"
                          onClick={() => handleDelete(product)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="no-products">
                  No products found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteProductConfirmation
          product={selectedProduct}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Edit Product Modal */}
      {editModalOpen && (
        <ProductEditModal
          product={selectedProduct}
          onCancel={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ProductManagement;
