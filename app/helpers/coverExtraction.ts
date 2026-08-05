import Epub from "epubjs";

export async function extractPdfCover(
  fileBuffer: ArrayBuffer,
): Promise<File | null> {
  try {
    const { parsePdf, getPdfPage } =
      await import("@/app/components/Reader/processingFunctions");
    const { renderPdfPage } =
      await import("@/app/components/Reader/pdfRenderer");

    const { pdf } = await parsePdf(fileBuffer.slice(0));
    const page = await getPdfPage(pdf, 1);

    const canvas = document.createElement("canvas");
    await renderPdfPage(page, canvas, 1.2);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) =>
          resolve(
            blob ? new File([blob], "cover.jpg", { type: "image/jpeg" }) : null,
          ),
        "image/jpeg",
        0.85,
      );
    });
  } catch (err) {
    console.error("PDF cover extraction error:", err);
    return null;
  }
}

export async function extractEpubCover(
  fileBuffer: ArrayBuffer,
): Promise<File | null> {
  try {
    const bookDetails = Epub(fileBuffer.slice(0) as any);
    await bookDetails.ready;

    const coverUrl = await bookDetails.coverUrl();
    if (!coverUrl) return null;

    const response = await fetch(coverUrl);
    const blob = await response.blob();
    return new File([blob], "cover.jpg", { type: blob.type || "image/jpeg" });
  } catch (err) {
    console.error("EPUB cover extraction error:", err);
    return null;
  }
}
