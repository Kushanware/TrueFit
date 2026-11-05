import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
} from "react-icons/fa";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="hero-section">
        <h1>About TrueFit</h1>
        <p>Elevating Style, Empowering Confidence</p>
      </div>

      <section className="our-story">
        <h2 className="about-subheading">Our Story</h2>
        <p>
          Founded in 2010, TrueFit began as a small boutique in the heart of
          Jakarta with a vision to redefine fashion. Our journey started with a
          passion for creating clothing that not only looks good but feels
          amazing to wear.
        </p>
        <p>
          Over the years, we've grown from a local favorite to an international
          brand, but our core values remain the same: quality, innovation, and
          customer satisfaction. We believe that great style shouldn't
          compromise on comfort or sustainability.
        </p>
      </section>

      <section className="our-mission">
        <h2 className="about-subheading">Our Mission</h2>
        <p>
          At TrueFit, our mission is to empower individuals to express their
          unique style while promoting sustainable and ethical fashion
          practices. We strive to create clothing that not only enhances your
          wardrobe but also contributes to a better world.
        </p>
        <ul>
          <li>Innovative designs that stand out</li>
          <li>Sustainable materials and production processes</li>
          <li>Inclusive sizing and styles for all body types</li>
          <li>Exceptional customer experience from browsing to wearing</li>
        </ul>
      </section>

      <section className="our-team">
        <h2 className="about-subheading">Meet Our Team</h2>
        <div className="team-grid">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & Creative Director",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Michael Lee",
              role: "Head of Design",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Emily Chen",
              role: "Sustainability Officer",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "David Patel",
              role: "Customer Experience Manager",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member, index) => (
            <div key={index} className="team-member">
              <img src={member.image || "/placeholder.svg"} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="our-values">
        <h2 className="about-subheading">Our Values</h2>
        <div className="values-grid">
          {[
            {
              title: "Quality",
              description:
                "We never compromise on the quality of our products.",
            },
            {
              title: "Innovation",
              description:
                "Constantly pushing boundaries in design and technology.",
            },
            {
              title: "Sustainability",
              description: "Committed to eco-friendly practices and materials.",
            },
            {
              title: "Inclusivity",
              description: "Creating fashion that celebrates diversity.",
            },
          ].map((value, index) => (
            <div key={index} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
