export interface Book {
  id: string;
  donor_id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  cover_image: string;
  pages: number;
  file_url: string;
  file_size: number;
  file_type: string;
  department: string;
  isbn?: string;
  publisher?: string;
  published_year?: number;
  tags?: string[];
}

export type BookPreview = Partial<Book> & {
  id: string;
  title: string;
  donor_id: string;
  author: string;
  cover_image: string;
  pages: number;
  category: string;
  description: string;
  published_year: number;
};

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
