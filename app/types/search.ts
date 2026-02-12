import { Book } from "./book";
import { Folder } from "./folder";
import { UserMinimal } from "./user";

export type SearchResultType = "book" | "folder" | "user";

export type SearchResultItem =
  | { type: "book"; data: Book }
  | { type: "folder"; data: Folder }
  | { type: "user"; data: UserMinimal };

export interface SearchResponse {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  q: string;
  type?: "all" | "book" | "folder" | "user";
  page?: number;
  pageSize?: number;
}
