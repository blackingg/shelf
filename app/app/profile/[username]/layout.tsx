import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getUser(username: string) {
  try {
    const res = await fetch(`${API_BASE}/users/${username}`, {
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
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return {
      title: "User Not Found",
      description: "This profile could not be found.",
    };
  }

  const title = `${user.fullName} (@${user.username})`;
  const description = user.bio
    ? user.bio.slice(0, 160)
    : `Explore ${user.fullName}'s profile on Shelf.`;
  const image = user.avatar || "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: user.fullName }],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [image],
    },
  };
}

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
