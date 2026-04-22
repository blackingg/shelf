import { Metadata } from "next";
import DepartmentClient from "./DepartmentClient";

interface PageProps {
  params: Promise<{
    department: string;
  }>;
}

async function getDepartment(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/departments/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching department for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { department } = await params;
  const deptData = await getDepartment(department);

  if (!deptData) {
    return {
      title: "Department Not Found",
    };
  }

  const title = deptData.name;
  const description = deptData.description || `Explore resources in the ${deptData.name} department at ${deptData.school?.name || "Shelf"}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Shelf`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | Shelf`,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { department } = await params;

  return <DepartmentClient departmentSlug={department} />;
}
