export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pages: number;
  category: string;
  rating: number;
  ratingsCount: number;
  reviewsCount: number;
  readersCount: number;
  downloadsCount: number;
  donatedBy: string;
  donatedAt: string;
}

export interface BookFilterParams {
  search?: string;
  category?: string;
  department?: string;
  page?: number;
  limit?: number;
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

export interface UploadResponse {
  url: string;
  fileSize: number;
  fileType: string;
}
