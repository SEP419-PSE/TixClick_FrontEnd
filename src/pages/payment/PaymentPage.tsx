import { motion } from "framer-motion"
import { ArrowLeft, Calendar, CheckCircle, Clock, CreditCard, Loader2, MapPin, Tag, X } from "lucide-react"
import { useEffect, useState } from "react"
import banner from "../../assets/banner.jpg"
import Logo from "../../assets/Logo.png"
import payOs from "../../assets/payOs.svg"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"

import { Link, useNavigate } from "react-router"
import { toast, Toaster } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"

const ticketPurchaseApi = {
  createTicketPurchase: async (data: any) => {
    try {
      const response = await fetch("/ticket-purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create ticket purchase")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating ticket purchase:", error)
      throw error
    }
  },
}

export default function PaymentPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const navigate = useNavigate()
  const [selectedSeatsData, setSelectedSeatsData] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const storedTicketId = localStorage.getItem("ticketId")
  ? JSON.parse(localStorage.getItem("ticketId")!)
  : undefined;

  const storedSeatId = localStorage.getItem("seatId")
  ? JSON.parse(localStorage.getItem("seatId")!)
  : undefined;

  console.log("store seatID:", storedSeatId)
  

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else {
        toast.success("Hết thời gian thanh toán")

        clearInterval(countdownInterval)

        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [minutes, seconds, navigate])

  useEffect(() => {
    const storedSeatsData = localStorage.getItem("selectedSeats")
    if (storedSeatsData) {
      const parsedData = JSON.parse(storedSeatsData)
      setSelectedSeatsData(parsedData)

      // Log the API responses for debugging
      if (parsedData.apiResponses) {
        console.log("Ticket API response:", parsedData.apiResponses.ticket)
        console.log("Seat API responses:", parsedData.apiResponses.seats)
        console.log("Purchase API response:", parsedData.apiResponses.purchase)
      }
    } else {
      // If no data is found, redirect back to the booking page
      toast.error("Không tìm thấy thông tin đặt vé")
      setTimeout(() => {
        navigate("/")
      }, 1500)
    }
  }, [navigate])

  const prepareTicketPurchaseData = () => {
    if (!selectedSeatsData || !selectedSeatsData.seats || !selectedSeatsData.eventInfo) {
      return null
    }

    // If we already have a purchase response from the ticket booking page, use that
    if (selectedSeatsData.apiResponses && selectedSeatsData.apiResponses.purchase) {
      console.log("Using existing purchase data from ticket booking page")
      return selectedSeatsData.apiResponses.purchase
    }

    // Otherwise, prepare the ticket purchase requests based on the selected seats
    const ticketPurchaseRequests = selectedSeatsData.seats.map((seat: any) => ({
      zoneId: seat.zoneId || 0,
      seatId: storedSeatId, // Use seatId property if available, otherwise use id
      eventActivityId: Number(selectedSeatsData.eventInfo.activityId),
      ticketId: storedTicketId, // Use the ticketId from the seat info
      eventId: Number(selectedSeatsData.eventInfo.id),
      quantity: 1, // For seated tickets, quantity is always 1
    }))

    console.log("Generated ticket purchase requests:", ticketPurchaseRequests)

    return {
      ticketPurchaseRequests,
    }
  }

  const handleConfirmPayment = async () => {
    if (!acceptTerms) return

    setIsProcessing(true)
    setApiError(null)

    try {
      const purchaseData = prepareTicketPurchaseData()

      if (!purchaseData) {
        throw new Error("Không thể chuẩn bị dữ liệu đặt vé")
      }

      console.log("Sending ticket purchase data:", purchaseData)

      // Call the API to create the ticket purchase
      const response = await ticketPurchaseApi.createTicketPurchase(purchaseData)

      console.log("Ticket purchase response:", response)

      // If successful, close the confirmation dialog and navigate to the queue page
      setShowConfirmation(false)

      // Show success message
      toast.success("Đặt vé thành công!")

      // Navigate to the queue page after a short delay
      setTimeout(() => {
        navigate("/payment/queue")
      }, 2000)
    } catch (error) {
      console.error("Error during payment confirmation:", error)
      setApiError(error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý thanh toán")
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý thanh toán")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <Toaster />
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <Link to="/">
          <div className="flex items-center ml-4">
            <img src={Logo || "/placeholder.svg"} alt="Event Ticket" className="h-12 w-auto mr-4" />
            <div className="text-[#FF8A00] font-semibold text-xl">TixClick</div>
          </div>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
            <X className="h-4 w-4 mr-2" />
            Hủy giao dịch
          </Button>
        </Link>
      </header>

      <div className="relative h-60 md:h-80 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A00]/20 to-[#FF8A00]/5"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            {selectedSeatsData?.eventInfo?.name || "Hòa nhạc Mùa Xuân 2024"}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-xl md:text-2xl mb-6"
          >
            <MapPin className="h-5 w-5 text-[#FF8A00]" />
            <span>{selectedSeatsData?.eventInfo?.location || "Nhà hát Lớn Hà Nội"}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3 bg-[#2A2A2A] px-6 rounded-full"
          >
            <Calendar className="h-5 w-5 text-[#FF8A00]" />
            <span className="font-medium">{selectedSeatsData?.eventInfo?.date || "Thứ Bảy, 30/03/2024 - 20:00"}</span>
          </motion.div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] transition-all duration-300 hover:border-[#FF8A00]/50">
            <h2 className="text-xl font-medium mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-[#FF8A00]" />
              Khuyến mãi
            </h2>

            <div className="mb-4">
              <label htmlFor="promo-code" className="block text-sm font-medium mb-2 text-gray-300">
                Mã khuyến mãi
              </label>
              <div className="flex gap-2">
                <Input
                  id="promo-code"
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                  placeholder="Nhập mã khuyến mãi"
                />
                <Button className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white px-6 transition-colors duration-300">
                  Áp Dụng
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Lưu ý: Chỉ áp dụng một mã khuyến mãi cho mỗi đơn hàng</p>
            </div>
          </section>

          <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] transition-all duration-300 hover:border-[#FF8A00]/50">
            <h2 className="text-xl font-medium mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-[#FF8A00]" />
              Phương thức thanh toán
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 border border-[#3A3A3A] rounded-md p-4 bg-[#2A2A2A] transition-all duration-300 hover:border-[#FF8A00] cursor-pointer">
                <div className="h-5 w-5 rounded-full bg-[#FF8A00] flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <Label className="flex items-center cursor-pointer text-white">
                  <img src={payOs || "/placeholder.svg"} alt="Payos" width={60} height={30} className="mr-2" />( payOS -
                  Thanh toán an toàn với thẻ nội địa, Visa, Master, JCB )
                </Label>
              </div>

              <div className="flex items-center space-x-3 border border-[#3A3A3A] rounded-md p-4 bg-[#2A2A2A] transition-all duration-300 hover:border-[#FF8A00] cursor-pointer opacity-60">
                <div className="h-5 w-5 rounded-full border border-gray-500 flex items-center justify-center"></div>
                <Label className="flex items-center cursor-pointer text-white">Ví điện tử (MoMo, ZaloPay, VNPay)</Label>
              </div>
            </div>

            <p className="text-xs text-[#FF8A00] mt-6">
              (*) Bằng việc click/chạm vào THANH TOÁN bên phải, bạn đã xác nhận hiểu rõ các Điều khoản và Điều kiện của
              chúng tôi.
            </p>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden sticky top-24">
            <div className="bg-[#2A2A2A] p-4 flex justify-between items-center">
              <h3 className="font-medium text-white">Chi tiết đơn hàng</h3>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1 text-[#FF8A00]" />
                <span>Còn lại: </span>
                <span className="text-[#FF8A00] font-medium ml-1">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex gap-4">
                <div className="w-fit h-full bg-gradient-to-br from-[#FF8A00]/30 to-[#FF8A00]/10 flex items-center justify-center">
                  <img
                    src={banner || "/placeholder.svg"}
                    alt="Event Poster"
                    width={120}
                    height={180}
                    className="rounded-md object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">
                    {selectedSeatsData?.eventInfo?.name || "Hòa nhạc Mùa Xuân 2024"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 text-[#FF8A00]" />
                    <span>{selectedSeatsData?.eventInfo?.date || "30/03/2024 - 20:00"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 text-[#FF8A00]" />
                    <span>{selectedSeatsData?.eventInfo?.location || "Nhà hát Lớn Hà Nội"}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4 border-[#2A2A2A]" />

              <div className="space-y-3">
                {selectedSeatsData?.seats ? (
                  selectedSeatsData.seats.map((seat: any, index: number) => (
                    <div key={seat.seatId || index} className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-2 text-xs">
                          1x
                        </div>
                        <div>
                          {seat.sectionName} - {seat.seatLabel} ({seat.typeName})
                        </div>
                      </div>
                      <div className="font-medium">{seat.formattedPrice}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-2 text-xs">
                          2x
                        </div>
                        <div>Vé Thường</div>
                      </div>
                      <div className="font-medium">600.000 đ</div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-2 text-xs">
                          1x
                        </div>
                        <div>Vé VIP</div>
                      </div>
                      <div className="font-medium">500.000 đ</div>
                    </div>
                  </>
                )}

                <Separator className="my-3 border-[#2A2A2A]" />

                <div className="flex justify-between font-medium">
                  <div>Tổng cộng</div>
                  <div className="text-[#FF8A00] text-lg">
                    {selectedSeatsData
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(selectedSeatsData.totalAmount)
                      : "1.100.000 đ"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A] hover:text-white transition-colors duration-300"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <Button
                  className="flex-1 bg-[#FF8A00] hover:bg-[#FF9A20] text-white transition-colors duration-300"
                  onClick={() => setShowConfirmation(true)}
                >
                  Thanh Toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogTitle className="text-center text-lg font-medium flex items-center justify-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#FF8A00]" />
            THÔNG TIN ĐẶT VÉ
          </DialogTitle>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium text-gray-400">Sự kiện</span>
              <div>
                <div className="font-medium text-white">
                  {selectedSeatsData?.eventInfo?.name || "Hòa nhạc Mùa Xuân 2024"}
                </div>
                <div className="text-sm mt-1 text-gray-400">
                  {selectedSeatsData?.eventInfo?.location || "Nhà hát Lớn Hà Nội"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium text-gray-400">Thời gian</span>
              <div>
                <div className="text-[#FF8A00] font-medium">
                  {selectedSeatsData?.eventInfo?.date || "20:00 - Thứ Bảy, 30/03/2024"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium text-gray-400">Vé</span>
              <div className="bg-[#2A2A2A] p-3 rounded-md">
                {selectedSeatsData?.seats ? (
                  selectedSeatsData.seats.map((seat: any, index: number) => (
                    <div key={seat.seatId || index} className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-2 text-xs">
                        1x
                      </div>
                      <div>
                        {seat.sectionName} - {seat.seatLabel} ({seat.typeName})
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-2 text-xs">
                        2x
                      </div>
                      <div>Vé Thường</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-2 text-xs">
                        1x
                      </div>
                      <div>Vé VIP</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium text-gray-400">Tổng</span>
              <div className="bg-[#FF8A00] text-white font-medium p-2 text-center rounded-md">
                {selectedSeatsData
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedSeatsData.totalAmount)
                  : "1.100.000 VND"}
              </div>
            </div>

            {apiError && (
              <div className="bg-red-900/50 border border-red-500 p-3 rounded-md text-sm text-red-200">
                <div className="font-medium mb-1">Lỗi:</div>
                <div>{apiError}</div>
              </div>
            )}

            <div className="flex items-start space-x-2 mt-2">
              <Checkbox
                id="terms"
                className="data-[state=checked]:bg-[#FF8A00] data-[state=checked]:border-[#FF8A00] bg-white"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none text-gray-300"
                onClick={() => setAcceptTerms(!acceptTerms)}
              >
                Tôi xác nhận các thông tin đặt vé đã chính xác
              </label>
            </div>
          </div>

          <Button
            className="w-full bg-[#FF8A00] hover:bg-[#FF9A20] text-white transition-colors duration-300 relative"
            onClick={handleConfirmPayment}
            disabled={isProcessing || !acceptTerms}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận và Thanh Toán"
            )}
          </Button>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
            >
              <div className="relative h-20 w-20 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF8A00] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-[#FF8A00]/20"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Đang xử lý thanh toán</h3>
              <p className="text-gray-300">Vui lòng đợi trong giây lát...</p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}






