import { Inter } from "next/font/google";
import "@/app/globals.css";
import AppProviders from "@/app/provider/AppProviders";
import { ThemeProvider } from "@/app/provider/ThemeProvider";
import { QueryProvider } from "@/app/provider/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { ModeratorSidebar } from "@/app/components/Moderator/ModeratorSidebar";
import ModeratorProtectedRoute from "@/app/components/Auth/ModeratorProtectedRoute";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function ModeratorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>
            <QueryProvider>
              <ModeratorProtectedRoute>
                <div className="min-h-screen bg-white dark:bg-neutral-900 flex font-sans overflow-hidden">
                  <ModeratorSidebar />

                  <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                    <header className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between pl-16 pr-8 lg:px-8 sticky top-0 z-30">
                      <h1 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-widest">
                        Moderator Center
                      </h1>
                      <div className="flex items-center space-x-4">
                        <Link
                          href="/library"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-neutral-800 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiArrowLeft className="w-3.5 h-3.5" />
                          Back to App
                        </Link>
                      </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                      <div className="max-w-7xl mx-auto w-full">
                        {children}
                      </div>
                    </div>
                  </main>
                </div>
              </ModeratorProtectedRoute>
            </QueryProvider>
          </AppProviders>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
