import { ChangeEvent, useEffect, useState } from "react";

import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useAllCompany from "../../../hooks/useAllCompany";
import { Company } from "../../../interface/company/Company";
import {
  EventDetailResponse,
  EventType,
} from "../../../interface/EventInterface";
import eventApi from "../../../services/eventApi";
import LoadingFullScreen from "../../Loading/LoadingFullScreen";
import ImageUpload from "../ImageUpload";
import TextInput from "../InputText";
import SelectTypeEvent from "../SelectTypeEvent";
import TextEditor from "../TextEditor";

const eventTypes: EventType[] = [
  { id: 1, name: "Music" },
  { id: 2, name: "Sport" },
  { id: 3, name: "Theater" },
  { id: 4, name: "Other" },
];

export type StepProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isStepValid: boolean;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  updateStep: (newStep: number) => void;
  eventId: number;
  event: EventDetailResponse | undefined;
};

export default function StepOne({
  step,
  isStepValid,
  setIsStepValid,
  updateStep,
  eventId,
  event,
}: StepProps) {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [background, setBackGround] = useState<File | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackGroundUrl] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [address, setAddress] = useState("");
  const [typeEvent, setTypeEvent] = useState("");
  const [typeEventid, setTypeEventId] = useState<number | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [eventMode, setEventMode] = useState<string>("OFFLINE");
  const [joinUrl, setJoinUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const companies: Company | undefined = useAllCompany();

  // const handleSelectCompany = (companyId: number) => {
  //   setSelectedCompanyId(companyId);
  // };

  // Auto validate khi người dùng nhập dữ liệu

  useEffect(() => {
    if (event != undefined) {
      setLogoImageUrl(event.logoURL);
      setBackGroundUrl(event.bannerURL);
      setEventName(event.eventName);
      setLocationEvent(event.locationName);
      setAddress(event.location);
      setTypeEvent(event.eventCategoryId.toString());
      setTypeEventId(event.eventCategoryId);
      setEditorContent(event.description);
      setEventMode(event.typeEvent);
    }
  }, [event]);

  useEffect(() => {
    const isValid =
      editorContent.trim() !== "<p><br></p>" &&
      eventName.trim() !== "" &&
      locationEvent.trim() !== "" &&
      address.trim() !== "" &&
      typeEvent !== "" &&
      (logoImage !== null || logoImageUrl !== null) &&
      (background !== null || backgroundUrl !== null);

    setIsStepValid(isValid);
  }, [
    editorContent,
    eventName,
    locationEvent,
    address,
    typeEvent,
    logoImage,
    background,
    setIsStepValid,
    logoImageUrl,
    backgroundUrl,
  ]);

  const submitInfo = async () => {
    if (
      editorContent.trim() == "<p><br></p>" ||
      eventName.trim() == "" ||
      locationEvent.trim() == "" ||
      address.trim() == "" ||
      typeEvent == "" ||
      (logoImage == null && logoImageUrl == null) ||
      (background == null && backgroundUrl == null)
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin", {
        position: "top-center",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      if (eventId) formData.append("eventId", eventId.toString());
      formData.append("eventName", eventName);
      formData.append("location", address);
      formData.append("locationName", locationEvent);
      formData.append("categoryId", typeEvent);
      formData.append("description", editorContent);
      formData.append("typeEvent", eventMode);
      formData.append("urlOnline", joinUrl);
      if (companies)
        formData.append("companyId", companies?.companyId.toString());
      if (logoImage) formData.append("logoURL", logoImage);
      if (background) formData.append("bannerURL", background);
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (event) {
        const updateEvent = await eventApi.update(formData);
        console.log(updateEvent);
        toast.success("Cập nhật thành công", { position: "top-center" });
        const queryParams = new URLSearchParams({
          id: updateEvent.data.result.eventId,
          step: "2",
        }).toString();
        await navigate(`?${queryParams}`);
      } else {
        const response = await eventApi.create(formData);
        console.log(response);

        toast.success("Tạo sự kiện thành công", { position: "top-center" });
        const queryParams = new URLSearchParams({
          id: response.data.result.eventId,
          step: "2",
        }).toString();
        await navigate(`?${queryParams}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      const errorAxios = error as AxiosError<{ message: string }>;
      if (errorAxios.response) toast.error(errorAxios.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    if (!isStepValid) {
      toast.warning("Bạn cần nhập đủ thông tin!");
      return;
    }
    await submitInfo();
    setIsStepValid(false); // reset cho bước sau
  };

  // const prevStep = () => {
  //   setStep((prev) => Math.max(prev - 1, 0));
  // }

  return (
    <div className="text-black text-[16px]">
      {isLoading && <LoadingFullScreen />}
      <section className="bg-pse-black-light p-4 rounded-lg mb-8 shadow-neon-green">
        <p className="text-white">Upload hình ảnh</p>
        <div className="flex flex-wrap py-5 justify-center gap-10">
          <ImageUpload
            previewImage={logoImageUrl}
            image={logoImage}
            setImage={setLogoImage}
            width={720}
            height={958}
            label="Thêm logo sự kiện"
          />
          <ImageUpload
            previewImage={backgroundUrl}
            image={background}
            setImage={setBackGround}
            width={1280}
            height={720}
            label="Thêm ảnh nền sự kiện"
          />
        </div>
        <TextInput
          maxLength={100}
          label="Tên sự kiện"
          text={eventName}
          setText={setEventName}
        />
      </section>

      <section className="bg-pse-black-light p-4 rounded-lg mb-8 shadow-neon-green">
        <p className="text-white">Địa chỉ sự kiện</p>
        <div className="flex flex-col space-y-2 text-white">
          <div className="flex items-center space-x-6 my-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="eventMode"
                value="ONLINE"
                checked={eventMode === "ONLINE"}
                onChange={() => setEventMode("ONLINE")}
                className="accent-pse-green w-4 h-4"
              />
              <span>Online</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="eventMode"
                value="OFFLINE"
                checked={eventMode === "OFFLINE"}
                onChange={() => setEventMode("OFFLINE")}
                className="accent-pse-green w-4 h-4"
              />
              <span>Offline</span>
            </label>
          </div>
        </div>
        {eventMode == "OFFLINE" ? (
          <>
            <TextInput
              maxLength={80}
              label="Tên địa điểm"
              text={locationEvent}
              setText={setLocationEvent}
            />
            <TextInput
              maxLength={80}
              label="Địa chỉ"
              text={address}
              setText={setAddress}
            />
          </>
        ) : (
          <div className="mx-1">
            <input
              value={joinUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setJoinUrl(e.target.value)
              }
              placeholder="Đường dẫn tham dự"
              className="px-3 py-1 rounded-md w-full outline-none text-[15px]"
            />
          </div>
        )}
      </section>

      <section className="bg-pse-black-light p-4 rounded-lg mb-8 shadow-neon-green">
        <SelectTypeEvent
          selectedId={typeEventid}
          choice={typeEvent}
          setChoice={setTypeEvent}
          label="Thể loại sự kiện"
          listType={eventTypes}
        />
      </section>

      <section className="bg-pse-black-light p-4 rounded-lg mb-8 shadow-neon-green">
        <p className="text-left mx-2 text-white">Thông tin sự kiện</p>
        <TextEditor onChange={setEditorContent} />
      </section>

      <section className=" bg-pse-black-light md:flex md:flex-row-reverse md:items-center md:gap-2 p-4 rounded-lg mb-8 shadow-neon-green">
        <div className="md:w-[70%]">
          <p className="text-white font-semibold">{companies?.companyName}</p>
          <p className="text-white font-light">{companies?.description}</p>
        </div>
        <div>
          <img
            src={companies?.logoURL}
            alt="Company Logo"
            className="w-[275px] h-[275px]"
          />
        </div>
      </section>

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
    </div>
  );
}
