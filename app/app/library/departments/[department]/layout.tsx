import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

type DepartmentListItem = {
  slug: string;
  name: string;
  description?: string | null;
};

type DepartmentsListResponse =
  | DepartmentListItem[]
  | { items?: DepartmentListItem[] };

async function getDepartment(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/departments/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as DepartmentListItem;
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
    return {
      title: "Department Not Found",
      description: "This department could not be found.",
    };
  }

  const title = department.name;
  const description = department.description
    ? department.description.slice(0, 160)
    : `Browse resources from the ${department.name} department on Shelf.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/logo.png", alt: department.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default function DepartmentSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
