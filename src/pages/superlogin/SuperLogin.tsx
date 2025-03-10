"use client"

import type React from "react"

import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"


interface LoginCredentials {
  username: string
  password: string
}

export default function SuperLogin() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value,
    })
    if (error) setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password")
      toast.error("Login failed", {
        description: "Please enter both username and password.",
      })
      return
    }

    setIsLoading(true)
    setError("")

    try {
     
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let userRole = null

      if (credentials.username === "admin" && credentials.password === "admin123") {
        userRole = 3 // Admin role
      } else if (credentials.username === "manager" && credentials.password === "manager123") {
        userRole = 4 // Manager role
      } else if (credentials.username === "user" && credentials.password === "user123") {
        userRole = 2 // Some other role (will be rejected)
      } else {
        throw new Error("Invalid credentials")
      }

      if (userRole !== 3 && userRole !== 4) {
        throw new Error("Unauthorized role")
      }

      localStorage.setItem("userRole", userRole.toString())
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userName", credentials.username)

      toast.success("Login successful", {
        description: `Welcome back, ${credentials.username}!`,
      })

      if (userRole === 3) {
        navigate("/admin/dashboard")
      } else if (userRole === 4) {
        navigate("/manager/company-approvals")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.message === "Unauthorized role") {
        setError("You don't have permission to access this system")
        toast.error("Access denied", {
          description: "Your account doesn't have permission to access this system.",
        })
      } else {
        setError("Invalid username or password")
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-4">
      <Card className="w-full max-w-md bg-[#2A2A2A] text-white border-[#333333]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Portal</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access the management system
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="bg-[#1E1E1E] border-[#333333] pl-10"
                  value={credentials.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-[#1E1E1E] border-[#333333] pl-10 pr-10"
                  value={credentials.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>

            {error && <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded-md">{error}</div>}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-500 text-[#00B14F] focus:ring-[#00B14F]"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-[#00B14F] hover:underline">
                Forgot password?
              </a>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#00B14F] hover:bg-[#00A040] text-white" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

