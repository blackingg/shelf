"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
} from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { FormInput } from "@/app/components/Form/FormInput";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { CreateBookRequest } from "@/app/types/book";
import { DEPARTMENTS } from "@/app/data/department";

import { useNotifications } from "@/app/context/NotificationContext";

export default function UploadPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<CreateBookRequest>>({
    title: "",
    author: "",
    description: "",
    category: "",
    pages: undefined,
    department: "",
    publisher: "",
    publishedYear: undefined,
    isbn: "",
    coverImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.pages || !file) {
      addNotification(
        "error",
        "Please fill in all required fields and upload a file."
      );
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    // ... appending data

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    addNotification(
      "success",
      "Book donated successfully! Thank you for your contribution."
    );
    setIsSubmitting(false);
    router.push("/app/library");
  };

  const categories = [
    { value: "education", label: "Education" },
    { value: "medical", label: "Medical" },
    { value: "business", label: "Business" },
    { value: "engineering", label: "Engineering" },
    { value: "science", label: "Science" },
    { value: "law", label: "Law" },
    { value: "general", label: "General" },
  ];

  const departmentOptions = DEPARTMENTS.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-emerald-100 p-3 rounded-2xl">
                  <FiHeart className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Donate to the Library
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Share your knowledge and help others learn.
                  </p>
                </div>
              </div>
            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <FiFile className="text-emerald-600" />
                    <span>Document File (Required)</span>
                  </h2>
                  <span className="text-sm text-gray-500">
                    PDF, EPUB, or DOCX
                  </span>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-200 text-center ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf,.epub,.docx"
                  />

                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file-selected"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center"
                      >
                        <div className="bg-emerald-100 p-4 rounded-full mb-4">
                          <FiCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors"
                          >
                            Change File
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                      >
                        <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-emerald-100 transition-colors">
                          <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                          Support for PDF, EPUB, and DOCX files up to 50MB
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <FiInfo className="text-emerald-600" />
                    <span>Book Details</span>
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <FormInput
                    label="Book Title (Required)"
                    name="title"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Introduction to Algorithms"
                    icon={<FiBook />}
                  />
                  <FormInput
                    label="Author(s) (Required)"
                    name="author"
                    value={formData.author || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="e.g. Thomas H. Cormen"
                    icon={<FiUser />}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <Select
                      options={departmentOptions}
                      placeholder="Select department..."
                      onChange={(option: any) =>
                        setFormData({
                          ...formData,
                          department: option?.value || "",
                        })
                      }
                      className="text-sm"
                      isClearable
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      options={categories}
                      placeholder="Select a category..."
                      onChange={(
                        option: { value: string; label: string } | null
                      ) =>
                        setFormData({
                          ...formData,
                          category: option?.value || "",
                        })
                      }
                      className="text-sm"
                      isClearable
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <FormInput
                    label="Publisher"
                    name="publisher"
                    value={formData.publisher || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                    placeholder="e.g. MIT Press"
                    icon={<FiBook />}
                  />
                  <FormInput
                    label="ISBN"
                    name="isbn"
                    value={formData.isbn || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    placeholder="e.g. 978-0262033848"
                    icon={<FiTag />}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <FormInput
                    label="Number of Pages (Required)"
                    name="pages"
                    type="number"
                    value={formData.pages?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pages: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="e.g. 1200"
                    icon={<FiLayers />}
                  />
                  <FormInput
                    label="Published Year"
                    name="publishedYear"
                    type="number"
                    value={formData.publishedYear?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publishedYear: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="e.g. 2022"
                    icon={<FiCalendar />}
                  />
                </div>

                <div className="mb-6">
                  <FormInput
                    label="Cover Image URL"
                    name="coverImage"
                    value={formData.coverImage || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                    placeholder="https://example.com/cover.jpg"
                    icon={<FiImage />}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-4 text-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all duration-200 resize-none"
                    placeholder="Tell us a bit about this book..."
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end"
              >
                <div className="w-full md:w-auto">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={!file || !formData.title || !formData.pages}
                    icon={<FiHeart className="w-5 h-5" />}
                  >
                    Donate Book
                  </Button>
                </div>
              </motion.div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
