import type React from "react"

import { useEffect, useState } from "react"
import { PinSetup } from "./PinSetup"
import { PinVerification } from "./PinVerification"


interface PinAuthProps {
  children: React.ReactNode
}

export function PinAuth({ children }: PinAuthProps) {
  const [authState, setAuthState] = useState<"loading" | "setup" | "verify" | "authenticated">("loading")

  useEffect(() => {
    // Check if PIN is already verified in this session
    const isPinVerified = sessionStorage.getItem("pinVerified") === "true"

    if (isPinVerified) {
      setAuthState("authenticated")
      return
    }

    // Check if PIN exists
    const hasPin = localStorage.getItem("userPin") !== null

    if (hasPin) {
      setAuthState("verify")
    } else {
      setAuthState("setup")
    }
  }, [])

  const handleSetupComplete = () => {
    sessionStorage.setItem("pinVerified", "true")
    setAuthState("authenticated")
  }

  const handleVerificationSuccess = () => {
    setAuthState("authenticated")
  }

  const handleReset = () => {
    localStorage.removeItem("userPin")
    sessionStorage.removeItem("pinVerified")
    setAuthState("setup")
  }

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1E1E1E]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  if (authState === "setup") {
    return <PinSetup onComplete={handleSetupComplete} />
  }

  if (authState === "verify") {
    return <PinVerification onSuccess={handleVerificationSuccess} onReset={handleReset} />
  }

  return <>{children}</>
}

