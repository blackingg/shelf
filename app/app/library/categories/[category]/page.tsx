import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getCategory(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/categories/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "This category could not be found.",
    };
  }

  const title = category.name;
  const description = category.description
    ? category.description.slice(0, 160)
    : `Browse resources in the ${category.name} category on Shelf.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return <CategoryClient params={params} />;
}
