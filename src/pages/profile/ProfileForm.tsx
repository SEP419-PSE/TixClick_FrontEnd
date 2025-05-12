import { motion } from "framer-motion";
import {
  Calendar,
  Camera,
  Check,
  Edit2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { toast, Toaster } from "sonner";
import Header from "../../components/Header/Header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { Profile } from "../../interface/profile/Profile";
import profileApi from "../../services/profile/ProfileApi";
import { getCroppedImg } from "./imageUtils";
import { ROLE_ID } from "../../constants/constants";

interface ExtendedProfile extends Profile {
  fullName?: string;
}

// Define crop area pixels interface
interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ExtendedProfile>(
    {} as ExtendedProfile
  );
  const [loading, setLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getProfile();
      if (res.data.result) {
        setProfile(res.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
      });
    }
  }, [profile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const uploadProfileImage = async (croppedImageBlob: Blob) => {
    try {
      setLoading(true);

      // Convert blob to File object with an appropriate name and type
      const avatarFile = new File([croppedImageBlob], "avatar.jpg", {
        type: "image/jpeg",
      });

      // Call the API with current profile data and the new avatar file
      // Need to update ProfileApi.updateProfile to accept File or null
      const response = await profileApi.updateProfile(
        profile as Profile,
        avatarFile as File
      );

      console.log(response);

      if (response.data.result) {
        // Update local state with the response from server
        // if (profile) {
        //   setProfile({
        //     ...profile,
        //     avatarURL:
        //       response.data.result?.avatarURL ||
        //       URL.createObjectURL(croppedImageBlob),
        //   });
        // }
        location.reload();
      } else {
        toast.error(response.data?.message || "Cập nhật ảnh đại diện thất bại");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setImage(null); // Close the cropper modal
    }
  };

  const handleCropComplete = async (
    _: unknown,
    croppedAreaPixels: CroppedAreaPixels
  ) => {
    try {
      if (!image) return;

      // Show loading state
      setLoading(true);

      // Get the cropped image as a blob
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);

      if (croppedImage) {
        // Upload the cropped image using the updated function
        await uploadProfileImage(croppedImage);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile?.accountId) {
        throw new Error("Missing account ID");
      }

      // Extract only the fields accepted by the API
      const updateData: Profile = {
        ...profile,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        phone: formData.phone || "",
        email: formData.email || "",
        dob: formData.dob || "",
      };

      // Call API with form data but no avatar file (null)
      const response = await profileApi.updateProfile(updateData, null);

      if (response.data && response.data.success) {
        // Update profile state with response data
        const updatedProfile = response.data.result || {
          ...profile,
          ...updateData,
        };

        setProfile(updatedProfile);
        toast.success("Cập nhật thông tin thành công!");
        setEditMode(false);
      } else {
        toast.error(response.data?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderRoleName = (roleId: number | undefined): JSX.Element => {
    const role = ROLE_ID.find((r) => r.id === roleId);
    if (!role) {
      return <span className="text-gray-500 italic">Không rõ</span>;
    }
    const roleColorMap: Record<string, string> = {
      ADMIN: "text-red-500",
      BUYER: "text-green-500",
      ORGANIZER: "text-pse-green",
      MANAGER: "text-purple-500",
    };

    return (
      <span
        className={`font-semibold text-sm ${
          roleColorMap[role?.roleName] || "text-black"
        }`}
      >
        {role.roleVi}
      </span>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#1E1E1E] text-gray-200 flex flex-col">
        <Header />
        <Toaster />
        <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#1A1A1A] rounded-2xl shadow-xl overflow-hidden border border-[#2A2A2A]">
                <div className="bg-gradient-to-r from-[#FF8A00]/20 to-[#FF8A00]/5 h-32 relative">
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
                    <Avatar className="h-32 w-32 border-4 border-[#1A1A1A] shadow-lg">
                      <AvatarImage
                        src={profile?.avatarURL || ""}
                        alt="Avatar"
                      />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-[#FF8A00] to-[#FF9A20] text-white">
                        {getInitials(profile?.firstName, profile?.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute -right-2 bottom-0">
                      <label
                        htmlFor="avatar-upload"
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#FF8A00] text-white shadow-md cursor-pointer hover:bg-[#FF9A20] transition-colors"
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

                  <h2 className="flex flex-col items-center mt-4 text-xl font-bold text-white">
                    {profile?.userName || "Người dùng"}{" "}
                    {renderRoleName(profile?.roleId)}
                  </h2>

                  <div className="w-full mt-6 space-y-4">
                    <div className="flex items-center text-gray-400">
                      <User className="h-5 w-5 mr-3 text-[#FF8A00]" />
                      <span>
                        {profile?.lastName || ""} {profile?.firstName || ""}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-400">
                      <Phone className="h-5 w-5 mr-3 text-[#FF8A00]" />
                      <span>{profile?.phone || "Chưa cập nhật"}</span>
                    </div>

                    <div className="flex items-center text-gray-400">
                      <Mail className="h-5 w-5 mr-3 text-[#FF8A00]" />
                      <span>{profile?.email || "Chưa cập nhật"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsContent value="profile">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-[#2A2A2A]"
                  >
                    <h3 className="text-xl font-bold text-white mb-6">
                      {editMode ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">
                          Họ
                        </label>
                        <div className="relative">
                          <Input
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                              !editMode ? "opacity-80" : ""
                            }`}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">
                          Tên
                        </label>
                        <div className="relative">
                          <Input
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                              !editMode ? "opacity-80" : ""
                            }`}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <Input
                            name="phone"
                            type="tel"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                              !editMode ? "opacity-80" : ""
                            }`}
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">
                          Email
                        </label>
                        <div className="relative">
                          <Input
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            disabled
                            className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                              !editMode ? "opacity-80" : ""
                            }`}
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">
                          Ngày sinh
                        </label>
                        <div className="relative">
                          <Input
                            name="dob"
                            type="date"
                            value={
                              typeof formData.dob === "string"
                                ? formData.dob
                                : ""
                            }
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00] ${
                              !editMode ? "opacity-80" : ""
                            }`}
                          />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      {editMode && (
                        <Button
                          type="submit"
                          className="w-full bg-[#FF8A00] hover:bg-[#FF9A20] text-white transition-colors duration-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Đang lưu
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Check className="mr-2 h-4 w-4" />
                              Lưu thông tin
                            </div>
                          )}
                        </Button>
                      )}
                    </form>
                  </motion.div>
                </TabsContent>

                <TabsContent value="security">
                  <div className="bg-[#1A1A1A] rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center border border-[#2A2A2A]">
                    <p className="text-gray-400">
                      Tính năng bảo mật sẽ được cập nhật sau
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="preferences">
                  <div className="bg-[#1A1A1A] rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center border border-[#2A2A2A]">
                    <p className="text-gray-400">
                      Tính năng tùy chọn sẽ được cập nhật sau
                    </p>
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
              className="bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-[#2A2A2A]"
            >
              <div className="p-4 bg-gradient-to-r from-[#FF8A00] to-[#FF9A20] text-white">
                <h3 className="text-lg font-semibold text-center">
                  Chỉnh sửa ảnh đại diện
                </h3>
              </div>

              <div className="p-6">
                <div className="relative w-full h-64 bg-[#2A2A2A] rounded-xl overflow-hidden mb-6">
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    cropShape="round"
                    showGrid={false}
                    onCropComplete={(_, croppedAreaPixels) => {
                      // Store the crop data for later use
                      setCroppedAreaPixels(croppedAreaPixels);
                    }}
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-300">
                        Phóng to
                      </label>
                      <span className="text-sm text-gray-400">
                        {zoom.toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) =>
                          setZoom(Number.parseFloat(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#2A2A2A] text-gray-200 hover:bg-[#2A2A2A] hover:text-white"
                      onClick={() => setImage(null)}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="flex-1 bg-[#FF8A00] hover:bg-[#FF9A20] text-white transition-colors duration-300"
                      onClick={() =>
                        handleCropComplete(
                          null,
                          croppedAreaPixels as CroppedAreaPixels
                        )
                      }
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Đang xử lý
                        </div>
                      ) : (
                        "Lưu ảnh"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
