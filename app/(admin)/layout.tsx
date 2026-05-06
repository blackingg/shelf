import { Inter } from "next/font/google";
import "@/app/globals.css";
import StoreProvider from "@/app/provider/StoreProvider";
import { ThemeProvider } from "@/app/provider/ThemeProvider";
import { QueryProvider } from "@/app/provider/QueryProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <QueryProvider>{children}</QueryProvider>
          </StoreProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
