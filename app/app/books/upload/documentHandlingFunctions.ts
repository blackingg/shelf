//compulsory Fileds : title, author, description, category, pages, cover_image, book_file
//btw, all of ts is FormData

import { parsePdf } from "@/app/components/Reader";
import Epub from "epubjs";
import { extractEpubCover, extractPdfCover, type PDFJSInfo } from "./page";
import { generateLocations } from "@/app/components/Reader/EpubViewer";
import { fileTypeFromBuffer } from "file-type";

async function PDFPromise(buffer: ArrayBuffer) {
  const { pdf, numPages } = await parsePdf(buffer.slice(0));
  const metadata = await pdf.getMetadata().catch(() => null);
  const info = metadata?.info as PDFJSInfo;
  if (info["Title"] !== undefined && info["Author"] !== undefined) {
    return {
      title: info["Title"],
      author: info["Author"],
      publisher: metadata?.metadata?.get("dc:publisher"),
      description: metadata?.metadata?.get("dc:description"),
      publishedYear: String(metadata?.metadata?.get("dc:date") || "").slice(
        0,
        4,
      ),
      pages: numPages,
      category: "Fiction",
    };
  } else {
    return {
      title: "",
      author: "",
      publisher: "",
      description: "",
      publishedYear: "",
      pages: 0,
      category: "",
    };
  }
}

export async function metadataParse(buffer: ArrayBuffer) {
  const derivedType = await fileTypeFromBuffer(buffer);
  if (derivedType?.ext === "epub") {
    const bookDetails = Epub(buffer.slice(0));
    await generateLocations(bookDetails);
    const metadata = await bookDetails.loaded.metadata;
    const { title, creator, description, publisher, pubdate } = metadata;
    if (metadata) {
      return {
        title: title,
        author: creator,
        description: description.slice(0, 1800) || "",
        publishedYear: pubdate.slice(0, 4) || "",
        publisher: publisher,
        pages: bookDetails.locations.length(),
        category: "Fiction",
      };
    } else {
      return {
        title: "",
        author: "",
        publisher: "",
        description: "",
        publishedYear: "",
        pages: 0,
        category: "",
      };
    }
  } else {
    const pdfParsedMetadata = await PDFPromise(buffer);
    return pdfParsedMetadata;
  }
}

export async function generatePhoto(buffer: ArrayBuffer) {
  const derivedType = await fileTypeFromBuffer(buffer);
  if (derivedType?.ext === "epub") {
    const picture = await extractEpubCover(buffer);
    return picture;
  } else {
    const picture = await extractPdfCover(buffer);
    return picture;
  }
}

export async function prepareForUpload(file: File) {
  const fileBuffer = await file.arrayBuffer();

  const [photo, metaObj] = await Promise.all([
    generatePhoto(fileBuffer),
    metadataParse(fileBuffer),
  ]);

  return {
    ...metaObj,
    coverImage: photo,
  };
}
