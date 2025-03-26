// File: StepTwo.tsx
import { useState } from "react";
import { DateRange, Range } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

type StepTwoProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
};

type TicketType = {
  ticketName: string;
  quantity: number;
  createdDate: string;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  eventId: number;
  status: boolean;
  textColor: string;
  seatBackgroundColor: string;
};

type DateRangeWithTickets = {
  range: Range;
  tickets: TicketType[];
};

export default function StepTwo({ setStep, setIsStepValid }: StepTwoProps) {
  const [currentRange, setCurrentRange] = useState<Range>({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });

  const [dateRanges, setDateRanges] = useState<DateRangeWithTickets[]>([]);
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState<number | "">("");
  const [ticketQuantity, setTicketQuantity] = useState<number | "">("");
  const [minQuantity, setMinQuantity] = useState<number | "">("");
  const [maxQuantity, setMaxQuantity] = useState<number | "">("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [seatBackgroundColor, setSeatBackgroundColor] = useState("#4ade80");

  const [currentTickets, setCurrentTickets] = useState<TicketType[]>([]);

  const isDateRangeOverlapping = (
    newRange: Range,
    existingRanges: DateRangeWithTickets[]
  ) => {
    return existingRanges.some(({ range }) => {
      if (
        !range.startDate ||
        !range.endDate ||
        !newRange.startDate ||
        !newRange.endDate
      )
        return false;

      const newStart = newRange.startDate.getTime();
      const newEnd = newRange.endDate.getTime();
      const existingStart = range.startDate.getTime();
      const existingEnd = range.endDate.getTime();

      // Kiểm tra xem có giao nhau không
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  };

  const handleAddDateRange = () => {
    // Nếu khoảng ngày mới, copy vé từ khoảng ngày trước đó
    if (dateRanges.length > 0 && currentTickets.length === 0) {
      const lastTickets = dateRanges[dateRanges.length - 1].tickets;
      setCurrentTickets([...lastTickets]);
    }
    if (isDateRangeOverlapping(currentRange, dateRanges)) {
      toast.error("Khoảng ngày này bị trùng hoặc giao với khoảng đã thêm!", {
        position: "top-center",
      });
      return;
    }

    // Thêm khoảng ngày mới với các vé hiện tại (đã copy từ trước nếu có)
    setDateRanges((prev) => [
      ...prev,
      {
        range: currentRange,
        tickets: [...currentTickets],
      },
    ]);

    setIsStepValid(true);
  };

  const handleDeleteDateRange = (index: number) => {
    setDateRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTicket = () => {
    if (
      !ticketName ||
      ticketPrice === "" ||
      ticketPrice <= 0 ||
      ticketQuantity === "" ||
      ticketQuantity <= 0 ||
      minQuantity === "" ||
      maxQuantity === "" ||
      minQuantity < 0 ||
      maxQuantity < 0 ||
      minQuantity > maxQuantity
    )
      return;

    const ticket: TicketType = {
      ticketName,
      quantity: Number(ticketQuantity),
      createdDate: new Date().toISOString(),
      price: Number(ticketPrice),
      minQuantity: Number(minQuantity),
      maxQuantity: Number(maxQuantity),
      eventId: 0, // sẽ cập nhật khi gửi về server
      status: true,
      textColor,
      seatBackgroundColor,
    };

    // Thêm vào vé hiện tại
    setCurrentTickets((prev) => [...prev, ticket]);

    // Cập nhật tất cả các khoảng ngày trước đó để thêm vé này vào
    setDateRanges((prev) =>
      prev.map((rangeItem) => ({
        ...rangeItem,
        tickets: [...rangeItem.tickets, ticket],
      }))
    );

    // Reset form vé
    setTicketName("");
    setTicketPrice("");
    setTicketQuantity("");
    setMinQuantity("");
    setMaxQuantity("");
    setTextColor("#FFFFFF");
    setSeatBackgroundColor("#4ade80");
  };

  return (
    <div className="text-white space-y-6">
      <p className="text-xl font-semibold">
        Chọn các khoảng ngày diễn ra sự kiện
      </p>

      <div className="flex flex-col md:flex-row md:gap-8">
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setCurrentRange(item.selection)}
          moveRangeOnFirstSelection={false}
          ranges={[currentRange]}
        />

        <div className="flex-1 mt-4 md:mt-0">
          <p className="font-semibold mb-2">Thêm loại vé cho khoảng ngày này</p>
          <div className="space-y-2">
            <div>
              <label className="block text-sm">Tên vé</label>
              <input
                type="text"
                placeholder="VD: Vé VIP"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div>
              <label className="block text-sm">Giá vé (VNĐ)</label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm">Số lượng vé</label>
              <input
                type="number"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                min={0}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm">Số lượng tối thiểu</label>
                <input
                  type="number"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                  min={0}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm">Số lượng tối đa</label>
                <input
                  type="number"
                  value={maxQuantity}
                  onChange={(e) => setMaxQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                  min={0}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm">Màu chữ trên vé</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm">Màu nền ghế</label>
                <input
                  type="color"
                  value={seatBackgroundColor}
                  onChange={(e) => setSeatBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              {/* Preview ghế kiểu rạp phim */}
              <div className="mt-5">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center border border-white/30 text-sm font-semibold"
                  style={{
                    backgroundColor: seatBackgroundColor,
                    color: textColor,
                  }}
                >
                  A1
                </div>
              </div>
              ``
            </div>

            <button
              onClick={handleAddTicket}
              className="px-4 py-2 bg-pse-green-second hover:bg-pse-green-third rounded mt-2"
            >
              Thêm loại vé
            </button>

            <div className="mt-3 space-y-1">
              {currentTickets.map((ticket, idx) => (
                <div key={idx} className="text-sm">
                  • {ticket.ticketName} - {ticket.price} VNĐ - {ticket.quantity}{" "}
                  vé
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddDateRange}
            disabled={currentTickets.length === 0}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
          >
            Xác nhận khoảng ngày và vé
          </button>
        </div>
      </div>

      <div>
        <p className="font-semibold mt-6">Danh sách các khoảng ngày đã thêm:</p>
        {dateRanges.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-pse-black-light rounded mt-2 border border-white/10 relative"
          >
            <button
              onClick={() => handleDeleteDateRange(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Xóa khoảng ngày này"
            >
              🗑️
            </button>
            <p className="flex items-center gap-2">
              <Calendar size={20} />{" "}
              {item.range.startDate?.toLocaleDateString()} -{" "}
              {item.range.endDate?.toLocaleDateString()}
            </p>
            <ul className="ml-4 list-disc mt-2">
              {item.tickets.map((t, i) => (
                <li key={i}>
                  {t.ticketName} - {t.price} VNĐ - {t.quantity} vé (min:{" "}
                  {t.minQuantity}, max: {t.maxQuantity})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
