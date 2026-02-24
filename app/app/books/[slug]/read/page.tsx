"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import { PdfViewer } from "@/app/components/Reader/PdfViewer";
import { EpubViewer } from "@/app/components/Reader/EpubViewer";
import { useGetBookBySlugQuery } from "@/app/store/api/booksApi";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { fileTypeFromBuffer } from "file-type";

export default function ReaderPage() {
  const params = useParams();
  const { slug } = params;

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingFile, setIsFetchingFile] = useState(false);

  const epubControlsRef = useRef<{
    next: () => void;
    prev: () => void;
    goTo?: (p: number) => void;
  } | null>(null);

  const { data, isLoading } = useGetBookBySlugQuery(String(slug));

  useEffect(() => {
    async function fetchFile() {
      if (data?.fileUrl) {
        setIsFetchingFile(true);
        try {
          const response = await fetch(data.fileUrl);
          const contentType = response.headers.get("content-type");
          const buf = await response.arrayBuffer();
          setBuffer(buf);
          const derivedFileType = await fileTypeFromBuffer(buf);
          console.log(derivedFileType?.ext);
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
      setCurrentPage((prev) => prev + 1);
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
      setCurrentPage((prev) => prev - 1);
    } else {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [fileType, currentPage, totalPages]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (fileType === "epub") {
        epubControlsRef.current?.goTo?.(page);
        setCurrentPage(page);
      } else {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [fileType],
  );

  if (isLoading || isFetchingFile) {
    return <LoadingScreen />;
  }

  if (!data || !buffer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Failed to load book</h2>
          <p className="text-gray-500">The book file could not be retrieved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 inset-0 z-100">
      <ReaderLayout
        title={data.title}
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
