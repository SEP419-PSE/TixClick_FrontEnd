import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Cropper from "react-easy-crop";
import { Link } from "react-router";
import HuyAvatar from "../../assets/AvatarHuy.jpg";
import { Profile } from "../../interface/profile/Profile";
import profileApi from "../../services/profile/ProfileApi";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile>()
  console.log("first:", profile);
  const [avatar, setAvatar] = useState<string>(HuyAvatar);
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
    console.log(setProfile)
  };

  const handleCropComplete = async () => {
    if (image) {
      setAvatar(image); 
      setImage(null); 
    }
  };

  const fetchProfile = async () => {
    console.log(localStorage);
    const res: any = (await profileApi.getProfile()).data.result;
    console.log("Profile:", res);
    

    if (res && res.length > 0) {
      setProfile(res);
    }
  };
  
  useEffect(() => {
    const initUseEffect = async () => {
      await fetchProfile();
    };
    initUseEffect();
  });

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res: any = await profileApi.getProfile();
  //       console.log("Dữ liệu từ API:", res.data); 
  
  //       if (res.data.result && res.data.result.length > 0) {
  //         const profileData = res.data.result[0];
  //         console.log("Dữ liệu profile đã chọn:", profileData);
  //         setProfile(profileData);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy profile:", error);
  //     }
  //   };
  
  //   fetchProfile();
  // }, []);
  


 


  const countryCodes = [
    { code: "+84", name: "Vietnam" },
    { code: "+1", name: "United States" },
    { code: "+61", name: "Australia" },
    { code: "+44", name: "United Kingdom" },
    { code: "+81", name: "Japan" },
    { code: "+33", name: "France" },
    { code: "+49", name: "Germany" },
    { code: "+86", name: "China" },
    { code: "+91", name: "India" },
    { code: "+7", name: "Russia" },
    { code: "+82", name: "South Korea" },
    { code: "+39", name: "Italy" },
    { code: "+34", name: "Spain" },
    { code: "+46", name: "Sweden" },
    { code: "+31", name: "Netherlands" },
    { code: "+41", name: "Switzerland" },
    { code: "+55", name: "Brazil" },
    { code: "+52", name: "Mexico" },
    { code: "+62", name: "Indonesia" },
    { code: "+63", name: "Philippines" },
    { code: "+65", name: "Singapore" },
    { code: "+66", name: "Thailand" },
    { code: "+90", name: "Turkey" },
    { code: "+351", name: "Portugal" },
    { code: "+32", name: "Belgium" },
    { code: "+45", name: "Denmark" },
    { code: "+20", name: "Egypt" },
    { code: "+27", name: "South Africa" },
    { code: "+94", name: "Sri Lanka" },
    { code: "+880", name: "Bangladesh" },
  ];
  

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
              src={avatar}
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
          <p className="text-center font-bold text-gray-600 mb-8">
            {profile?.userName}
        </p>
        </div>

        <p className="text-center text-gray-600 mb-8">
          Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong quá trình mua vé, hoặc khi cần xác thực vé
        </p>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={`${profile?.lastName || ""} ${profile?.firstName || ""}`}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            />

          </div>

          {/* <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              type="date"
              defaultValue="2000-01-01"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            >
              {profile?.dob}
            </input>
          </div> */}


          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <div className="flex gap-2">
            <select className="p-3 rounded-lg bg-gray-50 border border-gray-200 w-32 text-gray-700">
              {countryCodes.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
              <input
                type="tel"
                placeholder="Nhập ở đây"
                className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
              >

              </input>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            >
              {profile?.email}
            </input>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="phoneNumber"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            >
              {profile?.phone}
            </input>
          </div>

          {/* <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2  text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-pse-green"
                />
                <span>Nam</span>
              </label>
              <label className="flex items-center gap-2  text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-pse-green"
                />
                <span>Nữ</span>
              </label>
              <label className="flex items-center gap-2  text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-pse-green"
                />
                <span>Khác</span>
              </label>
            </div>
          </div> */}

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
