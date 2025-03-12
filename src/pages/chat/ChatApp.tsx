import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const ChatApp: React.FC = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [privateStompClient, setPrivateStompClient] = useState<Client | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [toUser, setToUser] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const publicClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      debug: console.log,
      onConnect: (frame) => {
        console.log("Connected: ", frame);
        publicClient.subscribe("/all/messages", (message) => {
          setMessages((prev) => [...prev, JSON.parse(message.body).text]);
        });
      },
    });
    publicClient.activate();
    setStompClient(publicClient);

    const privateClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: (frame) => {
        console.log("Private Connected: ", frame);
        privateClient.subscribe("/user/specific", (message) => {
          console.log("Private: ", message.body);
          setMessages((prev) => [...prev, JSON.parse(message.body).text]);
        });
      },
    });
    privateClient.activate();
    setPrivateStompClient(privateClient);

    return () => {
      publicClient.deactivate();
      privateClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && message) {
      stompClient.publish({
        destination: "/app/application",
        body: JSON.stringify({ text: message }),
      });
      setMessage("");
    }
  };

  const sendPrivateMessage = () => {
    if (privateStompClient && privateMessage && toUser) {
      privateStompClient.publish({
        destination: "/app/private",
        body: JSON.stringify({ text: privateMessage, to: toUser }),
      });
      setPrivateMessage("");
      setToUser("");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Text"
          className="border p-2 rounded w-full text-black placeholder-gray-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
          placeholder="Private Message"
          className="border p-2 rounded w-full text-black placeholder-gray-500"
        />
        <input
          type="text"
          value={toUser}
          onChange={(e) => setToUser(e.target.value)}
          placeholder="To"
          className="border p-2 rounded w-full text-black placeholder-gray-500"
        />
        <button
          onClick={sendPrivateMessage}
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
        >
          Send Private
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-bold">Messages</h2>
        <div className="border p-4 rounded bg-gray-100 max-h-60 overflow-y-auto">
          {messages.map((msg, index) => (
            <p key={index} className="p-2 bg-white shadow rounded">
              {msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
