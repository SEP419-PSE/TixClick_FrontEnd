import { Unlock, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { NumericKeypad } from "./NumbericKeypad"


interface PinVerificationProps {
  onSuccess: () => void
  onReset: () => void
}

export function PinVerification({ onSuccess, onReset }: PinVerificationProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const maxLength = 6

  const handleKeyPress = (key: string) => {
    if (pin.length < maxLength) {
      setPin((prev) => prev + key)
      setError("")
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
    setError("")
  }

  const handleVerifyPin = () => {
    const storedPin = localStorage.getItem("userPin")

    if (pin === storedPin) {
      // Store verification status
      sessionStorage.setItem("pinVerified", "true")
      onSuccess()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        setError("Quá nhiều lần thử. Vui lòng thiết lập lại mã PIN.")
      } else {
        setError(`Mã PIN không đúng. Còn ${3 - newAttempts} lần thử.`)
      }

      setPin("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1E1E1E] p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-[#252525] p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Nhập mã PIN</h2>

        <div className="mb-6 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: maxLength }).map((_, index) => (
              <div
                key={index}
                className={`flex h-12 w-8 items-center justify-center rounded-md border ${
                  index < pin.length ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-[#333333]"
                }`}
              >
                {index < pin.length && <div className="h-3 w-3 rounded-full bg-white"></div>}
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

        <div className="mb-4">
          <NumericKeypad
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onSubmit={handleVerifyPin}
            disabled={attempts >= 3}
          />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleVerifyPin}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={pin.length < 4 || attempts >= 3}
          >
            <Unlock className="mr-2 h-4 w-4" />
            Mở khóa
          </Button>

          {attempts >= 3 && (
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Thiết lập lại mã PIN
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

