import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Ticket,
  Save,
  X,
  CalendarIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import eventApi from "../../../services/event/eventApi";
import {
  cn,
  convertHHMMtoHHMMSS,
  formatDate,
  formatDateTime,
} from "../../../lib/utils";
import { toast } from "sonner";
import { StepProps } from "./Step1_Infor";
import { Card, CardContent, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import TimeInput from "../../Input/TimeInput";

interface TicketType {
  ticketCode: string;
  ticketName: string;
  price: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  eventId: number;
}

export interface Activity {
  activityName: string;
  dateEvent: Date;
  startTimeEvent: string;
  endTimeEvent: string;
  startTicketSale: string; // yy-mm-dd hh:mm:ss
  endTicketSale: string; // yy-mm-dd hh:mm:ss
  tickets?: TicketType[];
  eventId: number; // Optional vì chỉ dùng khi in
}
const defaultTicket: TicketType = {
  ticketCode: "",
  ticketName: "",
  price: 0,
  quantity: 0,
  minQuantity: 1,
  maxQuantity: 2,
  eventId: 0,
};

const StepTwo: React.FC<StepProps> = ({
  step,
  isStepValid,
  setIsStepValid,
  updateStep,
}) => {
  const [hasSeatMap, setHasSeatMap] = useState<boolean | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState<
    number | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingHasSeatMap, setPendingHasSeatMap] = useState<boolean | null>(
    null
  );
  const [newTicket, setNewTicket] = useState<TicketType>({ ...defaultTicket });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("id"));
  const navigate = useNavigate();
  // console.log(activities);

  useEffect(() => {
    const hasValidActivity = activities.some(
      (activity) =>
        activity.activityName.trim() &&
        activity.dateEvent &&
        activity.startTimeEvent.trim() &&
        activity.endTimeEvent.trim() &&
        activity.startTicketSale.trim() &&
        activity.endTicketSale.trim() &&
        activity.eventId !== undefined
    );

    if (hasValidActivity) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
  }, [activities]);

  const handleAddActivity = () => {
    setActivities((prev) => [
      ...prev,
      {
        activityName: "",
        dateEvent: new Date(),
        startTimeEvent: "",
        endTimeEvent: "",
        startTicketSale: "",
        endTicketSale: "",
        tickets: hasSeatMap ? undefined : [],
        eventId, // ← gán tự động từ URL
      },
    ]);
  };

  const handleRemoveActivity = (index: number) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const openTicketModal = (activityIndex: number) => {
    setCurrentActivityIndex(activityIndex);
    setNewTicket({
      ticketCode: Date.now().toString(),
      ticketName: "",
      price: 0,
      quantity: 0,
      minQuantity: 1,
      maxQuantity: 2,
      eventId, // ← gán tự động từ URL
    });
    setIsTicketModalOpen(true);
  };

  const saveTicket = () => {
    if (currentActivityIndex === null) return;
    const updated = [...activities];
    updated[currentActivityIndex].tickets?.push(newTicket);
    setActivities(updated);
    setIsTicketModalOpen(false);
  };

  const handleRemoveTicket = (activityIndex: number, ticketIndex: number) => {
    const updated = [...activities];
    updated[activityIndex].tickets?.splice(ticketIndex, 1);
    setActivities(updated);
  };

  const handleSeatMapChange = (newValue: boolean) => {
    if (activities.length > 0 && newValue !== hasSeatMap) {
      setPendingHasSeatMap(newValue);
      setShowConfirmDialog(true);
    } else {
      setHasSeatMap(newValue);
      setActivities([]); // reset khi đổi loại sơ đồ
    }
  };

  const confirmSeatMapChange = () => {
    setHasSeatMap(pendingHasSeatMap);
    setActivities([]);
    setShowConfirmDialog(false);
    setPendingHasSeatMap(null);
  };

  const cancelSeatMapChange = () => {
    setShowConfirmDialog(false);
    setPendingHasSeatMap(null);
  };

  const submitActivity = async () => {
    setIsLoading(true);
    const formatActivities = activities.map((activity) => ({
      ...activity,
      dateEvent: formatDate(activity.dateEvent),
      startTicketSale: formatDateTime(activity.startTicketSale),
      endTicketSale: formatDateTime(activity.endTicketSale),
      startTimeEvent: convertHHMMtoHHMMSS(activity.startTimeEvent),
      endTimeEvent: convertHHMMtoHHMMSS(activity.endTimeEvent),
    })) as any; // Any tạm thời

    console.log(JSON.stringify(formatActivities, null, 2));
    const response = await eventApi.createEventActivity(formatActivities);
    console.log(response);
    setIsLoading(false);
    toast.success(response.data.message);
    const queryParams = new URLSearchParams({
      id: eventId.toString(),
      step: "3",
    }).toString();
    await navigate(`?${queryParams}`);
  };

  const nextStep = async () => {
    if (!isStepValid) {
      toast.warning("Bạn cần phải thêm activity");
      return;
    }
    await submitActivity();
    setIsStepValid(false); // reset cho bước sau
  };

  // const prevStep = () => {
  //   setStep((prev) => Math.max(prev - 1, 0));
  // };

  return (
    <div className="p-6 space-y-6 text-black">
      <h2 className="text-2xl font-semibold text-white">
        Sự kiện này có sơ đồ ghế không?
      </h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleSeatMapChange(true)}
          className={`px-4 py-2 rounded ${
            hasSeatMap === true ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Có
        </button>
        <button
          onClick={() => handleSeatMapChange(false)}
          className={`px-4 py-2 rounded ${
            hasSeatMap === false ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Không
        </button>
      </div>

      {hasSeatMap !== null && (
        <div className="space-y-6">
          <button
            onClick={handleAddActivity}
            className="flex items-center gap-2 bg-pse-green hover:bg-pse-green/80 text-white px-4 py-2 rounded"
          >
            <CalendarCheck size={18} /> Thêm Activity
          </button>

          {activities.map((activity, index) => (
            <Card className="px-4 py-2 bg-gradient-to-b from-black/20 to-pse-green/50 text-white">
              <CardTitle className="mb-2 ml-4 text-[20px] font-bold">
                Hoạt động {index + 1}
              </CardTitle>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Tên hoạt động */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="activityName">Tên hoạt động</Label>
                  <Input
                    className="bg-transparent"
                    id="activityName"
                    type="text"
                    value={activity.activityName || ""}
                    onChange={(e) => {
                      const updated = [...activities];
                      updated[index].activityName = e.target.value;
                      setActivities(updated);
                    }}
                  />
                </div>

                {/* 2. Ngày diễn ra */}
                <div className="flex flex-col gap-2">
                  <Label>Ngày diễn ra</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-transparent",
                          !activity.dateEvent && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activity.dateEvent
                          ? format(activity.dateEvent, "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={activity.dateEvent}
                        onSelect={(date) => {
                          const updated = [...activities];
                          updated[index].dateEvent = date!;
                          setActivities(updated);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 3. Giờ bắt đầu */}
                <TimeInput
                  className="bg-transparent"
                  label="Giờ bắt đầu"
                  id="startTimeEvent"
                  value={activity.startTimeEvent || ""}
                  onChange={(value) => {
                    const updated = [...activities];
                    updated[index].startTimeEvent = value;
                    setActivities(updated);
                  }}
                />

                {/* 4. Giờ kết thúc */}
                <TimeInput
                  className="bg-transparent"
                  label="Giờ kết thúc"
                  id="endTimeEvent"
                  value={activity.endTimeEvent || ""}
                  onChange={(value) => {
                    const updated = [...activities];
                    updated[index].endTimeEvent = value;
                    setActivities(updated);
                  }}
                />

                {/* 5. Bắt đầu bán vé */}
                <div className="flex flex-col gap-2">
                  <Label>Bắt đầu bán vé</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-transparent",
                          !activity.startTicketSale && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activity.startTicketSale
                          ? format(
                              new Date(activity.startTicketSale),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "Chọn ngày và giờ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      <Calendar
                        mode="single"
                        selected={
                          activity.startTicketSale
                            ? new Date(activity.startTicketSale)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;
                          const updated = [...activities];
                          const old = new Date(
                            activity.startTicketSale || Date.now()
                          );
                          old.setFullYear(date.getFullYear());
                          old.setMonth(date.getMonth());
                          old.setDate(date.getDate());
                          updated[index].startTicketSale = old.toISOString();
                          setActivities(updated);
                        }}
                      />
                      <Input
                        type="time"
                        value={
                          activity.startTicketSale
                            ? new Date(activity.startTicketSale)
                                .toTimeString()
                                .slice(0, 5)
                            : "00:00"
                        }
                        onChange={(e) => {
                          const [hour, minute] = e.target.value.split(":");
                          const updated = [...activities];
                          const date = new Date(
                            activity.startTicketSale || new Date()
                          );
                          date.setHours(Number(hour));
                          date.setMinutes(Number(minute));
                          updated[index].startTicketSale = date.toISOString();
                          setActivities(updated);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 6. Kết thúc bán vé */}
                <div className="flex flex-col gap-2">
                  <Label>Kết thúc bán vé</Label>
                  <Popover>
                    <PopoverTrigger className="text-white" asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-transparent",
                          !activity.endTicketSale && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activity.endTicketSale
                          ? format(
                              new Date(activity.endTicketSale),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "Chọn ngày và giờ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      <Calendar
                        mode="single"
                        selected={
                          activity.endTicketSale
                            ? new Date(activity.endTicketSale)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;
                          const updated = [...activities];
                          const old = new Date(
                            activity.endTicketSale || Date.now()
                          );
                          old.setFullYear(date.getFullYear());
                          old.setMonth(date.getMonth());
                          old.setDate(date.getDate());
                          updated[index].endTicketSale = old.toISOString();
                          setActivities(updated);
                        }}
                      />
                      <Input
                        type="time"
                        value={
                          activity.endTicketSale
                            ? new Date(activity.endTicketSale)
                                .toTimeString()
                                .slice(0, 5)
                            : "00:00"
                        }
                        onChange={(e) => {
                          const [hour, minute] = e.target.value.split(":");
                          const updated = [...activities];
                          const date = new Date(
                            activity.endTicketSale || new Date()
                          );
                          date.setHours(Number(hour));
                          date.setMinutes(Number(minute));
                          updated[index].endTicketSale = date.toISOString();
                          setActivities(updated);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
              {!hasSeatMap && (
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Ticket size={18} /> Vé
                    </h4>
                    <button
                      onClick={() => openTicketModal(index)}
                      className="text-white hover:text-white/80 flex items-center gap-1"
                    >
                      <Plus size={16} /> Thêm vé
                    </button>
                  </div>

                  {activity.tickets?.map((ticket, tIndex) => (
                    <div
                      key={tIndex}
                      className="bg-gray-50 border rounded p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{ticket.ticketName}</p>
                        <p className="text-sm text-gray-500">
                          {ticket.price.toLocaleString()} VND
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveTicket(index, tIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-4 relative">
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Ticket size={18} /> Thêm vé
            </h3>
            {[
              { label: "Tên vé", key: "ticketName" },
              { label: "Giá", key: "price", type: "number" },
              { label: "Số lượng", key: "quantity", type: "number" },
              { label: "Mua tối đa", key: "maxQuantity", type: "number" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-medium">
                  {label}
                </label>
                <input
                  type={type || "text"}
                  className="w-full border px-3 py-2 rounded text-black"
                  value={(newTicket as any)[key]}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      [key]:
                        type === "number" ? +e.target.value : e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <button
              onClick={saveTicket}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save size={18} /> Lưu vé
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
          onClick={() => updateStep(step - 1)}
          disabled={step === 1}
        >
          Quay lại
        </button>

        <button
          className="px-4 py-2 bg-pse-green-second hover:bg-pse-green-third text-white rounded disabled:opacity-50"
          onClick={nextStep}
          disabled={isLoading}
        >
          Tiếp tục
        </button>
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-semibold">Xác nhận thay đổi</h3>
            <p className="text-sm text-gray-500">
              Việc chuyển chế độ sơ đồ ghế sẽ xóa toàn bộ dữ liệu hoạt động đã
              nhập. Bạn có chắc chắn không?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelSeatMapChange}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmSeatMapChange}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepTwo;
