import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Folders",
  description:
    "Browse public folders of books and course materials curated by the Shelf community.",
  alternates: {
    canonical: "/folders",
  },
};

export default function FoldersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
