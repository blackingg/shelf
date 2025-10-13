import { useNotifications } from "@/app/context/NotificationContext";
import { NotificationItem } from "./NotificationItem";
import { useEffect } from "react";

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 space-y-3 w-full max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};
