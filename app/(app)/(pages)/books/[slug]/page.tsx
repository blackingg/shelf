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
    const title = "Book Not Found";
    const description = "This book could not be found.";
    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: {
        title,
        description,
        images: ["/logo.png"],
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: ["/logo.png"],
      },
    };
  }

  const title = `${book.title} by ${book.author}`;
  const description = book.description;
  const image = book.coverImage || "/logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: `/books/${slug}`,
    },
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shelf.ng";
  const jsonLd = book
    ? {
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        author: {
          "@type": "Person",
          name: book.author,
        },
        description: book.description,
        url: `${siteUrl}/books/${slug}`,
        ...(book.coverImage && { image: book.coverImage }),
        ...(book.category && { genre: book.category }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BookClient />
    </>
  );
}
