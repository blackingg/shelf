import type { Metadata } from "next";
import BookClient from "./BookClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getBook(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/books/slug/${slug}`, {
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
  const book = await getBook(slug);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "This book could not be found in the Shelf library.",
    };
  }

  const title = `${book.title} by ${book.author}`;
  const description = book.description
    ? book.description.slice(0, 160)
    : `Read ${book.title} by ${book.author} on Shelf — a community-driven book library.`;
  const image = book.coverImage || "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: book.title }],
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

export default function Page() {
  return <BookClient />;
}
