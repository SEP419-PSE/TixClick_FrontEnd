import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react"
import type React from "react"
import { FormEvent, useContext, useState } from "react"
import { useNavigate } from "react-router"
import { toast, Toaster } from "sonner"
import Logo from "../../assets/Logo.png"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { AuthContextAdminPortal } from "../../contexts/AuthProviderAdminPortal"
import { LoginRequest } from "../../interface/superLogin/Login"
import { cn } from "../../lib/utils"
import superLoginApi from "../../services/superLogin/SuperLoginApi"



export default function SuperLogin() {
  const authContext = useContext(AuthContextAdminPortal);
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState<LoginRequest>({
    userName: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formTouched, setFormTouched] = useState({
    userName: false,
    password: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name}:`, value); 
  
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!credentials.userName || !credentials.password) {
      setFormTouched({
        userName: true,
        password: true,
      })
      setError("Please fill in all required fields")
      return
    }
    setIsLoading(true);
    setError("");
  
    try {
      console.log("Submitting credentials:", credentials);
      const response = await superLoginApi.login(credentials);
      console.log("API Response:", response);
  
      if (response.data?.result?.accessToken) {
        localStorage.setItem("accessTokenAdminPortal", response.data.result.accessToken);
        localStorage.setItem("refreshTokenAdminPortal", response.data.result.refreshToken);
       
  
        authContext?.login();
  
        if (response.data.result.status == true) {
          toast.success("Login successful", {duration:2000});
          setTimeout(() => {
            navigate(response.data.result.roleName == "ADMIN" ? "/proAdmin" : "/manager-dashboard");
          }, 1000)
        } else {
          setError("Access denied");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1E1E1E] p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md relative">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00B14F]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00B14F]/10 rounded-full blur-3xl" />

        <Card className="w-full backdrop-blur-sm bg-[#2A2A2A]/90 text-white border-[#333333] shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00B14F]/70 via-[#00D160] to-[#00B14F]/70" />

          <CardHeader className="space-y-1 pt-8">
            <div className="flex justify-center mb-2">
              <div className="relative">
                {/* <div className="absolute inset-0 bg-[#00B14F]/20 rounded-full blur-md" /> */}
                <div className="absolute inset-0 " />

                {/* <div className="relative bg-[#00B14F] text-white p-3 rounded-full"> */}
                <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-18 w-16" />
                {/* </div> */}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Portal</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access the management system
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin} className="animate-in fade-in duration-500">
            <CardContent className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-gray-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#00B14F]" />
                  Username
                </Label>
                <div className="relative group">
                  <Input
                    id="userName"
                    name="userName"
                    placeholder="Enter your username"
                    className={cn(
                      "bg-[#1E1E1E] border-[#333333] focus:border-[#00B14F] focus:ring-[#00B14F]/10 transition-all",
                      formTouched.userName && !credentials.userName ? "border-red-500" : "",
                    )}
                    value={credentials.userName}
                    onChange={handleInputChange}
                    autoComplete="username"
                  />
                  {formTouched.userName && !credentials.userName && (
                    <p className="text-red-400 text-xs mt-1 ml-1">Username is required</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#00B14F]" />
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      "bg-[#1E1E1E] border-[#333333] focus:border-[#00B14F] focus:ring-[#00B14F]/10 transition-all",
                      formTouched.password && !credentials.password ? "border-red-500" : "",
                    )}
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
                  {formTouched.password && !credentials.password && (
                    <p className="text-red-400 text-xs mt-1 ml-1">Password is required</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-md border border-red-400/20 animate-in fade-in zoom-in duration-300">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-gray-500 text-[#00B14F] data-[state=checked]:bg-[#00B14F] data-[state=checked]:border-[#00B14F]"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-[#00B14F] hover:text-[#00D160] hover:underline transition-colors">
                  Forgot password?
                </a>
              </div>
            </CardContent>

            <CardFooter className="pb-8">
              <Button
                type="submit"
                className="w-full bg-[#00B14F] hover:bg-[#00D160] text-white shadow-lg shadow-[#00B14F]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#00B14F]/30 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Authenticating...</span>
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

        <div className="text-center mt-4 text-gray-500 text-xs">
          © {new Date().getFullYear()} Admin Portal. All rights reserved.
        </div>
      </div>
    </div>
  )
}



