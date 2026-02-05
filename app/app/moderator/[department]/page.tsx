"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";

const pendingDocs = [
  {
    id: "doc-1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    submitter: "John Doe",
    cover_image: "/dummycover.png",
    status: "Pending",
  },
  {
    id: "doc-2",
    title: "Clean Code",
    author: "Robert C. Martin",
    submitter: "Jane Smith",
    cover_image: "/dummycover.png",
    status: "Pending",
  },
  {
    id: "doc-3",
    title: "Design Patterns",
    author: "Erich Gamma",
    submitter: "Alice Johnson",
    cover_image: "/dummycover.png",
    status: "Pending",
  },
  {
    id: "doc-4",
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    submitter: "Bob Williams",
    cover_image: "/dummycover.png",
    status: "Pending",
  },
  {
    id: "doc-5",
    title: "Refactoring",
    author: "Martin Fowler",
    submitter: "Charlie Brown",
    cover_image: "/dummycover.png",
    status: "Pending",
  },
];

export default function DepartmentModerationPage() {
  const router = useRouter();
  const params = useParams();
  const departmentSlug = params.department;

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <button
            onClick={() => router.back()}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Moderator
          </button>
          <span>/</span>
          <span className="capitalize text-gray-900 dark:text-white font-medium">
            {String(departmentSlug).replace("-", " ")}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white capitalize mb-2">
          {String(departmentSlug).replace("-", " ")}
        </h1>
        <p className="text-gray-500 dark:text-neutral-400">
          {pendingDocs.length} documents requiring approval
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {pendingDocs.map((doc) => (
          <div
            key={doc.id}
            className="relative group"
          >
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-1 bg-yellow-100/90 backdrop-blur-md text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm border border-yellow-200/50 dark:border-yellow-700/50">
                Pending
              </span>
            </div>
            <BookCard
              title={doc.title}
              author={doc.author}
              cover_image={doc.cover_image}
              donor_id={doc.submitter}
              onClick={() => router.push(`/app/moderator/book/${doc.id}`)}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
