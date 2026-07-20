import Link from "next/link";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import "@/app/globals.css";

export default function AdminNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-md flex items-center justify-center mx-auto border border-red-500/20">
              <FiShield className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-medium text-foreground tracking-tight">
                Resource Not Found
              </h1>
              <p className="text-muted font-medium">
                The administrative page or record you are looking for does not
                exist or has been moved.
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md text-sm font-medium transition-colors hover:opacity-90"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
