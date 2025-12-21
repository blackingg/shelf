export interface Department {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  school: string | null;
  faculty: string | null;
  booksCount: number;
}

export interface School {
  id: string;
  name: string;
  shortName: string;
  country: string;
}
