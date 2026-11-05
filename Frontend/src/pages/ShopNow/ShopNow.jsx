import ProductsRegularOrListView from "../../components/CommonUis/ProductsRegularOrListView/ProductsRegularOrListView";
import DesktopGridToggleAndSort from "../../components/CommonUis/DesktopGridToggleAndSort/DesktopGridToggleAndSort";
import MobileSortAndFilter from "../../components/CommonUis/MobileSortAndFilter/MobileSortAndFilter";
import DesktopSideFilter from "../../components/CommonUis/DesktopSideFilter/DesktopSideFilter";
import ShopNowHeroBanner from "../../components/ShopNow/ShopNowHeroBanner/ShopNowHeroBanner";
import CategoryNav from "../../components/Home/CategoryNav/CategoryNav";
import { StoreContext } from "../../components/Context/StoreContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ShopNow.css";

const ShopNow = () => {
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
    fetchHeroBanners,
    banners,
    categories,
    getTotalItems,
    search,
  } = useContext(StoreContext);
  const { tag } = useParams();
  const [bannerData, setBannerData] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  const filterProductByTag = (product) => {
    return product?.tags?.includes(`#${tag}`);
  };

  const getProducts = () => {
    if (!allProducts || allProducts.length === 0) return;

    // Search and filter by category
    let products = allProducts?.filter(
      (currProduct) =>
        searchProduct(currProduct) &&
        filterProductByCategory(currProduct, activeCategory) &&
        filterProductByTag(currProduct) &&
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

  const getBanner = () => {
    const foundBanner =
      banners?.find((currBanner) => currBanner.tag === `#${tag}`) || {};
    setBannerData(foundBanner);
  };

  useEffect(() => {
    getProducts();
  }, [search, activeCategory, allProducts, sortBy, filters]);

  useEffect(() => {
    getBanner();
  }, [bannerData]);

  useEffect(() => {
    fetchHeroBanners();
  }, []);

  return (
    <div className="shop-container">
      <ShopNowHeroBanner
        bannerData={bannerData}
        getTotalItems={getTotalItems}
        tag={tag}
      />

      <CategoryNav
        setActiveCategory={setActiveCategory}
        shop={true}
        tag={tag}
      />

      <div className="products-section">
        <div className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <DesktopSideFilter />

          {/* Products Grid Container */}
          <div className="products-container">
            <div className="section-header">
              <div className="section-title-container">
                <h2 className="shop-section-title">
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
        <h2 className="section-title">You May Also Like</h2>
        <div className="collections-grid">
          <div className="shop-card">
            <img
              src="https://i.cdn.newsbytesapp.com/images/l70620240409141615.jpeg"
              alt="Winter Collection"
            />
            <div className="shop-content">
              <h3>Summer Collection</h3>
              <button className="luxury-btn">Shop Now</button>
            </div>
          </div>
          <div className="shop-card">
            <img
              src="https://acendance.com/wp-content/uploads/2023/05/Connie1_proper_job_interview_clothes_for_men_b35e097d-c649-4bc9-ad00-70d0f755ced2.png"
              alt="Formal Wear"
            />
            <div className="shop-content">
              <h3>Formal Wear</h3>
              <button className="luxury-btn">Shop Now</button>
            </div>
          </div>
          <div className="shop-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_rnkCTDpOXGol-uaYYxhqJwp2B5_wwmVeIw&s"
              alt="Sports Collection"
            />
            <div className="shop-content">
              <h3>Sports Collection</h3>
              <button className="luxury-btn">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopNow;
