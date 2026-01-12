"use client";
import { motion } from "motion/react";

export default function FolderDetailSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 space-y-6">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-100 rounded w-16 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="space-y-6 md:space-y-10">
          {/* Header section */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Folder icon skeleton */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-2xl flex-shrink-0 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                />
              </div>
              
              <div className="space-y-4">
                {/* Title skeleton */}
                <div className="h-8 bg-gray-200 rounded-lg w-64 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-96 max-w-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-72 max-w-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </div>
                </div>
                
                {/* Meta info skeleton */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="h-5 bg-gray-100 rounded w-20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </div>
                  <div className="h-5 bg-gray-100 rounded w-32 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    />
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full w-16 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu button skeleton */}
            <div className="h-10 w-10 bg-gray-100 rounded-lg relative overflow-hidden self-end lg:self-start">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            </div>
          </div>

          {/* Books table skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-32 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  {/* Book cover */}
                  <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    />
                  </div>
                  
                  {/* Book info */}
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-48 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.1 }}
                      />
                    </div>
                    <div className="h-4 bg-gray-100 rounded w-32 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.2 }}
                      />
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="h-6 bg-emerald-50 rounded-full w-20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 + 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
