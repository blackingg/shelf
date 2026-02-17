import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUser(username: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_BASE_URL}/users/${username}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching user for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const user = await getUser(decodedUsername);

  if (!user) {
    return {
      title: "User Not Found | Shelf",
    };
  }

  const title = `${user.fullName} (@${decodedUsername}) | Shelf`;
  const description =
    user.bio ||
    `Check out ${user.fullName}'s book collections and donations on Shelf.`;
  const image = user.avatar || "/logo-stacked-1.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 400,
          height: 400,
          alt: user.fullName,
        },
      ],
      type: "profile",
      username: decodedUsername,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  return <ProfileClient username={decodedUsername} />;
}
