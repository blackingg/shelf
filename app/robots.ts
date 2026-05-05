import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    console.error("Missing required environment variables for robots");
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/app/auth/",
        "/app/settings/",
        "/app/profile/",
        "/app/bookmarks/",
        "/app/moderator/",
        "/app/onboarding/",
        "/app/upload-and-read/",
        "/*edit*",
        "/app/search",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
