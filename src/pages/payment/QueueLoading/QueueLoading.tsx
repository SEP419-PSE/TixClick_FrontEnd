import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Calendar, CheckCircle, CreditCard, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import type { EventDetailResponse } from "../../../interface/EventInterface";
import { formatDateVietnamese, formatTimeFe } from "../../../lib/utils";


export default function PaymentQueuePage() {
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID" | "CANCELED" | "FAILED">("PENDING");
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [eventInfor, setEventInfor] = useState<
    Pick<EventDetailResponse, "eventName" | "eventActivityDTOList" | "locationName">
  >();

  const navigate = useNavigate();
  const location = useLocation();
  const [discountInfo, setDiscountInfo] = useState<{
    code: string;
    discountAmount: number;
    discountPercentage: number;
  } | null>(null);

  const getQueryParams = (): Record<string, string> => {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    console.log("Query params:", params);
    return params;
  };

  // const rcCode = paymentData?.seats?.id?.split("-").slice(1).join("-") || "";

  const payOsApi = {
   checkPaymentStatus: async (queryParams: Record<string, string>) => {
      try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `https://tixclick.site/api/payment/payos_call_back${queryString ? `?${queryString}` : ""}`;
        console.log("Calling callback API:", url);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Missing access token. Please log in again.");
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Callback API failed: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error checking payment status:", error);
        throw error;
      }
    },

    createPaymentAttachment: async (ticketPurchaseId: number, accessToken: string, attachmentData: any) => {
      try {
        const response = await fetch(
          `https://tixclick.site/api/payment/ticket-purchase/${ticketPurchaseId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(attachmentData),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create payment attachment: ${response.status} ${errorText}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating payment attachment:", error);
        throw error;
      }
    },
  };

  // useEffect(() => {
  //   const fetchEventInfor = async () => {
  //     try {
  //       setIsLoadingEvent(true);
  //       const storedPaymentData = localStorage.getItem("paymentQueueData");

  //       if (storedPaymentData) {
  //         const parsedData = JSON.parse(storedPaymentData);
  //         const eventId = parsedData.eventInfo?.id;

  //         if (eventId) {
  //           const response = await eventApi.getEventDetail(Number(eventId));
  //           if (response.data.result.length !== 0) {
  //             setEventInfor(response.data.result);
  //             console.log("Event info:", response.data.result);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching event info:", error);
  //       toast.error("Failed to load event information");
  //     } finally {
  //       setIsLoadingEvent(false);
  //     }
  //   };

  //   fetchEventInfor();
  // }, []);

  // useEffect(() => {
  //   const storedPaymentData = localStorage.getItem("paymentQueueData");

  //   if (!storedPaymentData) {
  //     setPaymentError("No payment data found");
  //     setInitialLoading(false);
  //     toast.error("No payment data found");
  //     return;
  //   }

  //   try {
  //     const parsedData = JSON.parse(storedPaymentData);
  //     console.log("Payment queue data:", parsedData);
  //     setPaymentData(parsedData);

  //     if (parsedData?.voucher) {
  //       setDiscountInfo(parsedData.voucher);
  //     }

  //     const queryParams = new URLSearchParams(location.search);
  //     if (queryParams.has("orderCode")) {
  //       setInitialLoading(false);
  //       return;
  //     }

  //     const timer = setTimeout(() => {
  //       processPayment(parsedData);
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   } catch (error) {
  //     console.error("Error parsing payment queue data:", error);
  //     setPaymentError("Failed to parse payment data");
  //     setInitialLoading(false);
  //     toast.error("Error parsing payment data");
  //   }
  // }, [location.search]);

  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderCode = queryParams.get("orderCode");

    if (orderCode) {
      setIsVerifyingPayment(true);
      const allParams = getQueryParams();

      payOsApi
        .checkPaymentStatus(allParams)
        .then(async (response) => {
          if (response.data?.status === "PAID") {
            setPaymentStatus("PAID");
            setIsComplete(true);
            setShowConfetti(true);

            try {
              const storedPaymentData = localStorage.getItem("paymentQueueData");
              if (storedPaymentData) {
                const parsedData = JSON.parse(storedPaymentData);
                const ticketPurchaseId = parsedData.purchaseResponse?.result?.[0]?.ticketPurchaseId;

                if (ticketPurchaseId) {
                  const attachmentData = {
                    paymentMethod: "PAYOS",
                    amount: parsedData.discountedAmount || parsedData.totalAmount,
                    currency: "VND",
                    orderCode,
                    status: "PAID",
                    description: "Payment completed successfully",
                  };

                  await payOsApi.createPaymentAttachment(
                    ticketPurchaseId,
                    localStorage.getItem("accessToken") || "",
                    attachmentData,
                  );
                  console.log("Payment attachment created successfully");
                }
              }
            } catch (attachmentError) {
              console.error("Error creating payment attachment:", attachmentError);
              toast.error("Error saving payment information");
            }
          } else if (response.data?.status === "CANCELED") {
            setPaymentStatus("CANCELED");
            setPaymentError("Payment was canceled");
          } else {
            setPaymentStatus("FAILED");
            setPaymentError("Payment failed");
          }
        })
        .catch((error) => {
          console.error("Error verifying payment:", error);
          setPaymentStatus("FAILED");
          setPaymentError(error.message || "Failed to verify payment. Please try again.");
          toast.error(error.message || "Failed to verify payment");
        })
        .finally(() => {
          setIsVerifyingPayment(false);
          setInitialLoading(false);
        });
    } else {
      console.warn("No orderCode found in URL");
      setPaymentError("No transaction information found");
      setInitialLoading(false);
    }
  }, [location.search]);

  const processPayment = async (data: any) => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Please log in to continue payment");
      }

      const ticketPurchaseId =
        data?.purchaseResponse?.result?.[0]?.ticketPurchaseId ||
        data?.apiResponses?.purchase?.result?.[0]?.ticketPurchaseId;

      if (!ticketPurchaseId || isNaN(ticketPurchaseId)) {
        throw new Error("Invalid or missing transaction ID");
      }

    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError(error instanceof Error ? error.message : "Error processing payment");
      toast.error(error instanceof Error ? error.message : "Error processing payment");
    } finally {
      setIsProcessingPayment(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoading) return;

    const timer = setTimeout(() => {
      if (!isProcessingPayment && !isVerifyingPayment) {
        setInitialLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [initialLoading, isProcessingPayment, isVerifyingPayment]);

  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ["#FF8A00", "#FFFFFF"];

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const confettiInterval = setInterval(() => {
        if (Date.now() > animationEnd) {
          clearInterval(confettiInterval);
          return;
        }

        confetti({
          particleCount: 2,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { y: 0.6 },
          colors,
        });
      }, 200);

      return () => clearInterval(confettiInterval);
    }
  }, [showConfetti]);

  const handleViewTickets = () => {
    navigate("/ticketManagement");
  };

  const handleRetryPayment = () => {
    localStorage.removeItem("paymentQueueData");
    if (paymentData) {
      setInitialLoading(true);
      setPaymentError(null);
      processPayment(paymentData);
    }
  };

  const getFormattedEventDateTime = () => {
    if (eventInfor?.eventActivityDTOList && paymentData?.eventInfo?.activityId) {
      const activity = eventInfor.eventActivityDTOList.find(
        (x) => x.eventActivityId == Number(paymentData.eventInfo.activityId),
      );
      if (activity) {
        return `${formatTimeFe(activity.startTimeEvent)}, ${formatDateVietnamese(activity.dateEvent.toString())}`;
      }
    }
    return paymentData?.eventInfo?.date || "19:30, 12 tháng 4, 2025";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  if (initialLoading || isProcessingPayment || isVerifyingPayment) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <div className="relative h-20 w-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#FF8A00] border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-[#FF8A00]/20"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isProcessingPayment
              ? "Connecting to payment gateway"
              : isVerifyingPayment
              ? "Verifying payment"
              : "Preparing transaction"}
          </h3>
          <p className="text-gray-300">Please wait a moment...</p>
        </motion.div>
      </div>
    );
  }

  if (paymentError || paymentStatus === "CANCELED" || paymentStatus === "FAILED") {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6 max-w-md w-full">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-16 w-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {paymentStatus === "CANCELED" ? "Payment Canceled" : "Payment Error"}
            </h2>
            <p className="text-gray-400">{paymentError || "Payment failed. Please try again."}</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full bg-[#FF8A00] hover:bg-[#FF9A20] text-white" onClick={handleRetryPayment}>
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A]"
              onClick={() => navigate("/payment")}
            >
              Back to Payment Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col">
      <Toaster />
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] py-3 px-4 flex justify-between items-center">
        <div className="flex items-center ml-4">
          <div className="text-[#FF8A00] font-bold text-2xl">TixClick</div>
        </div>
        <div className="text-sm text-gray-400">
          Transaction ID: <span className="text-white font-medium">{getQueryParams().orderCode || paymentData?.transactionId}</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto py-8 px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden"
        >
          <div className="bg-[#2A2A2A] p-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <h1 className="text-xl font-bold">Payment Successful!</h1>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-col md:flex-row gap-5 mb-6">
              <div className="w-full md:w-[180px] h-[200px] bg-[#2A2A2A] rounded-md overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-[#FF8A00]/30 to-[#FF8A00]/10 flex items-center justify-center">
                  <Ticket className="h-16 w-16 text-[#FF8A00]/70" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{eventInfor?.eventName || paymentData?.eventInfo?.name}</h2>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-[#FF8A00] mr-3" />
                    <span>{getFormattedEventDateTime()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-[#FF8A00] mr-3" />
                    <span>{eventInfor?.locationName || paymentData?.eventInfo?.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Ticket className="h-5 w-5 text-[#FF8A00] mr-3" />
                    <span>
                      {paymentData?.seats
                        ? `${paymentData.seats.length}x Ticket (${paymentData.seats.map((s: any) => s.typeName).join(", ")})`
                        : "No ticket information"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-[#FF8A00] mr-3" />
                    <span>Paid via PayOS</span>
                  </div>
                </div>
                <div className="mt-4 bg-green-900/20 border border-green-800 rounded-md p-3 text-green-400 flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Successful!</p>
                    <p className="text-sm mt-1">Tickets have been sent to your email.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 border-[#2A2A2A]" />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Payment Details</h3>
              <div className="bg-[#2A2A2A] rounded-md p-4 space-y-3">
                {paymentData?.seats?.map((seat: any, index: number) => (
                  <div key={seat.seatId || index} className="flex justify-between">
                    <span className="text-gray-400">
                      1x {seat.sectionName} - {seat.seatLabel} ({seat.typeName})
                    </span>
                    <span>{formatCurrency(seat.price || 0)}</span>
                  </div>
                ))}
                {discountInfo && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span>{formatCurrency(paymentData.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-green-400 text-sm">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Discount ({discountInfo.code})
                      </span>
                      <span>
                        {discountInfo.discountPercentage > 0
                          ? `-${discountInfo.discountPercentage}%`
                          : `-${formatCurrency(discountInfo.discountAmount)}`}
                      </span>
                    </div>
                  </>
                )}
                <Separator className="border-[#3A3A3A]" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-[#FF8A00]">{formatCurrency(paymentData?.discountedAmount || paymentData?.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white" onClick={handleViewTickets}>
                View My Tickets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A] py-4 px-4 text-center text-sm text-gray-400">
        <p>© 2025 TixClick. All rights reserved.</p>
        <p className="mt-1">
          Contact support: <span className="text-[#FF8A00]">support@tixclick.com</span>
        </p>
      </footer>
    </div>
  );
}