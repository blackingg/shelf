"use client";
import { parsePdf, getPdfPage, usePdfViewer } from "./processingFunctions";
import { renderPdfPage } from "./pdfRenderer";
import * as pdfjs from "pdfjs-dist";
import { useRef, useState, useEffect } from "react";

interface PdfViewerProps {
  buffer: ArrayBuffer;
  onPageInfo?: (info: { currentPage: number; totalPages: number }) => void;
  page?: number;
}

export function PdfViewer({
  buffer,
  onPageInfo,
  page: externalPage,
}: PdfViewerProps) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    parsePdf(buffer).then((parsed) => {
      setDoc(parsed);
      onPageInfo?.({ currentPage: 1, totalPages: parsed.numPages });
    });
  }, [buffer]);

  const viewer = usePdfViewer(doc?.numPages ?? 1);

  useEffect(() => {
    if (externalPage !== undefined && externalPage !== viewer.page) {
      viewer.goTo(externalPage);
    }
  }, [externalPage]);

  useEffect(() => {
    if (!doc || !canvasRef.current) return;

    const currentPage = externalPage ?? viewer.page;
    getPdfPage(doc.pdf, currentPage).then((page) =>
      renderPdfPage(page, canvasRef.current!),
    );
  }, [doc, viewer.page, externalPage]);

  if (!doc) return <p className="text-center py-12 opacity-60">Loading PDF…</p>;

  return (
    <div className="w-full grid justify-items-center">
      <canvas
        ref={canvasRef}
        className="max-w-full"
      />
    </div>
  );
}
