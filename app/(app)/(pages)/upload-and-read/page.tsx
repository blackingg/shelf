"use client";
import { useContext, ChangeEvent, useCallback, useRef } from "react";
import { FileBufferContext } from "@/app/context/FileBufferContext";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import { PdfViewer } from "@/app/components/Reader/PdfViewer";
import type { PdfViewerHandle } from "@/app/components/Reader/PdfViewer";
import { EpubViewer } from "@/app/components/Reader/EpubViewer";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "motion/react";
import { useOpenPanel } from "@openpanel/nextjs";
import {
  ReaderProvider,
  useReader,
} from "@/app/components/Reader/ReaderContext";

function UploadAndReadInner({
  UploadButton,
}: {
  UploadButton: React.ReactNode;
}) {
  const { buffer, fileType, fileName } = useContext(FileBufferContext);

  const epubControlsRef = useRef<{
    next: () => void;
    prev: () => void;
    goTo?: (p: number) => void;
  } | null>(null);

  const pdfViewerRef = useRef<PdfViewerHandle>(null);

  const { currentPage, totalPages, updateProgress } = useReader();

  const handleNextPage = useCallback(() => {
    if (fileType === "epub" && currentPage < totalPages) {
      epubControlsRef.current?.next();
    } else {
      if (currentPage < totalPages) {
        pdfViewerRef.current?.scrollToPage(currentPage + 1);
      }
    }
  }, [fileType, currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (fileType === "epub" && currentPage > 1) {
      epubControlsRef.current?.prev();
    } else {
      if (currentPage > 1) {
        pdfViewerRef.current?.scrollToPage(currentPage - 1);
      }
    }
  }, [fileType, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (fileType === "epub") {
        epubControlsRef.current?.goTo?.(page);
      } else {
        pdfViewerRef.current?.scrollToPage(page);
      }
    },
    [fileType],
  );

  return (
    <div className="absolute top-0 left-0 inset-0 z-100 bg-white dark:bg-black">
      <ReaderLayout
        title={fileName || "Untitled"}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageChange={handlePageChange}
        extraHeaderActions={UploadButton}
      >
        {fileType === "epub" ? (
          <EpubViewer
            buffer={buffer}
            onReady={(controls) => {
              epubControlsRef.current = controls;
            }}
            onPageDetails={(info) => {
              updateProgress(Number(info.currentPage), Number(info.totalPages));
            }}
          />
        ) : (
          <PdfViewer
            ref={pdfViewerRef}
            buffer={buffer}
            onPageInfo={({ currentPage: cp, totalPages: tp }) => {
              updateProgress(cp, tp);
            }}
          />
        )}
      </ReaderLayout>
    </div>
  );
}

export default function UploadAndReadPage() {
  const { updateBuffer, fileType, setFileType, fileName, setFileName } =
    useContext(FileBufferContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openPanel = useOpenPanel();

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
      const buf = await file.arrayBuffer();
      updateBuffer(buf);
    }
  }

  const uploadButtonElement = (
    <>
      <button
        onClick={() => {
          fileInputRef.current?.click();
          openPanel.track("book_viewed_offline");
        }}
        className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:opacity-100"
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
      <div className="flex items-center justify-center h-full bg-white dark:bg-black font-onest">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-8 p-6 md:p-12"
        >
          <div className="w-20 h-20 mx-auto rounded-sm bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <FiUploadCloud className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-3 tracking-tight">
              Upload & Read
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              Upload a PDF or EPUB file to start reading directly in your
              browser.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-sm bg-primary text-primary-foreground font-medium cursor-pointer transition-colors hover:opacity-90 active:opacity-100">
              <FiUploadCloud className="w-5 h-5" />
              <span>Choose a file</span>
              <input
                type="file"
                accept=".epub, .pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
              Supports .PDF and .EPUB
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ReaderProvider initialFormat={fileType as "pdf" | "epub"}>
      <UploadAndReadInner UploadButton={uploadButtonElement} />
    </ReaderProvider>
  );
}
