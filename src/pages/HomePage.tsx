// import Categories from "../components/Categories/Categories";
import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import SpecialEvent from "../components/SpecialEvent/SpecialEvent";
import TabEvent from "../components/TabEvent/TabEvent";
import { EventForConsumer } from "../interface/EventInterface";
import eventApi from "../services/eventApi";

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
      {/* <Categories /> */}
      <HeroSlider />
      <SpecialEvent specialEvents={specialEvents} />
      <TabEvent />
    </div>
  );
};

export default HomePage;
