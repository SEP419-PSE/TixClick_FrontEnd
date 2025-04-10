import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { FaCalendar, FaFilter } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import { Switch } from "../../../../components/ui/switch";
import { Label } from "../../../../components/ui/label";
import { EventType } from "../../../../interface/EventInterface";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../../components/ui/toggle-group";
import { toast, Toaster } from "sonner";
import PriceRangeSlider from "./PriceRangeSLider";

interface EventTypeEngLishName extends EventType {
  englishName: string;
}

const eventTypes: EventTypeEngLishName[] = [
  { id: 1, name: "Nhạc sống", englishName: "Music" },
  { id: 2, name: "Thể thao", englishName: "Sport" },
  { id: 3, name: "Sân khấu & Nghệ thuật", englishName: "Theater" },
  { id: 4, name: "Khác", englishName: "Other" },
];

type Props = {
  handleOpenFilter: () => void;
  openFilter: boolean;
  handleCloseFilter: () => void;
  startDate: string;
  handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentDate: string;
  endDate: string;
  handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  eventMode: string;
  selectedItems: string[];
  handleToggleChange: (name: string) => void;
  submitForm: () => void;
  resetForm: () => void;
  maxPrice: number;
  onChangePrice: (newMaxPrice: number) => void;
  maxLimit?: number;
};

const FilterEvent = ({
  currentDate,
  endDate,
  eventMode,
  handleCloseFilter,
  handleEndDateChange,
  handleOpenFilter,
  handleStartDateChange,
  handleSwitchChange,
  handleToggleChange,
  openFilter,
  resetForm,
  selectedItems,
  startDate,
  submitForm,
  maxPrice,
  maxLimit,
  onChangePrice,
}: Props) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={handleOpenFilter}
        className="bg-pse-gray/50 focus:bg-pse-green lg:hidden"
      >
        <span>
          <FaFilter />
        </span>
        Bộ lọc
        <span>
          <FaAngleDown />
        </span>
      </Button>
      {openFilter == true && (
        <div className="fixed flex flex-col bottom-0 left-0 w-full max-w-sm h-[85%] lg:h-[100%] px-4 py-4 bg-white text-black rounded-t-lg">
          <div className="relative flex w-full mb-2 justify-center items-center font-bold">
            <p className="">Bộ lọc</p>
            <button
              onClick={handleCloseFilter}
              className="absolute right-0 lg:hidden"
            >
              <FaXmark />
            </button>
          </div>

          <div className="w-full h-[1px] bg-pse-gray/50"></div>
          <div className="flex my-4 justify-between gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-semibold">Ngày diễn ra</label>
              <input
                value={startDate}
                onChange={handleStartDateChange}
                type="date"
                className="border px-2 py-1 rounded-md"
                min={currentDate}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-semibold">Ngày kết thúc</label>
              <input
                value={endDate}
                onChange={handleEndDateChange}
                type="date"
                className="border px-2 py-1 rounded-md"
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-pse-gray/50"></div>
          <div className="flex flex-start items-center my-4 gap-2">
            <Switch
              onCheckedChange={handleSwitchChange}
              id="airplane-mode"
              checked={eventMode === "Online"}
            />
            <Label htmlFor="airplane-mode">Sự kiện online</Label>
          </div>
          <div className="w-full h-[1px] bg-pse-gray/50"></div>
          <div className="my-4">
            <div className="mb-2 flex justify-start font-semibold">
              Thể loại
            </div>
            <ToggleGroup
              className="flex flex-wrap justify-start"
              type="multiple"
              value={selectedItems} // Liên kết với mảng các giá trị được chọn
            >
              {eventTypes.map((eventType) => (
                <ToggleGroupItem
                  key={eventType.englishName}
                  className={`border p-2 rounded-full transition-colors 
              ${
                selectedItems.includes(eventType.englishName)
                  ? "text-white border-pse-black" // Được chọn
                  : "bg-transparent text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" // Chưa chọn
              }`}
                  value={eventType.englishName} // Xác định giá trị của item
                  aria-label={`Toggle ${eventType.englishName}`}
                  onClick={() => handleToggleChange(eventType.englishName)} // Cập nhật khi click
                >
                  {eventType.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="py-4">
            <PriceRangeSlider
              maxPrice={maxPrice}
              onChange={onChangePrice}
              maxLimit={2000000}
            />
          </div>
          <div className="mt-auto flex justify-between gap-4">
            <Button
              onClick={resetForm}
              className="w-full bg-pse-black text-white transition-all duration-500"
              variant={"outline"}
            >
              Thiết lập lại
            </Button>
            {/* <Button onClick={submitForm} className="w-full bg-pse-black">
              Áp dụng
            </Button> */}
          </div>
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
};

export default FilterEvent;
