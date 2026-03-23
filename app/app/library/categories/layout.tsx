import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Categories | Shelf",
  description:
    "Explore Shelf's full library by discipline and specialization. Find books and resources across every academic and professional category.",
  openGraph: {
    title: "Browse Categories | Shelf",
    description:
      "Explore Shelf's full library by discipline and specialization. Find books and resources across every academic and professional category.",
    images: [{ url: "/logo.png", alt: "Shelf" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Categories | Shelf",
    description:
      "Explore Shelf's full library by discipline and specialization.",
    images: ["/logo.png"],
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
