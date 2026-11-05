import { FaStar, FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sophia Williams",
      role: "Fashion Enthusiast",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "TrueFit has completely transformed my shopping experience. The quality of their products is exceptional, and their customer service is unmatched. I've recommended them to all my friends!",
    },
    {
      id: 2,
      name: "James Anderson",
      role: "Business Professional",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "As someone who values quality and style, I've found TrueFit to be my go-to destination for premium fashion. Their attention to detail and commitment to excellence is evident in every purchase.",
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Lifestyle Blogger",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 4,
      text: "I've been featuring TrueFit products on my blog for over a year now, and my audience absolutely loves them. The luxurious feel and timeless designs make them stand out in the crowded fashion market.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="testimonials" data-aos="fade-up">
      <div className="testimonials-header">
        <h2 className="testimonials-heading mb-0">What Our Customers Say</h2>
        <div className="slider-controls">
          <button className="slider-control" onClick={prevSlide}>
            <FaArrowLeft />
          </button>
          <button className="slider-control" onClick={nextSlide}>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="testimonials-slider">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`testimonial-card ${
              index === currentSlide ? "active" : ""
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <div className="testimonial-content">
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < testimonial.rating ? "star filled" : "star"}
                  />
                ))}
              </div>
            </div>
            <div className="testimonial-author">
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="author-image"
              />
              <div className="author-info">
                <h3 className="author-name">{testimonial.name}</h3>
                <p className="author-role mb-0">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
