import { FaPaperPlane, FaGift, FaRegCheckCircle } from "react-icons/fa";
import { PiStackBold } from "react-icons/pi";
import { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribing email:", email);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="newsletter" data-aos="fade-up">
      <div className="newsletter-content">
        <div className="newsletter-text">
          <h2 className="newsletter-title">
            Join Our <span className="gold-text">VIP</span> List
          </h2>
          <p className="newsletter-description">
            Subscribe to our newsletter and be the first to know about exclusive
            deals, new arrivals, and special events. Plus, get 10% off your
            first order!
          </p>

          <div className="benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaGift />
              </div>
              <div className="benefit-text">
                <h3>Exclusive Offers</h3>
                <p>Get access to members-only deals and promotions</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <PiStackBold />
              </div>
              <div className="benefit-text">
                <h3>New Arrivals</h3>
                <p>Be the first to see our latest collections</p>
              </div>
            </div>
          </div>
        </div>

        <div className="newsletter-form-container">
          <form
            className={`newsletter-form ${submitted ? "submitted" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="form-content">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="subscribe-btn">
                <span>Subscribe</span>
                <FaPaperPlane />
              </button>
            </div>
            <div className="success-message">
              <FaRegCheckCircle />
              <span>Thank you for subscribing!</span>
            </div>
          </form>
          <p className="privacy-note">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
