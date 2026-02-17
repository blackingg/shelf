'use client'
import { parsePdf, getPdfPage, usePdfViewer } from "./processingFunctions";
import { renderPdfPage } from "./pdfRenderer";
import * as pdfjs from "pdfjs-dist";
import {useRef, useState, useEffect} from 'react'

export function PdfViewer({ buffer }: { buffer: ArrayBuffer }) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const runtime = 'nodejs'
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

  if (!doc) return <p>Loading PDF…</p>;

  return (
    <>
      <canvas ref={canvasRef} className="md:p-2 md:my-4"/>
      <div>
        <button onClick={viewer.prev}>Prev</button>
        <span>
          {viewer.page} / {doc.numPages}
        </span>
        <button onClick={viewer.next}>Next</button>
      </div>
    </>
  );
}