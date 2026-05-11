import { Book } from "./book";

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  currentPage: number;
  totalPages: number;
  progress: number; // calculated as percentage
  lastReadAt: string;
}

export interface UpdateReadingProgressRequest {
  bookId: string;
  currentPage: number;
  totalPages: number;
}

export type MyReadingProgressResponse = ReadingProgress[];
