export interface School {
  id: string;
  name: string;
  shortName: string | null;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  faculty: string | null;
  school?: School | null;
  description?: string | null;
  icon?: string | null;
  booksCount?: number;
}

export interface FacultyResponse {
  name: string;
  departmentsCount: number;
}

export interface DepartmentFilterParams {
  school_id?: string;
  faculty?: string;
}

export interface DepartmentBooksParams {
  q?: string;
  slug: string;
  page?: number;
  pageSize?: number;
  sort_by?: "createdAt" | "rating" | "title";
  order?: "asc" | "desc";
}
