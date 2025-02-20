import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";

const steps = [
  "Thông tin sự kiện",
  "Thời gian & Loại vé",
  "Cài đặt",
  "Thông tin thanh toán",
];

// const stepComponents = [StepOne, StepTwo, StepThree, StepFour];

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isStepValid, setIsStepValid] = useState(false);

  // useEffect(() => {
  //   setIsStepValid(false);
  // }, [currentStep]);

  // const handleNext = () => {
  //   if (!isStepValid) {
  //     toast.warning(TOAST_WARNING, {
  //       position: "top-center",
  //     });
  //     return;
  //   }
  //   setCurrentStep((prev) => prev + 1); // Chuyển step nếu hợp lệ
  // };

  // const handleValidationChange = (isValid: boolean) => {
  //   setIsStepValid(isValid);
  // };

  // console.log(isStepValid);

  return (
    <>
      <div className="fixed left-1/2 top-2 z-20 flex justify-between items-center text-[14px] w-[90%] max-w-[500px] mx-auto px-2 transform -translate-x-1/2 overflow-hidden">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative z-10 gap-1 md:gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold relative ${
                index < currentStep ? "bg-pse-green" : "bg-pse-gray"
              }`}
            >
              {index + 1 < currentStep ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-6 h-6 text-green" />
                </motion.div>
              ) : (
                index + 1
              )}
            </motion.div>
            <span className="text-[10px] md:text-sm mt-1 text-white">
              {step}
            </span>
          </div>
        ))}
        {/* Thanh nền */}
        <motion.div className="absolute top-5 left-2 right-2 h-1 bg-white z-0"></motion.div>
        {/* Thanh tiến trình */}
        <motion.div
          className="absolute top-5 left-2 h-1 bg-pse-green z-10"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length - 1) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>

      <div className="min-h-screen max-w-[1000px] pt-24 pb-10 mx-auto p-6 bg-gradient-to-r from-pse-green-second/70 via-pse-green-second/50 rounded-lg">
        <div className="text-center text-lg font-semibold mb-4">
          {currentStep === 1 && (
            <StepOne
              step={currentStep}
              setStep={setCurrentStep}
              isStepValid={isStepValid}
              setIsStepValid={setIsStepValid}
            />
          )}
          {currentStep === 2 && <StepTwo />}
          {currentStep === 3 && <div>Step 3</div>}
          {currentStep === 4 && <div>Step 4</div>}
        </div>
      </div>
    </>
  );
}
