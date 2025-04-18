import { motion } from "framer-motion"
import { ArrowLeft, Calendar, CheckCircle, Clock, CreditCard, Loader2, MapPin, Tag, X } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import banner from "../../assets/banner.jpg"
import Logo from "../../assets/Logo.png"
import payOs from "../../assets/payOs.svg"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"

import { Client } from "@stomp/stompjs"
import { Link, useNavigate, useSearchParams } from "react-router"
import { toast, Toaster } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { AuthContext } from "../../contexts/AuthProvider"
import { EventDetailResponse } from "../../interface/EventInterface"
import { formatDateVietnamese, formatTimeFe } from "../../lib/utils"
import eventApi from "../../services/eventApi"

export default function PaymentPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get("eventId")
  const eventActivityId = searchParams.get("eventActivityId")
  const [selectedSeatsData, setSelectedSeatsData] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [purchaseResponse, setPurchaseResponse] = useState<any>(null)
  const [isTimeoutBoundFromServer, setIsTimeoutBoundFromServer] = useState(false)
  const [eventInfor, setEventInfor] =
    useState<Pick<EventDetailResponse, "eventName" | "eventActivityDTOList" | "locationName">>()
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)

  const stompClientRef = useRef<Client | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const context = useContext(AuthContext)

  // Fetch event information
  useEffect(() => {
    const fetchEventInfor = async () => {
      setIsLoadingEvent(true)
      try {
        if (!eventId) {
          // Try to get eventId from localStorage
          const storedSeatsData = localStorage.getItem("selectedSeats")
          if (storedSeatsData) {
            const parsedData = JSON.parse(storedSeatsData)
            if (parsedData.eventInfo?.id) {
              const response = await eventApi.getEventDetail(Number(parsedData.eventInfo.id))
              if (response.data.result.length != 0) {
                setEventInfor(response.data.result)
                console.log("Event info fetched from API:", response.data.result)
              }
            }
          }
        } else {
          const response = await eventApi.getEventDetail(Number(eventId))
          if (response.data.result.length != 0) {
            setEventInfor(response.data.result)
            console.log("Event info fetched from API:", response.data.result)
          }
        }
      } catch (error) {
        console.error("Error fetching event information:", error)
        toast.error("Không thể tải thông tin sự kiện")
      } finally {
        setIsLoadingEvent(false)
      }
    }
    fetchEventInfor()
  }, [eventId])

  useEffect(() => {
    const setupWebSocketAndTimer = () => {
      // Clear any existing interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }

      // Get the ticketPurchaseId from localStorage or state
      const storedSeatsData = localStorage.getItem("selectedSeats")
      let ticketPurchaseId = null

      if (storedSeatsData) {
        const parsedData = JSON.parse(storedSeatsData)
        if (parsedData.apiResponses?.purchase?.result?.[0]?.ticketPurchaseId) {
          ticketPurchaseId = parsedData.apiResponses.purchase.result[0].ticketPurchaseId
        }
      }

      // If we have a ticketPurchaseId, connect to WebSocket
      if (ticketPurchaseId) {
        console.log("Setting up WebSocket connection for ticketPurchaseId:", ticketPurchaseId)

        // Handle WebSocket messages
        const handleWebSocketMessage = (message: any) => {
          console.log("WebSocket message received:", message)

          // Handle different message types
          if (message.type === "TICKET_PURCHASE_EXPIRATION_UPDATE") {
            // Update the countdown timer with server-provided values
            const serverTimeRemaining = message.timeRemainingSeconds || 0
            setIsTimeoutBoundFromServer(true)
            setMinutes(Math.floor(serverTimeRemaining / 60))
            setSeconds(serverTimeRemaining % 60)

            // Chỉ hiển thị thông báo khi còn ít thời gian (ví dụ: dưới 2 phút)
            if (serverTimeRemaining < 120) {
              toast.info(
                `Thời gian thanh toán còn lại: ${Math.floor(serverTimeRemaining / 60)}:${(serverTimeRemaining % 60).toString().padStart(2, "0")}`,
              )
            }
          } else if (message.type === "TICKET_PURCHASE_EXPIRED") {
            // Handle expiration event
            toast.error("Thời gian giữ vé đã hết")
            setTimeout(() => {
              navigate("/")
            }, 2000)
          }
        }

        // Connect to WebSocket
        stompClientRef.current = websocketService.connect(ticketPurchaseId, handleWebSocketMessage)

        // Gửi yêu cầu cập nhật thời gian còn lại ngay sau khi kết nối
        const requestTimeUpdate = () => {
          if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
              destination: `/app/ticket-purchase/${ticketPurchaseId}/request-time`,
              body: JSON.stringify({ requestId: Date.now() }),
            })
            console.log("Sent time update request")
          }
        }

        // Sau 1 giây khi kết nối, gửi yêu cầu cập nhật thời gian
        setTimeout(requestTimeUpdate, 1000)
      }

      // Set up the local countdown timer (as backup or until we get server updates)
      countdownIntervalRef.current = setInterval(() => {
        // Chỉ sử dụng bộ đếm ngược cục bộ nếu không nhận được cập nhật từ máy chủ
        if (!isTimeoutBoundFromServer) {
          setSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
              return prevSeconds - 1
            } else if (minutes > 0) {
              setMinutes((prevMinutes) => prevMinutes - 1)
              return 59
            } else {
              // Time's up
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
              }
              toast.error("Hết thời gian thanh toán")
              setTimeout(() => {
                navigate("/")
              }, 2000)
              return 0
            }
          })
        }
      }, 1000)

      // Định kỳ yêu cầu cập nhật thời gian từ máy chủ (mỗi 30 giây)
      const periodicalUpdateTimerRef = setInterval(() => {
        if (ticketPurchaseId && stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.publish({
            destination: `/app/ticket-purchase/${ticketPurchaseId}/request-time`,
            body: JSON.stringify({ requestId: Date.now() }),
          })
          console.log("Sent periodic time update request")
        }
      }, 30000) // Mỗi 30 giây

      // Return cleanup function
      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
        if (periodicalUpdateTimerRef) {
          clearInterval(periodicalUpdateTimerRef)
        }
      }
    }

    const cleanup = setupWebSocketAndTimer()

    // Cleanup function
    return () => {
      if (cleanup) cleanup()
      if (stompClientRef.current) {
        websocketService.disconnect()
      }
    }
  }, [navigate, minutes, isTimeoutBoundFromServer])

  useEffect(() => {
    // Load selected seats data
    const storedSeatsData = localStorage.getItem("selectedSeats")
    if (storedSeatsData) {
      const parsedData = JSON.parse(storedSeatsData)
      setSelectedSeatsData(parsedData)

      if (parsedData.apiResponses) {
        console.log("Ticket API response:", parsedData.apiResponses.ticket)
        console.log("Seat API responses:", parsedData.apiResponses.seats)
        console.log("Purchase API response:", JSON.stringify(parsedData.apiResponses.purchase, null, 2))
        console.log("Purchase Response:", parsedData.apiResponses.purchase.result)
      }

      // Log the ticketPurchaseId
      if (parsedData.ticketPurchaseId) {
        console.log("Ticket Purchase ID:", parsedData.ticketPurchaseId)
      }
    } else {
      // If no data is found, redirect back to the booking page
      toast.error("Không tìm thấy thông tin đặt vé")
      setTimeout(() => {
        navigate("/")
      }, 1500)
    }

    // Load purchase response
    const storedPurchaseResponse = localStorage.getItem("purchaseResponse")
    if (storedPurchaseResponse) {
      try {
        const parsedResponse = JSON.parse(storedPurchaseResponse)
        setPurchaseResponse(parsedResponse)
        console.log("Loaded purchase response:", parsedResponse)
      } catch (error) {
        console.error("Error parsing purchase response:", error)
      }
    }
  }, [navigate])

  // Update the handleConfirmPayment function to pass parameters to the queue page
  const handleConfirmPayment = async () => {
    if (!acceptTerms) return

    setIsProcessing(true)
    setApiError(null)

    try {
      // Get the purchase response from state or localStorage
      const response =
        purchaseResponse ||
        selectedSeatsData?.apiResponses?.purchase ||
        JSON.parse(localStorage.getItem("purchaseResponse") || "null")

      if (!response) {
        throw new Error("Không tìm thấy thông tin đặt vé")
      }

      console.log("Using purchase response:", response)

      // Get the ticketPurchaseId from the response
      const ticketPurchaseId = response.result[0]?.ticketPurchaseId

      if (!ticketPurchaseId) {
        throw new Error("Không tìm thấy ID mua vé")
      }

      console.log("Using ticket purchase ID:", ticketPurchaseId)

      // Store all the necessary data for the queue page
      const queueData = {
        purchaseResponse: response,
        eventInfo: {
          id: eventId || selectedSeatsData?.eventInfo?.id,
          activityId: eventActivityId || selectedSeatsData?.eventInfo?.activityId,
          name: eventInfor?.eventName || selectedSeatsData?.eventInfo?.name,
          location: eventInfor?.locationName || selectedSeatsData?.eventInfo?.location,
          date:
            eventInfor?.eventActivityDTOList && eventActivityId
              ? `${formatTimeFe(eventInfor.eventActivityDTOList.find((x) => x.eventActivityId == Number(eventActivityId))?.startTimeEvent)} - ${formatTimeFe(eventInfor.eventActivityDTOList.find((x) => x.eventActivityId == Number(eventActivityId))?.endTimeEvent)}, ${formatDateVietnamese(eventInfor.eventActivityDTOList.find((x) => x.eventActivityId == Number(eventActivityId))?.dateEvent.toString())}`
              : selectedSeatsData?.eventInfo?.date,
        },
        seats: selectedSeatsData.seats,
        totalAmount: selectedSeatsData.totalAmount,
        transactionId: `TIX-${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        apiResponses: {
          purchase: response,
        },
      }

      // Save to localStorage for the queue page to access
      localStorage.setItem("paymentQueueData", JSON.stringify(queueData))

      // Close the confirmation dialog
      setShowConfirmation(false)

      // Show success message
      toast.success("Đang chuyển hướng đến trang thanh toán!")

      // Navigate to the queue page after a short delay
      setTimeout(() => {
        navigate("/payment/queue")
      }, 1500)
    } catch (error) {
      console.error("Error during payment confirmation:", error)
      setApiError(error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý thanh toán")
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý thanh toán")
      setIsProcessing(false)
    }
  }

  const websocketService = {
    client: null as Client | null,

    connect: (ticketPurchaseId: string, onMessageReceived: (message: any) => void): Client | null => {
      if (typeof window === "undefined") return null

      const client = new Client({
        brokerURL: `wss://tixclick.site/ws?token=${context?.accessToken}`,
        connectHeaders: {
          // Authorization: `Bearer ${context.accessToken}`,
        },
        debug: (str) => {
          console.log("STOMP: " + str)
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log("✅ WebSocket connected")

          // Đăng ký nhận thông báo hết hạn
          client.subscribe(`/all/${ticketPurchaseId}/ticket-purchase-expired`, (message) => {
            try {
              const body = JSON.parse(message.body)
              console.log("📥 Received expired message:", body)
              onMessageReceived(body)
            } catch (e) {
              console.log("⚠️ Raw message:", message.body)
            }
          })

          // Đăng ký nhận cập nhật thời gian còn lại
          client.subscribe(`/user/${ticketPurchaseId}/ticket-purchase-time-update`, (message) => {
            try {
              const body = JSON.parse(message.body)
              console.log("📥 Received time update:", body)
              onMessageReceived({
                type: "TICKET_PURCHASE_EXPIRATION_UPDATE",
                timeRemainingSeconds: body.timeRemainingSeconds,
              })
            } catch (e) {
              console.log("⚠️ Raw time update message:", message.body)
            }
          })

          // Gửi yêu cầu để nhận thời gian còn lại ban đầu
          client.publish({
            destination: `/all/ticket-purchase/${ticketPurchaseId}/request-time`,
            body: JSON.stringify({ requestId: Date.now() }),
          })
        },
        onStompError: (frame) => {
          console.error("❌ STOMP error:", frame)
        },
        onWebSocketClose: () => {
          console.log("🔌 WebSocket connection closed")
        },
        onWebSocketError: (error) => {
          console.error("❌ WebSocket error:", error)
          // Thử kết nối lại sau 3 giây
          setTimeout(() => {
            if (client) client.activate()
          }, 3000)
        },
      })

      websocketService.client = client
      client.activate()
      return client
    },

    disconnect: () => {
      if (websocketService.client && websocketService.client.connected) {
        websocketService.client.deactivate()
        websocketService.client = null
        console.log("🔌 WebSocket connection closed")
      }
    },

    // Thêm phương thức để yêu cầu cập nhật thời gian
    requestTimeUpdate: (ticketPurchaseId: string) => {
      if (websocketService.client && websocketService.client.connected) {
        websocketService.client.publish({
          destination: `/all/ticket-purchase/${ticketPurchaseId}/request-time`,
          body: JSON.stringify({ requestId: Date.now() }),
        })
        console.log("Sent manual time update request")
        return true
      }
      return false
    },
  }

  // Format event date and time
  const getFormattedEventDateTime = () => {
    if (eventInfor?.eventActivityDTOList && eventActivityId) {
      const activity = eventInfor.eventActivityDTOList.find((x) => x.eventActivityId == Number(eventActivityId))
      if (activity) {
        return `${formatTimeFe(activity.startTimeEvent)}, ${formatDateVietnamese(activity.dateEvent.toString())}`
      }
    }
    return selectedSeatsData?.eventInfo?.date || "19:30, 12 tháng 4, 2025"
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
          {isLoadingEvent ? (
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-2 border-[#FF8A00] border-t-transparent animate-spin mb-4"></div>
              <p>Đang tải thông tin sự kiện...</p>
            </div>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-center"
              >
                {eventInfor?.eventName || selectedSeatsData?.eventInfo?.name || "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!"}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-2 text-xl md:text-2xl mb-6"
              >
                <MapPin className="h-5 w-5 text-[#FF8A00]" />
                <span>
                  {eventInfor?.locationName || selectedSeatsData?.eventInfo?.location || "Nhà Hát Kịch IDECAF"}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3 bg-[#2A2A2A] px-6 rounded-full"
              >
                <Calendar className="h-5 w-5 text-[#FF8A00]" />
                <span className="font-medium">{getFormattedEventDateTime()}</span>
              </motion.div>
            </>
          )}
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
                    {eventInfor?.eventName ||
                      selectedSeatsData?.eventInfo?.name ||
                      "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 text-[#FF8A00]" />
                    <span>{getFormattedEventDateTime()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 text-[#FF8A00]" />
                    <span>
                      {eventInfor?.locationName || selectedSeatsData?.eventInfo?.location || "Nhà Hát Kịch IDECAF"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-4 border-[#2A2A2A]" />

              <div className="space-y-3">
                {selectedSeatsData?.seats ? (
                  selectedSeatsData.seats.map((seat: any, index: number) => (
                    <div key={seat.id || index} className="flex justify-between text-sm">
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
                  {eventInfor?.eventName || selectedSeatsData?.eventInfo?.name || "Nhà Hát Kịch IDECAF: MÁ ƠI ÚT DÌA!"}
                </div>
                <div className="text-sm mt-1 text-gray-400">
                  {eventInfor?.locationName || selectedSeatsData?.eventInfo?.location || "Nhà Hát Kịch IDECAF"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium text-gray-400">Thời gian</span>
              <div>
                <div className="text-[#FF8A00] font-medium">{getFormattedEventDateTime()}</div>
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start">
              <span className="font-medium text-gray-400">Vé</span>
              <div className="bg-[#2A2A2A] p-3 rounded-md">
                {selectedSeatsData?.seats ? (
                  selectedSeatsData.seats.map((seat: any, index: number) => (
                    <div key={seat.id || index} className="flex items-center mb-1">
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
