"use client";
import { motion } from "motion/react";

interface BookCardSkeletonProps {
  count?: number;
  variant?: "grid" | "list";
}

function SingleBookCardSkeleton({
  variant = "grid",
}: {
  variant?: "grid" | "list";
}) {
  if (variant === "list") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
        {/* Book Cover */}
        <div className="w-20 h-28 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1,
              }}
            />
          </div>
          <div className="h-4 bg-gray-100 rounded w-1/2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-100 rounded-full w-16 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </div>
            <div className="h-6 bg-gray-100 rounded-full w-20 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Book Cover */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-4/5 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
        </div>

        {/* Author */}
        <div className="h-4 bg-gray-100 rounded w-1/2 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-1">
          <div className="h-6 bg-emerald-50 rounded-full w-14 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </div>
          <div className="h-6 bg-blue-50 rounded-full w-16 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookCardSkeleton({
  count = 1,
  variant = "grid",
}: BookCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SingleBookCardSkeleton
          key={index}
          variant={variant}
        />
      ))}
    </>
  );
}
