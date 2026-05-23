import { Inter } from "next/font/google";
import "@/app/globals.css";
import AppProviders from "@/app/provider/AppProviders";
import { ThemeProvider } from "@/app/provider/ThemeProvider";
import { QueryProvider } from "@/app/provider/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { ModeratorSidebar } from "@/app/components/Moderator/ModeratorSidebar";
import ModeratorProtectedRoute from "@/app/components/Auth/ModeratorProtectedRoute";

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
                        <div className="w-8 h-8 rounded-md bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700" />
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
