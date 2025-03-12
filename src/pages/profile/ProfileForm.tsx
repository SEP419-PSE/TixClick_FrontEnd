import { motion } from "framer-motion";
import { Camera, ChevronLeft, Edit2, LogOut, Mail, Phone, Sliders, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Profile } from "../../interface/profile/Profile";
import profileApi from "../../services/profile/ProfileApi";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }


  const handleCropComplete = () => {
    setImage(null);
  };

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getProfile();
      if (res.data.result) {
        setProfile(res.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U"
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // setLoading(false)
      setEditMode(false)
      // Show success notification
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-indigo-600 dark:text-indigo-400">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="font-medium">Quay lại</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="px-6 pb-6 -mt-16 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarImage src={profile?.avatarURL || ""} alt="Avatar" />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {getInitials(profile?.firstName, profile?.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute -right-2 bottom-0">
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white shadow-md cursor-pointer hover:bg-indigo-700 transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                  {profile?.userName || "Người dùng"}
                </h2>

                

                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <User className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                    <span>{profile?.lastName} {profile?.firstName}</span>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Phone className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                    <span>{profile?.phone}</span>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Mail className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                    <span>{profile?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full bg-white dark:bg-gray-800 rounded-xl p-1 mb-6">
                <TabsTrigger value="profile" className="flex-1 rounded-lg">
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-1 rounded-lg">
                  Bảo mật
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1 rounded-lg">
                  Tùy chọn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                    {editMode ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên</label>
                      <div className="relative">
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`pl-10 ${!editMode ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
                      <div className="relative">
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`pl-10 ${!editMode ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <div className="relative">
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`pl-10 ${!editMode ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {editMode && (
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        // disabled={loading}
                      >
                        {/* {loading ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang lưu
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Check className="mr-2 h-4 w-4" />
                            Lưu thông tin
                          </div>
                        )} */}
                      </Button>
                    )}
                  </form>
                </motion.div>
              </TabsContent>

              <TabsContent value="security">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Tính năng bảo mật sẽ được cập nhật sau</p>
                </div>
              </TabsContent>

              <TabsContent value="preferences">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Tính năng tùy chọn sẽ được cập nhật sau</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {image && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-lg font-semibold text-center">Chỉnh sửa ảnh đại diện</h3>
            </div>

            <div className="p-6">
              <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-6">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phóng to</label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{zoom.toFixed(1)}x</span>
                  </div>
                  <Sliders
                    // value={[zoom]}
                    min={1}
                    max={3}
                    // step={0.1}
                    // onValueChange={(value) => setZoom(value[0])}
                    className="py-1"
                  />
                </div>

                <div className="flex justify-between gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setImage(null)}>
                    Hủy
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    onClick={handleCropComplete}
                    // disabled={loading}
                  >
                    {/* {loading ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang lưu
                      </div>
                    ) : (
                      "Lưu ảnh"
                    )} */}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

