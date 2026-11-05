import ProductsRegularOrListView from "../../components/CommonUis/ProductsRegularOrListView/ProductsRegularOrListView";
import DesktopGridToggleAndSort from "../../components/CommonUis/DesktopGridToggleAndSort/DesktopGridToggleAndSort";
import MobileSortAndFilter from "../../components/CommonUis/MobileSortAndFilter/MobileSortAndFilter";
import DesktopSideFilter from "../../components/CommonUis/DesktopSideFilter/DesktopSideFilter";
import CategoryNav from "../../components/Home/CategoryNav/CategoryNav";
import { StoreContext } from "../../components/Context/StoreContext";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Collection.css";

const Collection = () => {
  const {
    allProducts,
    products,
    setProducts,
    sortBy,
    filters,
    searchProduct,
    filterProductByCategory,
    filterProductByGender,
    sortProducts,
    filterProductsByPrice,
    categories,
    search,
  } = useContext(StoreContext);
  const { category } = useParams();
  const [activeCategory, setActiveCategory] = useState(`${category}`);

  const getProducts = () => {
    if (!allProducts || allProducts.length === 0) return;

    // Search and filter by category
    let products = allProducts?.filter(
      (currProduct) =>
        searchProduct(currProduct) &&
        filterProductByCategory(currProduct, activeCategory) &&
        filterProductByGender(currProduct, filters.gender)
    );

    // Sort
    sortProducts(products);

    // Filter
    if (filters.priceRange !== "none") {
      products = filterProductsByPrice(products);
    }

    setProducts(products);
  };

  useEffect(() => {
    getProducts();
  }, [search, activeCategory, allProducts, sortBy, filters]);

  return (
    <div className="shop-container">
      <CategoryNav setActiveCategory={setActiveCategory} collection={true} />

      {/* Products Section */}
      <div className="products-section">
        <div className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <DesktopSideFilter />

          {/* Products Grid Container */}
          <div className="products-container">
            <div className="section-header">
              <div className="section-title-container">
                <h2 className="collection-section-title">
                  {activeCategory === "All"
                    ? "All Products"
                    : categories.find((c) => c.id === activeCategory)?.name}
                </h2>
                <span className="results-count">{products?.length} items</span>
              </div>
              {/* Desktop Grid Toggle and Sort */}
              <DesktopGridToggleAndSort />
            </div>

            {/* Regular Grid/List View */}
            <ProductsRegularOrListView />
          </div>
        </div>

        {/* Mobile Filter/Sort Controls */}
        <MobileSortAndFilter />
      </div>

      {/* Featured Collections */}
      <div className="featured-collections">
        <h2 className="section-title">Featured Collections</h2>
        <div className="collections-grid">
          <div className="collection-card">
            <img
              src="https://i.pinimg.com/236x/9d/f5/c9/9df5c99603959ead2d7734d92c1fc374.jpg"
              alt="Men's Collection"
            />
            <div className="collection-content">
              <h3>Men's Collection</h3>
              <button className="luxury-btn">Shop Now</button>
            </div>
          </div>
          <div className="collection-card">
            <img
              src="https://static.vecteezy.com/system/resources/previews/037/749/944/non_2x/clothing-for-women-placed-on-a-wooden-floor-photo.jpg"
              alt="Women's Collection"
            />
            <div className="collection-content">
              <h3>Women's Collection</h3>
              <button className="luxury-btn">Shop Now</button>
            </div>
          </div>
          <div className="collection-card">
            <img
              src="https://img.freepik.com/premium-photo/travel-clothing-accessories-apparel-along-trip_11304-579.jpg"
              alt="Accessories"
            />
            <div className="collection-content">
              <h3>Accessories</h3>
              <button className="luxury-btn">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
