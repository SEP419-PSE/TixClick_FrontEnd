import { Outlet, useLocation } from "react-router";
import NavbarCompany from "./components/NavbarCompany";
import CompanyAccount from "./components/CompanyAccount";
import { Bell } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Client } from "@stomp/stompjs";
import Avatar from "../../assets/AvatarHuy.jpg";

const CompanyDashBoard = () => {
  const context = useContext(AuthContext);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    // Nếu có token, lấy username từ token
    if (context?.accessToken) {
      try {
        const tokenParts = context.accessToken.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setCurrentUser(payload.sub || "unknown");
          console.log("👤 Current user:", payload.sub);
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }

    // Kết nối WebSocket khi component được mount
    connectWebSocket();

    // Cleanup khi component unmount
    return () => {
      if (stompClient) {
        stompClient.deactivate();
        console.log("🔌 WebSocket disconnected");
      }
    };
  }, [context?.accessToken]);

  const connectWebSocket = () => {
    const brokerURL = `ws://160.191.175.172:8080/ws?token=${context?.accessToken}`;
    console.log("🔗 WebSocket URL:", brokerURL);

    const client = new Client({
      brokerURL,
      debug: (str: any) => console.log(str),
      onConnect: (frame: any) => {
        console.log("✅ Connected to WebSocket:", frame);
        setConnectionStatus("Connected");

        // Đăng ký nhận tin nhắn riêng tư
        client.subscribe("/user/specific/messages", (message: any) => {
          try {
            console.log("📩 Received private message:", message.body);
            const messageData = JSON.parse(message.body);
            // Format: From {sender}: {content}
            setMessages((prev) => [
              ...prev,
              `From ${messageData.sender}: ${messageData.content}`,
            ]);
          } catch (e) {
            console.error("Error parsing private message:", e);
            // Fallback for old format
            setMessages((prev) => [...prev, `Private: ${message.body}`]);
          }
        });
      },
      onStompError: (frame: any) => {
        console.error("❌ Broker error: ", frame.headers["message"]);
        setConnectionStatus("Error: " + frame.headers["message"]);
      },
      onDisconnect: () => {
        console.log("🔌 Disconnected from WebSocket");
        setConnectionStatus("Disconnected");
      },
    });

    client.activate();
    setStompClient(client);
  };

  const handleOpenNotification = () => {
    setOpenNotification(!openNotification);
  };

  return (
    <>
      {location.pathname !== "/company/profile" && <NavbarCompany />}

      <div
        className={`bg-pse-black-light ${
          location.pathname !== "/company/profile" && "lg:pl-[300px]"
        }  text-white min-h-screen font-inter text-[16px]`}
      >
        <div className="flex items-center px-6 pt-6 justify-end font-semibold">
          <button className="mr-auto" onClick={handleOpenNotification}>
            <Bell />
            <div
              className={`absolute border border-pse-gray rounded-lg bg-pse-black z-10 ${
                openNotification ? "block" : "hidden"
              }`}
            >
              <div className="flex gap-4 hover:bg-gray-800 p-4 rounded-lg">
                <img src={Avatar} className="rounded-full w-12 h-12" />
                <div className="flex flex-col items-start">
                  <p>Đã chấp nhận đơn của bạn</p>
                  <p className="text-pse-gray">Ngày tháng năm </p>
                </div>
              </div>
              <div className="flex gap-4 hover:bg-gray-800 p-4 rounded-lg">
                <img src={Avatar} className="rounded-full w-12 h-12" />
                <div className="flex flex-col items-start">
                  <p>Đã chấp nhận đơn của bạn</p>
                  <p className="text-pse-gray">Ngày tháng năm </p>
                </div>
              </div>
            </div>
          </button>
          <CompanyAccount />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default CompanyDashBoard;
