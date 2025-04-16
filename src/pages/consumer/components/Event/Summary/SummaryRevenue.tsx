import { ClipboardList, DollarSign, Eye, MapPin, Users } from "lucide-react";
import SummaryCard from "./SummaryCard";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { EventDetailResponse } from "../../../../../interface/EventInterface";
import eventApi from "../../../../../services/eventApi";
import { Card } from "../../../../../components/ui/card";
import LoadingFullScreen from "../../../../../components/Loading/LoadingFullScreen";

type SummaryType = "INFORMATION" | "REVENUE";

export interface Summary {
  id: number;
  name: string;
  value: number;
  growth: number;
  icon: JSX.Element;
  type?: SummaryType;
}

const summaries: Summary[] = [
  {
    id: 1,
    name: "Tổng doanh thu",
    value: 400000,
    type: "REVENUE",
    growth: 20.1,
    icon: <DollarSign size={20} className="text-pse-gray" />,
  },
  {
    id: 2,
    name: "Tổng đơn hàng",
    value: 2,
    growth: 10.7,
    icon: <ClipboardList size={20} className="text-pse-gray" />,
  },
  {
    id: 3,
    name: "Lượt xem",
    value: 20,
    growth: 50.1,
    icon: <Eye size={20} className="text-pse-gray" />,
  },
  {
    id: 4,
    name: "Vé đã bán",
    value: 10,
    growth: 20,
    icon: <Users size={20} className="text-pse-gray" />,
  },
];

const SummaryRevenue = () => {
  const { eventId } = useParams();
  const [eventDetail, setEventDetail] = useState<
    EventDetailResponse | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);

  console.log(eventDetail);
  useEffect(() => {
    const fetchData = async () => {
      if (eventId) {
        setLoading(true);
        const response = await eventApi.getEventDetail(Number(eventId));
        if (response.data.result) {
          setEventDetail(response.data.result);
        } else {
          setEventDetail(undefined);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (!eventDetail) return <LoadingFullScreen />;

  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaries.map((summary) => (
          <SummaryCard
            key={summary.id}
            id={summary.id}
            type={summary.type}
            name={summary.name}
            value={summary.value}
            growth={summary.growth}
            icon={summary.icon}
          />
        ))}
      </div>
      <Card className="my-6 bg-background h-auto text-foreground shadow-md rounded-2xl border">
        <div className="w-full flex">
          <img src={eventDetail.bannerURL} className="w-[640px] rounded-2xl" />
          <div className="w-full m-6 flex flex-col gap-2">
            <div className="font-bold text-2xl">{eventDetail.eventName}</div>
            <div className="flex gap-1 items-center font-semibold text-lg">
              <MapPin size={18} />
              <span> {eventDetail.locationName}</span>
            </div>
            <div className="flex w-full top-4 text-gray-400">
              {eventDetail.address +
                ", " +
                eventDetail.ward +
                ", " +
                eventDetail.district +
                ", " +
                eventDetail.city}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-background h-auto text-foreground shadow-md rounded-2xl border">
        <div
          className="p-6"
          dangerouslySetInnerHTML={{ __html: eventDetail?.description as any }}
        />
      </Card>
    </div>
  );
};

export default SummaryRevenue;
