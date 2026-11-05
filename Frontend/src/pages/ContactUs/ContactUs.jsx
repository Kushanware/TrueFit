import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
} from "react-icons/fa";
import "./ContactUs.css";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    // Reset form after submission
    setFormData({ name: "", email: "", subject: "", message: "" });
    // Reset submission status after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="contact-us-container">
      <div className="hero-section" data-aos="fade-up">
        <h1>Contact Us</h1>
        <p>We'd Love to Hear From You</p>
      </div>

      <div className="contact-content">
        <div className="contact-info" data-aos="fade-right">
          <h2>Get in Touch</h2>
          <p>
            Have questions about our products or services? Reach out to us and
            we'll be happy to assist you.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <p className="mb-0">Khopoli, Raigad, Maharashtra, 410202</p>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <p className="mb-0">+91 123 456 7890</p>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <p className="mb-0">truefitproject@gmail.com</p>
            </div>
          </div>
          <div className="social-links">
            <Link to="#" aria-label="Follow us on Instagram">
              <FaInstagram />
            </Link>
            <Link to="#" aria-label="Like us on Facebook">
              <FaFacebookF />
            </Link>
            <Link to="#" aria-label="Follow us on Twitter">
              <FaTwitter />
            </Link>
            <Link to="#" aria-label="Follow us on Pinterest">
              <FaPinterestP />
            </Link>
          </div>
        </div>

        <div className="contact-form" data-aos="fade-left">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                className="about-input"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="about-textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
          {isSubmitted && (
            <p className="success-message">
              Thank you for your message. We'll get back to you soon!
            </p>
          )}
        </div>
      </div>

      <div className="map-section" data-aos="zoom-in">
        <h2>Visit Our Store</h2>
        <div className="map-container">
          {/* Replace the src with your actual Google Maps embed URL */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.5582739829465!2d73.30149507380908!3d18.81782906002937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7fd691a4b1849%3A0x3d3778e3e21d62db!2sMahad%20Phata!5e0!3m2!1sen!2sin!4v1741675084215!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="faq-section" data-aos="fade-up">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <details>
            <summary>What are your shipping options?</summary>
            <p>
              We offer standard and express shipping options. Standard shipping
              usually takes 3-5 business days, while express shipping can
              deliver your items within 1-2 business days.
            </p>
          </details>
          <details>
            <summary>How can I track my order?</summary>
            <p>
              Once your order is shipped, you will receive a tracking number via
              email. You can use this number to track your package on our
              website or the courier's website.
            </p>
          </details>
          <details>
            <summary>What is your return policy?</summary>
            <p>
              We offer a 30-day return policy for most items. Items must be
              unworn, unwashed, and in the same condition that you received
              them. Please check our Returns page for more details.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
