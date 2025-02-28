import { useState } from "react"
import banner from "../../assets/banner.jpg"
import Logo from "../../assets/Logo.png"
import payOs from "../../assets/payOs.svg"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import Countdown from "../../components/ui/countdown"
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"


export default function PaymentPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-3 px-4 flex justify-between items-center">
        <div className="flex items-center ml-8">
          <img src={Logo} alt="Event Ticket" className="h-16 w-auto" />
        </div>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
          Hủy giao dịch ×
        </Button>
      </header>

      <div className="relative h-60 md:h-90">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-black">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hòa nhạc Mùa Xuân 2024</h1>
          <p className="text-xl md:text-2xl">Nhà hát Lớn Hà Nội</p>
          <Countdown targetDate="2024-03-30T20:00:00" />
        </div>
      </div>

      
      <main className="max-w-6xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-gray-50 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-medium mb-4 text-black">Khuyến mãi</h2>

            <div className="mb-4">
              <label htmlFor="promo-code" className="block text-sm font-medium mb-1 text-black">
                Mã khuyến mãi
              </label>
              <div className="flex gap-2">
                <Input id="promo-code" className="border rounded-md" placeholder="Nhập mã khuyến mãi" />
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 transition-colors duration-300">
                  Áp Dụng
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Lưu ý: Chỉ áp dụng một mã khuyến mãi cho mỗi đơn hàng</p>
            </div>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-medium mb-4 text-black">Phương thức thanh toán</h2>

            <div className="flex items-center space-x-3 border rounded-md p-3 bg-white transition-all duration-300 hover:border-blue-500">
              <img src={payOs} alt="Payos" width={60} height={30} className="mr-2" />
              <Label className="flex items-center cursor-pointer text-black">
                Payos - Thanh toán an toàn với thẻ nội địa, Visa, Master, JCB
              </Label>
            </div>

            <p className="text-xs text-red-500 mt-4">
              (*) Bằng việc click/chạm vào THANH TOÁN bên phải, bạn đã xác nhận hiểu rõ các Điều khoản và Điều kiện của
              chúng tôi.
            </p>
          </section>
        </div>

        <div className="lg:col-span-1 text-black">
          <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="text-right text-sm text-gray-600 mb-4">
              Thời gian giữ vé: <span className="text-blue-500 font-medium">10:00</span>
            </div>

            <div className="flex gap-4 mb-6">
              <img
                src={banner}
                alt="Event Poster"
                width={120}
                height={180}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-medium text-lg">Hòa nhạc Mùa Xuân 2024</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Nhà hát Lớn Hà Nội</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium">Thông tin sự kiện</h4>
              <p className="text-sm">Ngày: 20:00 - Thứ Bảy, 30/03/2024</p>
            </div>

            <Separator className="my-4 border-dashed" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <div>
                  <div>2x Vé Thường</div>
                </div>
                <div className="font-medium">600.000 đ</div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <div>1x Vé VIP</div>
                </div>
                <div className="font-medium">500.000 đ</div>
              </div>

              <Separator className="my-2 border-dashed" />

              <div className="flex justify-between font-medium">
                <div>Tổng cộng</div>
                <div className="text-blue-500">1.100.000 đ</div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="flex-1 transition-colors duration-300">
                Quay lại
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                onClick={() => setShowConfirmation(true)}
              >
                Thanh Toán
              </Button>
            </div>
          </div>
        </div>
      </main>

     

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center text-lg font-medium">THÔNG TIN ĐẶT VÉ</DialogTitle>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium">Sự kiện</span>
              <div>
                <div className="font-medium">Hòa nhạc Mùa Xuân 2024</div>
                <div className="text-sm mt-1">Nhà hát Lớn Hà Nội</div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium">Thời gian</span>
              <div>
                <div className="text-blue-600 font-medium">20:00 - Thứ Bảy, 30/03/2024</div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium">Vé</span>
              <div className="bg-gray-200 p-3 rounded-md">
                <div>2x Vé Thường</div>
                <div>1x Vé VIP</div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium">Tổng</span>
              <div className="bg-blue-600 text-white font-medium p-2 text-center">1.100.000 VND</div>
            </div>

            <div className="flex items-start space-x-2 mt-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tôi xác nhận các thông tin đặt vé đã chính xác
              </label>
            </div>
          </div>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
            onClick={() => setShowConfirmation(false)}
          >
            Xác nhận và Thanh Toán
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

