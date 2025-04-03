import { useParams } from "react-router";
import HostEvent from "../components/EventDetail/HostEvent";
import InformationEvent from "../components/EventDetail/InformationEvent";
import InformationTicket from "../components/EventDetail/InformationTicket";
import IntroduceEvent from "../components/EventDetail/IntroduceEvent";
import { useEffect, useState } from "react";
import eventApi from "../services/eventApi";
import { EventDetailResponse } from "../interface/EventInterface";

const EventDetail = () => {
  const { id } = useParams();
  const [eventDetail, setEventDetail] = useState<
    EventDetailResponse | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const response = await eventApi.getEventDetail(Number(id));
        // console.log(response);
        if (response.data.result) {
          setEventDetail(response.data.result);
        } else {
          setEventDetail(undefined);
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <InformationEvent eventDetail={eventDetail} />
      <IntroduceEvent eventDetail={eventDetail} />
      <InformationTicket eventDetail={eventDetail} />
      <HostEvent eventDetail={eventDetail} />
    </div>
  );
};

export default EventDetail;
