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
        notification.duration || 5000,
      );
      return () => clearTimeout(timer);
    }
  }, [stackIndex, notification.duration, handleClose]);

  const icons = {
    success: (
      <FiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    ),
    error: <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    warning: (
      <FiAlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    ),
    info: <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  };

  const colors = {
    success:
      "bg-white dark:bg-neutral-900 border-emerald-100 dark:border-emerald-900/50",
    error: "bg-white dark:bg-neutral-900 border-red-100 dark:border-red-900/50",
    warning:
      "bg-white dark:bg-neutral-900 border-amber-100 dark:border-amber-900/50",
    info: "bg-white dark:bg-neutral-900 border-blue-100 dark:border-blue-900/50",
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
        transform: "translateY(-12px) scale(0.96)",
        opacity: 0.8,
        zIndex: totalCount - 1,
      };
    if (stackIndex === 2)
      return {
        transform: "translateY(-24px) scale(0.92)",
        opacity: 0.5,
        zIndex: totalCount - 2,
      };
    return {
      transform: "translateY(-36px) scale(0.88)",
      opacity: 0.2,
      zIndex: totalCount - 3,
    };
  };

  const stackStyle = getStackStyle();

  return (
    <div
      className={`absolute top-0 left-0 right-0 px-4 transition-all duration-500 ease-in-out ${
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
        } border rounded-md p-4 shadow-sm flex items-start gap-4 backdrop-blur-md`}
      >
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-gray-50/50 dark:bg-neutral-800/50 border border-inherit`}
        >
          {icons[notification.type]}
        </div>
        <div className="flex-1 pt-1.5">
          <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-wider">
            {notification.message}
          </p>
        </div>
        {stackIndex === 0 && (
          <button
            onClick={handleClose}
            className="p-1 px-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 dark:text-neutral-500 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
