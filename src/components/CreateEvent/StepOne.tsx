import { useEffect, useState } from "react";

import ImageUpload from "./ImageUpload";
import TextInput from "./InputText";
import SelectTypeEvent from "./SelectTypeEvent";
import TextEditor from "./TextEditor";
const eventTypes = ["Nhạc sống", "Sân khấu & Nghệ thuật", "Thể thao", "Khác"];

export default function StepOne({
  onValidationChange,
}: {
  onValidationChange: (isValid: boolean) => void;
}) {
  const [logoImage, setLogoImage] = useState<string | null>("");
  const [background, setBackGround] = useState<string | null>("");
  const [logoOrganizer, setLogoOrganizer] = useState<string | null>("");
  const [eventName, setEventName] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [address, setAddress] = useState("");
  const [typeEvent, setTypeEvent] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerInfor, setOrganizerInfor] = useState("");
  const [editorContent, setEditorContent] = useState<string>("");

  // Kiểm tra điều kiện hợp lệ
  useEffect(() => {
    const isValid =
      editorContent.trim() !== "" &&
      logoImage?.trim() !== "" &&
      background?.trim() !== "" &&
      logoOrganizer?.trim() !== "" &&
      eventName.trim() !== "" &&
      locationEvent.trim() !== "" &&
      address.trim() !== "" &&
      typeEvent.trim() !== "" &&
      organizerName.trim() !== "";

    onValidationChange(isValid);
  }, [
    editorContent,
    eventName,
    locationEvent,
    address,
    typeEvent,
    organizerName,
    onValidationChange,
    logoImage,
    background,
    logoOrganizer,
  ]);

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
    </div>
  );
}
