import { useState } from "react";

import ImageUpload from "./ImageUpload";
import TextInput from "./InputText";
import SelectTypeEvent from "./SelectTypeEvent";
import TextEditor from "./TextEditor";
import eventApi from "../../services/eventApi";
import { EventType } from "../../interface/EventInterface";
import { toast } from "sonner";

const eventTypes: EventType[] = [
  {
    id: 1,
    name: "Nhạc sống",
  },
  {
    id: 2,
    name: "Thể thao",
  },
  {
    id: 3,
    name: "Sân khấu & Nghệ thuật",
  },
  {
    id: 4,
    name: "Khác",
  },
];

type StepOneProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isStepValid: boolean;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StepOne({ setStep, setIsStepValid }: StepOneProps) {
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [background, setBackGround] = useState<File | null>(null);
  const [logoOrganizer, setLogoOrganizer] = useState<File | null>(null);
  const [eventName, setEventName] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [address, setAddress] = useState("");
  const [typeEvent, setTypeEvent] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerInfor, setOrganizerInfor] = useState("");
  const [editorContent, setEditorContent] = useState<string>("");

  // Kiểm tra điều kiện hợp lệ
  // useEffect(() => {
  //   const isValid =
  //     editorContent.trim() !== "<p><br></p>" &&
  //     logoImage !== null &&
  //     background !== null &&
  //     logoOrganizer !== null &&
  //     eventName.trim() !== "" &&
  //     locationEvent.trim() !== "" &&
  //     address.trim() !== "" &&
  //     typeEvent.trim() !== "" &&
  //     organizerName.trim() !== "";

  //   onValidationChange(isValid);
  // }, [
  //   editorContent,
  //   eventName,
  //   locationEvent,
  //   address,
  //   typeEvent,
  //   organizerName,
  //   onValidationChange,
  //   logoImage,
  //   background,
  //   logoOrganizer,
  // ]);

  // const imageFile = [logoImage, background, logoOrganizer];

  const checkValid = () => {
    if (
      editorContent.trim() !== "<p><br></p>" &&
      eventName.trim() !== "" &&
      locationEvent.trim() !== "" &&
      address.trim() !== "" &&
      typeEvent.trim() !== "" &&
      organizerName.trim() !== "" &&
      logoImage !== null &&
      background !== null &&
      logoOrganizer !== null
    ) {
      setIsStepValid(true);
    } else {
      toast.warning("Vui lòng nhập đầy đủ thông tin", {
        position: "top-center",
      });
      return;
    }
  };
  const fetchData = async () => {
    try {
      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("location", locationEvent);
      formData.append("categoryId", typeEvent);
      formData.append("description", editorContent);
      formData.append("typeEvent", "Offline");

      // Append từng file nếu có
      if (logoImage) formData.append("logoURL", logoImage);
      if (background) formData.append("bannerURL", background);
      if (logoOrganizer) formData.append("logoOrganizeURL", logoOrganizer);
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const response = await eventApi.create(formData);
      console.log(response);
      toast.success("Tạo sự kiện thành công", { position: "top-center" });
      setStep(1);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const createEvent = () => {
    checkValid();
    fetchData();
  };

  // console.log(editorContent);
  return (
    <div className="text-black text-[14px]">
      <section className="bg-pse-footer p-4 rounded-lg mb-8 shadow-neon-green">
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

      <section className="bg-pse-footer p-4 rounded-lg mb-8 shadow-neon-green">
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

      <section className="bg-pse-footer p-4 rounded-lg mb-8 shadow-neon-green">
        <SelectTypeEvent
          choice={typeEvent}
          setChoice={setTypeEvent}
          label="Thể loại sự kiện"
          listType={eventTypes}
        />
      </section>
      <section className="bg-pse-footer p-4 rounded-lg mb-8 shadow-neon-green">
        <p className="text-left mx-2 text-white">Thông tin sự kiện</p>
        <TextEditor onChange={setEditorContent} />
      </section>
      <section className="md:flex md:flex-row-reverse md:items-center md:gap-2 bg-pse-footer p-4 rounded-lg mb-8 shadow-neon-green">
        <div className="md:w-[70%]">
          <TextInput
            label="Tên ban tổ chức"
            maxLength={80}
            text={organizerName}
            setText={setOrganizerName}
          />
          <TextInput
            label="Giới thiệu chung"
            maxLength={100}
            text={organizerInfor}
            setText={setOrganizerInfor}
          />
        </div>
        <div>
          <ImageUpload
            image={logoOrganizer}
            setImage={setLogoOrganizer}
            width={275}
            height={275}
            label="Thêm logo ban tổ chức"
          />
        </div>
      </section>
      <div className="flex flex-col items-end">
        <button
          className="px-4 py-2 bg-[#2dc275] text-white rounded"
          onClick={createEvent}
        >
          Next
        </button>
      </div>
    </div>
  );
}
