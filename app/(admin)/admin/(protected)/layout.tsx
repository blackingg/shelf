import { AdminSidebar } from "@/app/components/Admin/AdminSidebar";
import ProtectedRoute from "@/app/components/Auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute roles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-black flex font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-8 sticky top-0 z-30">
            <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Portal Control
            </h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700" />
            </div>
          </header>

          <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
