import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiBook,
  FiFolder,
  FiCheckSquare,
  FiPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { UserNotification } from "@/app/types/notification";
import { useUserNotifications, useMyInvites } from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import { FiX, FiCheck, FiMail, FiUser } from "react-icons/fi";
import { useMemo } from "react";

const getBucketCount = (count: number) => {
  if (count <= 10) return count.toString();
  if (count < 20) return "10+";
  if (count < 50) return "20+";
  if (count < 100) return "50+";
  return "99+";
};

export const NotificationPanel: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications: userNotifications,
    unreadCount,
    actions,
    isLoading,
  } = useUserNotifications();
  const { invites, actions: inviteActions } = useMyInvites({
    status: "PENDING",
  });
  const {
    notifications: localNotifications,
    removeNotification,
    addNotification,
    clearAllNotifications,
  } = useNotifications();

  const sortedInvites = useMemo(
    () =>
      [...invites].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [invites],
  );

  const totalUnread = useMemo(
    () => unreadCount + invites.length + localNotifications.length,
    [unreadCount, invites.length, localNotifications.length],
  );

  const bucketedCount = useMemo(
    () => getBucketCount(totalUnread),
    [totalUnread],
  );

  const handleRespondToInvite = async (
    inviteId: string,
    accept: boolean,
    folderSlug?: string,
  ) => {
    try {
      await inviteActions.respondToInvite(inviteId, accept);
      addNotification(
        "success",
        accept ? "Invite accepted" : "Invite declined",
        accept
          ? "You can now access and contribute to this folder."
          : undefined,
        1200000,
        accept && folderSlug ? `/folders/${folderSlug}` : undefined,
      );
    } catch (err: any) {
      addNotification("error", "Something went wrong. Please try again.");
    }
  };

  const handleNotificationClick = (notification: UserNotification) => {
    actions.markAsRead(notification.id);

    if (notification.resourceType === "book") {
      router.push(`/books/${notification.resourceSlug}`);
    } else if (notification.resourceType === "folder") {
      router.push(`/folders/${notification.resourceSlug}`);
    } else if (notification.resourceType === "department") {
      router.push(`/library/departments/${notification.resourceSlug}`);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: UserNotification["type"]) => {
    switch (type) {
      case "book_approved":
      case "book_review":
      case "book_added_to_department":
      case "book_added_to_folder":
      case "trending_book":
        return (
          <FiBook className="w-4 h-4 text-primary" />
        );
      case "folder_created":
      case "folder_invite":
      case "collab_accepted":
      case "collab_rejected":
      case "folder_shared":
        return (
          <FiFolder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        );
      case "department_new_uploads":
        return (
          <FiPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return "JUST NOW";
    if (minutes < 60) return `${minutes}M AGO`;
    if (hours < 24) return `${hours}H AGO`;
    if (days < 7) return `${days}D AGO`;
    if (weeks < 5) return `${weeks}W AGO`;
    if (months < 12) return `${months}MO AGO`;
    return `${years}Y AGO`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md transition-colors group"
      >
        <FiBell className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center px-1 shadow-sm">
            {bucketedCount}
          </span>
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
              className="absolute top-full -right-20 mt-3 w-80 lg:w-96 bg-white dark:bg-neutral-900 rounded-sm border border-gray-100 dark:border-neutral-800 overflow-hidden z-50 shadow-sm"
            >
              <div className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-gray-50/50 dark:bg-neutral-800/20">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                    Notifications
                  </h3>
                  {totalUnread > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded-sm">
                      {totalUnread}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => actions.markAllAsRead()}
                    className="text-[9px] font-bold text-gray-400 dark:text-neutral-500 hover:text-primary uppercase tracking-widest transition-colors"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {/* Local Alerts / Toasts */}
                {localNotifications.length > 0 && (
                  <div className="bg-gray-50/30 dark:bg-neutral-800/20 border-b border-gray-100 dark:border-neutral-800">
                    <div className="px-5 py-2 flex items-center justify-between">
                      <p className="text-[9px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                        System Alerts ({localNotifications.length})
                      </p>
                      <button
                        onClick={() => clearAllNotifications()}
                        className="text-[9px] font-bold text-primary hover:underline uppercase tracking-widest"
                      >
                        Clear All
                      </button>
                    </div>
                    {localNotifications.map((local) => (
                      <div
                        key={local.id}
                        onClick={() => {
                          if (local.actionLink) {
                            router.push(local.actionLink);
                            setIsOpen(false);
                            removeNotification(local.id);
                          }
                        }}
                        className={`px-5 py-3 border-t border-gray-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200 group/alert transition-colors ${
                          local.actionLink
                            ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                                local.type === "success"
                                  ? "bg-emerald-500"
                                  : local.type === "error"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight truncate">
                                {local.message}
                              </p>
                              {local.description && (
                                <p className="text-[10px] text-gray-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                  {local.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {local.actionLink && (
                              <span className="text-[9px] font-bold text-primary opacity-0 group-hover/alert:opacity-100 transition-opacity whitespace-nowrap">
                                VIEW
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(local.id);
                              }}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm text-gray-400 opacity-0 group-hover/alert:opacity-100 transition-all"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Collaboration Invites */}
                {sortedInvites.length > 0 && (
                  <div className="bg-gray-50/50 dark:bg-neutral-800/20">
                    <div className="px-5 py-2 border-b border-gray-100 dark:border-neutral-800">
                      <p className="text-[9px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                        Collaboration Invites ({invites.length})
                      </p>
                    </div>
                    {sortedInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center shrink-0">
                            <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5 truncate">
                              Invite from @
                              {(typeof invite.invitedBy === "object"
                                ? (invite.invitedBy as any)?.username
                                : null) ||
                                invite.folder?.user?.username ||
                                "Someone"}
                            </p>
                            <p className="text-[11px] text-gray-600 dark:text-neutral-400 mb-3 leading-relaxed">
                              wants you to join{" "}
                              <span className="font-bold text-primary">
                                {invite.folder?.name || "a folder"}
                              </span>
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleRespondToInvite(
                                    invite.id,
                                    true,
                                    invite.folder?.slug,
                                  )
                                }
                                className="flex-1 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-1"
                              >
                                <FiCheck className="w-3 h-3" /> Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleRespondToInvite(invite.id, false)
                                }
                                className="flex-1 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-1"
                              >
                                <FiX className="w-3 h-3" /> Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {userNotifications.length === 0 &&
                invites.length === 0 &&
                localNotifications.length === 0 ? (
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
                  userNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-5 py-4 border-b border-gray-50 dark:border-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group ${
                        !notification.read
                          ? "bg-primary/5"
                          : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            !notification.read
                              ? "bg-white dark:bg-neutral-800 border-primary/20 shadow-sm"
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
                              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1"></span>
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
                            {formatTimestamp(new Date(notification.timestamp))}
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
