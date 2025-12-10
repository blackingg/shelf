import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "Shelf",
  description: "Community-driven book collections",
  openGraph: {
    title: "Shelf",
    description: "Community-driven book collections",
    url: "https://www.shelf.ng/",
    siteName: "Shelf",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Shelf - Community-driven book collections",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelf",
    description: "Community-driven book collections",
    site: "@shelfng_",
    creator: "@shelfng_",
    images: ["/logo.png"],
  },
  other: {
    "google-site-verification": "A-sfbykyS0xgNPBBOCpXXNPVnVOSabEz6SV3hySn8M4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="me"
          href="https://x.com/shelfng_"
        />
        <link
          rel="me"
          href="https://www.instagram.com/shelf_ng"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <Analytics />
    </html>
  );
}
