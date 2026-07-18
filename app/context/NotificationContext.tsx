import React, { useState, createContext, useContext } from "react";
import type {
  NotificationContextType,
  NotificationType,
  Notification,
} from "../types/notification";
import { NotificationStack } from "../components/Notification/NotificationStack";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
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
    description?: string,
    // Long default is intentional: the popup toast auto-hides after a few
    // seconds (via dismissedFromStack in NotificationItem), but the record is
    // retained in the "System Alerts" section of the bell panel until the user
    // clears it. Pass duration=0 to keep it until manually removed.
    duration = 1200000,
    actionLink?: string,
  ) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 11);
    const notification = {
      id,
      type,
      message,
      description,
      duration,
      actionLink,
      dismissedFromStack: false,
    };
    setNotifications((prev) => [notification, ...prev]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const dismissFromStack = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dismissedFromStack: true } : n)),
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        dismissFromStack,
        clearAllNotifications,
      }}
    >
      {children}
      <NotificationStack />
    </NotificationContext.Provider>
  );
};
