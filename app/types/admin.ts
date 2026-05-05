import { UserMinimal, UserRole } from "./user";

export type FlagReason =
  | "INAPPROPRIATE_CONTENT"
  | "COPYRIGHT_VIOLATION"
  | "SPAM"
  | "MISLEADING_INFO"
  | "BROKEN_LINK"
  | "OTHER";

export type FlagAction = "DISMISS" | "WARN" | "REMOVE_CONTENT" | "BAN_USER";

export type BookModerationStatus = "AVAILABLE" | "ARCHIVED" | "PENDING_REVIEW";

export interface AdminUserResponse {
  id: string;
  username: string;
  fullName: string;
  avatar: string | null;
  email: string;
  role: UserRole;
  isBanned: boolean;
  bannedAt: string | null;
  bannedReason: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface FlagWithContentResponse {
  id: string;
  userId: string;
  bookId: string | null;
  folderId: string | null;
  reason: FlagReason;
  comment: string | null;
  reviewed: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  reporter: UserMinimal | null;
}

export interface PlatformStatsResponse {
  totalUsers: number;
  totalBooks: number;
  totalFolders: number;
  totalFlags: number;
  unreviewedFlags: number;
  bannedUsers: number;
  pendingBooks: number;
}

export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_BANNED"
  | "USER_UNBANNED"
  | "USER_ROLE_CHANGED"
  | "BOOK_DONATE"
  | "BOOK_UPDATE"
  | "BOOK_DELETE"
  | "BOOK_ARCHIVED"
  | "BOOK_RESTORED"
  | "BOOK_RATED"
  | "BOOK_REVIEWED"
  | "FOLDER_CREATED"
  | "FOLDER_UPDATED"
  | "FOLDER_DELETED"
  | "FOLDER_VISIBILITY_CHANGED"
  | "COLLABORATOR_INVITED"
  | "COLLABORATOR_ADDED"
  | "COLLABORATOR_REMOVED"
  | "COLLABORATOR_PERMISSIONS_CHANGED"
  | "FLAG_CREATED"
  | "FLAG_RESOLVED";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actor: {
    id: string;
    username: string;
    fullName: string;
  } | null;
  action: AuditAction;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

export interface ResolveFlagRequest {
  action: FlagAction;
  note?: string;
}

export interface SetBookStatusRequest {
  status: BookModerationStatus;
  reason?: string;
}

export interface AdminListUsersParams {
  q?: string;
  role?: UserRole;
  is_banned?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminAuditLogParams {
  action?: AuditAction;
  actor_id?: string;
  page?: number;
  limit?: number;
}
