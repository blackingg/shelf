import { Metadata } from "next";
import BookDetailsClient from "./BookDetailsClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBook(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/books/slug/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching book for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  const title = book.title;
  const description = book.description 
    ? book.description.substring(0, 160) 
    : `Read ${book.title} by ${book.author} on Shelf.`;
  const image = book.coverImage || "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Shelf`,
      description,
      images: [
        {
          url: image,
          width: 800,
          height: 1200,
          alt: title,
        },
      ],
      type: "book",
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

  return <BookDetailsClient slug={slug} />;
}
