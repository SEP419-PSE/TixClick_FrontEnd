import { useState } from "react";
import TicketList from "./TicketList";
import Popup from "../../../components/Popup/Popup";
import { QRCodeSVG } from "qrcode.react";
import { eventTypes } from "../../../constants/constants";
import DashDivider from "../../../components/Divider/DashDivider";
import { formatMoney } from "../../DataTranfer";
import useTicketsPurchases from "../../../hooks/useTicketPurchases";
import { SortType, TicketResponse } from "../../../interface/ticket/Ticket";
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
import TicketFilter from "./TicketFilter";

export default function TicketManagement() {
  const navigate = useNavigate();
  const {
    ticketPurchases,
    loading,
    pagination: { currentPage, totalPages, totalElements, pageSize },
    setPage,
    sort,
    setSort,
  } = useTicketsPurchases();

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse>();
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
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col p-6 bg-[#1e1e1e]">
      <div className="border-b border-gray-800">
        <nav className="text-sm text-gray-400 mb-2">
          <span className="hover:text-white">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-white">Vé đã mua</span>
        </nav>
      </div>
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-xl font-semibold">Vé đã mua </h1>
        <TicketFilter
          sort={sort}
          setSort={(e: string) => setSort(e as SortType)}
        />
      </div>
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
          <DashDivider />
          {selectedTicket?.ishaveSeatmap && (
            <div>
              <div>
                Ghế {"- "}
                <span className="font-bold">
                  {parseSeatCode(selectedTicket?.seatCode)}
                </span>{" "}
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
            <div>
              <h1 className="text-right">Giá</h1>
              <p className="text-right font-bold">
                {formatMoney(selectedTicket?.price)}
              </p>
            </div>
          </section>
          <DashDivider />
          <Button onClick={() => saveTicketPurchaseId(selectedTicket)}>
            Đổi vé
          </Button>
        </div>
      </Popup>
    </div>
  );
}
