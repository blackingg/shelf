"use client";
import React, { useState, useRef } from "react";
import { FiUploadCloud, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { FormInput } from "@/app/components/Form/FormInput";
import Select from "react-select";
import { useTheme } from "next-themes";

import { useRouter } from "next/navigation";
import { useCreateBookMutation } from "@/app/store/api/booksApi";
import { useGetDepartmentsQuery } from "@/app/store/api/departmentsApi";
import { useGetCategoriesQuery } from "@/app/store/api/categoriesApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";

export default function UploadPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const [createBook, { isLoading: isSubmitting }] = useCreateBookMutation();

  const { data: departments = [], isLoading: isLoadingDepts } =
    useGetDepartmentsQuery();
  const { data: categoriesData = [], isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const [bookFile, setBookFile] = useState<File | null>(null);
  const [dragActiveBook, setDragActiveBook] = useState(false);

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
    coverImage: "",
  });

  const bookInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const active = e.type === "dragenter" || e.type === "dragover";
    setDragActiveBook(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBook(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 50 * 1024 * 1024) {
        addNotification("error", "Book file must be less than 50MB");
        return;
      }
      setBookFile(file);
    }
  };

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        addNotification("error", "Book file must be less than 50MB");
        return;
      }
      setBookFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      { key: "title", label: "Title" },
      { key: "author", label: "Author" },
      { key: "description", label: "Description" },
      { key: "category", label: "Category" },
      { key: "pages", label: "Number of Pages" },
      { key: "coverImage", label: "Cover Image URL" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData]) {
        addNotification("error", `Please provide a ${field.label}.`);
        return;
      }
    }

    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        pages: parseInt(formData.pages) || 0,
        coverImage: formData.coverImage,
        department: formData.department || undefined,
        publisher: formData.publisher || undefined,
        publishedYear: formData.publishedYear
          ? parseInt(formData.publishedYear)
          : undefined,
        isbn: formData.isbn || undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      await createBook(payload).unwrap();

      addNotification(
        "success",
        "Book donated successfully! Thank you for your contribution.",
      );
      router.push("/app/library");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to donate book."),
      );
    }
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.slug,
    label: dept.name,
  }));

  const categoryOptions = categoriesData.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] uppercase font-medium tracking-widest text-gray-500 dark:text-neutral-400 ml-1 mb-2 block">
      {children}
    </label>
  );

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto">
      <main className="p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
            Donate Resource
          </h1>
          <p className="text-gray-500 dark:text-neutral-500 text-sm">
            Share academic materials with the community. Contributors help build
            a collectively owned digital library.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-12 pb-20"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <Label>Document File</Label>
                <span className="text-[10px] font-medium uppercase text-gray-400 dark:text-neutral-500 tracking-tight">
                  Optional (PDF, EPUB)
                </span>
              </div>

              <input
                ref={bookInputRef}
                type="file"
                className="hidden"
                onChange={handleBookFileChange}
                accept=".pdf,.epub"
              />

              <div
                onDragEnter={(e) => handleDrag(e)}
                onDragOver={(e) => handleDrag(e)}
                onDragLeave={(e) => handleDrag(e)}
                onDrop={(e) => handleDrop(e)}
                onClick={() => bookInputRef.current?.click()}
                className={`border border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[160px] relative ${
                  dragActiveBook
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : bookFile
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/5"
                      : "border-gray-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500"
                }`}
              >
                {bookFile ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full px-4 mb-1">
                      {bookFile.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {(bookFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookFile(null);
                      }}
                      className="mt-4 text-[10px] font-medium uppercase text-red-500 dark:text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUploadCloud className="text-gray-300 dark:text-neutral-700 text-2xl mb-3" />
                    <span className="text-xs font-medium text-gray-500 dark:text-neutral-500">
                      Drop document or click to upload
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Cover Image URL</Label>
              <input
                name="coverImage"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-[10px] text-gray-400 dark:text-neutral-500 mt-1 italic">
                Pro tip: Use a direct link to an image (ArtStation, Cloudinary,
                etc.)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-100 dark:border-neutral-800 pt-12">
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                Core Metadata
              </h2>
            </div>

            <div className="space-y-1.5">
              <Label>Resource Title</Label>
              <input
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Organic Chemistry Vol. 1"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Author</Label>
              <input
                name="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="e.g. Jonathan Clayden"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select
                options={departmentOptions}
                isLoading={isLoadingDepts}
                placeholder="Select Department"
                onChange={(opt: any) =>
                  setFormData({ ...formData, department: opt?.label || "" })
                }
                styles={customSelectStyles(isDark)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                options={categoryOptions}
                isLoading={isLoadingCategories}
                placeholder="Select Category"
                onChange={(opt: any) =>
                  setFormData({ ...formData, category: opt?.value || "" })
                }
                styles={customSelectStyles(isDark)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Number of Pages</Label>
              <input
                name="pages"
                type="number"
                value={formData.pages}
                onChange={(e) =>
                  setFormData({ ...formData, pages: e.target.value })
                }
                placeholder="e.g. 450"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Published Year</Label>
              <input
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({ ...formData, publishedYear: e.target.value })
                }
                placeholder="e.g. 2023"
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label>Description</Label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Provide a brief summary of the resource..."
                required
              />
            </div>

            <div className="space-y-6 md:col-span-2 mt-4">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                Optional Identifiers
              </h2>
            </div>

            <div className="space-y-1.5">
              <Label>Publisher</Label>
              <input
                name="publisher"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                placeholder="e.g. Pearson"
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label>ISBN</Label>
              <input
                name="isbn"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                placeholder="e.g. 978-3-16-148410-0"
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tags (Comma separated)</Label>
              <input
                name="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="e.g. chemistry, organic, science"
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-gray-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-500 text-[10px] font-medium uppercase tracking-tight">
              <FiAlertCircle className="text-xs" />
              <span>Review required by community moderators</span>
            </div>
            <div className="w-full md:w-64">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full py-4 rounded-md text-sm font-medium uppercase tracking-widest"
              >
                Confirm Donation
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

const customSelectStyles = (isDark: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "0.375rem",
    padding: "0.25rem 0.5rem",
    borderColor: state.isFocused ? "#10b981" : isDark ? "#262626" : "#e5e7eb",
    backgroundColor: isDark ? "#171717" : "#ffffff",
    boxShadow: "none",
    "&:hover": { borderColor: "#10b981" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.375rem",
    overflow: "hidden",
    boxShadow: isDark
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
      : "0 4px 6px -1px rgb(0 0 0 / 0.05)",
    border: isDark ? "1px solid #262626" : "1px solid #e5e7eb",
    backgroundColor: isDark ? "#171717" : "#ffffff",
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
        ? isDark
          ? "#262626"
          : "#f3f4f6"
        : "transparent",
    color: state.isSelected ? "white" : isDark ? "#ffffff" : "#111827",
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#10b981",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: isDark ? "#ffffff" : "#111827",
  }),
  input: (base: any) => ({
    ...base,
    color: isDark ? "#ffffff" : "#111827",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: isDark ? "#737373" : "#9ca3af",
  }),
});
