import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments | Shelf",
  description:
    "Browse academic and professional departments on Shelf. Discover curated book collections organized by your school's departments.",
  openGraph: {
    title: "Departments | Shelf",
    description:
      "Browse academic and professional departments on Shelf. Discover curated book collections organized by your school's departments.",
    images: [{ url: "/logo.png", alt: "Shelf" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Departments | Shelf",
    description: "Browse academic and professional departments on Shelf.",
    images: ["/logo.png"],
  },
};

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
