import Categories from "../components/Categories/Categories";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import HeroSlider from "../components/HeroSlider/HeroSlider";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Categories />
      <HeroSlider />
      <Footer />
    </div>
  );
};

export default HomePage;
