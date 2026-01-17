import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "book_saved" | "folder_created" | "system" | "reminder";
}

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: "1",
      title: "Book Saved",
      message:
        "You saved 'The Great Gatsby' to your 'ENG 203 - American Literature' folder",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      type: "book_saved",
    },
    {
      id: "2",
      title: "Book Saved",
      message:
        "You saved 'Things Fall Apart' to your public folder 'African Classics'",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      type: "book_saved",
    },
    {
      id: "3",
      title: "New Folder Created",
      message: "Folder 'ENG 203 - American Literature' has been created",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      type: "folder_created",
    },
    {
      id: "4",
      title: "Folder Shared",
      message: "Your folder 'POL 302 - Governance & Policy' is now public",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      type: "folder_created",
    },
    {
      id: "5",
      title: "Reading Reminder",
      message: "Time to continue reading 'Atomic Habits",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      type: "reminder",
    },
    {
      id: "6",
      title: "Book Added to Folder",
      message:
        "A new book 'Digital Design and Computer Architecture' was added to 'CPE 310 Group Folder'",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      type: "book_saved",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: UserNotification["type"]) => {
    switch (type) {
      case "book_saved":
        return "📚";
      case "folder_created":
        return "📁";
      case "reminder":
        return "⏰";
      default:
        return "ℹ️";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <FiBell className="lg:w-6 lg:h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full -right-20 mt-2 w-64 md:w-80 lg:w-96 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <FiBell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      No notifications yet
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      We&apos;ll notify you about important updates
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-emerald-50/30 dark:bg-emerald-900/10" : ""
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
