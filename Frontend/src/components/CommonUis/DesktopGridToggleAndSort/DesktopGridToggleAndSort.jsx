import { StoreContext } from "../../Context/StoreContext";
import { IoGridOutline, IoList } from "react-icons/io5";
import "./DesktopGridToggleAndSort.css";
import { FaSort } from "react-icons/fa";
import { useContext } from "react";

const DesktopGridToggleAndSort = () => {
  const { viewMode, setViewMode, setIsSortOpen, sortOptions, sortBy } =
    useContext(StoreContext);

  return (
    <div className="grid-toggle-and-sort">
      <div className="view-toggle">
        <button
          className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <IoGridOutline />
        </button>
        <button
          className={`view-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <IoList />
        </button>
      </div>
      <div className="sort-controls">
        <button className="sort-toggle" onClick={() => setIsSortOpen(true)}>
          <FaSort className="sort-icon" />
          <span className="sort-label">
            {sortOptions.find((option) => option.id === sortBy)?.name}
          </span>
        </button>
      </div>
    </div>
  );
};
export default DesktopGridToggleAndSort;
