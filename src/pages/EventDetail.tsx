import HostEvent from "../components/EventDetail/HostEvent";
import InformationEvent from "../components/EventDetail/InformationEvent";
import InformationTicket from "../components/EventDetail/InformationTicket";
import IntroduceEvent from "../components/EventDetail/IntroduceEvent";
const EventDetail = () => {
  return (
    <div>
      <InformationEvent />
      <IntroduceEvent />
      <InformationTicket />
      <HostEvent />
    </div>
  );
};

export default EventDetail;
