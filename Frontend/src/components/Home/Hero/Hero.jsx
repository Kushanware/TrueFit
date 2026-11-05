import { useState, useEffect, useRef, useContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const { fetchHeroBanners, banners } = useContext(StoreContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRef = useRef(null);

  useEffect(() => {
    if (banners && banners.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === banners?.length - 1 ? 0 : prev + 1));

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? banners?.length - 1 : prev - 1));

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchHeroBanners();
  }, []);

  return (
    <section className="hero" data-aos="fade-up">
      <div className="hero-background"></div>

      {banners?.length ? (
        <>
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-tag">{banners?.[currentSlide]?.tag}</span>
              <h1 className="hero-title">{banners?.[currentSlide]?.title}</h1>
              <h2 className="hero-subtitle">
                {banners?.[currentSlide]?.discount}
              </h2>
              <p className="hero-description">
                {banners?.[currentSlide]?.description}
              </p>

              <div className="hero-buttons">
                <Link
                  to={`/shop/${banners?.[currentSlide]?.tag.replace(
                    "#",
                    ""
                  )}/All`}
                >
                  <button className="shop-now-btn luxury-btn">Shop Now</button>
                </Link>
                <Link to="/collection/All">
                  <button className="view-collection-btn">
                    View Collection
                  </button>
                </Link>
              </div>
            </div>

            <div className="hero-image-container">
              <div
                className={`hero-image ${isAnimating ? "animating" : ""}`}
                ref={slideRef}
              >
                <img
                  src={banners?.[currentSlide]?.image.url || "/placeholder.svg"}
                  alt="Fashion items"
                  className="slide-image"
                />
              </div>
            </div>
          </div>

          <div className="hero-controls">
            <button className="hero-arrow prev" onClick={prevSlide}>
              <FaArrowLeft />
            </button>

            <div className="hero-dots">
              {banners?.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button className="hero-arrow next" onClick={nextSlide}>
              <FaArrowRight />
            </button>
          </div>
        </>
      ) : (
        <div className="loader">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="line-3"></div>
            <div className="line-4"></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
