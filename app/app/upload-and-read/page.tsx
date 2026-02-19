"use client";
import { useContext, ChangeEvent, useState, useCallback, useRef } from "react";
import { FileBufferContext } from "@/app/context/FileBufferContext";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import { PdfViewer } from "@/app/components/Reader/PdfViewer";
import { EpubViewer } from "@/app/components/Reader/EpubViewer";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "motion/react";

export default function UploadAndReadPage() {
  const { buffer, updateBuffer } = useContext(FileBufferContext);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const epubControlsRef = useRef<{ next: () => void; prev: () => void } | null>(
    null,
  );

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    const file = files ? files[0] : null;

    if (file?.type === "application/pdf") {
      setFileType("pdf");
    } else {
      setFileType("epub");
    }
    if (file) {
      setFileName(file.name);
      setCurrentPage(1);
      const buf = await file.arrayBuffer();
      updateBuffer(buf);
    }
  }

  const handleNextPage = useCallback(() => {
    if (fileType === "epub") {
      epubControlsRef.current?.next();
    } else {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [fileType, currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (fileType === "epub") {
      epubControlsRef.current?.prev();
    } else {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [fileType, currentPage, totalPages]);

  const uploadButton = (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all shadow-lg shadow-emerald-600/20"
      >
        <FiUploadCloud className="w-5 h-5" />
        <span className="hidden sm:inline">
          {fileName ? "Change File" : "Upload"}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".epub, .pdf"
        className="hidden"
        onChange={handleFileUpload}
      />
    </>
  );

  if (!fileType) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 p-12"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <FiUploadCloud className="w-12 h-12 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upload &amp; Read
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Upload a PDF or EPUB file to start reading.
            </p>
          </div>
          <label className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-all shadow-lg shadow-emerald-600/20">
            <FiUploadCloud className="w-5 h-5" />
            <span>Choose a file</span>
            <input
              type="file"
              accept=".epub, .pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports .pdf and .epub formats
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <ReaderLayout
        title={fileName || "Untitled"}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        extraHeaderActions={uploadButton}
      >
        {fileType === "epub" ? (
          <EpubViewer
            buffer={buffer}
            onReady={(controls) => {
              epubControlsRef.current = controls;
            }}
          />
        ) : (
          <PdfViewer
            buffer={buffer}
            page={currentPage}
            onPageInfo={({ totalPages: tp }) => {
              setTotalPages(tp);
            }}
          />
        )}
      </ReaderLayout>
    </div>
  );
}
