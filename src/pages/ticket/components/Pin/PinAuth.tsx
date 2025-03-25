import type React from "react"

import { useEffect, useState } from "react"
import { PinSetup } from "./PinSetup"
import { PinVerification } from "./PinVerification"


interface PinAuthProps {
  children: React.ReactNode
}

export function PinAuth({ children }: PinAuthProps) {
  const [authState, setAuthState] = useState<"loading" | "setup" | "verify" | "authenticated">("loading")
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    const isPinVerified = sessionStorage.getItem("pinVerified") === "true"

    if (isPinVerified) {
      setAuthState("authenticated")
      return
    }

    const hasPin = localStorage.getItem("userPin") !== null

    if (hasPin) {
      setAuthState("verify")
    } else {
      setAuthState("setup")
    }

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
      setAuthState("authenticated")
    }, 300)
  }

  const handleReset = () => {
    localStorage.removeItem("userPin")
    sessionStorage.removeItem("pinVerified")
    setAuthState("setup")
  }

  const overlayClass = `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
    showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
  }`

  return (
    <div className="relative">
      <div
        className={
          authState !== "authenticated" ? "blur-sm transition-all duration-300" : "transition-all duration-300"
        }
      >
        {children}
      </div>

      {authState !== "authenticated" && (
        <div className={overlayClass}>
          {authState === "loading" ? (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
          ) : authState === "setup" ? (
            <div className="animate-fadeIn">
              <PinSetup onComplete={handleSetupComplete} />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <PinVerification onSuccess={handleVerificationSuccess} onReset={handleReset} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

