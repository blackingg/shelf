import { UserPublic } from "./user";

export type FolderVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export interface Folder {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImages: string[] | null;
  visibility: FolderVisibility;
  booksCount: number;
  bookmarksCount: number;
  createdBy: string;
  createdAt: string;
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  coverImages?: string[];
  visibility?: FolderVisibility;
}

export interface UpdateFolderRequest extends Partial<CreateFolderRequest> {}

export interface AddBookToFolderRequest {
  bookId: string;
}

export interface InviteCollaboratorRequest {
  email: string;
  role: "EDITOR" | "VIEWER";
}

export interface Invite {
  id: string;
  folderId: string;
  senderId: string;
  email: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

export interface Collaborator {
  id: string;
  userId: string;
  folderId: string;
  role: string;
  permissions: string[];
  user: UserPublic;
}

export interface UpdatePermissionsRequest {
  permissions: string[];
}
