import { useEffect, useState } from "react";
import { StoreContext } from "../../components/Context/StoreContext";
import { getAvailableCoupons } from "../../services/services.jsx";
import { toast } from "react-toastify";
import { FaCopy, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Coupons.css";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await getAvailableCoupons();
        if (res.data.success) {
          setCoupons(res.data.coupons);
        } else {
          toast.error(res.data.message || "Could not load coupons.");
        }
      } catch {
        toast.error("Could not load coupons.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard`);
  };

  if (loading) {
    return (
      <div className="coupons-container" data-aos="fade-up">
        <h1 className="coupons-title">Available Coupons</h1>
        <p className="coupons-subtitle">Loading available coupons...</p>
      </div>
    );
  }

  return (
    <div className="coupons-container" data-aos="fade-up">
      <div className="coupons-header">
        <div className="coupons-title-wrapper">
          <FaTag className="coupons-icon" />
          <h1 className="coupons-title">Available Coupons</h1>
        </div>
        <p className="coupons-subtitle">
          Apply these promo codes at checkout to save on your order.
        </p>
      </div>

      {coupons.length === 0 ? (
        <div className="empty-coupons">
          <p>No active coupons available right now.</p>
        </div>
      ) : (
        <div className="coupons-list">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="coupon-card">
              <div className="coupon-info">
                <span className="coupon-code">{coupon.code}</span>
                <span className="coupon-type">
                  {coupon.type === "Percentage"
                    ? `${coupon.value}% OFF`
                    : `₹${coupon.value} OFF`}
                </span>
                {coupon.minPurchase > 0 && (
                  <span className="coupon-min">
                    Min. order: ₹{coupon.minPurchase}
                  </span>
                )}
              </div>
              <div className="coupon-actions">
                <button
                  className="copy-btn"
                  onClick={() => copyCode(coupon.code)}
                  title="Copy code"
                >
                  <FaCopy /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="coupons-note">
        <p>
          Enter the coupon code on the <Link to="/checkout">checkout</Link> page
          to apply the discount to your order.
        </p>
      </div>
    </div>
  );
};

export default Coupons;
