import type { Notification } from "../types/notification";
import {
  FiX,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";

export const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiXCircle className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`${
        colors[notification.type]
      } border rounded-xl p-4 shadow-lg flex items-start space-x-3 animate-slide-in`}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[notification.type]}</span>
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};
