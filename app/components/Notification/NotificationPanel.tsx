import { useState } from "react";
import {
  FiBell,
  FiBook,
  FiFolder,
  FiClock,
  FiCheckSquare,
} from "react-icons/fi";
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
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: UserNotification["type"]) => {
    switch (type) {
      case "book_saved":
        return (
          <FiBook className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        );
      case "folder_created":
        return (
          <FiFolder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        );
      case "reminder":
        return (
          <FiClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        );
      default:
        return (
          <FiCheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "JUST NOW";
    if (minutes < 60) return `${minutes}M AGO`;
    if (hours < 24) return `${hours}H AGO`;
    if (days < 7) return `${days}D AGO`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md transition-colors group"
      >
        <FiBell className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full -right-20 mt-3 w-80 lg:w-96 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 overflow-hidden z-50 shadow-sm"
            >
              <div className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-gray-50/50 dark:bg-neutral-800/20">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold rounded-sm">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[9px] font-bold text-gray-400 dark:text-neutral-500 hover:text-emerald-600 uppercase tracking-widest transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-neutral-800">
                      <FiBell className="w-5 h-5 text-gray-300 dark:text-neutral-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-1">
                      Clear Sky
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium">
                      Nothing new to report right now.
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-5 py-4 border-b border-gray-50 dark:border-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group ${
                        !notification.read
                          ? "bg-emerald-50/10 dark:bg-emerald-900/5"
                          : ""
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors ${
                            !notification.read
                              ? "bg-white dark:bg-neutral-800 border-emerald-100 dark:border-emerald-800/50 shadow-sm"
                              : "bg-gray-50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800"
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p
                              className={`text-xs font-bold ${
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-600 dark:text-neutral-400"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] leading-relaxed mb-2 ${
                              !notification.read
                                ? "text-gray-600 dark:text-neutral-300"
                                : "text-gray-400 dark:text-neutral-500"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 dark:text-neutral-600 tracking-widest uppercase">
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
