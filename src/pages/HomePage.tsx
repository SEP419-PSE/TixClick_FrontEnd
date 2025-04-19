// import Categories from "../components/Categories/Categories";
import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import SpecialEvent from "../components/SpecialEvent/SpecialEvent";
import TabEvent from "../components/TabEvent/TabEvent";
import { EventForConsumer } from "../interface/EventInterface";
import eventApi from "../services/eventApi";
import EventsByCategory from "../components/TabEvent/EventsByCategory";
import Categories from "../components/Categories/Categories";
import HeroSection from "../components/HeroSlider/HeroSection";

const HomePage = () => {
  const [specialEvents, setSpecialEvents] = useState<EventForConsumer[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await eventApi.getEventList();
      if (response.data.result.length != 0) {
        setSpecialEvents(response.data.result);
      } else {
        setSpecialEvents([]);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <HeroSlider />
      <Categories />
      <SpecialEvent specialEvents={specialEvents} />
      <TabEvent />
      <EventsByCategory eventCategoryId={1} status="SCHEDULED" />
      <EventsByCategory eventCategoryId={2} status="SCHEDULED" />
      <EventsByCategory eventCategoryId={3} status="SCHEDULED" />
      <EventsByCategory eventCategoryId={4} status="SCHEDULED" />
      <HeroSection />
    </div>
  );
};

export default HomePage;
