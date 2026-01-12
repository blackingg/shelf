"use client";
import { motion } from "motion/react";

interface FolderListSkeletonProps {
  count?: number;
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
            />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 + 0.1 }}
              />
            </div>
            <div className="h-3 bg-gray-100 rounded w-24 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 + 0.2 }}
              />
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-100 rounded w-16 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 + 0.3 }}
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-100 rounded-full w-20 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 + 0.4 }}
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-100 rounded w-24 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 + 0.5 }}
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 w-8 bg-gray-100 rounded-lg ml-auto relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 + 0.6 }}
          />
        </div>
      </td>
    </tr>
  );
}

export default function FolderListSkeleton({ count = 5 }: FolderListSkeletonProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Folder Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Books
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: count }).map((_, index) => (
              <SkeletonRow key={index} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
