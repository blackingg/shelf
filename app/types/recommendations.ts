import { Book } from "./book";
import { Folder } from "./folder";

export interface RecommendationsCombinedResponse {
  books: Book[];
  folders: Folder[];
  personalized: boolean;
  totalBooks: number;
  totalFolders: number;
}
