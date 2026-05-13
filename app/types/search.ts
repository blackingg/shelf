import { Book } from "./book";
import { Folder } from "./folder";
import { UserMinimal } from "./user";

export type SearchResultType = "books" | "folders" | "users" | "all";

export type SearchResultItem =
  | { type: "books"; data: Book }
  | { type: "folders"; data: Folder }
  | { type: "users"; data: UserMinimal };

export interface GlobalSearchResponse {
  query: string;
  books: Book[];
  folders: Folder[];
  users: UserMinimal[];
  total_books: number;
  total_folders: number;
  total_users: number;
}

export interface TypeSpecificSearchResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}

export interface SearchParams {
  q: string;
  types?: string | string[]; // Can be "books" or ["books", "folders"]
  category?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}
