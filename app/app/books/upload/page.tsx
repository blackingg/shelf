"use client";
import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  FiUploadCloud,
  FiFile,
  FiCheck,
  FiBook,
  FiHeart,
  FiInfo,
  FiUser,
  FiLayers,
  FiCalendar,
  FiTag,
  FiImage,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { FormInput } from "@/app/components/Form/FormInput";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useUploadBookMutation } from "@/app/store/api/booksApi";
import { useGetDepartmentsQuery } from "@/app/store/api/departmentsApi";
import { useGetCategoriesQuery } from "@/app/store/api/categoriesApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";

export default function UploadPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [uploadBook, { isLoading: isSubmitting }] = useUploadBookMutation();
  const { data: departments = [], isLoading: isLoadingDepts } =
    useGetDepartmentsQuery();
  const { data: categoriesData = [], isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [dragActiveBook, setDragActiveBook] = useState(false);
  const [dragActiveCover, setDragActiveCover] = useState(false);

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

  const bookInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, type: "book" | "cover") => {
    e.preventDefault();
    e.stopPropagation();
    const active = e.type === "dragenter" || e.type === "dragover";
    if (type === "book") setDragActiveBook(active);
    else setDragActiveCover(active);
  };

  const handleDrop = (e: React.DragEvent, type: "book" | "cover") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "book") setDragActiveBook(false);
    else setDragActiveCover(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === "book") {
        if (file.size > 50 * 1024 * 1024) {
          addNotification("error", "Book file must be less than 50MB");
          return;
        }
        setBookFile(file);
      } else {
        if (file.size > 5 * 1024 * 1024) {
          addNotification("error", "Cover image must be less than 5MB");
          return;
        }
        setCoverFile(file);
      }
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

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        addNotification("error", "Cover image must be less than 5MB");
        return;
      }
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The validation error provided by the user shows these are required for /books/upload
    if (
      !formData.title ||
      !formData.author ||
      !formData.description ||
      !formData.category ||
      !formData.pages ||
      !coverFile
    ) {
      addNotification(
        "error",
        "Please fill in all required fields and upload a cover image.",
      );
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("pages", formData.pages);
      submitData.append("cover_image", coverFile);

      if (bookFile) {
        submitData.append("book_file", bookFile);
      }

      if (formData.department)
        submitData.append("department", formData.department);
      if (formData.publisher)
        submitData.append("publisher", formData.publisher);
      if (formData.publishedYear)
        submitData.append("published_year", formData.publishedYear);
      if (formData.isbn) submitData.append("isbn", formData.isbn);
      if (formData.tags) submitData.append("tags", formData.tags);

      await uploadBook(submitData).unwrap();

      addNotification(
        "success",
        "Book donated successfully! Thank you for your contribution.",
      );
      router.push("/app/library");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to upload book."),
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

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
      <main className="p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">
              <FiHeart />
              <span>Community Contribution</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Donate to the Library
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-lg max-w-2xl">
              Share your academic materials with the community. Your
              contributions help build a collectively owned digital library.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-10 pb-20"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-700 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiFile className="text-emerald-500" />
                    <span>Document File</span>
                  </h2>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Optional
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
                  onDragEnter={(e) => handleDrag(e, "book")}
                  onDragOver={(e) => handleDrag(e, "book")}
                  onDragLeave={(e) => handleDrag(e, "book")}
                  onDrop={(e) => handleDrop(e, "book")}
                  onClick={() => bookInputRef.current?.click()}
                  className={`border-4 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] relative ${
                    dragActiveBook
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : bookFile
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                        : "border-gray-100 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                  }`}
                >
                  {bookFile ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookFile(null);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-700 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX />
                      </button>
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4">
                        <FiCheck className="text-2xl" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-full px-4">
                        {bookFile.name}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {(bookFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4 transition-colors">
                        <FiUploadCloud className="text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-neutral-400 text-center">
                        Drag & drop or click to upload
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-black">
                        PDF, EPUB (MAX 50MB)
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Cover Image Upload */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-700 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiImage className="text-emerald-500" />
                    <span>Cover Image</span>
                  </h2>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Required
                  </span>
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleCoverFileChange}
                  accept="image/*"
                />

                <div
                  onDragEnter={(e) => handleDrag(e, "cover")}
                  onDragOver={(e) => handleDrag(e, "cover")}
                  onDragLeave={(e) => handleDrag(e, "cover")}
                  onDrop={(e) => handleDrop(e, "cover")}
                  onClick={() => coverInputRef.current?.click()}
                  className={`border-4 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] relative ${
                    dragActiveCover
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : coverFile
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                        : "border-gray-100 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                  }`}
                >
                  {coverFile ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverFile(null);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-700 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX />
                      </button>
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4">
                        <FiCheck className="text-2xl" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-full px-4">
                        {coverFile.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4 transition-colors">
                        <FiUploadCloud className="text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-neutral-400 text-center">
                        Drag & drop or click to upload
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-black">
                        JPG, PNG (MAX 5MB)
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <FiInfo className="text-emerald-500 text-xl" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Resource Metadata
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <FormInput
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Organic Chemistry Vol. 1"
                  icon={<FiBook />}
                  required
                />
                <FormInput
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="e.g. Jonathan Clayden"
                  icon={<FiUser />}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1">
                    Department
                  </label>
                  <Select
                    options={departmentOptions}
                    isLoading={isLoadingDepts}
                    placeholder="Select Department"
                    onChange={(opt: any) =>
                      setFormData({ ...formData, department: opt?.value || "" })
                    }
                    styles={customSelectStyles}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1">
                    Category
                  </label>
                  <Select
                    options={categoryOptions}
                    isLoading={isLoadingCategories}
                    placeholder="Select Category"
                    onChange={(opt: any) =>
                      setFormData({ ...formData, category: opt?.value || "" })
                    }
                    styles={customSelectStyles}
                  />
                </div>

                <FormInput
                  label="Number of Pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) =>
                    setFormData({ ...formData, pages: e.target.value })
                  }
                  placeholder="e.g. 450"
                  icon={<FiLayers />}
                  required
                />

                <FormInput
                  label="Published Year"
                  name="publishedYear"
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedYear: e.target.value })
                  }
                  placeholder="e.g. 2023"
                  icon={<FiCalendar />}
                />
              </div>

              <div className="mt-10">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1 mb-2 block">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-6 bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-700 rounded-[2rem] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  placeholder="Provide a brief summary of the resource..."
                  required
                />
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-neutral-700 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-gray-600 dark:text-neutral-300 uppercase text-[10px] tracking-widest">
                  Optional Identifiers
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <FormInput
                  label="Publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={(e) =>
                    setFormData({ ...formData, publisher: e.target.value })
                  }
                  placeholder="e.g. Pearson"
                />
                <FormInput
                  label="ISBN"
                  name="isbn"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  placeholder="e.g. 978-3-16-148410-0"
                />
                <FormInput
                  label="Tags (Comma separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g. basic, intro, core"
                  icon={<FiTag />}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
              <div className="flex items-center gap-2 text-gray-400 text-xs text-center md:text-left">
                <FiAlertCircle />
                <span>
                  Your upload will be reviewed by community moderators.
                </span>
              </div>
              <div className="w-full md:w-64">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  // disabled={
                  //   !coverFile ||
                  //   !formData.title ||
                  //   !formData.author ||
                  //   !formData.description ||
                  //   !formData.category ||
                  //   !formData.pages
                  // }
                  className="w-full py-5 rounded-3xl shadow-xl shadow-emerald-500/20 text-lg"
                  icon={<FiCheck className="w-6 h-6" />}
                >
                  Confirm Donation
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "1.5rem",
    padding: "0.25rem 0.5rem",
    borderColor: state.isFocused ? "#10b981" : "#f3f4f6",
    backgroundColor: "transparent",
    boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
    "&:hover": { borderColor: "#10b981" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
        ? "#ecfdf5"
        : "transparent",
    color: state.isSelected ? "white" : "#374151",
  }),
};
