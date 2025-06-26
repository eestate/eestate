import { useGetNotyfQuery } from "@/redux/services/AgentApi";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user?._id;

const socket = io("http://localhost:3003", {
  transports: ["websocket"],
  query: {
    userId,
  },
});

const NotificationAlert = () => {
  const { refetch } = useGetNotyfQuery({ userId });
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    const newNotification = { id, message };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    if (!userId) return;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("enquiryNotification", (data) => {
      console.log("📦 Received Notification Data:", data);

      if (data?.agentId === userId) {
        addNotification(`🔔 ${data.title}`);
        refetch();
      } else {
        console.log("🚫 agentId does not match. Not your notification.");
      }
    });

    return () => {
      socket.off("enquiryNotification");
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-center justify-between animate-slide-in"
        >
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-3 text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationAlert;
