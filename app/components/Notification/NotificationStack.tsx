"use client";
import { useNotifications } from "@/app/context/NotificationContext";
import { NotificationItem } from "./NotificationItem";

export const NotificationStack: React.FC = () => {
  const { notifications, dismissFromStack } = useNotifications();

  const activeNotifications = notifications.filter(
    (n) => !n.dismissedFromStack,
  );

  if (activeNotifications.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
      <div
        className="relative mx-auto"
        style={{
          height: `${80 + (activeNotifications.length - 1) * 8}px`,
        }}
      >
        {activeNotifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => dismissFromStack(notification.id)}
            stackIndex={index}
            totalCount={activeNotifications.length}
          />
        ))}
      </div>
    </div>
  );
};
