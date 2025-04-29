// import { Search } from "lucide-react";
// import { useSearchParams } from "react-router";
// import { Input } from "../../components/ui/input";
// import { EventDetailResponse } from "../../interface/EventInterface";
// import { Button } from "../../components/ui/button";
// import EventList from "./components/Search/EventList";
// import { FormEvent, useEffect, useState } from "react";
// import eventApi from "../../services/eventApi";
// import FilterEvent from "./components/Search/FilterEvent";
// import { toast } from "sonner";

// const SearchPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const eventName = searchParams.get("event-name") || "";
//   const [eventList, setEventList] = useState<EventDetailResponse[]>([]);
//   const [eventMode, setEventMode] = useState<string>("");
//   const [openFilter, setOpenFilter] = useState<boolean>(false);
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [maxPrice, setMaxPrice] = useState(100000);
//   const currentDate = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     const handleResize = () => {
//       setOpenFilter(window.innerWidth > 1024);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     console.log("Call lại list");
//     const params: any = {
//       eventName: searchParams.get("event-name") || undefined,
//       startDate: searchParams.get("startDate") || undefined,
//       endDate: searchParams.get("endDate") || undefined,
//       eventType: searchParams.get("eventMode") || undefined,
//       eventCategory:
//         searchParams.get("types")?.split(",").filter(Boolean) || undefined,
//       maxPrice: searchParams.get("maxPrice")
//         ? Number(searchParams.get("maxPrice"))
//         : undefined,
//     };

//     eventApi.search(params).then((response) => {
//       console.log(response);
//       setEventList(response.data.result || []);
//     });
//   }, [searchParams, eventName]);

//   useEffect(() => {
//     setStartDate(searchParams.get("startDate") || "");
//     setEndDate(searchParams.get("endDate") || "");
//     setEventMode(searchParams.get("eventMode") || "");
//     setSelectedItems(
//       searchParams.get("types")?.split(",").filter(Boolean) || []
//     );
//     setMaxPrice(
//       searchParams.get("maxPrice")
//         ? Number(searchParams.get("maxPrice"))
//         : 100000
//     );
//   }, [searchParams]);

//   const updateSearchParam = (key: string, value?: string) => {
//     const params = new URLSearchParams(searchParams);
//     if (value) params.set(key, value);
//     else params.delete(key);
//     setSearchParams(params);
//   };

//   const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = e.target.value;
//     if (selected < currentDate) {
//       toast.warning("Ngày bắt đầu không được nhỏ hơn ngày hiện tại");
//     } else if (endDate && selected >= endDate) {
//       toast.warning("Ngày kết thúc phải lớn hơn ngày bắt đầu");
//     } else {
//       setStartDate(selected);
//       updateSearchParam("startDate", selected);
//     }
//   };

//   const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = e.target.value;
//     if (startDate && selected <= startDate) {
//       toast.warning("Ngày kết thúc phải lớn hơn ngày bắt đầu");
//     } else {
//       setEndDate(selected);
//       updateSearchParam("endDate", selected);
//     }
//   };

//   const handleToggleChange = (value: string) => {
//     const updated = selectedItems.includes(value)
//       ? selectedItems.filter((item) => item !== value)
//       : [...selectedItems, value];
//     setSelectedItems(updated);
//     updateSearchParam("types", updated.join(","));
//   };

//   const handleSwitchChange = (checked: boolean) => {
//     const value = checked ? "Online" : "Offline";
//     setEventMode(value);
//     updateSearchParam("eventMode", value);
//   };

//   const handleOpenFilter = () => setOpenFilter(true);
//   const handleCloseFilter = () => setOpenFilter(false);

//   const resetForm = () => {
//     setStartDate("");
//     setEndDate("");
//     setEventMode("");
//     setSelectedItems([]);
//     setMaxPrice(100000);

//     const params = new URLSearchParams(searchParams);
//     params.delete("startDate");
//     params.delete("endDate");
//     params.delete("eventMode");
//     params.delete("types");
//     params.delete("maxPrice");
//     setSearchParams(params);
//   };

//   const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     console.log(formData.get("event-name"));
//     const searchValue = formData.get("event-name")?.toString().trim() || "";
//     updateSearchParam("event-name", searchValue || undefined);
//   };

//   const submitForm = () => {
//     updateSearchParam("startDate", startDate || undefined);
//     updateSearchParam("endDate", endDate || undefined);
//     updateSearchParam("eventMode", eventMode || undefined);
//     updateSearchParam("types", selectedItems.join(",") || undefined);
//     updateSearchParam("maxPrice", maxPrice.toString() || undefined);
//   };

//   return (
//     <div className="bg-pse-black pl-[400px] px-4 py-4">
//       <form onSubmit={onSubmitSearch} className="mb-6 flex justify-center">
//         <div className="flex w-full max-w-xl items-center gap-2">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               name="event-name"
//               type="text"
//               defaultValue={eventName}
//               placeholder="Tìm kiếm sự kiện..."
//               className="pl-10 text-black"
//             />
//           </div>
//           <Button
//             type="submit"
//             variant="default"
//             className="bg-white text-black hover:bg-opacity-80"
//           >
//             Tìm kiếm
//           </Button>
//         </div>
//       </form>
//       <EventList eventList={eventList} />

//       <FilterEvent
//         currentDate={currentDate}
//         endDate={endDate}
//         eventMode={eventMode}
//         handleCloseFilter={handleCloseFilter}
//         handleEndDateChange={handleEndDateChange}
//         handleStartDateChange={handleStartDateChange}
//         handleSwitchChange={handleSwitchChange}
//         handleToggleChange={handleToggleChange}
//         resetForm={resetForm}
//         selectedItems={selectedItems}
//         startDate={startDate}
//         submitForm={submitForm}
//         handleOpenFilter={handleOpenFilter}
//         openFilter={openFilter}
//         maxPrice={maxPrice}
//         onChangePrice={(price) => {
//           setMaxPrice(price);
//           updateSearchParam("maxPrice", price.toString());
//         }}
//         maxLimit={2000000}
//       />
//     </div>
//   );
// };

// export default SearchPage;

const SearchPage = () => {
  return <div className="min-h-screen mt-[70px] p-4">SearchPage</div>;
};

export default SearchPage;
