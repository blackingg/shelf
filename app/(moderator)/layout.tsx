import { ModeratorSidebar } from "@/app/components/Moderator/ModeratorSidebar";
import ProtectedRoute from "@/app/components/Auth/ProtectedRoute";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute roles={["MODERATOR", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex font-sans overflow-hidden">
        <ModeratorSidebar />

        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between px-8 sticky top-0 z-30">
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
    </ProtectedRoute>
  );
}
