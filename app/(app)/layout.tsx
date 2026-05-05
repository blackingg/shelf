import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import StoreProvider from "@/app/provider/StoreProvider";
import { ErrorBoundaryWithNotification } from "@/app/components/Shared/ErrorBoundary";
import ProtectedRoute from "@/app/components/Auth/ProtectedRoute";
import { ThemeProvider } from "@/app/provider/ThemeProvider";
import { QueryProvider } from "@/app/provider/QueryProvider";
import { BufferProvider } from "@/app/context/FileBufferContext";
import { HydrationGuard } from "@/app/components/Layout/HydrationGuard";
import { OpenPanelComponent } from "@openpanel/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
};

export default function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="me" href="https://x.com/shelfng_" />
        <link rel="me" href="https://www.instagram.com/shelf_ng" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OpenPanelComponent
            clientId={String(process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID)}
            trackScreenViews={true}
            sessionReplay={{
              enabled: true,
              maskAllInputs: true,
            }}
          />
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
        <Analytics />
      </body>
    </html>
  );
}
