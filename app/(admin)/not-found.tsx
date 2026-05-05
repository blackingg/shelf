import Link from "next/link";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import "@/app/globals.css";

export default function AdminNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl shadow-red-500/10">
              <FiShield className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Resource Not Found
              </h1>
              <p className="text-gray-500 dark:text-neutral-400 font-medium">
                The administrative page or record you are looking for does not
                exist or has been moved.
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
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
