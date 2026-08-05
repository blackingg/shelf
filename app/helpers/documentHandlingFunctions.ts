import { parsePdf } from "@/app/components/Reader";
import Epub from "epubjs";
import { extractEpubCover, extractPdfCover } from "./coverExtraction";
import { type PDFJSInfo } from "@/app/types/book";
import { generateLocations } from "@/app/components/Reader/EpubViewer";
import { fileTypeFromBuffer } from "file-type";
import processDescription from "./processDescription";

async function PDFPromise(buffer: ArrayBuffer) {
  const { pdf, numPages } = await parsePdf(buffer.slice(0));
  const metadata = await pdf.getMetadata().catch(() => null);
  const info = metadata?.info as PDFJSInfo;
  const rawDescription = metadata?.metadata?.get("dc:description");
  const subject = info?.["Subject"];
  const keywords = info?.["Keywords"];

  const descriptionParts = [];
  if (rawDescription) {
    descriptionParts.push(processDescription(rawDescription));
  }
  if (subject && subject !== rawDescription) {
    descriptionParts.push(`Subject: ${processDescription(subject)}`);
  }
  if (keywords && keywords !== subject) {
    descriptionParts.push(`Keywords: ${processDescription(keywords)}`);
  }

  const combinedDescription = descriptionParts.join("\n\n");

  return {
    title: info?.["Title"] || "",
    author: info?.["Author"] || "",
    publisher: metadata?.metadata?.get("dc:publisher") || "",
    description: combinedDescription,
    publishedYear: String(metadata?.metadata?.get("dc:date") || "").slice(
      0,
      4,
    ),
    pages: numPages || 0,
    category: "Fiction",
  };
}

export async function metadataParse(buffer: ArrayBuffer, ext?: string) {
  const derivedExt = ext ?? (await fileTypeFromBuffer(buffer))?.ext;
  if (derivedExt === "epub") {
    const bookDetails = Epub(buffer.slice(0));
    await generateLocations(bookDetails);
    const metadata = await bookDetails.loaded.metadata;
    const { title, creator, description, publisher, pubdate } = metadata || {};
    const subject = (metadata as any)?.subject;
    
    const descriptionParts = [];
    if (description) {
      descriptionParts.push(processDescription(description).slice(0, 1800));
    }
    if (subject) {
      const subjectStr = Array.isArray(subject) ? subject.join(", ") : subject;
      if (subjectStr) descriptionParts.push(`Subjects: ${processDescription(subjectStr)}`);
    }

    const combinedDescription = descriptionParts.join("\n\n");

    return {
      title: title || "",
      author: creator || "",
      description: combinedDescription,
      publishedYear: pubdate ? pubdate.slice(0, 4) : "",
      publisher: publisher || "",
      pages: bookDetails.locations ? bookDetails.locations.length() : 0,
      category: "Fiction",
    };
  } else {
    const pdfParsedMetadata = await PDFPromise(buffer);
    return pdfParsedMetadata;
  }
}

export async function generatePhoto(buffer: ArrayBuffer, ext?: string) {
  const derivedExt = ext ?? (await fileTypeFromBuffer(buffer))?.ext;
  if (derivedExt === "epub") {
    const picture = await extractEpubCover(buffer);
    return picture;
  } else {
    const picture = await extractPdfCover(buffer);
    return picture;
  }
}

export async function prepareForUpload(file: File) {
  const fileBuffer = await file.arrayBuffer();

  // Derive the file type once and share it, instead of each helper re-sniffing
  // the buffer independently.
  const ext = (await fileTypeFromBuffer(fileBuffer))?.ext;

  const [photo, metaObj] = await Promise.all([
    generatePhoto(fileBuffer, ext),
    metadataParse(fileBuffer, ext),
  ]);

  return {
    ...metaObj,
    coverImage: photo,
  };
}
