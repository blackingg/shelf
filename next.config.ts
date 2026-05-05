import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cloudinary-images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
    // ── API Caching (granular, per data volatility) ──
    // Static reference data — rarely changes, cache aggressively
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/categories/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-categories",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/departments/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-departments",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/onboarding/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-onboarding",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Discover & public content — moderate freshness
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/recommendations/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-discover",
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 30, // 30 minutes
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/folders\/public/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-public-folders",
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 30, // 30 minutes
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // User-specific data — short cache, always prefer network
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/users\/me/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-user",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 10, // 10 minutes
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // All other API calls — fallback
    {
      urlPattern: /^https?:\/\/.*\/api\/v1\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-general",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdnb.artstation.com",
      },
      {
        protocol: "https",
        hostname: "cdna.artstation.com",
      },
    ],
  },
};

export default withPWA(nextConfig);
