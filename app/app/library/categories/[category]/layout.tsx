import type { Metadata } from "next";

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

  if (slug === "all") {
    return {
      title: "All Categories",
      description:
        "Browse the full Shelf collection across all categories and disciplines.",
      openGraph: {
        title: "All Categories",
        description:
          "Browse the full Shelf collection across all categories and disciplines.",
        images: [{ url: "/logo.png", alt: "Shelf" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "All Categories",
        description:
          "Browse the full Shelf collection across all categories and disciplines.",
        images: ["/logo.png"],
      },
    };
  }

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
    : `Explore community-curated resources for ${category.name} on Shelf.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/logo.png", alt: category.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default function CategorySlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
