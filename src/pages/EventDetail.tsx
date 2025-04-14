import { useParams } from "react-router";
import HostEvent from "../components/EventDetail/HostEvent";
import InformationEvent from "../components/EventDetail/InformationEvent";
import InformationTicket from "../components/EventDetail/InformationTicket";
import IntroduceEvent from "../components/EventDetail/IntroduceEvent";
import { useEffect, useState } from "react";
import eventApi from "../services/eventApi";
import { EventDetailResponse } from "../interface/EventInterface";
import LoadingFullScreen from "../components/Loading/LoadingFullScreen";

const EventDetail = () => {
  const { id } = useParams();
  const [eventDetail, setEventDetail] = useState<
    EventDetailResponse | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        const response = await eventApi.getEventDetail(Number(id));
        // console.log(response);
        if (response.data.result) {
          setEventDetail(response.data.result);
        } else {
          setEventDetail(undefined);
        }
        const countResponse = await eventApi.countView(Number(id));
        console.log(countResponse.data.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      {loading ? (
        <LoadingFullScreen />
      ) : (
        <div>
          <InformationEvent eventDetail={eventDetail} />
          <IntroduceEvent eventDetail={eventDetail} />
          <InformationTicket eventDetail={eventDetail} />
          <HostEvent eventDetail={eventDetail} />
        </div>
      )}
    </>
  );
};

export default EventDetail;
