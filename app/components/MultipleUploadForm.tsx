import { useEffect, useRef, useState } from "react";
import { FiTrash, FiUploadCloud } from "react-icons/fi";
import { prepareForUpload } from "../app/books/upload/documentHandlingFunctions";

import { useNotifications } from "../context/NotificationContext";
import { useRouter } from "next/navigation";
import { useBookActions } from "../services";

const processFileType = (fileType: string) => {
  if (fileType.includes("pdf")) return "PDF";
  else return "EPUB";
};

export default function MultipleUploadForm({
  files,
}: {
  files: FileList | null;
}) {
  const { actions: bookActions } = useBookActions();
  const inputRef = useRef<HTMLInputElement>(null);
  let filesNew = files ? Array.from(files) : null;
  const [filesToBeUploaded, updateFilesToBeUploaded] = useState<File[] | null>(
    filesNew,
  );
  const [isLoading, updateLoadingState] = useState(false);
  const [filesWithMetadataState, updateFilesStatusObject] = useState<
    {
      formDataObject: any;
      state: boolean;
      file: File;
    }[]
  >([]);
  const { addNotification } = useNotifications();
  const router = useRouter();

  const toArray = (fileList: FileList) => {
    return Array.from(fileList);
  };

  const uploadIndividualItem = async (file: File) => {
    const shape_fake = await prepareForUpload(file);
    const shapeReal = { ...shape_fake, book_file: file };
    try {
      // const formValues = new FormData();
      // formValues.append("title", shapeReal.title);
      // formValues.append("author", shapeReal.author);
      // formValues.append("description", shapeReal.description || "");
      // formValues.append("category", shapeReal.category);
      // formValues.append("pages", String(shapeReal.pages));
      // formValues.append("book_file", shapeReal.book_file);
      // formValues.append("published_year", shapeReal.publishedYear);
      // formValues.append("publisher", shapeReal.publisher);
      // if (shapeReal.cover_image) {
      //   formValues.append("cover_image", shapeReal.cover_image);
      // }
      // return formValues;
      return shapeReal;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const doStuff = async () => {
      if (!filesToBeUploaded) return;

      const results = await Promise.all(
        filesToBeUploaded.map(async (file) => {
          const parsedData = await uploadIndividualItem(file);
          if (!parsedData) return null;

          return {
            state: parsedData.title.length > 1,
            formDataObject: parsedData,
            file: file,
          };
        }),
      );

      const filteredResults = results.filter(Boolean) as {
        formDataObject: any;
        state: boolean;
        file: File;
      }[];

      updateFilesStatusObject(filteredResults);
    };

    doStuff();
  }, [filesToBeUploaded]);

  async function uploadAllItems() {
    updateLoadingState(true);
    if (filesToBeUploaded && filesToBeUploaded.length > 0) {
      Promise.allSettled(
        filesToBeUploaded?.map((file) => uploadIndividualItem(file)),
      )
        .then((results) => {
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
        })
        .then(() => {
          updateLoadingState(false);
          // router.push("/app/library");
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
          className="md:p-4 p-2 border-2 my-3 rounded-xl border-dotted border-gray-400 block md:w-2/5 w-3/4"
        >
          <FiUploadCloud className="text-gray-300 dark:text-neutral-700 text-4xl mb-2" />
          <p className="text-md text-gray-400 font-medium uppercase tracking-tighter">
            Click or Drag File(s)
          </p>

          <input
            id="swag"
            type="file"
            ref={inputRef}
            className="hidden"
            multiple={true}
            onChange={(e) => {
              if (e.target.files && filesToBeUploaded) {
                updateFilesToBeUploaded([
                  ...filesToBeUploaded,
                  ...toArray(e.target.files),
                ]);
              }
            }}
          />
        </label>
      </div>

      <p className="text-emerald-400 text-lg font-bold my-1">
        {filesToBeUploaded?.length} Files to be Uploaded:{" "}
      </p>

      <div className="md:my-2 my-4">
        <div className="grid grid-cols-6 py-1 gap-x-1 mt-8 mb-2">
          <div className="text-left grid col-span-3">Name</div>
          <div className="text-center">File Size</div>
          <div className="text-center">File Type</div>
          <div className="text-center"></div>
        </div>
        <hr className="text-emerald-400" />
        <div>
          {filesWithMetadataState &&
            filesToBeUploaded &&
            filesWithMetadataState.map(({ file, state, formDataObject }) => (
              <FileToBeUploaded
                file={file}
                onClick={() => {
                  const excludesFile = filesToBeUploaded.filter(
                    (fileSpec) =>
                      filesToBeUploaded.indexOf(file) !==
                      filesToBeUploaded.indexOf(fileSpec),
                  );
                  updateFilesToBeUploaded(excludesFile);
                }}
                state={state}
                dataObj={formDataObject}
              />
            ))}
        </div>
      </div>
      <button
        className="px-8 justify-self-center py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-center flex place-content-center gap-x-4 w-1/2 bg-emerald-400 text-white gap-y-2 whitespace-nowrap md:my-6 disabled:opacity-50 disabled:bg-gray-400 disabled:text-white"
        onClick={uploadAllItems}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : null}
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

function FileToBeUploaded({
  file,
  onClick,
  state,
  dataObj,
}: {
  file: File;
  onClick: () => void;
  state: boolean;
  dataObj: {
    title: string;
    author: string;
    publisher: number;
    description: string;
    publishedYear: string;
    pages: number;
    category: "";
  };
}) {
  useEffect(() => {
    console.log(dataObj);
  }, []);
  const [isShown, show] = useState(false);
  const [dataObject, updateDataObject] = useState(dataObj);
  const [title, updateTitle] = useState(dataObj.title);

  return (
    <div onClick={() => show(true)}>
      <div className="md:p-2 p-1 my-1 md:my-2 grid grid-cols-6" key={file.name}>
        <p
          className={`${state ? "text-emerald-500" : "text-red-500"} cursor-pointer w-3/4 truncate h-8 grid col-span-3 `}
          title={`${state ? "Good to go!" : "This file does not have the required metadata. It will not be uploaded to the Shelf DB"}`}
        >
          {file.name}
        </p>
        <div className="text-center col-span-1">
          {(file.size / 1048576).toFixed(2)} MB
        </div>
        <div className="text-center col-span-1">
          {processFileType(file.type)}
        </div>
        <div className="justify-center grid">
          <FiTrash
            className="inline text-2xl hover:bg-red-600 hover:cursor-pointer"
            title="Delete Book"
            onClick={onClick}
          />
        </div>
      </div>
      <div className={`${isShown ? "block" : "hidden"} metadata-input-form`}>
        {/* {//Input States for showing and allowing for metadata editing on bulk} */}
        uploads
        <div className="grid grid-cols-3 gap-x-3 gap-y-1 p-1 items-center">
          <div className="p-1">
            <label>Title</label>
            <input
              type="text"
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2"
              autoFocus
              onChange={(e) => updateTitle(e.target.value)}
              defaultValue={dataObj.title}
              readOnly={state}
            />
          </div>
          <div className="p-1">
            <label>Author</label>
            <input
              type="text"
              defaultValue={dataObj.author}
              readOnly={state}
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2"
            />
          </div>

          <div className="p-1">
            <label>Publisher</label>
            <input
              type="text"
              defaultValue={dataObj.author}
              readOnly={state}
              className="block w-4/5 border  border-white rounded-lg outline-0 indent-4 px-2"
            />
          </div>

          <div className="p-1">
            <label>Year of Publication</label>
            <input
              type="text"
              defaultValue={dataObj.publishedYear}
              readOnly={state}
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2 "
            />
          </div>

          <div className="p-1">
            <label>Pages</label>
            <input
              type="number"
              defaultValue={dataObj.pages}
              readOnly={state}
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2 "
            />
          </div>

          <div>
            <label>Category</label>
            <input
              type="text"
              defaultValue={dataObj.category}
              readOnly={state}
              className="block border w-full border-white rounded-lg outline-0 indent-4 px-2"
            />
          </div>

          <button
            onClick={() => {
              updateDataObject({
                ...dataObject,
                title: title,
              });
              console.log(dataObject);
            }}
          >
            Update Metas
          </button>
        </div>
      </div>
    </div>
  );
}

/*  title: "",
      author: "",
      publisher: "",
      description: "",
      publishedYear: "",
      pages: 0,
      category: "", */
