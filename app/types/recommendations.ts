import { Book } from "./book";
import { Folder } from "./folder";

export interface RecommendationsCombinedResponse {
  books: Book[];
  folders: Folder[];
  personalized: boolean;
  totalBooks: number;
  totalFolders: number;
}

export interface DiscoveryFeedResponse {
  items: ({ type: "book"; data: Book } | { type: "folder"; data: Folder })[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  personalized: boolean;
}
