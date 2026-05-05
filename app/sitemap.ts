import type { MetadataRoute } from "next";

interface DepartmentResponse {
  slug: string;
  updatedAt: string;
}

interface CategoryResponse {
  slug: string;
  updatedAt: string;
}

interface BookResponse {
  slug: string;
  updatedAt: string;
}

interface FolderResponse {
  slug: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl || !apiUrl) {
    console.error("Missing required environment variables for sitemap");
    return [];
  }

  let departments: DepartmentResponse[] = [];
  let categories: CategoryResponse[] = [];
  let books: BookResponse[] = [];
  let folders: FolderResponse[] = [];

  // Fetch data in parallel
  try {
    const [resDepts, resCats, resBooks, resFolders] = await Promise.all([
      fetch(`${apiUrl}/departments/`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/categories/`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/books/?limit=500`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/folders/public?limit=500`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (resDepts.ok) departments = await resDepts.json();
    if (resCats.ok) categories = await resCats.json();

    if (resBooks.ok) {
      const booksData: PaginatedResponse<BookResponse> = await resBooks.json();
      books = booksData.items;
    }

    if (resFolders.ok) {
      const foldersData: PaginatedResponse<FolderResponse> =
        await resFolders.json();
      folders = foldersData.items;
    }
  } catch (error) {
    console.error("Error fetching data for sitemap:", error);
  }

  // Define static public routes
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/library/departments`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/library/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/folders`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Map dynamic routes
  const departmentUrls: MetadataRoute.Sitemap = departments.map((dept) => ({
    url: `${baseUrl}/library/departments/${dept.slug}`,
    lastModified: dept.updatedAt ? new Date(dept.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/library/categories/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const bookUrls: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: book.updatedAt ? new Date(book.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const folderUrls: MetadataRoute.Sitemap = folders.map((folder) => ({
    url: `${baseUrl}/folders/${folder.slug}`,
    lastModified: folder.updatedAt ? new Date(folder.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticUrls,
    ...departmentUrls,
    ...categoryUrls,
    ...bookUrls,
    ...folderUrls,
  ];
}
