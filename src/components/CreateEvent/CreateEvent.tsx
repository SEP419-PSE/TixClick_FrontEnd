import { useEffect, useState } from "react";
import StepOne from "./steps/Step1_Infor";
import StepTwo from "./steps/StepTwo";
import { useNavigate, useSearchParams } from "react-router";
import SeatChartDesigner from "../../pages/seatmap/Seatmap";
import FinalStep from "./steps/FinalStep";

// import StepTwo from "./Steps/StepTwo"; // nếu có
// import StepThree from "./Steps/StepThree"; // nếu có

export default function CreateEvent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isStepValid, setIsStepValid] = useState<boolean>(false);

  // Lấy step từ URL, nếu không có thì mặc định là 0
  const getStepFromUrl = () => {
    const stepFromUrl = searchParams.get("step");
    return stepFromUrl ? Math.max(parseInt(stepFromUrl, 10) || 1, 1) : 1;
  };
  const [step, setStep] = useState<number>(getStepFromUrl);

  const getEventIdFromUrl = () => {
    const eventIdFromUrl = Number(searchParams.get("id"));
    return eventIdFromUrl;
  };
  const [eventId, setEventId] = useState<number>(getStepFromUrl);

  // Đồng bộ URL params với state khi URL thay đổi
  useEffect(() => {
    setStep(getStepFromUrl());
    setEventId(getEventIdFromUrl());
  }, [searchParams]);

  const updateStep = (newStep: number) => {
    navigate(`?id=${eventId}&step=${newStep}`, { replace: true }); // Cập nhật URL mà không reload
    setStep(newStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      case 2:
        return (
          <StepTwo
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      case 3:
        return (
          <SeatChartDesigner
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      case 4:
        return (
          <FinalStep
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
            updateStep={updateStep}
            eventId={eventId}
          />
        );
      default:
        return <p>Hoàn tất hoặc bước không hợp lệ</p>;
    }
  };

  return (
    <div
      className={`p-6 ${
        step == 3 ? "w-full bg-gray-200" : "max-w-[1000px]"
      }  mx-auto`}
    >
      <div className="mb-6">
        <p
          className={`${
            step == 3 ? "text-black" : "text-white"
          } font-semibold text-xl`}
        >
          Tạo sự kiện
        </p>
        <p className={`${step == 3 ? "text-black/70" : "text-white/70"}`}>
          Bước {step} trong 4
        </p>
      </div>

      {renderStep()}
    </div>
  );
}
