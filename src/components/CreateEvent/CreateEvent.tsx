import { useState } from "react";
import StepOne from "./steps/Step1_Infor";
import StepTwo from "./steps/StepTwo";

// import StepTwo from "./Steps/StepTwo"; // nếu có
// import StepThree from "./Steps/StepThree"; // nếu có

export default function CreateEvent() {
  const [step, setStep] = useState<number>(0);
  const [isStepValid, setIsStepValid] = useState<boolean>(false);

  const nextStep = () => {
    if (!isStepValid) {
      // Nếu current step chưa hợp lệ thì không cho đi tiếp
      return;
    }
    setStep((prev) => prev + 1);
    setIsStepValid(false); // reset cho bước sau
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepOne
            step={step}
            setStep={setStep}
            isStepValid={isStepValid}
            setIsStepValid={setIsStepValid}
          />
        );
      case 1:
        return <StepTwo />;
      default:
        return <p>Hoàn tất hoặc bước không hợp lệ</p>;
    }
  };

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="mb-6">
        <p className="text-white font-semibold text-xl">Tạo sự kiện</p>
        <p className="text-white/70">Bước {step + 1} trong 4</p>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
          onClick={prevStep}
          disabled={step === 0}
        >
          Quay lại
        </button>

        <button
          className="px-4 py-2 bg-pse-green-second hover:bg-pse-green-third text-white rounded disabled:opacity-50"
          onClick={nextStep}
          disabled={!isStepValid}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
