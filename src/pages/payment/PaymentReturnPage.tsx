// import { useEffect, useState } from "react"
// import { useNavigate, useSearchParams } from "react-router-dom"

// const PaymentReturnPage = () => {
//   const [searchParams] = useSearchParams()
//   const navigate = useNavigate()
//   const [status, setStatus] = useState("loading")

//   useEffect(() => {
//     // Extract payment status directly from URL parameters
//     const paymentStatus = searchParams.get("status")
//     const responseCode = searchParams.get("code")
    
//     // Check if payment was successful based on URL parameters
//     if (paymentStatus === "PAID" && responseCode === "00") {
//       setStatus("success")
//     } else {
//       setStatus("fail")
//     }
//   }, [searchParams])

//   const handleBackHome = () => {
//     navigate("/")
//   }

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
//       {status === "loading" && <div style={{ fontSize: "18px" }}>🔄 Đang kiểm tra thanh toán...</div>}

//       {status === "success" && (
//         <div>
//           <h1 style={{ color: "green" }}>✅ Thanh toán thành công!</h1>
//           <p>Cảm ơn bạn đã mua vé tại TixClick.</p>
//           <button
//             onClick={handleBackHome}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#007bff",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Về trang chủ
//           </button>
//         </div>
//       )}

//       {status === "fail" && (
//         <div>
//           <h1 style={{ color: "red" }}>❌ Thanh toán thất bại!</h1>
//           <p>Giao dịch không thành công hoặc bị hủy. Vui lòng thử lại.</p>
//           <button
//             onClick={handleBackHome}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#dc3545",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Quay lại trang chủ
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PaymentReturnPage