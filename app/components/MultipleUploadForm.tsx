import React, {
  FormEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiTrash, FiUploadCloud } from "react-icons/fi";
import { prepareForUpload } from "../app/books/upload/documentHandlingFunctions";

import { useNotifications } from "../context/NotificationContext";
import { useRouter } from "next/navigation";
import { useBookActions } from "../services";
import { Book, CreateBookRequest } from "../types/book";
import processDescription from "../helpers/processDescription";
import { createContext } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";

const processFileType = (fileType: string) => {
  if (fileType.includes("pdf")) return "PDF";
  else return "EPUB";
};

type multFileContext = {
  filesWithMetadataState: {
    formDataObject: any;
    state: boolean;
    file: File;
  }[];
  updateFilesStatusObject: React.Dispatch<
    SetStateAction<
      {
        formDataObject: any;
        state: boolean;
        file: File;
      }[]
    >
  >;
};

const MultipleFileContext = createContext<multFileContext>(
  {} as multFileContext,
);

const useMultipleFiles = () => useContext(MultipleFileContext);

export const MultipleFileProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filesWithMetadataState, updateFilesStatusObject] = useState<
    {
      formDataObject: any;
      state: boolean;
      file: File;
    }[]
  >([]);

  return (
    <MultipleFileContext
      value={{ filesWithMetadataState, updateFilesStatusObject }}
    >
      {children}
    </MultipleFileContext>
  );
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
  const { filesWithMetadataState, updateFilesStatusObject } =
    useMultipleFiles();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const toArray = (fileList: FileList) => {
    return Array.from(fileList);
  };

  interface BookMetadata {
    author: string;
    description: string;
    category: string;
    title: string;
    pages: number;
    department?: string;
    isbn?: string;
    publisher?: string;
    publishedYear?: number | string;
    tags?: string[];
    cover_image: File | null;
    book_file: File;
  }

  function validateBookToBeUploaded(book: BookMetadata) {
    const { title, author, description, category, pages } = book;
    if (
      title?.length > 1 &&
      author?.length > 1 &&
      description?.length > 1 &&
      category.length > 1 &&
      pages > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  const parseIndividualItemData = async (file: File) => {
    const shape_fake = await prepareForUpload(file);
    const shapeReal = { ...shape_fake, book_file: file };
    try {
      return shapeReal;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadIndividualItem = async (item: {
    formDataObject: BookMetadata;
    state: boolean;
    file: File;
  }) => {
    try {
      if (item.state === true) {
        const {
          title,
          book_file,
          author,
          description,
          category,
          pages,
          publishedYear,
          publisher,
          cover_image,
        } = item.formDataObject;
        const formValues = new FormData();
        formValues.append("title", title);
        formValues.append("author", author);
        formValues.append("description", description || "");
        formValues.append("category", category);
        formValues.append("pages", String(pages));
        formValues.append("book_file", book_file);
        formValues.append("published_year", String(publishedYear));
        formValues.append("publisher", String(publisher));
        if (cover_image) {
          formValues.append("cover_image", cover_image);
        }
        await bookActions.createBook(formValues);
      } else {
        addNotification(
          `error`,
          `${item.file.name} could not be uploaded. Reason: Missing Metadata`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const doStuff = async () => {
      if (!filesToBeUploaded) return;

      const filesInMetadataObj = filesWithMetadataState.map(
        (item) => item.file,
      );
      const newFiles = filesToBeUploaded.filter(
        (item) => filesInMetadataObj.indexOf(item) === -1,
      );

      const results = await Promise.all(
        newFiles.map(async (file) => {
          const parsedData = await parseIndividualItemData(file);
          if (!parsedData) return null;

          return {
            state: validateBookToBeUploaded(parsedData),
            formDataObject: parsedData,
            file: file,
          };
        }),
      );

      const filteredResults = results.filter(Boolean) as {
        formDataObject: BookMetadata;
        state: boolean;
        file: File;
      }[];

      updateFilesStatusObject([...filesWithMetadataState, ...filteredResults]);
    };

    doStuff();
  }, [filesToBeUploaded]);

  async function uploadAllItems() {
    updateLoadingState(true);
    if (filesToBeUploaded && filesToBeUploaded.length > 0) {
      Promise.allSettled(
        filesWithMetadataState?.map((file) => uploadIndividualItem(file)),
      )
        .then((results) => {
          results.forEach((result, index) => {
            if (result.status !== "rejected") {
              addNotification(
                "success",
                `${filesToBeUploaded[index].name} successfully uploaded`,
              );
            }
          });
        })
        .then(() => {
          updateLoadingState(false);
          router.push("/app/library");
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
        {filesWithMetadataState?.length} Files to be Uploaded:{" "}
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
                  const removedFromContext = filesWithMetadataState.filter(
                    (fileSpecific) => fileSpecific.file.name !== file.name,
                  );
                  updateFilesStatusObject(removedFromContext);
                  const goodFiles = filesToBeUploaded.filter(
                    (fileSpecific) => file.name !== fileSpecific.name,
                  );
                  updateFilesToBeUploaded(goodFiles);
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
  dataObj: Partial<CreateBookRequest>;
}) {
  const { updateFilesStatusObject, filesWithMetadataState } =
    useMultipleFiles();

  const [isShown, show] = useState(false);
  const [title, updateTitle] = useState(dataObj.title);
  const [author, updateAuthor] = useState(dataObj.author);
  const [description, updateDescription] = useState(dataObj.description);
  const [publisher, updatePublisher] = useState(dataObj.publisher);
  const [publishedYear, updatePublishedYear] = useState(dataObj.publishedYear);
  const [isbn, updateISBN] = useState(dataObj.isbn);
  const [department, updateDepartment] = useState(dataObj.department);
  const [category, updateCategory] = useState(dataObj.category);
  const [pages, updatePages] = useState(dataObj.pages);

  const updateMetadata = (e: any) => {
    e.preventDefault();
    const [fileTarget] = filesWithMetadataState.filter(
      (item) => item.file.name === file.name,
    );
    const fileTargetRemoved = filesWithMetadataState.filter(
      (item) => item.file.name !== file.name,
    );
    const newFileTarget = {
      ...fileTarget,
      formDataObject: {
        title: title,
        description: description,
        author: author,
        publisher: publisher,
        publlishedYear: publishedYear,
        isbn: isbn,
        department: department,
        category: category,
        pages: pages,
      },
      state: true,
    };
    updateFilesStatusObject([...fileTargetRemoved, newFileTarget]);
    show(false);
  };

  return (
    <div>
      <div className="md:p-2 p-1 my-1 md:my-2 grid grid-cols-6" key={file.name}>
        <div className="col-span-3 flex gap-x-2">
          {!state ? (
            <FaCaretDown
              onClick={() => show(!isShown)}
              className="text-2xl fill-white"
            />
          ) : (
            <FaCaretUp
              onClick={() => show(!isShown)}
              className="text-2xl fill-white"
            />
          )}
          <p
            className={`${state ? "text-emerald-500" : "text-red-500"} cursor-pointer flex w-3/4 truncate h-8 gap-x-2 `}
            title={`${state ? "Good to go!" : "This file does not have the required metadata. It will not be uploaded to the Shelf DB"}`}
          >
            {file.name}
          </p>
        </div>
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
        <form
          className="grid grid-cols-3 gap-x-3 gap-y-1 p-1 items-center"
          onSubmit={updateMetadata}
        >
          <div className="p-1">
            <label>Title</label>
            <input
              type="text"
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2"
              autoFocus
              onChange={(e) => updateTitle(e.target.value)}
              defaultValue={dataObj.title}
            />
          </div>
          <div className="p-1">
            <label>Author</label>
            <input
              type="text"
              defaultValue={dataObj.author}
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updateAuthor(e.target.value)}
            />
          </div>

          <div className="p-1">
            <label>Publisher</label>
            <input
              type="text"
              defaultValue={dataObj.publisher}
              className="block w-full border  border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updatePublisher(e.target.value)}
            />
          </div>

          <div className="p-1">
            <label>Year of Publication</label>
            <input
              type="text"
              defaultValue={dataObj.publishedYear}
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updatePublishedYear(Number(e.target.value))}
            />
          </div>

          <div className="p-1">
            <label>Pages</label>
            <input
              type="number"
              defaultValue={dataObj.pages}
              className="block w-full border border-white rounded-lg outline-0 indent-4 px-2 "
              onChange={(e) => updatePages(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Category</label>
            <input
              type="text"
              defaultValue={dataObj.category}
              className="block border w-full border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updateCategory(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <input
              type="text"
              defaultValue={
                dataObj.description
                  ? processDescription(dataObj.description)
                  : ""
              }
              className="block border w-full border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updateDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Department *</label>
            <input
              type="text"
              defaultValue={dataObj.department}
              className="block border w-full border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updateDepartment(e.target.value)}
            />
          </div>

          <div>
            <label>ISBN *</label>
            <input
              type="text"
              defaultValue={dataObj.isbn}
              className="block border w-full border-white rounded-lg outline-0 indent-4 px-2"
              onChange={(e) => updateISBN(e.target.value)}
            />
          </div>

          <button className="rounded-lg p-2 bg-emerald-500 my-2">
            Update Metas
          </button>
        </form>
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
