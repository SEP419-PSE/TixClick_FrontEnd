import { useState } from "react";
import TicketList from "./TicketList";
import Popup from "../../../components/Popup/Popup";
import { QRCodeSVG } from "qrcode.react";
import { eventTypes } from "../../../constants/constants";
import DashDivider from "../../../components/Divider/DashDivider";
import { formatMoney } from "../../DataTranfer";
import useTicketsPurchases from "../../../hooks/useTicketPurchases";
import { TicketResponse } from "../../../interface/ticket/Ticket";
import {
  formatDateVietnamese,
  formatTimeFe,
  parseSeatCode,
} from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  CaseTicketType,
  setTicketPurchase,
} from "../../../redux/features/ticketPurchase/ticketPurchaseSlice";
import Pagination from "../../../components/Pagination/Pagination";
import { useNavigate } from "react-router";

export default function TicketManagement() {
  const navigate = useNavigate();
  const {
    ticketPurchases,
    loading,
    pagination: { currentPage, totalPages, totalElements, pageSize },
    setPage,
  } = useTicketsPurchases();

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse>();
  const ticketPurchase = useAppSelector((state) => state.ticketPurchase);
  const dispatch = useAppDispatch();

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleSelectedTicket = (ticket: TicketResponse) => {
    setSelectedTicket(ticket);
    handleOpenPopup();
  };

  const saveTicketPurchaseId = (ticket: TicketResponse | undefined) => {
    let urlNavigate = "";
    if (!ticket) {
      throw new Error("Don't have any ticket");
    } else {
      let payloadCaseTicket: CaseTicketType = null;

      if (ticket.ishaveSeatmap == false) {
        payloadCaseTicket = "noSeatMap";
        urlNavigate = `/event-detail/${ticket.eventId}/booking-ticket-no-seatmap?eventId=${ticket.eventId}&eventActivityId=${ticket.eventActivityId}`;
      }
      if (ticket.ishaveSeatmap && ticket.seatCode != null) {
        payloadCaseTicket = "changeSeat";
        urlNavigate = `/event-detail/${ticket.eventId}/booking-ticket?eventId=${ticket.eventId}&eventActivityId=${ticket.eventActivityId}`;
      } else if (ticket.ishaveSeatmap && ticket.seatCode == null) {
        payloadCaseTicket = "changeZone";
        urlNavigate = `/event-detail/${ticket.eventId}/booking-ticket?eventId=${ticket.eventId}&eventActivityId=${ticket.eventActivityId}`;
      }

      dispatch(
        setTicketPurchase({
          ticketPurchaseId: ticket.ticketPurchaseId,
          quantity: ticket.quantity,
          caseTicket: payloadCaseTicket,
        })
      );
      navigate(urlNavigate, {
        state: {
          changeTicket: true,
        },
      });
    }
    // Navigate to select change
  };
  console.log(ticketPurchase);
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col p-6 bg-[#1e1e1e]">
      <div className="border-b border-gray-800">
        <nav className="text-sm text-gray-400 mb-2">
          <span className="hover:text-white">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-white">Vé đã mua</span>
        </nav>
      </div>
      <h1 className="text-xl mt-4 font-semibold">Vé đã mua </h1>
      <section className="mt-auto">
        <TicketList
          ticketList={ticketPurchases}
          clickOpenPopup={handleOpenPopup}
          onClickSelectTicket={handleSelectedTicket}
          loading={loading}
        />
      </section>
      <section className="mt-auto">
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </section>

      <Popup
        className="w-auto max-w-sm p-4"
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
      >
        <div className="overflow-x-hidden text-black">
          <div className="flex flex-col justify-center items-center">
            <img
              src={selectedTicket?.banner}
              alt=""
              className="w-40 h-20 rounded-md"
            />
            <div className="font-semibold mt-1 text-black text-xl text-center break-words">
              {selectedTicket?.eventName}
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-pse-gray font-medium">
                {selectedTicket?.ticketType}
              </span>
              <p
                style={{
                  backgroundColor: eventTypes.find(
                    (x) => x.id == selectedTicket?.eventCategoryId
                  )?.color,
                }}
                className="text-white text-xs text-center font-medium rounded-md w-fit px-2 py-1"
              >
                {
                  eventTypes.find(
                    (x) => x.id == selectedTicket?.eventCategoryId
                  )?.vietnamName
                }
              </p>
            </div>
          </div>
          <DashDivider />
          <div className="space-y-2">
            <p className="break-words">
              <span className="text-pse-green font-semibold">
                {selectedTicket?.locationName}
              </span>{" "}
              {"- "}
              {selectedTicket?.location}
            </p>
            <p className="w-full truncate">
              Giờ bắt đầu: {formatTimeFe(selectedTicket?.eventStartTime)} {"-"}
              <span className="font-semibold">
                {formatDateVietnamese(selectedTicket?.eventDate.toString())}
              </span>
            </p>
          </div>
        {/* ) : ( */}
          {/* <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6">
              <img src={NoEvent || "/placeholder.svg"} alt="No tickets" className="w-full h-full object-contain" />
            </div>
            <p className="text-gray-400 mb-6">Không có vé nào</p>
            <Button className="bg-pse-green hover:bg-[#00B14F]/90">Mua vé ngay</Button>
          </div> */}
        {/* )} */}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTicket && (
          <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Chi tiết vé</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{selectedTicket.eventName}</h3>
                  {/* <StatusIndicator status={selectedTicket.status} /> */}
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Ngày</p>
                      <p>{new Date(selectedTicket.eventDate).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <LocateFixed className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Khu vực</p>
                      <p>{selectedTicket.zoneName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Armchair className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Mã ghế</p>
                      <p>{selectedTicket.seatCode}</p>
                    </div>
                  </div>


                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Giờ</p>
                      <p>{selectedTicket.eventStartTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Địa điểm</p>
                      <p>{selectedTicket.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Giá vé</p>
                      <p>{selectedTicket.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-[#ff8a00]" />
                    <div>
                      <p className="text-gray-400 text-sm">Loại vé</p>
                      <p>{selectedTicket.ticketType}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                Khu vực {"- "}
                <span className="font-bold">
                  {selectedTicket.zoneName}
                </span>{" "}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <QRCodeSVG
              value={selectedTicket?.qrCode as string}
              size={140}
              bgColor={"#FFFFFF"}
              level={"M"}
            />
          </div>
          <DashDivider />
          <section className="flex justify-between text-black">
            <div>
              <h1 className="text-left">Mã vé</h1>
              <p className="text-left font-bold">
                {selectedTicket?.ticketPurchaseId}
              </p>
            </div>
            <div>
              <h1 className="text-center">Số lượng</h1>
              <p className="text-center font-bold">
                {selectedTicket?.quantity}
              </p>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" className="border-gray-700 text-black hover:bg-gray-400">
                Hủy vé
              </Button>
              <Button className="bg-pse-green hover:bg-[#00B14F]/90">Tải vé</Button>
            </div>
          </section>
          <DashDivider />
          <Button onClick={() => saveTicketPurchaseId(selectedTicket)}>
            Đổi vé
          </Button>
        </div>
      </Popup>
    </div>
  )
}