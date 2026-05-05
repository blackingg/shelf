"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiCheck,
  FiArrowLeft,
  FiImage,
  FiEdit3,
  FiFileText,
} from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { FormSelect } from "@/app/components/Form/FormSelect";
import {
  useGetBookByIdQuery,
  useBookActions,
  useDepartments,
  useCategories,
  useUser,
} from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";

export default function AdminEditBookPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { me: user } = useUser();

  const { data: book, isLoading: isLoadingBook } = useGetBookByIdQuery(id);
  const {
    actions: bookActions,
    isUpdating,
    isUpdatingCover,
    isUpdatingFile,
  } = useBookActions();

  const { departments, isLoading: isLoadingDepts } = useDepartments(
    user?.school?.id ? { school_id: user.school.id } : undefined,
  );
  const { categories: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    department: "",
    pages: "",
    publisher: "",
    publishedYear: "",
    isbn: "",
    tags: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const bookFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        category: book.category || "",
        department: book.departmentRef?.id || "",
        pages: book.pages?.toString() || "",
        publisher: book.publisher || "",
        publishedYear: book.publishedYear?.toString() || "",
        isbn: book.isbn || "",
        tags: book.tags?.join(", ") || "",
      });
      setCoverPreviewUrl(book.coverImage || null);
    }
  }, [book]);

  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => ({
        value: dept.id,
        label: dept.name,
      })),
    [departments],
  );

  const categoryOptions = useMemo(
    () =>
      categoriesData.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    [categoriesData],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        pages: parseInt(formData.pages) || 0,
        department: formData.department || undefined,
        publisher: formData.publisher || undefined,
        publishedYear: formData.publishedYear
          ? parseInt(formData.publishedYear)
          : undefined,
        isbn: formData.isbn || undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      await bookActions.updateBook(book.id, payload);

      if (coverFile) {
        await bookActions.updateCover(book.id, coverFile);
      }

      if (bookFile) {
        await bookActions.updateFile(book.id, bookFile);
      }

      addNotification("success", "Resource updated by Admin successfully!");
      router.back();
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update resource."),
      );
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBookFile(e.target.files[0]);
    }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block">
      {children}
    </label>
  );

  if (isLoadingBook) return <div className="p-12 text-center text-sm text-gray-500">Loading system resource...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors mb-8"
      >
        <FiArrowLeft />
        Back to Admin
      </button>

      <div className="mb-10 border-l-4 border-red-500 pl-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          Administrative Content Override
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 italic">
          System Admin — Force Editing "{book?.title}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div>
              <Label>Cover Image</Label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className="aspect-[3/4] border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors relative group"
              >
                {coverPreviewUrl ? (
                  <img src={coverPreviewUrl} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <FiImage size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold uppercase">
                  Override Cover
                </div>
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            </div>

            <div>
              <Label>Document File</Label>
              <div
                onClick={() => bookFileRef.current?.click()}
                className="p-4 border border-dashed border-gray-100 dark:border-neutral-800 rounded-md text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
              >
                <FiFileText className="mx-auto text-gray-300 mb-2" />
                <p className="text-[10px] font-bold text-gray-500">
                  {bookFile ? bookFile.name : "Replace System File"}
                </p>
              </div>
              <input ref={bookFileRef} type="file" accept=".pdf,.epub" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Author</Label>
              <input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormSelect<any, false>
                label="Category"
                options={categoryOptions}
                isLoading={isLoadingCategories}
                placeholder="Select..."
                onChange={(opt: any) => setFormData({ ...formData, category: opt?.value || "" })}
                value={categoryOptions.find((opt) => opt.value === formData.category) || null}
              />
              <div className="space-y-1.5">
                <Label>Pages</Label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500/50 resize-none"
                required
              />
            </div>

            <FormSelect<any, false>
              label="Department"
              options={departmentOptions}
              isLoading={isLoadingDepts}
              placeholder="Select..."
              onChange={(opt: any) => setFormData({ ...formData, department: opt?.value || "" })}
              value={departmentOptions.find((opt) => opt.value === formData.department) || null}
            />
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-gray-50 dark:border-neutral-800 space-x-4">
          <Button variant="secondary" type="button" onClick={() => router.back()} className="px-8 rounded-md uppercase text-[10px] font-bold tracking-widest">
            Discard
          </Button>
          <Button type="submit" isLoading={isUpdating} className="px-8 rounded-md bg-red-600 hover:bg-red-700 text-white border-none uppercase text-[10px] font-bold tracking-widest">
            Apply System Override
          </Button>
        </div>
      </form>
    </div>
  );
}
