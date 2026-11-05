const ShopNowHeroBanner = ({ bannerData, getTotalItems, tag }) => {
  return (
    <div className="hero-banner">
      <img
        src={bannerData?.image?.url || "/placeholder.svg"}
        alt={bannerData?.title}
        className="banner-image"
      />
      <div className="banner-content">
        <div className="shop-tag">{bannerData?.tag}</div>
        <h1 className="banner-title">{bannerData?.title}!</h1>
        <p className="banner-subtitle">{bannerData?.discount}</p>
        <p className="banner-description">{bannerData?.description}</p>
        <div className="shop-stats">
          <span>{getTotalItems(`#${tag}`)} Items</span>
        </div>
      </div>
    </div>
  );
};

export default ShopNowHeroBanner;
