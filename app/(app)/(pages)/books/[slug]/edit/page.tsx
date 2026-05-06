"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiAlertCircle,
  FiCheck,
  FiArrowLeft,
  FiImage,
  FiLayout,
  FiBookOpen,
  FiEdit3,
  FiFileText,
  FiSearch,
} from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { FormSelect } from "@/app/components/Form/FormSelect";
import {
  useBookBySlug,
  useBookActions,
  useDepartments,
  useCategories,
  useUser,
} from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { motion } from "framer-motion";
import { useIsOwner } from "@/app/hooks/useIsOwner";

export default function EditBookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { me: user } = useUser();

  const { book, isLoading: isLoadingBook } = useBookBySlug(slug);
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

  // Initialize form with book data
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

  // Handle cover preview
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
      // 1. Update metadata
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

      // 2. Update cover if changed
      if (coverFile) {
        await bookActions.updateCover(book.id, coverFile);
      }

      // 3. Update file if changed
      if (bookFile) {
        await bookActions.updateFile(book.id, bookFile);
      }

      addNotification("success", "Resource updated successfully!");
      router.push(`/books/${book.slug}`);
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update resource."),
      );
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        addNotification("error", "Cover image must be less than 5MB");
        return;
      }
      setCoverFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        addNotification("error", "Document file must be less than 50MB");
        return;
      }
      setBookFile(file);
    }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block">
      {children}
    </label>
  );

  if (isLoadingBook) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Fetching resource...
          </p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800 p-6 md:p-10">
        <div className="max-w-4xl mx-auto border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900 px-6 py-10 sm:px-8 sm:py-12">
          <div className="max-w-xl text-left space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>404 resource missing</span>
            </div>

            <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
              Resource Not Found
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
              The resource you are trying to edit does not exist.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/library")}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-emerald-700"
              >
                <FiSearch className="w-4 h-4" />
                Back to Library
              </button>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user is the donor
  const isDonor = useIsOwner(book?.donor);
  if (!isDonor && user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6">
            <FiAlertCircle className="text-3xl text-red-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm mb-10 leading-relaxed">
            You do not have the required permissions to modify this resource.
            Only the original donor can edit its details.
          </p>
          <Button
            variant="secondary"
            onClick={() => router.push("/library")}
            icon={<FiArrowLeft className="text-xs" />}
            className="w-auto px-8"
          >
            Back to Library
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800 overflow-y-auto">
      <main className="p-6 md:p-12 max-w-4xl mx-auto w-full">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-500 transition-all mb-8 w-fit"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Return to Library
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-emerald-500"></div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
              Edit Resource
            </h1>
          </div>
          <p className="text-gray-500 dark:text-neutral-500 text-sm max-w-lg leading-relaxed">
            Updating details for{" "}
            <span className="text-emerald-600 font-medium">"{book.title}"</span>
            . Changes will be reflected across the community bookshelf.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          <div className="grid md:grid-cols-3 gap-10">
            {/* Left: Cover and File */}
            <div className="md:col-span-1 space-y-8">
              <div className="space-y-4">
                <Label>Cover Image</Label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="group relative aspect-[3/4] border border-gray-200 dark:border-neutral-800 rounded-md overflow-hidden cursor-pointer hover:border-emerald-500 transition-all shadow-sm"
                >
                  {coverPreviewUrl ? (
                    <img
                      src={coverPreviewUrl}
                      className="w-full h-full object-cover"
                      alt="Cover"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-300">
                      <FiImage className="text-2xl mb-2" />
                      <p className="text-[10px] font-bold uppercase">
                        Upload Cover
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiImage className="text-white text-xl" />
                  </div>
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </div>

              <div className="space-y-4">
                <Label>Document File</Label>
                <div
                  onClick={() => bookFileRef.current?.click()}
                  className={`p-4 border border-dashed rounded-md flex flex-col items-center text-center transition-all cursor-pointer ${
                    bookFile
                      ? "border-emerald-500 bg-emerald-50/20"
                      : "border-gray-200 dark:border-neutral-800 hover:border-emerald-500"
                  }`}
                >
                  <FiFileText
                    className={`text-xl mb-2 ${bookFile ? "text-emerald-500" : "text-gray-300"}`}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 dark:text-neutral-400">
                    {bookFile
                      ? bookFile.name
                      : book.fileType
                        ? `${book.fileType.toUpperCase()} File`
                        : "Replace File"}
                  </p>
                </div>
                <input
                  ref={bookFileRef}
                  type="file"
                  accept=".pdf,.epub"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-[10px] text-gray-400 italic">
                  Leave empty to keep the existing document.
                </p>
              </div>
            </div>

            {/* Right: Metadata */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <div className="relative group">
                  <FiEdit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Resource Title"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Author</Label>
                <input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author Name"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormSelect<any, false>
                  label="Category"
                  icon={<FiLayout />}
                  options={categoryOptions}
                  isLoading={isLoadingCategories}
                  placeholder="Select..."
                  onChange={(opt: any) =>
                    setFormData({
                      ...formData,
                      category: opt?.value || "",
                    })
                  }
                  value={
                    categoryOptions.find(
                      (opt) => opt.value === formData.category,
                    ) || null
                  }
                />
                <div className="space-y-1.5">
                  <Label>Pages</Label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) =>
                      setFormData({ ...formData, pages: e.target.value })
                    }
                    placeholder="0"
                    required
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Short Description</Label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief summary..."
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all resize-none rounded-md"
                />
              </div>

              <FormSelect<any, false>
                label="Department"
                icon={<FiBookOpen />}
                options={departmentOptions}
                isLoading={isLoadingDepts}
                placeholder="Department"
                onChange={(opt: any) =>
                  setFormData({
                    ...formData,
                    department: opt?.value || "",
                  })
                }
                value={
                  departmentOptions.find(
                    (opt) => opt.value === formData.department,
                  ) ||
                  (book?.departmentRef
                    ? {
                        value: book.departmentRef.id as string,
                        label: book.departmentRef.name,
                      }
                    : null)
                }
              />

              <div className="space-y-1.5">
                <Label>Publisher</Label>
                <input
                  value={formData.publisher}
                  onChange={(e) =>
                    setFormData({ ...formData, publisher: e.target.value })
                  }
                  placeholder="e.g. Pearson, O'Reilly"
                  className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Published Year</Label>
                  <input
                    type="number"
                    value={formData.publishedYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publishedYear: e.target.value,
                      })
                    }
                    placeholder="YYYY"
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>ISBN</Label>
                  <input
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    placeholder="Optional"
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tags (Comma separated)</Label>
                <input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g. engineering, study guide, exam"
                  className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-neutral-800 gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              className="px-8 py-3 rounded-md text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              isLoading={isUpdating || isUpdatingCover || isUpdatingFile}
              icon={<FiCheck className="text-sm" />}
              className="px-8 py-3 rounded-md text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
