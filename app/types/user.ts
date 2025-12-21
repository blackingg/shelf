export interface User {
  id: string;
  uuid: string;
  email: string;
  fullName: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  booksCount: number;
  foldersCount: number;
  createdAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserPublic {
  id: string;
  uuid: string;
  email: string;
  fullName: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  booksCount: number;
  foldersCount: number;
  createdAt: string;
}
