import { Metadata } from "next";
import FolderDetailsClient from "./FolderDetailsClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getFolder(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/folders/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching folder for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const folder = await getFolder(slug);

  if (!folder) {
    return {
      title: "Folder Not Found",
    };
  }

  const title = folder.name;
  const description = folder.description || `Browse the ${folder.name} collection on Shelf.`;
  const image = "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Shelf`,
      description,
      images: [{ url: image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Shelf`,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <FolderDetailsClient slug={slug} />;
}
