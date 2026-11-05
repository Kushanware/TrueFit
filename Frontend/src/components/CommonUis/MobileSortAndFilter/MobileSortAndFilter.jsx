import { StoreContext } from "../../Context/StoreContext";
import { useContext } from "react";
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaSort,
  FaTimes,
} from "react-icons/fa";

const MobileSortAndFilter = () => {
  const {
    isFilterOpen,
    setIsFilterOpen,
    toggleFilterDropdown,
    handleFilterChange,
    getActiveFiltersCount,
    clearAllFilters,
    priceRanges,
    isSortOpen,
    setIsSortOpen,
    sortBy,
    filters,
    openFilters,
    sortOptions,
    colors,
    sizes,
    genders,
    setSortBy,
  } = useContext(StoreContext);

  return (
    <div>
      <div className="mobile-controls">
        <button className="filter-btn" onClick={() => setIsFilterOpen(true)}>
          <FaFilter className="mobile-btn-icon" />
          <span>Filter</span>
          {getActiveFiltersCount() > 0 && (
            <span className="mobile-filter-badge">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
        <button className="sort-btn" onClick={() => setIsSortOpen(true)}>
          <FaSort className="mobile-btn-icon" />
          <span>Sort</span>
        </button>
      </div>

      {/* Sort Modal */}
      <div className={`sort-modal ${isSortOpen ? "active" : ""}`}>
        <div className="modal-header">
          <h3>Sort by</h3>
          <button className="close-btn" onClick={() => setIsSortOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-content sort-options-container">
          {sortOptions.map((option) => (
            <label
              key={option.id}
              className={`sort-option ${
                sortBy === option.id ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="sort"
                checked={sortBy === option.id}
                onChange={() => {
                  setSortBy(option.id);
                  setIsSortOpen(false);
                }}
                className="sort-radio-input"
              />
              {sortBy === option.id ? (
                <span className="sort-radio-selected">
                  <FaCheck className="sort-check-icon" />
                </span>
              ) : (
                <span className="sort-radio"></span>
              )}
              <span className="sort-option-name">{option.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      <div className={`filter-modal ${isFilterOpen ? "active" : ""}`}>
        <div className="modal-header">
          <h3>
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">({getActiveFiltersCount()})</span>
            )}
          </h3>
          <button className="close-btn" onClick={() => setIsFilterOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-content">
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
                      onChange={() =>
                        handleFilterChange("priceRange", range.id)
                      }
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
        </div>
        <div className="modal-footer">
          <button
            className="clear-btn"
            onClick={() => {
              clearAllFilters();
              setIsFilterOpen(false);
            }}
          >
            Clear All
          </button>
          <button className="apply-btn" onClick={() => setIsFilterOpen(false)}>
            Apply
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {(isSortOpen || isFilterOpen) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setIsSortOpen(false);
            setIsFilterOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default MobileSortAndFilter;
