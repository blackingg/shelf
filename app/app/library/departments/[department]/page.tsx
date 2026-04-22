import type { Metadata } from "next";
import DepartmentClient from "./DepartmentClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getDepartment(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/departments/${slug}`, {
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
  params: Promise<{ department: string }>;
}): Promise<Metadata> {
  const { department: slug } = await params;
  const department = await getDepartment(slug);

  if (!department) {
    const title = "Department Not Found";
    const description = "This department could not be found.";
    return {
      title,
      description,
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

  const title = department.name;
  const description = department.description
    ? department.description.slice(0, 160)
    : `Browse resources in the ${department.name} department at ${department.school?.name || "Shelf"}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function Page({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  return <DepartmentClient params={params} />;
}
