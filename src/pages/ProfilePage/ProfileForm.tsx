import { Camera, X } from 'lucide-react'
import { useState } from 'react'
import HuyAvatar from "../../assets/AvatarHuy.jpg"


export default function ProfileForm() {
  const [gender, setGender] = useState<string>('')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 relative">
        <button className="absolute right-4 top-4">
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={HuyAvatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute -right-2 -bottom-2 p-2 bg-pse-green rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
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
              defaultValue="Le Quang Huy (K17 HCM)"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200  text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <div className="flex gap-2">
              <select className="p-3 rounded-lg bg-gray-50 border border-gray-200 w-24 text-gray-700">
                <option>+84</option>
              </select>
              <input
                type="tel"
                placeholder="Nhập ở đây"
                className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-200  text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              defaultValue="huylqse173543@fpt.edu.vn"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200  text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ngày tháng năm sinh
            </label>
            <input
              type="text"
              placeholder="Nhập ở đây"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
            />
          </div>

          <div className="space-y-2">
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
          </div>

          <button
            type="submit"
            className="w-full bg-pse-green text-white rounded-lg p-3 font-medium hover:bg-opacity-90 transition-colors"
          >
            Hoàn thành
          </button>
        </form>
      </div>
    </div>
  )
}

