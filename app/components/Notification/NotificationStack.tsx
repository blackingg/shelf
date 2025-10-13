"use client";
import { useNotifications } from "@/app/context/NotificationContext";
import { NotificationItem } from "./NotificationItem";

export const NotificationStack: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
      <div
        className="relative mx-auto"
        style={{
          height: `${80 + (notifications.length - 1) * 8}px`,
        }}
      >
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            stackIndex={index}
            totalCount={notifications.length}
          />
        ))}
      </div>
    </div>
  );
};
