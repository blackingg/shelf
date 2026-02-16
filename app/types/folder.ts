import { UserMinimal } from "./user";
import { Book } from "./book";
import { FolderSortBy, SortOrder, PaginationParams } from "./common";

export interface FolderFilterParams extends PaginationParams {
  sort_by?: FolderSortBy;
  order?: SortOrder;
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
  book: Book;
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

export interface InviteCollaboratorRequest {
  userId: string;
  role?: FolderRoles;
  permissions?: string[];
  message?: string;
}

export interface Invite {
  id: string;
  folderId: string;
  userId: string;
  invitedBy: string;
  role: string;
  permissions: string[];
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  folder?: Partial<Folder>;
  user?: UserMinimal;
}

export interface Collaborator {
  id: string;
  role: string;
  permissions: string[];
  user: UserMinimal;
  invitedAt: string;
  acceptedAt: string | null;
}

export interface UpdatePermissionsRequest {
  role?: string;
  permissions?: string[];
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
