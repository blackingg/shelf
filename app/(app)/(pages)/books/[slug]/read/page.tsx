"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { ReaderLayout } from "@/app/components/Reader/ReaderLayout";
import { PdfViewer } from "@/app/components/Reader/PdfViewer";
import type { PdfViewerHandle } from "@/app/components/Reader/PdfViewer";
import { EpubViewer } from "@/app/components/Reader/EpubViewer";
import { useGetBookBySlugQuery, useGetBookProgressQuery } from "@/app/services";
import { LoadingScreen } from "@/app/components/Loader/LoadingScreen";
import { fileTypeFromBuffer } from "file-type";
import Cookies from "js-cookie";
import {
  useReader,
  ReaderProvider,
} from "@/app/components/Reader/ReaderContext";

/**
 * Handles the one-time jump to the user's saved page on initial load.
 * Once the jump is done (or skipped), it clears the isInitialLoad flag
 * so ReaderProgressSyncer can start syncing.
 */
function ReaderInitializer({
  progressData,
  handlePageChange,
}: {
  progressData: any;
  handlePageChange: (page: number) => void;
}) {
  const { setIsInitialLoad } = useReader();
  const hasJumped = useRef(false);

  useEffect(() => {
    if (hasJumped.current) return;

    if (progressData !== undefined) {
      // Once progressData is resolved, we signal that the initial load phase is over.
      // The viewers themselves use the initialPage prop to mount at the correct position.
      const timer = setTimeout(() => {
        hasJumped.current = true;
        setIsInitialLoad(false);
      }, 500); // Small delay to allow viewers to finish their first paint
      return () => clearTimeout(timer);
    }
    // If progressData is still undefined (loading), we wait — don't mark done yet
  }, [progressData, setIsInitialLoad]);

  return null;
}

function ReaderPageInner({
  data,
  buffer,
  fileType,
  progressData,
  isLoadingProgress,
}: {
  data: any;
  buffer: ArrayBuffer;
  fileType: "epub" | "pdf";
  progressData: any;
  isLoadingProgress: boolean;
}) {
  const epubControlsRef = useRef<{
    next: () => void;
    prev: () => void;
    goTo?: (page: number) => void;
  } | null>(null);

  const pdfViewerRef = useRef<PdfViewerHandle>(null);

  // Pull page state from context — single source of truth
  const { currentPage, totalPages, updateProgress, setIsReady, initialPage } =
    useReader();

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
    <div className="absolute top-0 left-0 inset-0 z-100">
      <ReaderLayout
        title={data.title}
        subtitle={data.author}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageChange={handlePageChange}
      >
        {/* Wait for progressData to finish loading before mounting the initializer,
            so it sees the resolved value immediately rather than undefined→value churn */}
        {!isLoadingProgress && (
          <ReaderInitializer
            progressData={progressData}
            handlePageChange={handlePageChange}
          />
        )}
        {fileType === "epub" ? (
          <EpubViewer
            buffer={buffer}
            initialPage={initialPage}
            onReady={(controls) => {
              epubControlsRef.current = controls;
              // Signal context that the viewer is ready to start syncing
              setIsReady(true);
            }}
            onPageDetails={(info) => {
              if (info.currentPage && info.totalPages) {
                // Single call keeps context as the one source of truth
                updateProgress(info.currentPage, Number(info.totalPages));
              }
            }}
          />
        ) : (
          <PdfViewer
            ref={pdfViewerRef}
            buffer={buffer}
            initialPage={initialPage}
            onPageInfo={({ currentPage: cp, totalPages: tp }) => {
              updateProgress(cp, tp);
              // PDF viewer is considered ready once it starts reporting pages
              setIsReady(true);
            }}
          />
        )}
      </ReaderLayout>
    </div>
  );
}

export default function ReaderPage() {
  const params = useParams();
  const { slug } = params;

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");
  const [isFetchingFile, setIsFetchingFile] = useState(false);

  const isAuthenticated = !!Cookies.get("accessToken");
  const { data, isLoading } = useGetBookBySlugQuery(String(slug));
  const { data: progressData, isLoading: isLoadingProgress } =
    useGetBookProgressQuery(isAuthenticated && data?.id ? data.id : "");

  useEffect(() => {
    async function fetchFile() {
      if (data?.fileUrl) {
        setIsFetchingFile(true);
        try {
          const response = await fetch(data.fileUrl);
          const buf = await response.arrayBuffer();
          setBuffer(buf);
          const derivedFileType = await fileTypeFromBuffer(buf);
          setFileType(derivedFileType?.ext === "pdf" ? "pdf" : "epub");
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

  if (isLoading || isFetchingFile || isLoadingProgress || (data && !buffer)) {
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
    <ReaderProvider
      initialFormat={fileType as "pdf" | "epub"}
      bookId={data.id}
      initialPage={progressData?.currentPage}
    >
      <ReaderPageInner
        data={data}
        buffer={buffer}
        fileType={fileType as "epub" | "pdf"}
        progressData={progressData}
        isLoadingProgress={isLoadingProgress}
      />
    </ReaderProvider>
  );
}
