import React, { useState, createContext, useContext, useEffect } from "react";
import type {
  NotificationContextType,
  NotificationType,
  Notification,
} from "../types/notification";
import { NotificationContainer } from "../components/Notification/NotificationContainer";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    message: string,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, type, message, duration };
    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};
