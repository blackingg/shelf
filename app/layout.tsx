import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import StoreProvider from "./provider/StoreProvider";
import { ErrorBoundaryWithNotification } from "./components/ErrorBoundary";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { ThemeProvider } from "./provider/ThemeProvider";
import { QueryProvider } from "./provider/QueryProvider";
import { BufferProvider } from "./context/FileBufferContext";
import { HydrationGuard } from "./components/Layout/HydrationGuard";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

export const viewport: Viewport = {
  themeColor: "#072c0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.shelf.ng",
  ),
  icons: {
    icon: "/logo.png",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  title: {
    default: "Shelf",
    template: "%s | Shelf",
  },
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
    title: {
      default: "Shelf",
      template: "%s | Shelf",
    },
    description: "Community-driven digital library",
    url: "https://www.shelf.ng/",
    siteName: "Shelf",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Shelf - Community-driven digital library",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Shelf",
      template: "%s | Shelf",
    },
    description: "Community-driven digital library",
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
    <html
      lang="en"
      suppressHydrationWarning
    >
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
      <body className={`${onest.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <QueryProvider>
              <ErrorBoundaryWithNotification>
                <HydrationGuard>
                  <ProtectedRoute>
                    <BufferProvider>{children}</BufferProvider>
                  </ProtectedRoute>
                </HydrationGuard>
              </ErrorBoundaryWithNotification>
            </QueryProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
