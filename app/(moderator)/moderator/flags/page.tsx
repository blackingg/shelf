"use client";

import { useState } from "react";
import { useGetFlaggedContentQuery } from "@/app/services";
import { FiFlag, FiMoreHorizontal, FiExternalLink, FiBookOpen } from "react-icons/fi";
import Link from "next/link";
import { Pagination } from "@/app/components/Library/Pagination";
import { ResolveFlagModal } from "@/app/components/Moderator/ResolveFlagModal";

export default function FlaggedContent() {
  const [activeTab, setActiveTab] = useState<"books" | "folders">("books");
  const [page, setPage] = useState(1);
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const handleTabChange = (tab: "books" | "folders") => {
    setActiveTab(tab);
    setPage(1);
  };

  const { data: flaggedBooks, isLoading: loadingBooks } = useGetFlaggedContentQuery("books", {
    reviewed: false,
    page,
    limit: 10,
  });
  
  const { data: flaggedFolders, isLoading: loadingFolders } = useGetFlaggedContentQuery("folders", {
    reviewed: false,
    page,
    limit: 10,
  });

  const activeData = activeTab === "books" ? flaggedBooks : flaggedFolders;
  const items = activeData?.items;
  const isLoading = activeTab === "books" ? loadingBooks : loadingFolders;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          Flagged Content
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Review reports from the community.
        </p>
      </section>

      <div className="flex space-x-8 border-b border-gray-100 dark:border-neutral-800">
        <button
          onClick={() => handleTabChange("books")}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "books"
              ? "text-primary font-semibold"
              : "text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Books
          {activeTab === "books" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => handleTabChange("folders")}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "folders"
              ? "text-primary font-semibold"
              : "text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Folders
          {activeTab === "folders" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-neutral-400">
            Loading flags...
          </div>
        ) : items?.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FiFlag className="mx-auto text-3xl text-gray-200 dark:text-neutral-800" />
            <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
              Clean slate. No pending flags.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50 dark:divide-neutral-800/50">
              {items?.map((flag) => (
                <div
                  key={flag.id}
                  className="group flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-2 h-2 rounded-full ${activeTab === "books" ? "bg-blue-500" : "bg-yellow-400"}`} />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {flag.reason.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        Reported by <span className="text-gray-900 dark:text-neutral-300">@{flag.reporter?.username || "-"}</span> • {new Date(flag.createdAt).toLocaleDateString()}
                      </p>
                      {flag.comment && (
                        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2 italic">
                          "{flag.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 mr-4">
                      {activeTab === "books" && flag.bookId && (
                        <>
                          <Link 
                            href={`/moderator/books/${flag.bookId}`}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <FiExternalLink />
                          </Link>
                          <Link 
                            href={`/moderator/books/${flag.bookId}/read`}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                            title="Read"
                          >
                            <FiBookOpen />
                          </Link>
                        </>
                      )}
                      {activeTab === "folders" && flag.folderId && (
                        <Link 
                          href={`/folders/${flag.folderId}`}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                          title="View Folder"
                        >
                          <FiExternalLink />
                        </Link>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedFlagId(flag.id);
                        setIsResolveModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md transition-colors border border-gray-100 dark:border-neutral-700 cursor-pointer"
                    >
                      Resolve
                    </button>
                    <button className="p-2 text-gray-400 dark:text-neutral-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <FiMoreHorizontal />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {activeData && activeData.totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-neutral-900/30 px-6">
                <Pagination
                  currentPage={page}
                  totalPages={activeData.totalPages}
                  onPageChange={(p) => setPage(p)}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedFlagId && (
        <ResolveFlagModal
          isOpen={isResolveModalOpen}
          onClose={() => {
            setIsResolveModalOpen(false);
            setSelectedFlagId(null);
          }}
          flagId={selectedFlagId}
          contentType={activeTab}
        />
      )}
    </div>
  );
}
