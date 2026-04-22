import { Metadata } from "next";
import CategoryClient from "./CategoryClient";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getCategory(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/categories/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching category for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategory(category);

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const title = categoryData.name;
  const description = categoryData.description || `Explore resources in the ${categoryData.name} category on Shelf.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Shelf`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | Shelf`,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  return <CategoryClient categorySlug={category} />;
}
