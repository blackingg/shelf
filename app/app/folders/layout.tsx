import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Folders | Shelf",
  description:
    "Manage and browse your personal reading folders on Shelf. Organize books into private or public collections and explore community folders.",
  openGraph: {
    title: "My Folders | Shelf",
    description:
      "Manage and browse your personal reading folders on Shelf. Organize books into private or public collections and explore community folders.",
    images: [{ url: "/logo.png", alt: "Shelf" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Folders | Shelf",
    description: "Manage and browse your personal reading folders on Shelf.",
    images: ["/logo.png"],
  },
};

export default function FoldersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
