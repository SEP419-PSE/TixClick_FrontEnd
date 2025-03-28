import type React from "react"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { PinSetup } from "./PinSetup"
import { PinVerification } from "./PinVerification"
import { PinUpdate } from "./PinUpdate"


interface PinAuthProps {
  children: React.ReactNode
}

export const PinAuth = forwardRef<any, PinAuthProps>(({ children }, ref) => {
  const [authState, setAuthState] = useState<"loading" | "setup" | "verify" | "update" | "authenticated">("loading")
  const [showOverlay, setShowOverlay] = useState(false)

  // Cho phép component cha gọi các phương thức này
  useImperativeHandle(ref, () => ({
    handleUpdateRequest: () => {
      setShowOverlay(true)
      setAuthState("update")
    },
  }))

  useEffect(() => {
    // Kiểm tra xem PIN đã được xác thực trong phiên này chưa
    const isPinVerified = sessionStorage.getItem("pinVerified") === "true"

    if (isPinVerified) {
      setAuthState("authenticated")
      return
    }

    // Kiểm tra xem PIN đã tồn tại chưa
    const hasPin = localStorage.getItem("userPin") !== null

    if (hasPin) {
      setAuthState("verify")
    } else {
      setAuthState("setup")
    }

    // Độ trễ nhỏ để cho phép hiệu ứng
    setTimeout(() => setShowOverlay(true), 100)
  }, [])

  const handleSetupComplete = () => {
    setShowOverlay(false)
    setTimeout(() => {
      sessionStorage.setItem("pinVerified", "true")
      setAuthState("authenticated")
    }, 300)
  }

  const handleVerificationSuccess = () => {
    setShowOverlay(false)
    setTimeout(() => {
      sessionStorage.setItem("pinVerified", "true")
      setAuthState("authenticated")
    }, 300)
  }

  // Xử lý khi người dùng muốn cập nhật PIN
  const handleUpdateRequest = () => {
    setShowOverlay(true)
    setAuthState("update")
  }

  // Xử lý khi cập nhật PIN thành công
  const handleUpdateSuccess = () => {
    setShowOverlay(false)
    setTimeout(() => {
      sessionStorage.setItem("pinVerified", "true")
      setAuthState("authenticated")
    }, 300)
  }

  // Xử lý khi hủy cập nhật PIN
  const handleUpdateCancel = () => {
    setShowOverlay(false)
    setTimeout(() => {
      setAuthState("authenticated")
    }, 300)
  }

  // CSS class cho hiệu ứng animation
  const overlayClass = `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
    showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
  }`

  return (
    <div className="relative">
      {/* Nội dung trang TicketPage */}
      <div
        className={
          authState !== "authenticated" ? "blur-sm transition-all duration-300" : "transition-all duration-300"
        }
      >
        {children}
      </div>

      {/* Nút cập nhật PIN (chỉ hiển thị khi đã xác thực) */}
      {authState === "authenticated" && (
        <button
          onClick={handleUpdateRequest}
          className="fixed bottom-4 right-4 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
          title="Cập nhật mã PIN"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </button>
      )}

      {/* Overlay xác thực PIN */}
      {authState !== "authenticated" && (
        <div className={overlayClass}>
          {authState === "loading" ? (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
          ) : authState === "setup" ? (
            <div className="animate-fadeIn">
              <PinSetup onComplete={handleSetupComplete} />
            </div>
          ) : authState === "update" ? (
            <div className="animate-fadeIn">
              <PinUpdate onSuccess={handleUpdateSuccess} onCancel={handleUpdateCancel} />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <PinVerification onSuccess={handleVerificationSuccess} onReset={handleUpdateRequest} />
            </div>
          )}
        </div>
      )}
    </div>
  )
})

