"use client";
import { motion } from "motion/react";

const Shimmer = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
    animate={{ x: ["-100%", "100%"] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

export default function FolderEditSkeleton() {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back button */}
        <div className="h-5 bg-gray-100 dark:bg-neutral-800 rounded w-28 mb-8 relative overflow-hidden">
          <Shimmer />
        </div>

        <div>
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-md relative overflow-hidden">
                <Shimmer delay={0.1} />
              </div>
              <div className="space-y-2">
                <div className="h-7 bg-gray-200 dark:bg-neutral-800 rounded w-36 relative overflow-hidden">
                  <Shimmer delay={0.15} />
                </div>
                <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-56 relative overflow-hidden">
                  <Shimmer delay={0.2} />
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Folder Name field */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-24 relative overflow-hidden">
                <Shimmer delay={0.25} />
              </div>
              <div className="h-12 bg-gray-100 dark:bg-neutral-800 rounded-md w-full relative overflow-hidden">
                <Shimmer delay={0.3} />
              </div>
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-20 relative overflow-hidden">
                <Shimmer delay={0.35} />
              </div>
              <div className="h-28 bg-gray-100 dark:bg-neutral-800 rounded-md w-full relative overflow-hidden">
                <Shimmer delay={0.4} />
              </div>
            </div>

            {/* Visibility toggle */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-16 relative overflow-hidden">
                <Shimmer delay={0.45} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-24 bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-800 rounded-md relative overflow-hidden">
                  <Shimmer delay={0.5} />
                </div>
                <div className="h-24 bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-800 rounded-md relative overflow-hidden">
                  <Shimmer delay={0.55} />
                </div>
              </div>
            </div>

            {/* Collaborators section */}
            <div className="border-t border-gray-100 dark:border-white/5 pt-8 space-y-4">
              <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-28 relative overflow-hidden">
                <Shimmer delay={0.6} />
              </div>
              <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-md p-4 md:p-6 space-y-4 border border-gray-100 dark:border-white/5">
                {/* Invite row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 h-10 bg-gray-100 dark:bg-neutral-800 rounded-md relative overflow-hidden">
                    <Shimmer delay={0.65} />
                  </div>
                  <div className="w-32 h-10 bg-gray-100 dark:bg-neutral-800 rounded-md relative overflow-hidden">
                    <Shimmer delay={0.7} />
                  </div>
                  <div className="w-24 h-10 bg-gray-200 dark:bg-neutral-700 rounded-md relative overflow-hidden">
                    <Shimmer delay={0.75} />
                  </div>
                </div>
                {/* Collaborator rows */}
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-white/5"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-neutral-800 rounded-md relative overflow-hidden">
                        <Shimmer delay={0.8 + i * 0.1} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-24 relative overflow-hidden">
                          <Shimmer delay={0.85 + i * 0.1} />
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-14 relative overflow-hidden">
                          <Shimmer delay={0.9 + i * 0.1} />
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 dark:bg-neutral-800 rounded-md relative overflow-hidden">
                      <Shimmer delay={0.95 + i * 0.1} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="h-12 bg-gray-100 dark:bg-neutral-800 rounded-md w-24 relative overflow-hidden">
                <Shimmer delay={1.1} />
              </div>
              <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-md w-40 relative overflow-hidden">
                <Shimmer delay={1.15} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
