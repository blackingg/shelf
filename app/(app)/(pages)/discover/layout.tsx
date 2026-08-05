import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover",
  description:
    "Explore trending books, folders, and course materials shared by the Shelf community.",
  alternates: {
    canonical: "/discover",
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
