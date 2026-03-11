import { useEffect, useRef, useState } from "react";
import { FiCheck, FiUploadCloud } from "react-icons/fi";
import {
  metadataParse,
  prepareForUpload,
} from "../app/books/upload/documentHandlingFunctions";
import { useUploadBookMutation } from "../store/api/booksApi";
import { useNotifications } from "../context/NotificationContext";

const processFileType = (fileType: string) => {
  if (fileType.includes("pdf")) return "PDF";
  else return "EPUB";
};

export default function MultipleUploadForm({
  files,
}: {
  files: FileList | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  let filesNew = files ? Array.from(files) : null;
  const [filesToBeUploaded, updateFilesToBeUploaded] = useState<File[] | null>(
    filesNew,
  );
  const [uploadBook] = useUploadBookMutation();
  const { addNotification } = useNotifications();

  const uploadIndividualItem = async (file: File) => {
    const shape_fake = await prepareForUpload(file);
    const shapeReal = { ...shape_fake, book_file: file };
    try {
      const formValues = new FormData();
      formValues.append("title", shapeReal.title);
      formValues.append("author", shapeReal.author);
      formValues.append("description", shapeReal.description || "");
      formValues.append("category", shapeReal.category);
      formValues.append("pages", String(shapeReal.pages));
      formValues.append("book_file", shapeReal.book_file);
      if (shapeReal.cover_image) {
        formValues.append("cover_image", shapeReal.cover_image);
      }
      await uploadBook(formValues).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  async function uploadAllItems() {
    if (filesToBeUploaded) {
      const results = await Promise.allSettled(
        filesToBeUploaded?.map((file) => uploadIndividualItem(file)),
      );

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Failed: ${filesToBeUploaded[index].name}`,
            result.reason,
          );
          addNotification(
            "error",
            `${filesToBeUploaded[index].name} failed to upload`,
          );
        } else {
          addNotification(
            "success",
            `${filesToBeUploaded[index].name} successfully uploaded`,
          );
        }
      });
    }
  }

  return (
    <div className="p-6 md:p-12 w-full mx-auto bg-white dark:bg-neutral-900">
      <div className="flex items-center gap-4 px-6 text-center">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]"></p>
          <p className="text-[10px] text-gray-400 uppercase"></p>
        </div>
      </div>
      <div>
        <label
          htmlFor="swag"
          className="md:p-2 border-2 border-dotted border-gray-400 block w-2/5"
        >
          <FiUploadCloud className="text-gray-300 dark:text-neutral-700 text-2xl mb-2" />
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
            Click or Drag File
          </p>

          <input
            id="swag"
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && filesToBeUploaded) {
                updateFilesToBeUploaded([
                  ...filesToBeUploaded,
                  e.target.files[0],
                ]);
              }
            }}
          />
        </label>
      </div>

      <p className="text-emerald-400 text-lg underline my-1">
        {filesToBeUploaded?.length} Files to be Uploaded:{" "}
      </p>

      <div className="grid grid-cols-5 py-1 gap-x-1">
        <div className="text-left grid col-span-3">Name</div>
        <div className="text-center">File Size</div>
        <div className="text-center">File Type</div>
      </div>
      <hr className="text-emerald-400" />
      <div>
        {filesToBeUploaded &&
          filesToBeUploaded.map((file) => (
            <div className="md:p-2 md:my-2 grid grid-cols-5 " key={file.name}>
              <div className="w-3/4 truncate h-8 grid col-span-3">
                {file.name}
              </div>
              <div className="text-center">
                {(file.size / 1048576).toFixed(2)} MB
              </div>
              <div className="text-center">{processFileType(file.type)}</div>
            </div>
          ))}
      </div>
      <button
        className="px-8 justify-self-center py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-center flex place-content-center gap-x-4 w-1/2 bg-emerald-400 text-white gap-y-2 whitespace-nowrap md:my-6"
        onClick={uploadAllItems}
      >
        Upload
      </button>
    </div>
  );
}
