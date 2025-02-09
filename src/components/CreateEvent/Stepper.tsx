import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import ImageUpload from "./ImageUpload";
import TextInput from "./InputText";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

function StepOne() {
  const [eventName, setEventName] = useState<string>("");
  return (
    <div className="text-black">
      <section className="bg-pse-footer p-4 rounded-lg">
        <p className="text-white">Upload hình ảnh</p>
        <div className="flex flex-wrap py-5 justify-center gap-20">
          <ImageUpload width={720} height={958} label="Thêm logo sự kiện" />
          <ImageUpload width={1280} height={720} label="Thêm ảnh nền sự kiện" />
        </div>
        <TextInput
          maxLength={100}
          label="Tên sự kiện"
          text={eventName}
          setText={setEventName}
        />
      </section>
    </div>
  );
}

function StepTwo() {
  return <div>Content for Step 2</div>;
}

function StepThree() {
  return <div>Content for Step 3</div>;
}

function StepFour() {
  return <div>Content for Step 4</div>;
}

const stepComponents = [StepOne, StepTwo, StepThree, StepFour];

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const CurrentComponent = stepComponents[currentStep];

  return (
    <div className="min-h-screen max-w-[1000px] mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="relative flex justify-between items-center mb-6 w-[90%] mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold relative ${
                index <= currentStep ? "bg-[#2dc275]" : "bg-gray-300"
              }`}
            >
              {index < currentStep ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                index + 1
              )}
            </motion.div>
            <span className="text-sm mt-2 text-gray-700">{step}</span>
          </div>
        ))}
        <motion.div className="absolute top-5 left-0 right-1 h-1 bg-gray-300 z-0"></motion.div>
        <motion.div
          className="absolute top-5 left-0 h-1 bg-[#2dc275] z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 98}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>
      <div className="text-center text-lg font-semibold mb-4">
        <CurrentComponent />
      </div>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-[#2dc275] text-white rounded disabled:opacity-50"
          disabled={currentStep === steps.length - 1}
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
