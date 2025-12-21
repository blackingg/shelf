export interface UpdateProgressRequest {
  bookId: string;
  currentPage: number;
  totalPages: number;
}

export interface ProgressResponse {
  bookId: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastRead: string;
}
