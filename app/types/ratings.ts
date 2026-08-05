import { UserMinimal } from "./user";

export interface RateBookRequest {
  bookId: string;
  rating: number; // 0.5 increments [1, 5]
}

export interface RatingResponse {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyRatingResponse {
  rating: number | null;
}

export interface CreateReviewRequest {
  bookId: string;
  content: string;
}

export interface UpdateReviewRequest {
  content: string;
}

export interface ReviewResponse {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  user: UserMinimal;
}
