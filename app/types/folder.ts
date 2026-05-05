import { UserMinimal } from "./user";
import { Book } from "./book";
import { FolderSortBy, SortOrder, PaginationParams } from "./common";

export interface FolderFilterParams extends PaginationParams {
  limit?: number;
  max_limit?: number;
  sort_by?: FolderSortBy;
  order?: SortOrder;
  q?: string;
}

export type FolderVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export interface FolderCounts {
  items: number;
  bookmarks: number;
  collaborators: number;
}

export interface Folder {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  visibility: FolderVisibility;
  booksCount: number;
  bookmarksCount: number;
  allowCollaboration: boolean;
  requireApproval: boolean;
  createdAt: string;
  updatedAt: string;
  user?: UserMinimal;
  items?: FolderItem[];
  collaborators?: Collaborator[];
  counts?: FolderCounts;
}

export interface FolderItem {
  id: string;
  order: number;
  addedAt: string;
  book: Partial<Book> & { id: string; slug: string; title: string; author: string };
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  coverImage?: string;
  visibility?: FolderVisibility;
  allowCollaboration?: boolean;
}

export interface UpdateFolderRequest extends Partial<CreateFolderRequest> {}

export interface AddBookToFolderRequest {
  bookId: string;
}

export type FolderRoles = "OWNER" | "EDITOR" | "VIEWER";

export type FolderPermission =
  | "ADD_BOOKS"
  | "REMOVE_BOOKS"
  | "EDIT_FOLDER"
  | "DELETE_FOLDER"
  | "MANAGE_COLLABORATORS"
  | "CHANGE_VISIBILITY";

export interface InviteCollaboratorRequest {
  userId: string;
  role?: Exclude<FolderRoles, "OWNER">;
  permissions?: FolderPermission[];
  message?: string;
}

export type InviteStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface Invite {
  id: string;
  folderId: string;
  userId: string;
  invitedBy: string | UserMinimal;
  role: Exclude<FolderRoles, "OWNER">;
  permissions: FolderPermission[];
  message: string | null;
  status: InviteStatus;
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  folder?: Partial<Folder>;
  user?: UserMinimal;
}

export interface Collaborator {
  id: string;
  role: Exclude<FolderRoles, "OWNER">;
  permissions: FolderPermission[];
  user: UserMinimal;
  invitedAt: string;
  acceptedAt: string | null;
}

export interface UpdatePermissionsRequest {
  role?: Exclude<FolderRoles, "OWNER">;
  permissions?: FolderPermission[];
}

export interface UpdateCollaborationSettingsRequest {
  allowCollaboration: boolean;
  requireApproval: boolean;
}

export interface FolderActivity {
  id: string;
  folderId: string;
  userId: string;
  action: string;
  details: any;
  createdAt: string;
  user: UserMinimal;
}
export interface RecommendedFoldersResponse {
  items: Folder[];
  total: number;
  personalized: boolean;
}
