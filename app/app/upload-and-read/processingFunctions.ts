import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";

//Essential types
export interface PdfSource {
  buffer: ArrayBuffer;
}

export interface PdfDocument {
  pdf: PDFDocumentProxy;
  numPages: number;
  metadata?: any;
}

export interface PdfPage {
  page: PDFPageProxy;
  pageNumber: number;
  width: number;
  height: number;
}
//

//Loader



export async function loadPdf(buffer: ArrayBuffer) {
  const loadingTask = pdfjs.getDocument({ data: buffer });
  return loadingTask.promise;
}
//end loader



//parser
export async function parsePdf(buffer: ArrayBuffer): Promise<PdfDocument> {
  const pdf = await loadPdf(buffer);

  const metadata = await pdf.getMetadata().catch(() => null);

  return {
    pdf,
    numPages: pdf.numPages,
    metadata: metadata?.info,
  };
}
//end parser

//Get Page Util
export async function getPdfPage(
  pdf: PdfDocument["pdf"],
  pageNumber: number
): Promise<PdfPage> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });

  return {
    page,
    pageNumber,
    width: viewport.width,
    height: viewport.height,
  };
}
//


import { useState } from "react";

export function usePdfViewer(totalPages: number) {
  const [page, setPage] = useState(1);

  return {
    page,
    next: () => setPage(p => Math.min(p + 1, totalPages)),
    prev: () => setPage(p => Math.max(p - 1, 1)),
    goTo: (n: number) =>
      setPage(Math.min(Math.max(1, n), totalPages)),
  };
}





