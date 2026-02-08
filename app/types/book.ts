import {
  PaginatedResponse,
  BookSortBy,
  SortOrder,
  PaginationParams,
} from "./common";

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  rating: number;
  ratingsCount: number;
  pages: number;
  featured: boolean;
  description: string;
  fileUrl?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  department?: string;
  isbn?: string | null;
  publisher?: string | null;
  publishedYear?: number | null;
  tags?: string[];
  donor?: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
  };
}

export type BookPreview = Partial<Book> & {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  pages: number;
  category: string;
  description: string;
  donor?: { id: string; username: string } | null;
};

export interface BookFilterParams extends PaginationParams {
  q?: string;
  category?: string;
  department?: string;
  featured?: boolean;
  sort_by?: BookSortBy;
  order?: SortOrder;
}

export interface RecommendedBooksResponse {
  items: Book[];
  total: number;
  personalized: boolean;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string;
  pages: number;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  department?: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  tags?: string[];
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

export interface UploadResponse extends Book {}

export interface BookmarkResponse {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
}

export interface BookmarkedStatus {
  bookmarked: boolean;
}
