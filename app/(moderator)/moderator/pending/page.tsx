"use client";

import { useState } from "react";
import { useGetPendingBooksQuery, useModeration } from "@/app/services";
import { FiInbox, FiCheck, FiX, FiExternalLink, FiEdit3, FiBookOpen } from "react-icons/fi";
import Link from "next/link";
import { Pagination } from "@/app/components/Library/Pagination";
import { ConfirmModal } from "@/app/components/Shared/ConfirmModal";

export default function PendingBooks() {
  const [page, setPage] = useState(1);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  const { data: pendingData, isLoading } = useGetPendingBooksQuery({
    page,
    limit: 10,
  });

  const { actions: { setBookStatus, isSettingStatus } } = useModeration();

  const books = pendingData?.items;

  const handleActionClick = (bookId: string, action: "approve" | "reject") => {
    setSelectedBookId(bookId);
    setConfirmAction(action);
  };

  const handleConfirmAction = async () => {
    if (!selectedBookId || !confirmAction) return;
    try {
      await setBookStatus({
        bookId: selectedBookId,
        status: confirmAction === "approve" ? "AVAILABLE" : "ARCHIVED",
      });
      setSelectedBookId(null);
      setConfirmAction(null);
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          Pending Approvals
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Verify and approve newly donated books.
        </p>
      </section>

      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-neutral-400">
            Loading pending books...
          </div>
        ) : books?.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FiInbox className="mx-auto text-3xl text-gray-200 dark:text-neutral-800" />
            <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
              All caught up! No books awaiting review.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50 dark:divide-neutral-800/50">
              {books?.map((book) => (
                <div
                  key={book.id}
                  className="group flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {book.title}
                        </p>
                        <Link 
                          href={`/moderator/books/${book.id}`}
                          className="text-gray-400 hover:text-primary transition-colors"
                          title="View Details"
                        >
                          <FiExternalLink className="text-xs" />
                        </Link>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        by <span className="text-gray-900 dark:text-neutral-300">{book.author || "-"}</span> • Donated by <span className="text-gray-900 dark:text-neutral-300">@{book.donor?.username || "-"}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 border border-gray-100 dark:border-neutral-700 rounded-sm uppercase tracking-wider">
                          {book.department || "-"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 border border-gray-100 dark:border-neutral-700 rounded-sm uppercase tracking-wider">
                          {book.category || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden mr-4">
                      <Link 
                        href={`/moderator/books/${book.id}/read`}
                        className="p-2.5 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 border-r border-gray-100 dark:border-neutral-800 transition-colors"
                        title="Read"
                      >
                        <FiBookOpen className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/moderator/books/${book.id}/edit`}
                        className="p-2.5 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Metadata"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleActionClick(book.id, "approve")}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-md transition-colors border border-emerald-100 dark:border-emerald-500/20 cursor-pointer"
                    >
                      <FiCheck />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleActionClick(book.id, "reject")}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md transition-colors border border-red-100 dark:border-red-500/20 cursor-pointer"
                    >
                      <FiX />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pendingData && pendingData.totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-neutral-900/30 px-6">
                <Pagination
                  currentPage={page}
                  totalPages={pendingData.totalPages}
                  onPageChange={(p) => setPage(p)}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmAction === "approve"}
        onClose={() => {
          setSelectedBookId(null);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        isLoading={isSettingStatus}
        title="Approve Book"
        message="Are you sure you want to approve this book? It will become publicly available for all users."
        confirmText="Approve"
        cancelText="Cancel"
        isDanger={false}
      />

      <ConfirmModal
        isOpen={confirmAction === "reject"}
        onClose={() => {
          setSelectedBookId(null);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        isLoading={isSettingStatus}
        title="Reject Book"
        message="Are you sure you want to reject this book? It will be archived and will not appear in public collections."
        confirmText="Reject & Archive"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
}
