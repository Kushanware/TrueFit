import { FaTshirt, FaShoppingBag } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { GiBilledCap } from "react-icons/gi";
import { BiBriefcase } from "react-icons/bi";
import "./CategoryNav.css";
import {
  GiTrousers,
  GiRunningShoe,
  GiWatch,
  GiMonclerJacket,
  GiShirt,
} from "react-icons/gi";

const CategoryNav = ({ setActiveCategory, shop, collection, tag }) => {
  const categories = [
    {
      id: "All",
      name: "All",
      icon: <FaShoppingBag />,
      color: "#1a365d",
    },
    { id: "T-Shirts", name: "TShirts", icon: <FaTshirt />, color: "#1a365d" },
    {
      id: "Jackets",
      name: "Jackets",
      icon: <GiMonclerJacket />,
      color: "#1a365d",
    },
    { id: "Shirts", name: "Shirts", icon: <GiShirt />, color: "#1a365d" },
    { id: "Pants", name: "Pants", icon: <GiTrousers />, color: "#1a365d" },
    { id: "Bags", name: "Bags", icon: <BiBriefcase />, color: "#1a365d" },
    { id: "Shoes", name: "Shoes", icon: <GiRunningShoe />, color: "#1a365d" },
    { id: "Watches", name: "Watches", icon: <GiWatch />, color: "#1a365d" },
    { id: "Caps", name: "Caps", icon: <GiBilledCap />, color: "#1a365d" },
  ];

  return (
    <section className="category-nav" data-aos="fade-up" data-aos-delay="0">
      {shop ? (
        <div className="category-list">
          {categories.map((category, index) => (
            <NavLink
              to={`/shop/${tag}/${category.id}`}
              key={index}
              className="category-item"
              onClick={() => setActiveCategory(category.id)}
            >
              <div
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <span className="category-name">{category.name}</span>
            </NavLink>
          ))}
        </div>
      ) : collection ? (
        <div className="category-list">
          {categories.map((category, index) => (
            <NavLink
              to={`/collection/${category.id}`}
              key={index}
              className="category-item"
              onClick={() => setActiveCategory(category.id)}
            >
              <div
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <span className="category-name">{category.name}</span>
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="category-list">
          {categories.map((category, index) => (
            <Link
              to={`/collection/${category.id}`}
              key={index}
              className="category-item"
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <div
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryNav;
