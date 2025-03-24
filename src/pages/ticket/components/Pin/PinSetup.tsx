import { Check, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { NumericKeypad } from "./NumbericKeypad"


interface PinSetupProps {
  onComplete: () => void
}

export function PinSetup({ onComplete }: PinSetupProps) {
  const [step, setStep] = useState<"create" | "confirm">("create")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const maxLength = 6

  const handleKeyPress = (key: string) => {
    if (step === "create" && pin.length < maxLength) {
      setPin((prev) => prev + key)
    } else if (step === "confirm" && confirmPin.length < maxLength) {
      setConfirmPin((prev) => prev + key)
    }
    setError("")
  }

  const handleBackspace = () => {
    if (step === "create") {
      setPin((prev) => prev.slice(0, -1))
    } else {
      setConfirmPin((prev) => prev.slice(0, -1))
    }
    setError("")
  }

  const handleNextStep = () => {
    if (pin.length < 4) {
      setError("PIN phải có ít nhất 4 số")
      return
    }
    setStep("confirm")
  }

  const handleSetPin = () => {
    if (pin !== confirmPin) {
      setError("PIN không khớp")
      setConfirmPin("")
      return
    }

    // Store PIN in localStorage (hashed in a real app)
    localStorage.setItem("userPin", pin)
    onComplete()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1E1E1E] p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-[#252525] p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          {step === "create" ? "Tạo mã PIN" : "Xác nhận mã PIN"}
        </h2>

        <div className="mb-6 flex justify-center">  
          <div className="flex gap-2">
            {Array.from({ length: maxLength }).map((_, index) => (
              <div
                key={index}
                className={`flex h-12 w-8 items-center justify-center rounded-md border ${
                  step === "create"
                    ? index < pin.length
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700 bg-[#333333]"
                    : index < confirmPin.length
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700 bg-[#333333]"
                }`}
              >
                {(step === "create" && index < pin.length) || (step === "confirm" && index < confirmPin.length) ? (
                  <div className="h-3 w-3 rounded-full bg-white"></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-900/30 p-3 text-sm text-red-400">
            <X className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4 ml-12">
          <NumericKeypad
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onSubmit={step === "create" ? handleNextStep : handleSetPin}
          />
        </div>

        {step === "create" ? (
          <Button onClick={handleNextStep} className="w-full bg-blue-600 hover:bg-blue-700" disabled={pin.length < 4}>
            Tiếp tục
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleSetPin}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={confirmPin.length < 4}
            >
              <Check className="mr-2 h-4 w-4" />
              Xác nhận
            </Button>

            <Button
              onClick={() => {
                setStep("create")
                setConfirmPin("")
                setError("")
              }}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Quay lại
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

