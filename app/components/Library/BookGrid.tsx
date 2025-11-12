"use client";
import { BookCard } from "./BookCard";

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  pages: number;
  readingCount: number;
  reviews: number;
  description: string;
  category?: string;
}

interface BookGridProps {
  books: Book[];
  columns?: 4 | 5;
  onBookClick: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  columns = 5,
  onBookClick,
}) => {
  const gridClass = columns === 4 ? "grid-cols-4" : "grid-cols-5";

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          {...book}
          onClick={() => onBookClick(book)}
        />
      ))}
    </div>
  );
};
