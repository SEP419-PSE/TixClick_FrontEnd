import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "react-router";
import { Input } from "../../components/ui/input";
import { EventDetailResponse } from "../../interface/EventInterface";
import { Button } from "../../components/ui/button";
import EventList from "./components/Search/EventList";
import { FormEvent, useEffect, useState } from "react";
import eventApi from "../../services/eventApi";
import FilterEvent from "./components/Search/FilterEvent";
import { toast } from "sonner";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventName = searchParams.get("event-name") || "";
  const [eventList, setEventList] = useState<EventDetailResponse[]>([]);
  const [eventMode, setEventMode] = useState<string>("");
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const currentDate = new Date().toISOString().split("T")[0];

  // Gọi API khi event-name thay đổi
  useEffect(() => {
    console.log("call lại list");
    const fetchData = async () => {
      const response = await eventApi.search(
        startDate,
        endDate,
        eventMode,
        eventName,
        selectedItems
      );
      console.log(response);
      setEventList(response.data.result || []);
    };

    fetchData();
  }, [searchParams, eventName]);

  useEffect(() => {
    console.log("Láy dữ liệu từ URL");
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    const mode = searchParams.get("eventMode");
    const types = searchParams.get("types");

    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (mode) setEventMode(mode);
    if (types) setSelectedItems(types.split(","));
  }, [searchParams]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0];

    // Kiểm tra startDate không nhỏ hơn ngày hiện tại
    if (selectedStartDate < currentDate) {
      toast.warning("Ngày bắt đầu không được nhỏ hơn ngày hiện tại");
    } else {
      setStartDate(selectedStartDate);

      // Kiểm tra endDate phải lớn hơn startDate nếu endDate đã được chọn
      if (endDate && selectedStartDate >= endDate) {
        toast.warning("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      }
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.value;

    // Kiểm tra endDate phải lớn hơn startDate
    if (startDate && selectedEndDate <= startDate) {
      toast.warning("Ngày kết thúc phải lớn hơn ngày bắt đầu");
    } else {
      setEndDate(selectedEndDate);
    }
  };

  // Hàm cập nhật trạng thái khi toggle thay đổi
  const handleToggleChange = (value: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(value)) {
        // Nếu đã chọn, thì bỏ chọn
        return prevSelectedItems.filter((item) => item !== value);
      } else {
        // Nếu chưa chọn, thì thêm vào mảng
        return [...prevSelectedItems, value];
      }
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setEventMode(checked ? "Online" : "Offline");
  };

  const hanldeOpenFilter = () => {
    setOpenFilter(true);
  };

  const hanldeCloseFilter = () => {
    setOpenFilter(false);
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setEventMode("");
    setSelectedItems([]);
    const params = new URLSearchParams(searchParams);
    params.delete("startDate");
    params.delete("endDate");
    params.delete("eventMode");
    params.delete("types");
    setSearchParams(params);
  };

  const onSubmitSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("eventName")?.toString().trim() || "";

    const currentParams = new URLSearchParams(searchParams);

    currentParams.set("event-name", searchValue);
    setSearchParams(currentParams);

    // ✅ Gọi lại fetch thủ công nếu chuỗi rỗng
    if (searchValue === "") {
      const response = await eventApi.search(
        startDate,
        endDate,
        eventMode,
        "",
        selectedItems
      );
      setEventList(response.data.result || []);
    }
  };

  const submitForm = async () => {
    const params = new URLSearchParams(searchParams);
    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    if (eventMode) params.set("eventMode", eventMode);
    else params.delete("eventMode");

    if (selectedItems.length > 0) {
      params.set("types", selectedItems.join(","));
    } else {
      params.delete("types");
    }

    setSearchParams(params);

    // ✅ Gọi lại API bất kể eventName rỗng hay không
    const response = await eventApi.search(
      startDate,
      endDate,
      eventMode,
      eventName,
      selectedItems
    );
    setEventList(response.data.result || []);
  };

  return (
    <div className="bg-pse-black px-4 py-4">
      <div className="relative  flex mb-4">
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
        <FilterEvent
          currentDate={currentDate}
          endDate={endDate}
          eventMode={eventMode}
          handleCloseFilter={hanldeCloseFilter}
          handleEndDateChange={handleEndDateChange}
          handleStartDateChange={handleStartDateChange}
          handleSwitchChange={handleSwitchChange}
          handleToggleChange={handleToggleChange}
          resetForm={resetForm}
          selectedItems={selectedItems}
          startDate={startDate}
          submitForm={submitForm}
          handleOpenFilter={hanldeOpenFilter}
          openFilter={openFilter}
        />
      </div>

      <div>
        <EventList eventList={eventList} />
      </div>
    </div>
  );
};

export default SearchPage;
