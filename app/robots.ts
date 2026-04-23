import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    console.error('Missing required environment variables for robots');
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/app/auth/',
        '/app/settings/',
        '/app/profile/',
        '/app/bookmarks/',
        '/app/moderator/',
        '/app/onboarding/',
        '/app/upload-and-read/',
        '/*edit*',        // Exclude all edit pages
        '/app/search',    // User specifically requested excluding search
        '/app/books/',    // User specifically requested excluding books
        '/app/folders/',  // User specifically requested excluding folders
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
