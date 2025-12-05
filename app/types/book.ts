export type Book = {
  type: "book";
  id: number;
  title: string;
  author: string;
  donatedBy: string;
  coverImage: string;
  pages?: number;
  rating?: number;
  readingCount?: number;
  reviews?: number;
  description?: string;
};
