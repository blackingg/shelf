"use client";
import { parsePdf, getPdfPage, usePdfViewer } from "./processingFunctions";
import { renderPdfPage } from "./pdfRenderer";
import * as pdfjs from "pdfjs-dist";
import { useRef, useState, useEffect } from "react";

export function PdfViewer({ buffer }: { buffer: ArrayBuffer }) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const runtime = "nodejs";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    parsePdf(buffer).then(setDoc);
  }, [buffer]);

  const viewer = usePdfViewer(doc?.numPages ?? 1);

  useEffect(() => {
    if (!doc || !canvasRef.current) return;

    getPdfPage(doc.pdf, viewer.page).then((page) =>
      renderPdfPage(page, canvasRef.current!),
    );
  }, [doc, viewer.page]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        viewer.next();
      } else if (e.key === "ArrowLeft") {
        viewer.prev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewer.page]);

  if (!doc) return <p>Loading PDF…</p>;

  return (
    <div className="w-full grid justify-items-center relative">
      <div className="w-full bg-[#1a1a1a] absolute grid-cols-12 z-10 opacity-0 top-0 p-2 grid hover:opacity-100 transition-opacity">
        <button onClick={viewer.prev} className="grid">
          Prev
        </button>
        <div className="grid col-span-10 text-center w-full">
          <p>
            Page:{" "}
            <span className="p-1 border-2 rounded-xl border-gray-400">
              {viewer.page} / {doc.numPages}
            </span>
          </p>
        </div>
        <button onClick={viewer.next} className="grid">
          Next
        </button>
      </div>
      <canvas ref={canvasRef} className="md:p-2 md:my-4" />
    </div>
  );
}
