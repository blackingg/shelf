import type { MetadataRoute } from 'next';

interface DepartmentResponse {
  slug: string;
  updatedAt: string;
}

interface CategoryResponse {
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl || !apiUrl) {
    console.error('Missing required environment variables for sitemap');
    return [];
  }

  let departments: DepartmentResponse[] = [];
  let categories: CategoryResponse[] = [];

  // Fetch departments directly from Backend API
  try {
    const resDepts = await fetch(`${apiUrl}/departments/`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (resDepts.ok) {
      departments = await resDepts.json();
    } else {
      console.error('Failed to fetch departments for sitemap', await resDepts.text());
    }
  } catch (error) {
    console.error('Error fetching departments for sitemap:', error);
  }

  try {
    const resCats = await fetch(`${apiUrl}/categories/`, {
      next: { revalidate: 3600 },
    });
    if (resCats.ok) {
      categories = await resCats.json();
    } else {
      console.error('Failed to fetch categories for sitemap', await resCats.text());
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  // Define static public routes
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Map dynamic department routes
  const departmentUrls: MetadataRoute.Sitemap = departments.map((dept) => ({
    url: `${baseUrl}/app/library/departments/${dept.slug}`,
    lastModified: dept.updatedAt ? new Date(dept.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Map dynamic category routes
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/app/library/categories/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticUrls, ...departmentUrls, ...categoryUrls];
}
