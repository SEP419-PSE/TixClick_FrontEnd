import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "react-router";
import { Input } from "../../components/ui/input";
import { EventDetailResponse } from "../../interface/EventInterface";
import { Button } from "../../components/ui/button";
import EventList from "./components/Search/EventList";
import { FormEvent, useEffect, useState } from "react";
import eventApi from "../../services/eventApi";
import FilterEvent from "./components/Search/FilterEvent";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventName = searchParams.get("event-name") || "";
  const [eventList, setEventList] = useState<EventDetailResponse[]>([]);
  const [eventCategory, setEventCategory] = useState<string[]>([]);

  // Gọi API khi event-name thay đổi
  useEffect(() => {
    const fetchData = async () => {
      if (eventName.trim() !== "") {
        const response = await eventApi.search(
          "",
          "",
          "",
          eventName,
          eventCategory
        );
        console.log(response);
        setEventList(response.data.result || []);
      } else {
        setEventList([]); // clear nếu không có keyword
      }
    };

    fetchData();
  }, [eventName, eventCategory]);

  // Xử lý form submit
  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("eventName")?.toString().trim() || "";

    const currentParams = new URLSearchParams(searchParams);

    if (searchValue === "") {
      currentParams.delete("event-name");
    } else {
      currentParams.set("event-name", searchValue);
    }

    setSearchParams(currentParams);
  };

  return (
    <div className="bg-pse-black px-4 py-4">
      <div className="relative flex mb-4">
        <button className="absolute left-0 top-0 border border-white rounded-full w-fit h-fit">
          <ChevronLeft />
        </button>
        <div className="mx-auto text-lg font-bold">Tìm kiếm</div>
      </div>

      <form onSubmit={onSubmitSearch} className="mb-4 flex">
        <div className="flex w-full max-w-sm items-center mx-auto space-x-2">
          <Input
            className="bg-transparent"
            type="text"
            name="eventName"
            placeholder="Sự kiện bạn muốn tìm"
            defaultValue={eventName}
          />

          <Button
            className="bg-white text-black hover:bg-opacity-80"
            type="submit"
          >
            Tìm kiếm
          </Button>
        </div>

        {/* Date picker */}
      </form>
      <div className="mb-4">
        <FilterEvent />
      </div>

      <div>
        <EventList eventList={eventList} />
      </div>
    </div>
  );
};

export default SearchPage;
