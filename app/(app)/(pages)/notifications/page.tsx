"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiBook,
  FiFolder,
  FiCheck,
  FiX,
  FiInbox,
  FiUser,
} from "react-icons/fi";
import { motion } from "motion/react";
import { Card } from "@/app/components/Layout/Card";
import { useUserNotifications, useMyInvites } from "@/app/services";
import { useNotifications as useToastNotifications } from "@/app/context/NotificationContext";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";

type TabType = "all" | "invites" | "activity";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { notifications, unreadCount, actions, isLoading } =
    useUserNotifications();
  const { invites, actions: inviteActions } = useMyInvites({
    status: "PENDING",
  });
  const { addNotification: addToast } = useToastNotifications();

  const handleRespondToInvite = async (
    inviteId: string,
    accept: boolean,
    folderSlug?: string,
  ) => {
    try {
      await inviteActions.respondToInvite(inviteId, accept);
      addToast(
        "success",
        accept ? "Invite accepted" : "Invite declined",
        accept
          ? "You can now access and contribute to this folder."
          : undefined,
        2000,
        accept && folderSlug ? `/folders/${folderSlug}` : undefined,
      );
    } catch (err: any) {
      addToast("error", "Something went wrong. Please try again.");
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "activity")
      return notifications.filter((n) => n.type !== "folder_invite");
    return [];
  }, [notifications, activeTab]);

  const filteredInvites = useMemo(() => {
    if (activeTab === "all" || activeTab === "invites") return invites;
    return [];
  }, [invites, activeTab]);

  const isEmpty =
    !isLoading &&
    filteredNotifications.length === 0 &&
    filteredInvites.length === 0;

  return (
    <>
      <div className="lg:bg-white lg:dark:bg-neutral-950 lg:border-b border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 lg:pt-8 pb-0">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tighter">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <button
                onClick={() => actions.markAllAsRead()}
                className="text-[10px] font-bold text-faint hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" /> Mark all read
              </button>
            )}
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
            {(["all", "invites", "activity"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-150 shrink-0 ${
                    isActive
                      ? "bg-gray-100 dark:bg-white/5 text-foreground"
                      : "text-muted hover:bg-wash hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                  {tab === "invites" && invites.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-sm font-bold">
                      {invites.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="max-w-3xl">
          <div className="space-y-3">
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <SpinnerLoader />
              </div>
            ) : isEmpty ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-900 rounded-sm flex items-center justify-center mx-auto mb-6 border border-line-subtle">
                  <FiInbox className="w-8 h-8 text-gray-200 dark:text-neutral-800" />
                </div>
                <p className="text-xs font-bold text-faint uppercase tracking-widest">
                  No notifications
                </p>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                  We'll let you know when something important happens.
                </p>
              </div>
            ) : (
              <>
                {filteredInvites.map((invite) => (
                  <Card
                    key={invite.id}
                    className="p-6 border-primary/10 bg-primary/[0.02] dark:bg-primary/[0.04]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                        <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-foreground">
                            Collaboration Invitation
                          </p>
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-sm">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-muted mb-5 leading-relaxed">
                          <span className="font-bold text-primary">
                            @
                            {(typeof invite.invitedBy === "object"
                              ? (invite.invitedBy as any)?.username
                              : null) || "Someone"}
                          </span>{" "}
                          invited you to join
                          <span className="font-bold text-foreground ml-1">
                            "{invite.folder?.name}"
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
                            className="px-5 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all flex items-center gap-2"
                          >
                            <FiCheck className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRespondToInvite(invite.id, false)
                            }
                            className="px-5 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-muted text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all flex items-center gap-2"
                          >
                            <FiX className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-6 transition-all border-transparent hover:border-gray-100 dark:hover:border-neutral-800/50 cursor-pointer ${
                      !notification.read
                        ? "bg-primary/[0.01] border-primary/5"
                        : ""
                    }`}
                    onClick={() => {
                      actions.markAsRead(notification.id);
                      if (notification.resourceType === "folder")
                        router.push(
                          `/folders/${notification.resourceSlug || notification.resourceId}`,
                        );
                      else if (notification.resourceType === "book")
                        router.push(
                          `/books/${notification.resourceSlug || notification.resourceId}`,
                        );
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border transition-colors ${
                          !notification.read
                            ? "bg-white dark:bg-neutral-800 border-primary/20 text-primary"
                            : "bg-gray-50 dark:bg-neutral-800/50 border-line-subtle text-gray-400"
                        }`}
                      >
                        {notification.type.includes("book") ? (
                          <FiBook className="w-5 h-5" />
                        ) : (
                          <FiFolder className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`text-sm font-bold ${!notification.read ? "text-foreground" : "text-gray-500 dark:text-neutral-500"}`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          )}
                        </div>
                        <p
                          className={`text-sm mb-4 leading-relaxed ${!notification.read ? "text-gray-600 dark:text-neutral-300" : "text-faint"}`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-faint uppercase tracking-widest">
                            {new Date(
                              notification.timestamp,
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.markAsRead(notification.id);
                              }}
                              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
