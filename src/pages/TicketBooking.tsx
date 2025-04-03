import { Calendar, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useNavigate, useSearchParams } from "react-router";
import CustomDivider from "../components/Divider/CustomDivider";
import Header from "../components/Header/Header";
import { Button } from "../components/ui/button";
import { formatMoney } from "../lib/utils";
import seatmapApi from "../services/seatmapApi";
import ticketApi from "../services/ticketApi";

type SeatStatus = "available" | "disabled"
type ToolType = "select" | "add" | "remove" | "edit" | "move" | "addSeatType"
type ViewMode = "edit" | "preview"
export type SectionType = "SEATED" | "STANDING"

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export type SeatTypeEdit = {
  id: string
  name: string
  color: string
  textColor: string
  price: number
  minQuantity?: number
  maxQuantity?: number
  eventId?: number
  ticketId: number
}

export interface ISeat {
  seatId: number
  zoneActivityId?: number
  id: string
  row: number
  column: number
  // status: SeatStatus;
  price: number
  seatTypeId: string
  x?: number
  y?: number
}

export interface ISection {
  id: string
  name: string
  rows: number
  columns: number
  seats: ISeat[]
  x: number
  y: number
  width: number
  height: number
  type: SectionType
  priceId?: string
  price?: number // Price for standing sections
  capacity?: number // Capacity for standing sections
  isSave: boolean
  zoneActivityId?: number // Added to ensure we can access this property
}

interface DraggableSectionProps {
  section: ISection
  seatTypes: SeatTypeEdit[]
  getSeatColor: (seat: ISeat) => string
  onSeatClick: (seat: ISeat, sectionName: string) => void
}

const DraggableSection: React.FC<DraggableSectionProps> = ({ section, seatTypes, getSeatColor, onSeatClick }) => {
  const [hoveredSeat, setHoveredSeat] = useState<ISeat | null>(null)

  const handleSeatClick = (seat: ISeat) => {
    onSeatClick(seat, section.name)
  }

  return (
    <Draggable position={{ x: section.x, y: section.y }} disabled={true} bounds="parent">
      <div
        className={`absolute w-auto h-auto p-4 overflow-visible `}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="text-center text-gray-800 font-semibold mb-3">
          {section.name}
          {section.type == "STANDING" && (
            <div className="text-sm text-gray-600 mt-1">Khu vực đứng - {formatCurrency(section.price || 0)}</div>
          )}
        </div>
        {section.type == "STANDING" ? (
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg flex flex-col items-center justify-center text-gray-700 font-medium relative overflow-hidden"
            style={{
              width: section.width - 32,
              height: section.height - 32,
              minWidth: "180px",
              minHeight: "80px",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #6b7280 0, #6b7280 1px, transparent 0, transparent 50%)`,
                  backgroundSize: "10px 10px",
                }}
              />
            </div>
            <div className="flex flex-col items-center relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-3 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-500">Số lượng: {section.capacity || 0} vé</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg">
            {Array.from({ length: section.rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex text-gray-700 gap-2.5 mb-2.5">
                <div
                  style={{
                    width: `30px`,
                    textAlign: "center",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                  }}
                  className="bg-gray-700 bg-opacity-20 rounded-md"
                >
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                {Array.from({ length: section.columns }).map((_, colIndex) => {
                  const seat = section.seats.find((s) => s.row == rowIndex && s.column == colIndex)

                  if (!seat)
                    return (
                      <div
                        key={colIndex}
                        style={{
                          width: `30px`,
                          height: `30px`,
                          marginRight: "5px",
                        }}
                      ></div>
                    )
                  const seatColor = getSeatColor(seat)
                  return (
                    <div
                      key={colIndex}
                      className="flex items-center justify-center rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                      style={{
                        width: `30px`,
                        height: `30px`,
                        fontSize: `14px`,
                        backgroundColor: seatColor,
                        color: seatTypes.find((type) => type.id == seat.seatTypeId)?.textColor || "#000000",
                        marginRight: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSeatClick(seat)
                      }}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      {String.fromCharCode(65 + rowIndex)}
                      {colIndex + 1}

                      {hoveredSeat && hoveredSeat.id == seat.id && (
                        <div
                          className="absolute z-20 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap shadow-lg"
                          style={{
                            bottom: rowIndex == 0 ? "auto" : "100%",
                            top: rowIndex == 0 ? "100%" : "auto",
                            left: "50%",
                            transform: "translateX(-50%)",
                            marginBottom: rowIndex == 0 ? "0" : "2px",
                            marginTop: rowIndex == 0 ? "2px" : "0",
                          }}
                        >
                          <div className="mb-1">Hàng: {String.fromCharCode(65 + rowIndex)}</div>
                          <div className="mb-1">Ghế: {colIndex + 1}</div>
                          <div className="mb-1">
                            Loại ghế: {seatTypes.find((type) => type.id == seat.seatTypeId)?.name || "Chưa xác định"}
                          </div>
                          <div className="mb-1">
                            Giá: {formatMoney(seatTypes.find((type) => type.id == seat.seatTypeId)?.price)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </Draggable>
  )
}

export interface SelectedSeatInfo extends ISeat {
  sectionName: string
  typeName: string
  formattedPrice: string
  seatLabel: string
  ticketId?: number // Added to store the ticket ID
  zoneId?: number // Added to store the zone ID
}

const TicketBooking = () => {
  const [searchParms] = useSearchParams()
  const eventId = searchParms.get("eventId")
  const eventActivityId = searchParms.get("eventActivityId")
  const [sections, setSections] = useState<ISection[]>([])
  const [seatTypes, setSeatTypes] = useState<SeatTypeEdit[]>([])
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatInfo[]>([])
  const navigate = useNavigate()

  console.log("Sections:", sections)

  useEffect(() => {
    const fetchSeatmap = async () => {
      try {
        const response = await seatmapApi.getSeatmapConsumer(Number(eventId), Number(eventActivityId))
        if (response.data.result.length != 0) {
          setSections(response.data.result)
        }
        const ticketResponse = await ticketApi.getTicketsByEventId(Number(eventId))
        console.log("ticket:", ticketResponse.data.result)
        if (ticketResponse.data.result.length != 0) {
          setSeatTypes(ticketResponse.data.result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSeatmap()
  }, [eventId, eventActivityId])

  // Function to get the seat color based on selection status
  const getSeatColor = (seat: ISeat): string => {
    // Check if seat is selected to highlight it
    const isSelected = selectedSeats.some((s) => s.id === seat.id)
    if (isSelected) {
      return "#059669" // Highlight selected seat with a green color
    }

    const seatType = seatTypes.find((type) => type.id == seat.seatTypeId)
    return seatType ? seatType.color : "#6b7280" // Use actual color from seat type or gray-500 as default
  }

  // Handle seat click
  const handleSeatClick = (seat: ISeat, sectionName: string) => {
    // Find seat type info
    const seatType = seatTypes.find((type) => type.id === seat.seatTypeId)

    // Find the corresponding ticket by matching seatTypeId with ticket id in the seatTypes array
    // In this case, the seatTypeId is the same as the ticket id
    const ticket = seatTypes.find((type) => type.id === seat.seatTypeId);
    const ticketId = ticket ? ticket.ticketId : undefined;
    console.log("ticketId:", ticketId)
    localStorage.setItem("ticketId", JSON.stringify(ticket?.ticketId));


    // Get zoneId from the section or from the seat if available
    const section = sections.find((s) => s.name === sectionName)
    const zoneId = seat.zoneActivityId || section?.zoneActivityId || Number.parseInt(section?.id || "0")

    console.log("Found section:", section)
    console.log("Zone ID:", zoneId)
    console.log("Ticket ID:", ticketId)

    // Create rich seat info object
    const seatInfo: SelectedSeatInfo = {
      ...seat,
      sectionName,
      typeName: seatType?.name || "Unknown Type",
      formattedPrice: formatCurrency(seatType?.price || 0),
      seatLabel: `${String.fromCharCode(65 + seat.row)}${seat.column + 1}`,
      ticketId: ticketId, // Add the ticketId to the seat info
      zoneId: zoneId, // Add the zoneId to the seat info
    }
    

    // Check if seat is already selected
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId)
    const seatId = seat.seatId
    localStorage.setItem("seatId", JSON.stringify(seat.seatId));


    console.log("seat ID:",seatId)

    if (isSelected) {
      // Remove the seat if already selected
      setSelectedSeats((prev) => prev.filter((s) => s.seatId !== seat.seatId))
      console.log("Unselected seat:", seatInfo)
    } else {
      // Add the seat if not already selected
      setSelectedSeats((prev) => [...prev, seatInfo])
      console.log("Selected seat:", seatInfo)
    }

    // Log the full seat info for debugging
    console.log("Seat details:", {
      id: seat.id,
      row: seat.row,
      column: seat.column,
      rowLabel: String.fromCharCode(65 + seat.row),
      seatLabel: String.fromCharCode(65 + seat.row) + (seat.column + 1),
      section: sectionName,
      seatType: seatType?.name,
      price: seatType?.price,
      formattedPrice: formatCurrency(seatType?.price || 0),
      ticketId: ticketId, // Log the ticketId
      zoneId: zoneId, // Log the zoneId
    })
  }

  // Tính tổng tiền từ các ghế đã chọn
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const seatType = seatTypes.find((type) => type.id === seat.seatTypeId)
      return total + (seatType?.price || 0)
    }, 0)
  }


  const storedSeatId = localStorage.getItem("seatId")
  ? JSON.parse(localStorage.getItem("seatId")!)
  : undefined;
  
  // Hàm xử lý việc chuyển đến trang thanh toán
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return

    // Prepare ticket purchase requests
    const ticketPurchaseRequests = selectedSeats.map((seat) => ({
      zoneId: seat.zoneId || 0,
      seatId: storedSeatId, // Use seatId property if available, otherwise use id
      eventActivityId: Number(eventActivityId),
      ticketId: seat.ticketId, // Use the ticketId we added to the seat info
      eventId: Number(eventId),
      quantity: 1,
    }))

    console.log("Ticket purchase requests:", ticketPurchaseRequests)

    // Store data for payment page
    localStorage.setItem(
      "selectedSeats",
      JSON.stringify({
        seats: selectedSeats,
        totalAmount: calculateTotal(),
        eventInfo: {
          id: eventId,
          activityId: eventActivityId,
          name: "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!",
          location: "Nhà Hát Kịch IDECAF",
          date: "19:30, 12 tháng 4, 2025",
        },
        apiResponses: {
          ticket: seatTypes, // Store the ticket types for reference
          seats: selectedSeats, // Store the selected seats with all details
          purchase: {
            ticketPurchaseRequests, // Store the prepared purchase requests
          },
        },
      }),
    )

    // Chuyển đến trang thanh toán
    navigate("/payment")
  }

  return (
    <div className="h-screen w-full text-black">
      <Header />
      <div className="flex gap-6">
        <div className="relative mt-[70px] flex justify-left">
          <div
            id="mapContainer"
            className="relative w-[1200px] h-[800px] bg-gray-100 border border-gray-300 rounded overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 p-5 bg-gray-800 text-white text-center">STAGE</div>

            {sections?.map((section) => (
              <DraggableSection
                key={section.id}
                section={section}
                seatTypes={seatTypes}
                getSeatColor={getSeatColor}
                onSeatClick={(seat, sectionName) => handleSeatClick(seat, sectionName)}
              />
            ))}
          </div>
        </div>
        <div className="fixed flex flex-col top-0 right-0 h-full w-80 pt-[70px] bg-white p-6 shadow-md border border-gray-200">
          <div className="my-4 space-y-4">
            <div className="text-[18px] font-semibold">Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!</div>
            <div className="flex items-center gap-1 font-medium">
              <span>
                <Calendar size={20} fill="white" className="text-pse-green-second" />
              </span>
              19:30, 12 tháng 4, 2025
            </div>
            <div className="flex items-center gap-1">
              <span>
                <MapPin size={20} fill="white" className="text-pse-green-second" />
              </span>
              Nhà Hát Kịch IDECAF
            </div>
          </div>
          <CustomDivider />

          <div className="space-y-3">
            <h3 className="text-black font-semibold mb-4">Chú thích loại ghế</h3>
            {/* Map mảng ticketType ở đây */}
            {seatTypes.map((seatType) => (
              <div
                key={seatType.id}
                className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
              >
                <div className="w-8 h-8 rounded-lg shadow-md mr-3" style={{ backgroundColor: seatType.color }}></div>
                <div>
                  <div className="font-medium text-gray-900">{seatType.name}</div>
                  <div className="text-sm text-gray-600">{formatCurrency(seatType.price)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Ghế đã chọn:</h3>
            {selectedSeats.length > 0 ? (
              <div className="space-y-2">
                {selectedSeats.map((seat) => (
                  <div key={seat.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {seat.sectionName} - {seat.seatLabel}
                      </div>
                      <div className="text-sm font-semibold text-gray-700">{seat.formattedPrice}</div>
                    </div>
                    <div className="text-sm text-gray-600">{seat.typeName}</div>
                  </div>
                ))}
                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                  <div>Tổng tiền:</div>
                  <div>{formatCurrency(calculateTotal())}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa chọn ghế nào.</p>
            )}
          </div>

          <div className="mt-auto bg-pse-black-light text-white -mx-[26px] -my-[26px] p-4 pb-4">
            <div className="mb-2 flex items-center text-xs gap-1">
              <Ticket fill="white" className="text-pse-black-light" />
              {selectedSeats.length > 0 ? selectedSeats.map((seat) => seat.seatLabel).join(", ") : "Chưa chọn ghế"}
            </div>

            <Button
              className="w-full bg-white text-black"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToPayment}
            >
              {selectedSeats.length > 0 ? "Tiếp tục" : "Vui lòng chọn vé"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketBooking