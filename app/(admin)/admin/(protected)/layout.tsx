import Link from "next/link";
import { AdminSidebar } from "@/app/components/Admin/AdminSidebar";
import AdminProtectedRoute from "@/app/components/Auth/AdminProtectedRoute";
import { FiArrowLeft } from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background flex font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between pl-16 pr-8 lg:px-8 sticky top-0 z-30">
            <h1 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-widest">
              Portal Control
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

          <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
