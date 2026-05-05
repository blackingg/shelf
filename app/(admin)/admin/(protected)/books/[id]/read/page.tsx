"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import { PdfViewer } from "@/app/components/Reader/PdfViewer";
import type { PdfViewerHandle } from "@/app/components/Reader/PdfViewer";
import { EpubViewer } from "@/app/components/Reader/EpubViewer";
import { useGetBookByIdQuery } from "@/app/services";
import { LoadingScreen } from "@/app/components/Loader/LoadingScreen";
import { fileTypeFromBuffer } from "file-type";
import { FiArrowLeft } from "react-icons/fi";
import { getErrorMessage } from "@/app/helpers/error";

export default function AdminReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingFile, setIsFetchingFile] = useState(false);

  const epubControlsRef = useRef<{
    next: () => void;
    prev: () => void;
    goTo?: (page: number) => void;
  } | null>(null);

  const pdfViewerRef = useRef<PdfViewerHandle>(null);

  const { data, isLoading, error } = useGetBookByIdQuery(String(id));

  useEffect(() => {
    async function fetchFile() {
      if (data?.fileUrl) {
        setIsFetchingFile(true);
        try {
          const response = await fetch(data.fileUrl);
          const buf = await response.arrayBuffer();
          setBuffer(buf);
          const derivedFileType = await fileTypeFromBuffer(buf);
          if (derivedFileType?.ext === "pdf") {
            setFileType("pdf");
          } else {
            setFileType("epub");
          }
        } catch (error) {
          console.error("Failed to fetch book file:", error);
        } finally {
          setIsFetchingFile(false);
        }
      }
    }

    if (data) {
      fetchFile();
    }
  }, [data]);

  const handleNextPage = useCallback(() => {
    if (fileType === "epub") {
      epubControlsRef.current?.next();
    } else {
      if (currentPage < totalPages) {
        pdfViewerRef.current?.scrollToPage(currentPage + 1);
      }
    }
  }, [fileType, currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (fileType === "epub") {
      epubControlsRef.current?.prev();
    } else {
      if (currentPage > 1) {
        pdfViewerRef.current?.scrollToPage(currentPage - 1);
      }
    }
  }, [fileType, currentPage, totalPages]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (fileType === "epub") {
        epubControlsRef.current?.goTo?.(page);
        setCurrentPage(page);
      } else {
        pdfViewerRef.current?.scrollToPage(page);
      }
    },
    [fileType],
  );

  if (isLoading || isFetchingFile) {
    return <LoadingScreen />;
  }

  if (!data || !buffer) {
    const errorMessage = getErrorMessage(error, "The requested document could not be retrieved.");
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-4 max-w-md px-6">
          <h2 className="text-xl font-medium text-white">Resource Load Failure</h2>
          <p className="text-sm text-neutral-400">
            {errorMessage}
          </p>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-emerald-400 font-medium pt-4"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <ReaderLayout
        title={`[ADMIN REVIEW] ${data.title}`}
        subtitle={data.author}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageChange={handlePageChange}
        format={fileType as "pdf" | "epub"}
      >
        {fileType === "epub" ? (
          <EpubViewer
            buffer={buffer}
            onReady={(controls) => {
              epubControlsRef.current = controls;
            }}
            onPageDetails={(info) => setTotalPages(Number(info.totalPages))}
          />
        ) : (
          <PdfViewer
            ref={pdfViewerRef}
            buffer={buffer}
            onPageInfo={({ currentPage: cp, totalPages: tp }) => {
              setCurrentPage(cp);
              setTotalPages(tp);
            }}
          />
        )}
      </ReaderLayout>
      
      {/* Admin context banner */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg z-[110]">
        System Admin Mode
      </div>
    </div>
  );
}
