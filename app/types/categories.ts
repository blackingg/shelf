export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  booksCount: number;
}

export interface CategoryBooksParams {
  q?: string;
  slug: string;
  sort_by?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}
