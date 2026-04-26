"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FiUploadCloud,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiImage,
  FiLayout,
  FiBookOpen,
} from "react-icons/fi";
import { FolderSelectDropdown } from "@/app/components/Library/FolderSelectDropdown";
import { Button } from "@/app/components/Form/Button";
import { FormSelect } from "@/app/components/Form/FormSelect";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store";
import {
  useBookActions,
  useDepartments,
  useDiscoverCategories,
} from "@/app/services";
import { useFolderActions, useMeFolders } from "@/app/services/folders/hooks";
import { useNotifications } from "@/app/context/NotificationContext";
import {
  getErrorMessage,
  extractEpubCover,
  extractPdfCover,
} from "@/app/helpers";
import { motion, AnimatePresence } from "framer-motion";
import Epub from "epubjs";
import { PDFJSInfo } from "@/app/types/book";

interface SingleUploadFormProps {
  onSwitchToBulk: (files?: FileList) => void;
}

export default function SingleUploadForm({
  onSwitchToBulk,
}: SingleUploadFormProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [uploadedBookId, setUploadedBookId] = useState<string | null>(null);
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string>("");

  const { folders, isLoading: isLoadingFolders } = useMeFolders({ limit: 100 });
  const { actions: folderActions } = useFolderActions();
  const { actions: bookActions, isCreating: isUploading } = useBookActions();
  const user = useSelector(selectCurrentUser);

  const { departments, isLoading: isLoadingDepts } = useDepartments(
    user?.school?.id ? { school_id: user.school.id } : undefined,
  );
  const { categories: categoriesData, isLoading: isLoadingCategories } =
    useDiscoverCategories();

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBook(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBook(false);
    if (e.dataTransfer.files) {
      if (e.dataTransfer.files.length === 1) {
        validateAndSetBookFile(e.dataTransfer.files[0]);
      } else {
        onSwitchToBulk(e.dataTransfer.files);
      }
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
    if (e.target.files) {
      if (e.target.files.length === 1) {
        validateAndSetBookFile(e.target.files[0]);
      } else {
        onSwitchToBulk(e.target.files);
      }
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
      const selectedId = formData.department
        ? departments.find(
            (d: any) =>
              d.id === formData.department || d.slug === formData.department,
          )?.id
        : undefined;

      const result = await bookActions.createBook({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        pages: Number(formData.pages),
        book_file: bookFile,
        coverImage: coverFile,
        department: selectedId,
      });

      if (targetFolderId && result?.id) {
        await folderActions.addBookToFolder(targetFolderId, result.id);
      }
      setUploadedBookId(result.id);
      setStep(2);
      addNotification(
        "success",
        "Files and essentials uploaded! Now refine the details.",
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
      const selectedDepartmentId = formData.department
        ? departments.find(
            (dept: any) =>
              dept.id === formData.department ||
              dept.slug === formData.department,
          )?.id
        : undefined;

      const payload = {
        department: selectedDepartmentId,
        publisher: formData.publisher || undefined,
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

      const result = await bookActions.updateBook(uploadedBookId, payload);
      addNotification("success", "Book details updated and donation complete!");

      const targetSlug = folders.find((f) => f.id === targetFolderId)?.slug;
      if (targetSlug) {
        router.push(`/app/folders/${targetSlug}`);
      } else {
        router.push(`/app/books/${result.slug}`);
      }
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update book details."),
      );
    }
  };

  const departmentOptions = departments.map((dept: any) => ({
    value: dept.id,
    label: dept.name,
  }));
  const categoryOptions = categoriesData.map((cat: any) => ({
    value: cat.name,
    label: cat.name,
  }));

  const isStep2FormComplete =
    !!uploadedBookId &&
    !!formData.title.trim() &&
    !!formData.author.trim() &&
    !!formData.description.trim() &&
    !!formData.category.trim() &&
    !!formData.pages &&
    Number(formData.pages) > 0;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block">
      {children}
    </label>
  );

  return (
    <>
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-emerald-500"></div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
              Upload Resources
            </h1>
          </div>
          <p className="text-gray-500 dark:text-neutral-500 text-sm max-w-lg leading-relaxed">
            {step === 1
              ? "Upload your document(s) — we'll automatically extract the title, author, and cover image from the file."
              : "Review the extracted information and add optional identifiers like ISBN or Tags to make your resource easier to find."}
          </p>
        </div>
        <button
          onClick={() => onSwitchToBulk()}
          className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 border border-emerald-500/20 px-4 py-2 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
        >
          Switch to Bulk Upload
        </button>
      </div>

      <div className="flex items-center gap-4 mb-12">
        {[
          { n: "01", label: "Files & Essentials" },
          { n: "02", label: "Details" },
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
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
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
                          Processing file…
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
                    onClick={() => !coverFile && coverInputRef.current?.click()}
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
                            : "Upload cover image"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-neutral-800">
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
                <FormSelect<any, false>
                  label="Category"
                  icon={<FiLayout />}
                  options={categoryOptions}
                  isLoading={isLoadingCategories}
                  placeholder="Select Category"
                  onChange={(opt: any) =>
                    setFormData({
                      ...formData,
                      category: opt?.value || "",
                    })
                  }
                  value={
                    categoryOptions.find(
                      (opt: any) => opt.value === formData.category,
                    ) || null
                  }
                />
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
                      (opt: any) => opt.value === formData.department,
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
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all rounded-sm"
                  />
                </div>
                <FolderSelectDropdown
                  selectedFolderId={targetFolderId}
                  onSelect={(id) => setTargetFolderId(id)}
                />

                <div className="space-y-1.5 pt-4">
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
                    placeholder="Provide a brief summary of the book (min. 10 characters)..."
                    required
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-neutral-800">
              <Button
                type="submit"
                isLoading={isUploading}
                disabled={
                  isExtractingMetadata ||
                  !bookFile ||
                  !coverFile ||
                  !formData.title ||
                  !formData.author ||
                  !formData.category ||
                  !formData.pages ||
                  formData.description.length < 10
                }
                icon={<FiArrowRight className="text-sm" />}
                className="px-8 py-3 rounded-none text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
              >
                Confirm Essentials & Upload
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Publisher</Label>
                    <input
                      value={formData.publisher}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publisher: e.target.value,
                        })
                      }
                      placeholder="e.g. Pearson"
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
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
                      placeholder="e.g. 2024"
                      className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>ISBN (Optional)</Label>
                  <input
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    placeholder="e.g. 978-3-16-148410-0"
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Tags</Label>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Separate with commas
                    </span>
                  </div>
                  <input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="e.g. biology, exam-prep, textbook"
                    className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <Label>Summary Review</Label>
                <div className="flex-1 p-8 bg-gray-50/50 dark:bg-neutral-800/30 border border-gray-100 dark:border-neutral-800 relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <div className="flex gap-6">
                      <div className="w-24 aspect-[2/3] bg-gray-200 dark:bg-neutral-800 shrink-0 overflow-hidden shadow-2xl">
                        {coverPreviewUrl && (
                          <img
                            src={coverPreviewUrl}
                            className="w-full h-full object-cover"
                            alt="Final cover"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                          {formData.title || "Untitled Resource"}
                        </h3>
                        <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider">
                          {formData.author || "Unknown Author"}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                            {formData.category || "No Category"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400 uppercase font-bold tracking-widest">
                          Pages
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formData.pages || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400 uppercase font-bold tracking-widest">
                          Publisher
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formData.publisher || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <FiArrowLeft />
                Back to essentials
              </button>
              <Button
                type="submit"
                isLoading={isUploading}
                disabled={!isStep2FormComplete}
                icon={<FiCheck className="text-sm" />}
                className="px-12 py-3 rounded-none text-[11px] font-bold uppercase tracking-widest"
              >
                Confirm Donation
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}
