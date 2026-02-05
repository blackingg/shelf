import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import StoreProvider from "./store/StoreProvider";
import { ErrorBoundaryWithNotification } from "./components/ErrorBoundary";
import { ThemeProvider } from "./provider/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#044c41",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  title: "Shelf",
  description: "Community-driven book collections",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shelf",
  },
  formatDetection: {
    telephone: false,
  },
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
    <html>
      <head>
        <link
          rel="manifest"
          href="/manifest.json"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/icon-192x192.png"
        />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Shelf"
        />
        <meta
          name="mobile-web-app-capable"
          content="yes"
        />
        <link
          rel="me"
          href="https://x.com/shelfng_"
        />
        <link
          rel="me"
          href="https://www.instagram.com/shelf_ng"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <ErrorBoundaryWithNotification>
              {children}
            </ErrorBoundaryWithNotification>
          </StoreProvider>
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
