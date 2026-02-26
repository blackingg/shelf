"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FiUploadCloud,
  FiAlertCircle,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiImage,
} from "react-icons/fi";
import Epub from "epubjs";
import { Button } from "@/app/components/Form/Button";
import Select from "react-select";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import {
  useUploadBookMutation,
  useUpdateBookMutation,
} from "@/app/store/api/booksApi";
import { useGetDepartmentsQuery } from "@/app/store/api/departmentsApi";
import { useGetCategoriesQuery } from "@/app/store/api/categoriesApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { motion, AnimatePresence } from "framer-motion";

interface PDFJSInfo {
  Title: string;
  Author: string;
}

async function extractPdfCover(fileBuffer: ArrayBuffer): Promise<File | null> {
  try {
    const { parsePdf, getPdfPage } =
      await import("@/app/components/Reader/processingFunctions");
    const { renderPdfPage } =
      await import("@/app/components/Reader/pdfRenderer");

    const { pdf } = await parsePdf(fileBuffer.slice(0));
    const page = await getPdfPage(pdf, 1);

    const canvas = document.createElement("canvas");
    await renderPdfPage(page, canvas, 1.2);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) =>
          resolve(
            blob ? new File([blob], "cover.jpg", { type: "image/jpeg" }) : null,
          ),
        "image/jpeg",
        0.85,
      );
    });
  } catch (err) {
    console.error("PDF cover extraction error:", err);
    return null;
  }
}

async function extractEpubCover(fileBuffer: ArrayBuffer): Promise<File | null> {
  try {
    const bookDetails = Epub(fileBuffer.slice(0) as any);
    await bookDetails.ready;

    const coverUrl = await bookDetails.coverUrl();
    if (!coverUrl) return null;

    const response = await fetch(coverUrl);
    const blob = await response.blob();
    return new File([blob], "cover.jpg", { type: blob.type || "image/jpeg" });
  } catch (err) {
    console.error("EPUB cover extraction error:", err);
    return null;
  }
}

export default function UploadPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadedBookId, setUploadedBookId] = useState<string | null>(null);
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const [uploadBook, { isLoading: isUploading }] = useUploadBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const user = useSelector(selectCurrentUser);

  const { data: departments = [], isLoading: isLoadingDepts } =
    useGetDepartmentsQuery(
      user?.school?.id ? { school_id: user.school.id } : undefined,
    );
  const { data: categoriesData = [], isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
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
  });

  const bookInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const customSelectStyles = (isDark: boolean) => ({
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "0px",
      padding: "0.25rem 0.5rem",
      borderColor: state.isFocused ? "#10b981" : isDark ? "#262626" : "#e5e7eb",
      backgroundColor: "transparent",
      boxShadow: "none",
      "&:hover": { borderColor: "#10b981" },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0px",
      margin: "0px",
      overflow: "hidden",
      boxShadow: "none",
      border: isDark ? "1px solid #262626" : "1px solid #e5e7eb",
      backgroundColor: isDark ? "#121212" : "#ffffff",
      zIndex: 50,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#10b981"
        : state.isFocused
          ? isDark
            ? "#1a1a1a"
            : "#f9fafb"
          : "transparent",
      color: state.isSelected ? "white" : isDark ? "#a3a3a3" : "#4b5563",
      fontSize: "0.80rem",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      cursor: "pointer",
      padding: "10px 15px",
      "&:active": { backgroundColor: "#10b981" },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#111827",
      fontSize: "0.875rem",
    }),
    input: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#111827",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDark ? "#525252" : "#9ca3af",
      fontSize: "0.875rem",
    }),
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBook(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBook(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetBookFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetBookFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      addNotification("error", "Book file must be less than 50MB");
      return;
    }
    setBookFile(file);
    setIsExtractingMetadata(true);

    const fileBuffer = await file.arrayBuffer();

    if (file.type.includes("epub")) {
      try {
        const bookDetails = Epub(fileBuffer.slice(0) as any);
        const metadata = await bookDetails.loaded.metadata;
        if (metadata) {
          setFormData((prev) => ({
            ...prev,
            title: metadata.title || prev.title,
            author: metadata.creator || prev.author,
            description: metadata.description || prev.description,
            publishedYear: metadata.pubdate?.slice(0, 4) || prev.publishedYear,
            publisher: metadata.publisher || prev.publisher,
          }));
        }
      } catch (err) {
        console.error("EPUB metadata extraction error:", err);
      }

      const cover = await extractEpubCover(fileBuffer);
      if (cover) {
        setCoverFile(cover);
      }
    } else if (file.type.includes("pdf")) {
      try {
        const { parsePdf } =
          await import("@/app/components/Reader/processingFunctions");
        const { pdf, numPages } = await parsePdf(fileBuffer.slice(0));
        setFormData((prev) => ({ ...prev, pages: String(numPages) }));
        const metadata = await pdf.getMetadata().catch(() => null);
        const info = metadata?.info as PDFJSInfo;
        if (info) {
          setFormData((prev) => ({
            ...prev,
            title: info["Title"] || prev.title,
            author: info["Author"] || prev.author,
            publisher:
              metadata?.metadata?.get("dc:publisher") || prev.publisher,
            description:
              metadata?.metadata?.get("dc:description") || prev.description,
            publishedYear:
              String(metadata?.metadata?.get("dc:date") || "").slice(0, 4) ||
              prev.publishedYear,
          }));
        }
      } catch (err) {
        console.error("PDF metadata extraction error:", err);
      }

      const cover = await extractPdfCover(fileBuffer);
      if (cover) {
        setCoverFile(cover);
      }
    }

    setIsExtractingMetadata(false);
  };

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetBookFile(e.target.files[0]);
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

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookFile) {
      addNotification("error", "Please provide a document file.");
      return;
    }
    if (!coverFile) {
      addNotification(
        "error",
        "Could not extract a cover from the file. Please upload one manually.",
      );
      return;
    }

    try {
      const formValues = new FormData();
      formValues.append("title", formData.title);
      formValues.append("author", formData.author);
      formValues.append("description", formData.description);
      formValues.append("category", formData.category);
      formValues.append("pages", formData.pages);
      formValues.append("book_file", bookFile);
      formValues.append("cover_image", coverFile);

      const result = await uploadBook(formValues).unwrap();
      setUploadedBookId(result.id);
      setStep(2);
      addNotification(
        "success",
        "Files uploaded successfully! Now refine the details.",
      );
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to initiate upload."),
      );
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedBookId) return;

    try {
      const payload = {
        department: formData.department || "",
        publisher: formData.publisher || "",
        publishedYear: formData.publishedYear
          ? parseInt(formData.publishedYear)
          : 2000,
        isbn: formData.isbn || "",
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        pages: parseInt(formData.pages) || 0,
      };

      await updateBook({ id: uploadedBookId, data: payload }).unwrap();
      addNotification("success", "Book details updated and donation complete!");
      router.push("/app/library");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update book details."),
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
    <label className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block">
      {children}
    </label>
  );

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800 overflow-y-auto">
      <main className="p-6 md:p-12 max-w-4xl mx-auto w-full">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-emerald-500"></div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
              {step === 1 ? "Upload Resource" : "Refine Metadata"}
            </h1>
          </div>
          <p className="text-gray-500 dark:text-neutral-500 text-sm max-w-lg leading-relaxed">
            {step === 1
              ? "Upload your document — we'll automatically extract the title, author, and cover image from the file."
              : "Review the extracted information and add optional identifiers like ISBN or Tags to make your resource easier to find."}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-12">
          {[
            { n: "01", label: "Files & Essentials" },
            { n: "02", label: "Details & Polish" },
          ].map(({ n, label }, i) => (
            <React.Fragment key={n}>
              {i > 0 && (
                <div className="h-px w-8 bg-gray-200 dark:bg-neutral-800" />
              )}
              <div
                className={`flex items-center gap-2 px-4 py-2 border ${
                  step === i + 1
                    ? "border-emerald-500 text-emerald-600"
                    : "border-gray-200 dark:border-neutral-800 text-gray-400"
                } transition-all duration-300`}
              >
                <span className="text-xs font-bold uppercase tracking-widest">
                  {n}
                </span>
                <span className="text-xs font-medium border-l border-current pl-2">
                  {label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleStep1Submit}
              className="space-y-12"
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label>Document File (.pdf, .epub)</Label>
                    <input
                      ref={bookInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleBookFileChange}
                      accept=".pdf,.epub"
                    />
                    <div
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => bookInputRef.current?.click()}
                      className={`h-48 border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                        dragActiveBook
                          ? "border-emerald-500 bg-emerald-50/20"
                          : "border-gray-200 dark:border-neutral-800 hover:border-emerald-500"
                      }`}
                    >
                      {isExtractingMetadata ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
                            Extracting metadata…
                          </p>
                        </div>
                      ) : bookFile ? (
                        <div className="flex items-center gap-4 px-6 text-center">
                          <FiCheck className="text-emerald-500 text-xl" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                              {bookFile.name}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase">
                              {(bookFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FiUploadCloud className="text-gray-300 dark:text-neutral-700 text-2xl mb-2" />
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
                            Click or Drag File
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Cover Image</Label>
                      {coverFile && (
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="text-[10px] text-emerald-500 hover:underline uppercase tracking-wider font-semibold"
                        >
                          Replace
                        </button>
                      )}
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleCoverFileChange}
                      accept="image/*"
                    />
                    <div
                      onClick={() =>
                        !coverFile && coverInputRef.current?.click()
                      }
                      className={`group relative h-48 border border-gray-200 dark:border-neutral-800 transition-all overflow-hidden flex items-center justify-center ${
                        !coverFile
                          ? "cursor-pointer hover:border-emerald-500"
                          : ""
                      }`}
                    >
                      {coverPreviewUrl ? (
                        <img
                          src={coverPreviewUrl}
                          className="w-full h-full object-cover"
                          alt="Cover preview"
                        />
                      ) : isExtractingMetadata ? (
                        <div className="flex flex-col items-center gap-2 text-gray-300 dark:text-neutral-600">
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-neutral-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-[11px] font-medium uppercase tracking-tighter">
                            Extracting cover…
                          </p>
                        </div>
                      ) : (
                        <div className="text-center flex flex-col items-center gap-1 text-gray-300 dark:text-neutral-700">
                          <FiImage className="text-2xl mb-1" />
                          <p className="text-[11px] font-medium uppercase tracking-tighter text-gray-400">
                            {bookFile
                              ? "No cover found — click to upload"
                              : "Auto-extracted from file"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Resource Title"
                      required
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                    />
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
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select
                        options={categoryOptions}
                        isLoading={isLoadingCategories}
                        placeholder="Select..."
                        onChange={(opt: any) =>
                          setFormData({
                            ...formData,
                            category: opt?.value || "",
                          })
                        }
                        styles={customSelectStyles(isDark)}
                      />
                    </div>
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
                        className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Short Description</Label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief summary..."
                      required
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  {bookFile && !isExtractingMetadata && (
                    <p className="text-[10px] text-gray-400 dark:text-neutral-600 flex items-center gap-1.5 italic">
                      <FiCheck className="text-emerald-500 shrink-0" />
                      Fields prefilled from file — edit freely.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-neutral-800">
                <Button
                  type="submit"
                  isLoading={isUploading || isExtractingMetadata}
                  className="px-8 py-3 rounded-none text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Continue...</span>
                  <FiArrowRight className="text-sm" />
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleStep2Submit}
              className="space-y-12"
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Select
                      options={departmentOptions}
                      isLoading={isLoadingDepts}
                      placeholder="Academic Department"
                      onChange={(opt: any) =>
                        setFormData({
                          ...formData,
                          department: opt?.label || "",
                        })
                      }
                      styles={customSelectStyles(isDark)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Publisher</Label>
                    <input
                      value={formData.publisher}
                      onChange={(e) =>
                        setFormData({ ...formData, publisher: e.target.value })
                      }
                      placeholder="e.g. Pearson, O'Reilly"
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
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
                        className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
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
                        className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
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
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="p-6 border border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-white/5 space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                    File Preview
                  </h3>
                  <div className="flex gap-4">
                    <div className="w-20 h-28 bg-gray-200 dark:bg-neutral-800 overflow-hidden border border-gray-100 dark:border-white/10 shrink-0">
                      {coverPreviewUrl && (
                        <img
                          src={coverPreviewUrl}
                          className="w-full h-full object-cover"
                          alt="Cover"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {formData.title || "Untitled"}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-neutral-500 mb-2">
                        {formData.author || "Unknown Author"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-1.5 py-0.5 border border-emerald-500/20 text-emerald-600 font-bold uppercase">
                          {formData.category || "General"}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium uppercase">
                          {formData.pages || 0} Pages
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-2 text-[10px] text-gray-500 italic">
                    <FiAlertCircle className="text-xs shrink-0" />
                    <span>You can still edit core fields here.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <FiArrowLeft className="text-sm" /> Back to Upload
                </button>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-medium uppercase text-gray-400 tracking-tighter mr-4">
                    <FiAlertCircle /> Final Review
                  </div>
                  <Button
                    type="submit"
                    isLoading={isUpdating}
                    className="px-12 py-3 rounded-none text-[11px] font-bold uppercase tracking-widest"
                  >
                    Confirm Donation
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
