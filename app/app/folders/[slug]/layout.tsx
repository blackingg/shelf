import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getFolder(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/folders/slug/${slug}`, {
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const folder = await getFolder(slug);

  if (!folder) {
    return {
      title: "Folder Not Found",
      description: "This folder could not be found.",
    };
  }

  const title = folder.name;
  const description = folder.description
    ? folder.description.slice(0, 160)
    : `Explore the "${folder.name}" collection on Shelf — a community-driven book library.`;
  const image = folder.coverImage || "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: folder.name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function FolderSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
