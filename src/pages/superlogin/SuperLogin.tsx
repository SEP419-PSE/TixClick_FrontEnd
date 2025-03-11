import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react"
import type React from "react"
import { FormEvent, useContext, useState } from "react"
import { useNavigate } from "react-router"
import { toast, Toaster } from "sonner"
import Logo from "../../assets/Logo.png"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { AuthContext } from "../../contexts/AuthProvider"
import { LoginRequest } from "../../interface/superLogin/Login"
import superLoginApi from "../../services/superLogin/SuperLoginApi"



export default function SuperLogin() {
  const authContext = useContext(AuthContext);
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState<LoginRequest>({
    userName: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
    setIsLoading(true);
    setError("");
  
    try {
      console.log("Submitting credentials:", credentials);
      const response = await superLoginApi.login(credentials);
      console.log("API Response:", response);
  
      if (response.data?.result?.accessToken) {
        localStorage.setItem("accessToken", response.data.result.accessToken);
        localStorage.setItem("refreshToken", response.data.result.refreshToken);
       
  
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
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-4">
      <Toaster position="top-right" />
      
      <Card className="w-full max-w-md bg-[#2A2A2A] text-white border-[#333333]">
        <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-16 w-13" />
              </div>
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
                  id="userName"
                  name="userName"
                  placeholder="Enter your username"
                  className="bg-[#1E1E1E] border-[#333333] pl-10"
                  value={credentials.userName}
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

