import type { UserMinimal } from "./user";

// Toast notification type (used by NotificationContext)
type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    message: string,
    duration?: number,
  ) => void;
  removeNotification: (id: string) => void;
}

// User notification type (used by NotificationPanel)
export type UserNotificationType =
  | "book_approved"
  | "book_review"
  | "book_added_to_department"
  | "folder_created"
  | "folder_invite"
  | "collab_accepted"
  | "collab_rejected"
  | "book_added_to_folder"
  | "folder_shared"
  | "trending_book"
  | "department_new_uploads";

export type ResourceType = "book" | "folder" | "department" | "user";

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: UserNotificationType;
  resourceType: ResourceType;
  resourceId: string;
  resourceSlug?: string;
  actor?: UserMinimal | null;
}

export type { Notification, NotificationType, NotificationContextType };
