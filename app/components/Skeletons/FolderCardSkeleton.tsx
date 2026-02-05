"use client";
import { motion } from "motion/react";

interface FolderCardSkeletonProps {
  count?: number;
}

function SingleFolderCardSkeleton() {
  return (
    <div className="overflow-hidden">
      {/* Cover Image Skeleton */}
      <div className="relative h-64 rounded-xl bg-gray-200 dark:bg-neutral-700 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="py-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded-lg w-3/4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-neutral-700/50 rounded w-2/3 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </div>
          <div className="h-4 bg-gray-100 dark:bg-neutral-700/50 rounded w-1/3 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FolderCardSkeleton({
  count = 1,
}: FolderCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SingleFolderCardSkeleton key={index} />
      ))}
    </>
  );
}
