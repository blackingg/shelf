"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBookByIdQuery } from "@/app/services";
import { FiArrowLeft, FiEdit3, FiBookOpen, FiClock, FiUser, FiInfo, FiShield } from "react-icons/fi";
import Link from "next/link";

export default function AdminBookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: book, isLoading } = useGetBookByIdQuery(id);

  if (isLoading) return <div className="p-12 text-center text-sm text-gray-500">Loading system data...</div>;
  if (!book) return <div className="p-12 text-center text-sm text-red-500">Resource not found in system directory.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors"
      >
        <FiArrowLeft />
        Back to Admin Portal
      </button>

      <section className="flex flex-col md:flex-row gap-10">
        <div className="w-48 h-64 flex-shrink-0 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden relative group">
          <img src={book.coverImage || "/dummycover.png"} className="w-full h-full object-cover" alt={book.title} />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[8px] font-bold uppercase tracking-tighter rounded-sm">
            System Resource
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <FiShield />
              <span>Admin Override Access</span>
            </div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white leading-tight">
              {book.title}
            </h1>
            <p className="text-lg text-gray-500 dark:text-neutral-400">{book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={`/admin/books/${book.id}/read`}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-md text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
            >
              <FiBookOpen />
              <span>Preview Content</span>
            </Link>
            <Link 
              href={`/admin/books/${book.id}/edit`}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              <FiEdit3 />
              <span>System Edit</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12 border-t border-gray-50 dark:border-neutral-800 pt-10">
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">System Metadata</h3>
          <div className="space-y-4">
            <MetaItem label="Internal ID" value={book.id} icon={<FiInfo />} />
            <MetaItem label="Slug" value={book.slug} icon={<FiInfo />} />
            <MetaItem label="Category" value={book.category} icon={<FiInfo />} />
            <MetaItem label="Department" value={book.departmentRef?.name} icon={<FiInfo />} />
            <MetaItem label="Pages" value={book.pages} icon={<FiInfo />} />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contributor Governance</h3>
          <div className="space-y-4">
            <MetaItem label="Owner" value={`@${book.donor?.username || "anonymous"}`} icon={<FiUser />} />
            <MetaItem label="Created At" value={new Date(book.donatedAt).toLocaleDateString()} icon={<FiClock />} />
            <MetaItem label="System Update" value={new Date(book.updatedAt).toLocaleDateString()} icon={<FiClock />} />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-50 dark:border-neutral-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Content Description</h3>
        <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
          {book.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}

function MetaItem({ label, value, icon }: { label: string; value: any; icon: any }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-300 dark:text-neutral-700">{icon}</span>
      <span className="text-gray-500 dark:text-neutral-500 font-medium w-28">{label}:</span>
      <span className="text-gray-900 dark:text-white font-mono text-[11px]">{value || "-"}</span>
    </div>
  );
}
