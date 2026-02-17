import { PdfPage } from "./processingFunctions";

export async function renderPdfPage(
  pdfPage: PdfPage,
  canvas: HTMLCanvasElement,
  scale = 1.5
) {
  const viewport = pdfPage.page.getViewport({ scale });

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas context not found");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await pdfPage.page.render({
    canvas, 
    viewport,
  }).promise;
}
