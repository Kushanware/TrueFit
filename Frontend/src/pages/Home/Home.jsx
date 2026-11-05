import Testimonials from "../../components/Home/Testimonials/Testimonials";
import TodaysForYou from "../../components/Home/TodaysForYou/TodaysForYou";
import CategoryNav from "../../components/Home/CategoryNav/CategoryNav";
import Newsletter from "../../components/Home/Newsletter/Newsletter";
import FlashSale from "../../components/Home/FlashSale/FlashSale";
import Hero from "../../components/Home/Hero/Hero";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Hero />
      <CategoryNav />
      <FlashSale />
      <TodaysForYou />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
