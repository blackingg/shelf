export type SortOrder = "asc" | "desc";

export type BookSortBy = "createdAt" | "rating" | "title" | "pages";
export type FolderSortBy = "createdAt" | "booksCount" | "bookmarksCount";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams<T extends string = string> {
  sort_by?: T;
  order?: SortOrder;
}

export type SetSortBy<T> = (value: T) => void;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SuccessResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  deletedId: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  code: string;
  details: { field: string | null; message: string; code: string | null }[] | null;
  timestamp: string;
}
