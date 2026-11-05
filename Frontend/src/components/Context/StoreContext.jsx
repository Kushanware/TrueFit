import { createContext, useEffect, useState } from "react";
import {
  categories,
  sortOptions,
  priceRanges,
  sizes,
  colors,
  genders,
} from "../../assets/data.js";
import {
  getCartData,
  getHeroBanners,
  getProducts,
  getUserData,
  getWishlistData,
  toggleProductInCart,
  toggleProductInwishlist,
} from "../../services/services.jsx";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [noFlashSale, setNoFlashSale] = useState(false);
  const [todaysForYouProducts, setTodaysForYouProducts] = useState([]);
  const [sortBy, setSortBy] = useState("none");
  const [viewMode, setViewMode] = useState("grid");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "none",
    size: "none",
    color: "none",
    gender: "none",
  });
  const [openFilters, setOpenFilters] = useState({
    price: false,
    size: false,
    color: false,
    gender: false,
  });
  const [wishlistData, setWishlistData] = useState({});
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [cartData, setCartData] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [productsToOrder, setProductsToOrder] = useState([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: { url: "", filename: "" },
    phone: "",
    address: "",
    role: "",
    _id: "",
  });
  const shippingCost = 60;
  const expressShippingCost = 120;
  const [subtotal, setSubtotal] = useState();

  const getTotalItems = (tagToFind) => {
    const products = allProducts?.filter((currProduct) =>
      currProduct.tags.find((currTag) => currTag === tagToFind)
    );
    return products?.length;
  };

  const toggleWishlist = async (id) => {
    setWishlistData((prev) => {
      const updatedWishlistData = { ...prev };

      if (wishlistData[id]) {
        delete updatedWishlistData[id];
      } else {
        updatedWishlistData[id] = true;
      }

      return updatedWishlistData;
    });

    // Adding or removing item from users DB wishlist
    if (token) {
      try {
        const res = await toggleProductInwishlist(id, token);
        if (!res.data.success) {
          console.log("Could not toggle product to Db wishlist");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleCart = async (id) => {
    setCartData((prev) => {
      const updatedCartData = { ...prev };

      if (cartData[id]) {
        delete updatedCartData[id];
      } else {
        updatedCartData[id] = 1;
      }

      return updatedCartData;
    });

    // Adding or removing item from users DB cart
    if (token) {
      try {
        const res = await toggleProductInCart(id, token);
        if (!res.data.success) {
          console.log("Could not toggle product to Db wishlist");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getWishlistProducts = () => {
    setWishlistProducts(
      allProducts.filter(
        (currProduct) => wishlistData[currProduct._id] === true
      )
    );
  };

  const getCartProducts = () => {
    setCartProducts(
      allProducts
        .filter(
          (currProduct) => cartData[currProduct._id] && currProduct.stock > 0
        )
        .map((currProduct) => ({
          ...currProduct,
          quantity: cartData[currProduct._id] || 1,
        }))
    );
  };

  const fetchHeroBanners = async () => {
    try {
      const response = await getHeroBanners();
      if (response.data.success) {
        setBanners(response.data.banners.sort((a, b) => a.order - b.order));
      } else {
        console.log(response.data.message || "Could not get hero banners.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFlashSaleProducts = () => {
    const flashProducts = allProducts.filter((currProduct) =>
      currProduct.tags.includes("Flash Sale")
    );
    setFlashSaleProducts(flashProducts);
    if (flashProducts.length === 0) {
      setNoFlashSale(true);
    } else {
      setNoFlashSale(false);
    }
  };

  const getTodaysForYouProducts = () => {
    setTodaysForYouProducts(
      allProducts.filter((currProduct) =>
        currProduct.tags.includes("Todays For You")
      )
    );
  };

  const toggleFilterDropdown = (filterName) => {
    setOpenFilters({
      price: false,
      size: false,
      color: false,
      gender: false,
      [filterName]: !openFilters[filterName],
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: "none",
      size: "none",
      color: "none",
      gender: "none",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;

    if (filters.priceRange && filters.priceRange !== "none") {
      count++;
    }
    if (filters.size && filters.size !== "none") {
      count++;
    }
    if (filters.color && filters.color !== "none") {
      count++;
    }
    if (filters.gender && filters.gender !== "none") {
      count++;
    }

    return count;
  };

  const searchProduct = (product) => {
    if (search) {
      return product.name.toLowerCase().includes(search.toLowerCase());
    } else {
      return true;
    }
  };

  const filterProductByCategory = (product, activeCategory) => {
    if (activeCategory !== "All") {
      return product.category === activeCategory;
    } else {
      return true;
    }
  };

  const filterProductByGender = (product, selectedGender) => {
    if (selectedGender && selectedGender !== "none") {
      return product.gender === selectedGender;
    } else {
      return true;
    }
  };

  const sortProducts = (products) => {
    if (sortBy === "none") {
      // return
    } else if (sortBy === "newest") {
      products.sort((a, b) => {
        const aIsNew = a.tags.includes("New");
        const bIsNew = b.tags.includes("New");

        return (bIsNew ? 1 : 0) - (aIsNew ? 1 : 0);
      });
    } else if (sortBy === "top-rated") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-low-high") {
      products.sort((a, b) => {
        const priceAfterDiscountA = a.discount
          ? a.price - (a.price * a.discount) / 100
          : a.price;
        const priceAfterDiscountB = b.discount
          ? b.price - (b.price * b.discount) / 100
          : b.price;

        return priceAfterDiscountA - priceAfterDiscountB;
      });
    } else if (sortBy === "price-high-low") {
      products.sort((a, b) => {
        const priceAfterDiscountA = a.discount
          ? a.price - (a.price * a.discount) / 100
          : a.price;
        const priceAfterDiscountB = b.discount
          ? b.price - (b.price * b.discount) / 100
          : b.price;

        return priceAfterDiscountB - priceAfterDiscountA;
      });
    }
  };

  const filterProductsByPrice = (products) => {
    const [min, max] = filters.priceRange.split("-").map(Number);
    products = products.filter((currProduct) => {
      const priceAfterDiscount = currProduct.discount
        ? currProduct.price - (currProduct.price * currProduct.discount) / 100
        : currProduct.price;
      return (
        priceAfterDiscount >= (min || 0) &&
        (max ? priceAfterDiscount <= max : true)
      );
    });

    return products;
  };

  const fetchProductsData = async () => {
    try {
      const res = await getProducts();
      if (res.data.success) {
        setAllProducts(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const res = await getCartData(token);
      if (res.data.success) {
        setCartData(res.data.cartData);
      } else {
        console.log(
          res.data.message || "Something went wrong while getting cart data"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadWishlistData = async (token) => {
    try {
      const res = await getWishlistData(token);
      if (res.data.success) {
        setWishlistData(res.data.wishlistData);
      } else {
        console.log(
          res.data.message || "Something went wrong while getting wishlist data"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadUserData = async (token) => {
    try {
      const res = await getUserData(token);
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        console.log(
          res.data.message || "Something went wrong while getting wishlist data"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProductsData();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
        await loadWishlistData(localStorage.getItem("token"));
        await loadUserData(localStorage.getItem("token"));
      }
    };
    loadData();
  }, []);

  const contextData = {
    allProducts,
    products,
    setProducts,
    flashSaleProducts,
    setFlashSaleProducts,
    getFlashSaleProducts,
    noFlashSale,
    todaysForYouProducts,
    setTodaysForYouProducts,
    getTodaysForYouProducts,
    sortBy,
    setSortBy,
    viewMode,
    fetchHeroBanners,
    banners,
    setBanners,
    setViewMode,
    isSortOpen,
    setIsSortOpen,
    isFilterOpen,
    setIsFilterOpen,
    filters,
    setFilters,
    openFilters,
    setOpenFilters,
    getActiveFiltersCount,
    clearAllFilters,
    handleFilterChange,
    filterProductsByPrice,
    searchProduct,
    filterProductByCategory,
    filterProductByGender,
    sortProducts,
    toggleFilterDropdown,
    categories,
    sortOptions,
    priceRanges,
    sizes,
    colors,
    genders,
    getTotalItems,
    toggleWishlist,
    wishlistData,
    setWishlistData,
    loadWishlistData,
    wishlistProducts,
    setWishlistProducts,
    getWishlistProducts,
    toggleCart,
    cartData,
    setCartData,
    productsToOrder,
    setProductsToOrder,
    loadCartData,
    cartProducts,
    setCartProducts,
    getCartProducts,
    search,
    setSearch,
    token,
    setToken,
    user,
    setUser,
    shippingCost,
    expressShippingCost,
    subtotal,
    setSubtotal,
  };

  return (
    <StoreContext.Provider value={contextData}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
