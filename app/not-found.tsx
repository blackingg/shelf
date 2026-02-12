"use client";
import Link from "next/link";
import { FiHome, FiSearch, FiAlertTriangle } from "react-icons/fi";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full"
      >
        <div className="relative text-center">
          <div className="relative z-10">
            <div className="flex justify-center mb-10">
              <div className="w-20 h-20 bg-gray-50 dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 flex items-center justify-center shadow-sm">
                <FiAlertTriangle className="w-8 h-8 text-emerald-500" />
              </div>
            </div>

            <span className="inline-block text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-500 mb-6 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800/30">
              Error 404
            </span>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-none">
              Lost in the <span className="text-emerald-600">stacks</span>.
            </h1>

            <p className="text-gray-500 dark:text-neutral-500 mb-12 text-lg font-medium max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find the resource you were looking for. It might
              have been relocated to a different department or archived.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/app/library"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 h-14 bg-gray-900 dark:bg-white text-white dark:text-neutral-950 text-[11px] font-black uppercase tracking-widest rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/5 dark:shadow-white/5"
              >
                <FiHome className="w-4 h-4" />
                Back to Library
              </Link>
              <Link
                href="/app/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 h-14 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <FiSearch className="w-4 h-4" />
                Search Library
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-dashed border-gray-100 dark:border-neutral-800/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-600">
                If you believe this is an error, please contact support.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
