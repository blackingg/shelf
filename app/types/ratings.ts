export interface RateBookRequest {
  bookId: string;
  rating: number; // 0.5 increments [1, 5]
}

export interface Rating {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  createdAt: string;
}

export interface CreateReviewRequest {
  bookId: string;
  content: string;
}

export interface UpdateReviewRequest {
  content: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}
