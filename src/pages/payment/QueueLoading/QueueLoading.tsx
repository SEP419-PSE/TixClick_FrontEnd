import { useEffect, useState } from "react"

import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, Calendar, CheckCircle, Clock, CreditCard, MapPin, Ticket, Users } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { Separator } from "../../../components/ui/separator"


export default function PaymentQueuePage() {
    const [progress, setProgress] = useState(0)
    const [queuePosition, setQueuePosition] = useState(15)
    const [estimatedTime, setEstimatedTime] = useState(180) // seconds
    const [isComplete, setIsComplete] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
  
    // Format time from seconds to MM:SS
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }
  
    // Initial loading animation
    useEffect(() => {
      const timer = setTimeout(() => {
        setInitialLoading(false)
      }, 1500)
  
      return () => clearTimeout(timer)
    }, [])
  
    // Simulate queue progress
    useEffect(() => {
      if (initialLoading) return
  
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            clearInterval(interval)
            setIsComplete(true)
            setShowConfetti(true)
            return 100
          }
          return newProgress
        })
  
        setQueuePosition((prev) => {
          if (prev <= 1) return 1
          // Decrease queue position more rapidly as progress increases
          const decrease = Math.random() > 0.7 ? 1 : 0
          return prev - decrease
        })
  
        setEstimatedTime((prev) => {
          if (prev <= 0) return 0
          return prev - 1
        })
      }, 1000)
  
      return () => clearInterval(interval)
    }, [initialLoading])
  
    // Trigger confetti effect when complete
    useEffect(() => {
      if (showConfetti) {
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const colors = ["#FF8A00", "#FFFFFF"]
  
        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min
        }
  
        const confettiInterval = setInterval(() => {
          const timeLeft = animationEnd - Date.now()
  
          if (timeLeft <= 0) {
            clearInterval(confettiInterval)
            return
          }
  
          confetti({
            particleCount: 2,
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { y: 0.6 },
            colors: colors,
          })
        }, 200)
  
        return () => clearInterval(confettiInterval)
      }
    }, [showConfetti])
  
    if (initialLoading) {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <div className="relative h-20 w-20 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-[#FF8A00] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#FF8A00]/20"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Đang chuẩn bị giao dịch</h3>
            <p className="text-gray-300">Vui lòng đợi trong giây lát...</p>
          </motion.div>
        </div>
      )
    }
  
    return (
      <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col">
        <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] py-3 px-4 flex justify-between items-center">
          <div className="flex items-center ml-4">
            <div className="text-[#FF8A00] font-bold text-2xl">TixClick</div>
          </div>
          <div className="text-sm text-gray-400">
            ID Giao dịch: <span className="text-white font-medium">TIX-24032023-8721</span>
          </div>
        </header>
  
        <main className="flex-1 max-w-4xl mx-auto py-8 px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#2A2A2A] p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center">
                  {isComplete ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  ) : (
                    <div className="relative mr-3">
                      <div className="h-6 w-6 rounded-full border-2 border-[#FF8A00] border-t-transparent animate-spin"></div>
                      <Clock className="h-3 w-3 text-[#FF8A00] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )}
                  <h1 className="text-xl font-bold">
                    {isComplete ? "Thanh toán thành công!" : "Đang xử lý thanh toán..."}
                  </h1>
                </div>
  
                {!isComplete && (
                  <div className="flex items-center bg-[#232323] px-3 py-2 rounded-full text-sm">
                    <Users className="h-4 w-4 text-[#FF8A00] mr-2" />
                    <span>
                      Vị trí trong hàng chờ: <strong className="text-white">{queuePosition}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
  
            {/* Progress bar */}
            {!isComplete && (
              <div className="px-5 py-4 border-b border-[#2A2A2A]">
                <div className="flex justify-between text-sm mb-2">
                  <span>Tiến trình xử lý</span>
                  <span className="text-[#FF8A00]">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-[#2A2A2A]" />
                <div className="mt-3 text-sm text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#FF8A00]" />
                  <span>
                    Thời gian chờ ước tính: <strong className="text-white">{formatTime(estimatedTime)}</strong>
                  </span>
                </div>
              </div>
            )}
  
            {/* Content */}
            <div className="p-5">
              {/* Event info */}
              <div className="flex flex-col md:flex-row gap-5 mb-6">
                <div className="w-full md:w-[180px] h-[200px] bg-[#2A2A2A] rounded-md overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-[#FF8A00]/30 to-[#FF8A00]/10 flex items-center justify-center">
                    <Ticket className="h-16 w-16 text-[#FF8A00]/70" />
                  </div>
                </div>
  
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-3">Hòa nhạc Mùa Xuân 2024</h2>
  
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-[#FF8A00] mr-3" />
                      <span>Thứ Bảy, 30/03/2024 - 20:00</span>
                    </div>
  
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-[#FF8A00] mr-3" />
                      <span>Nhà hát Lớn Hà Nội</span>
                    </div>
  
                    <div className="flex items-center">
                      <Ticket className="h-5 w-5 text-[#FF8A00] mr-3" />
                      <span>2x Vé Thường, 1x Vé VIP</span>
                    </div>
  
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-[#FF8A00] mr-3" />
                      <span>Thanh toán qua Payos</span>
                    </div>
                  </div>
  
                  {isComplete && (
                    <div className="mt-4 bg-green-900/20 border border-green-800 rounded-md p-3 text-green-400 flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Thanh toán thành công!</p>
                        <p className="text-sm mt-1">
                          Vé của bạn đã được gửi đến email đăng ký. Vui lòng kiểm tra hộp thư của bạn.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              <Separator className="my-6 border-[#2A2A2A]" />
  
              {/* Payment details */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Chi tiết thanh toán</h3>
  
                <div className="bg-[#2A2A2A] rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">2x Vé Thường</span>
                    <span>600.000 đ</span>
                  </div>
  
                  <div className="flex justify-between">
                    <span className="text-gray-400">1x Vé VIP</span>
                    <span>500.000 đ</span>
                  </div>
  
                  <Separator className="border-[#3A3A3A]" />
  
                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng</span>
                    <span className="text-[#FF8A00]">1.100.000 đ</span>
                  </div>
                </div>
              </div>
  
              {/* Notes */}
              {!isComplete && (
                <div className="bg-[#2A2A2A] rounded-md p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-[#FF8A00] mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-white mb-1">Vui lòng không đóng trang này</p>
                      <p className="text-gray-400">
                        Hệ thống đang xử lý giao dịch của bạn. Việc đóng trang có thể làm gián đoạn quá trình thanh toán.
                      </p>
                    </div>
                  </div>
                </div>
              )}
  
              {/* Actions */}
              <div className="flex justify-end">
                {isComplete ? (
                  <Button className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white">
                    Xem vé của tôi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-[#2A2A2A] text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  >
                    Hủy và quay lại
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
  
          {/* FAQ */}
          <div className="mt-8 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-5">
            <h3 className="text-lg font-medium mb-4">Câu hỏi thường gặp</h3>
  
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-1">Tại sao tôi phải chờ trong hàng đợi?</h4>
                <p className="text-gray-400">
                  Hệ thống đang xử lý nhiều giao dịch cùng lúc. Việc xếp hàng giúp đảm bảo tất cả giao dịch được xử lý
                  công bằng và hiệu quả.
                </p>
              </div>
  
              <div>
                <h4 className="font-medium text-white mb-1">Tôi có thể đóng trang này không?</h4>
                <p className="text-gray-400">
                  Chúng tôi khuyến nghị bạn không đóng trang cho đến khi quá trình thanh toán hoàn tất để tránh mất vé
                  hoặc phải thanh toán lại.
                </p>
              </div>
  
              <div>
                <h4 className="font-medium text-white mb-1">Tôi sẽ nhận vé ở đâu?</h4>
                <p className="text-gray-400">
                  Sau khi thanh toán thành công, vé điện tử sẽ được gửi đến email bạn đã đăng ký. Bạn cũng có thể xem vé
                  trong tài khoản TixClick của mình.
                </p>
              </div>
            </div>
          </div>
        </main>
  
        <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A] py-4 px-4 text-center text-sm text-gray-400">
          <p>© 2024 TixClick. Tất cả các quyền được bảo lưu.</p>
          <p className="mt-1">
            Nếu bạn gặp vấn đề, vui lòng liên hệ <span className="text-[#FF8A00]">support@tixclick.com</span>
          </p>
        </footer>
      </div>
    )
  }

