import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext";
import { useContext } from "react";
import "./DesktopSideFilter.css";

const DesktopSideFilter = () => {
  const {
    getActiveFiltersCount,
    toggleFilterDropdown,
    handleFilterChange,
    openFilters,
    clearAllFilters,
    priceRanges,
    filters,
    colors,
    sizes,
    genders,
  } = useContext(StoreContext);

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>
          Filters
          {getActiveFiltersCount() > 0 && (
            <span className="filter-count">({getActiveFiltersCount()})</span>
          )}
        </h3>
      </div>

      <div className="filter-section">
        <div
          className="filter-dropdown-header"
          onClick={() => toggleFilterDropdown("price")}
        >
          <h4>Price</h4>
          <div className="filter-dropdown-icon">
            {openFilters.price ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        <div
          className={`filter-options-container ${
            openFilters.price ? "open" : ""
          }`}
        >
          <div className="filter-options">
            {priceRanges.map((range) => (
              <label key={range.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.priceRange === range.id}
                  onChange={() => handleFilterChange("priceRange", range.id)}
                />
                <span className="filter-checkbox"></span>
                <span className="filter-label">{range.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div
          className="filter-dropdown-header"
          onClick={() => toggleFilterDropdown("color")}
        >
          <h4>Color</h4>
          <div className="filter-dropdown-icon">
            {openFilters.color ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        <div
          className={`filter-options-container ${
            openFilters.color ? "open" : ""
          }`}
        >
          <div className="filter-options">
            {colors.map((color) => (
              <label key={color.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.color === color.id}
                  onChange={() => handleFilterChange("color", color.id)}
                />
                <span className="filter-checkbox"></span>
                <span className="filter-label">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: color.id.toLowerCase() }}
                  ></span>
                  {color.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div
          className="filter-dropdown-header"
          onClick={() => toggleFilterDropdown("size")}
        >
          <h4>Size</h4>
          <div className="filter-dropdown-icon">
            {openFilters.size ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        <div
          className={`filter-options-container ${
            openFilters.size ? "open" : ""
          }`}
        >
          <div className="filter-options">
            {sizes.map((size) => (
              <label key={size.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.size === size.id}
                  onChange={() => handleFilterChange("size", size.id)}
                />
                <span className="filter-checkbox"></span>
                <span className="filter-label">{size.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div
          className="filter-dropdown-header"
          onClick={() => toggleFilterDropdown("gender")}
        >
          <h4>Gender</h4>
          <div className="filter-dropdown-icon">
            {openFilters.gender ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        <div
          className={`filter-options-container ${
            openFilters.gender ? "open" : ""
          }`}
        >
          <div className="filter-options">
            {genders.map((gender) => (
              <label key={gender.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.gender === gender.id}
                  onChange={() => handleFilterChange("gender", gender.id)}
                />
                <span className="filter-checkbox"></span>
                <span className="filter-label">{gender.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button className="clear-all-btn" onClick={clearAllFilters}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default DesktopSideFilter;
