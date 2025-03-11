import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Link } from "react-router";
import { Profile } from "../../interface/profile/Profile";
import profileApi from "../../services/profile/ProfileApi";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 relative">
        <Link to="/">
          <button className="absolute top-4">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </Link>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={profile?.avatarURL || "default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute -right-2 -bottom-2 p-2 bg-pse-green rounded-full cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white" />
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

        <p className="text-center font-bold text-gray-600 mb-8">
          {profile?.userName || "Người dùng"}
        </p>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={`${profile?.lastName || ""} ${profile?.firstName || ""}`}
              onChange={() => {}}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={profile?.phone || ""}
              onChange={() => {}}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ""}
              onChange={() => {}}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pse-green text-white rounded-lg p-3 font-medium hover:bg-opacity-90 transition-colors"
          >
            Hoàn thành
          </button>
        </form>
      </div>

      {image && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-center font-medium mb-4">Chỉnh sửa ảnh</h2>
            <div className="relative w-full h-64 bg-gray-100">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setImage(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-pse-green text-white rounded-lg"
                onClick={handleCropComplete}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
