import Categories from "../components/Categories/Categories";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import SpecialEvent from "../components/SpecialEvent/SpecialEvent";
import TabEvent from "../components/TabEvent/TabEvent";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Categories />
      <HeroSlider />
      <SpecialEvent />
      <TabEvent />

      <Footer />
    </div>
  );
};

export default HomePage;
