"use client";

import React, { useEffect, useState, useCallback } from "react";
import type { Notification } from "@/app/types/notification";
import {
  FiX,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
  stackIndex: number;
  totalCount: number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
  stackIndex,
  totalCount,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Auto-close only for top notification
  useEffect(() => {
    if (stackIndex === 0) {
      const timer = setTimeout(
        () => handleClose(),
        notification.duration || 5000
      );
      return () => clearTimeout(timer);
    }
  }, [stackIndex, notification.duration, handleClose]);

  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiXCircle className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-100 border-green-300 text-green-800",
    error: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-amber-100 border-amber-300 text-amber-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  // Apply scale/opacity/offset to stack notifications
  const getStackStyle = () => {
    if (stackIndex === 0)
      return {
        transform: "translateY(0) scale(1)",
        opacity: 1,
        zIndex: totalCount,
      };
    if (stackIndex === 1)
      return {
        transform: "translateY(-8px) scale(0.96)",
        opacity: 0.7,
        zIndex: totalCount - 1,
      };
    if (stackIndex === 2)
      return {
        transform: "translateY(-16px) scale(0.92)",
        opacity: 0.4,
        zIndex: totalCount - 2,
      };
    return {
      transform: "translateY(-24px) scale(0.88)",
      opacity: 0.2,
      zIndex: totalCount - 3,
    };
  };

  const stackStyle = getStackStyle();

  return (
    <div
      className={`absolute top-0 left-0 right-0 px-4 transition-all duration-300 ${
        stackIndex === 0 && !isClosing
          ? "animate-[slideInRight_0.4s_ease-out]"
          : ""
      } ${isClosing ? "opacity-0 translate-x-full" : ""}`}
      style={{
        transform: stackStyle.transform,
        opacity: isClosing ? 0 : stackStyle.opacity,
        zIndex: stackStyle.zIndex,
        pointerEvents: stackIndex === 0 ? "auto" : "none",
      }}
    >
      <div
        className={`${
          colors[notification.type]
        } border rounded-xl p-4 shadow-lg flex items-start space-x-3 backdrop-blur-sm`}
      >
        <span className="flex-shrink-0 mt-0.5">{icons[notification.type]}</span>
        <p className="flex-1 text-sm font-medium">{notification.message}</p>
        {stackIndex === 0 && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
