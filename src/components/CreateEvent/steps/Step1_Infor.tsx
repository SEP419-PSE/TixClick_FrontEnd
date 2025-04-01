import { useEffect, useState } from "react";

import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useAllCompany from "../../../hooks/useAllCompany";
import { Company } from "../../../interface/company/Company";
import { EventType } from "../../../interface/EventInterface";
import eventApi from "../../../services/eventApi";
import LoadingFullScreen from "../../Loading/LoadingFullScreen";
import ImageUpload from "../ImageUpload";
import TextInput from "../InputText";
import SelectTypeEvent from "../SelectTypeEvent";
import TextEditor from "../TextEditor";

const eventTypes: EventType[] = [
  { id: 1, name: "Nhạc sống" },
  { id: 2, name: "Thể thao" },
  { id: 3, name: "Sân khấu & Nghệ thuật" },
  { id: 4, name: "Khác" },
];

export type StepProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isStepValid: boolean;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  updateStep: (newStep: number) => void;
  eventId: number;
};

export default function StepOne({
  step,
  isStepValid,
  setIsStepValid,
  updateStep,
  eventId,
}: StepProps) {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [background, setBackGround] = useState<File | null>(null);
  const [eventName, setEventName] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [address, setAddress] = useState("");
  const [typeEvent, setTypeEvent] = useState("");
  const [editorContent, setEditorContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const companies: Company | undefined = useAllCompany();

  // const handleSelectCompany = (companyId: number) => {
  //   setSelectedCompanyId(companyId);
  // };

  // Auto validate khi người dùng nhập dữ liệu

  useEffect(() => {
    if (eventId) {
      console.log("Có event");
    } else {
      console.log("Chưa có event");
    }
  }, []);
  useEffect(() => {
    const isValid =
      editorContent.trim() !== "<p><br></p>" &&
      eventName.trim() !== "" &&
      locationEvent.trim() !== "" &&
      address.trim() !== "" &&
      typeEvent.trim() !== "" &&
      logoImage !== null &&
      background !== null;

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
  ]);

  const submitInfo = async () => {
    if (
      editorContent.trim() == "<p><br></p>" ||
      eventName.trim() == "" ||
      locationEvent.trim() == "" ||
      address.trim() == "" ||
      typeEvent.trim() == "" ||
      logoImage == null ||
      background == null
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin", {
        position: "top-center",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("location", locationEvent);
      formData.append("locationName", address);
      formData.append("categoryId", typeEvent);
      formData.append("description", editorContent);
      formData.append("typeEvent", "Offline");
      if (companies)
        formData.append("companyId", companies?.companyId.toString());

      formData.append("logoURL", logoImage);
      formData.append("bannerURL", background);

      const response = await eventApi.create(formData);
      console.log(response);

      toast.success("Tạo sự kiện thành công", { position: "top-center" });
      const queryParams = new URLSearchParams({
        id: response.data.result.eventId,
        step: "2",
      }).toString();
      await navigate(`?${queryParams}`);
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
  // };

  return (
    <div className="text-black text-[16px]">
      {isLoading && <LoadingFullScreen />}
      <section className="bg-pse-black-light p-4 rounded-lg mb-8 shadow-neon-green">
        <p className="text-white">Upload hình ảnh</p>
        <div className="flex flex-wrap py-5 justify-center gap-10">
          <ImageUpload
            image={logoImage}
            setImage={setLogoImage}
            width={720}
            height={958}
            label="Thêm logo sự kiện"
          />
          <ImageUpload
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
      </section>

      <section className="bg-pse-black-light p-4 rounded-lg mb-8 shadow-neon-green">
        <SelectTypeEvent
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
