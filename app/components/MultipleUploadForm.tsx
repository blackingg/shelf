import React, {
  FormEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FiTrash,
  FiUploadCloud,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiCheck,
  FiLayout,
  FiBookOpen,
} from "react-icons/fi";
import { FolderSelectDropdown } from "./Library/FolderSelectDropdown";
import { prepareForUpload } from "../helpers";
import { useNotifications } from "../context/NotificationContext";
import { useRouter } from "next/navigation";
import {
  useBookActions,
  useDepartments,
  useDiscoverCategories,
} from "../services";
import { useFolderActions, useMeFolders } from "../services/folders/hooks";
import { Book, CreateBookRequest } from "../types/book";
import processDescription from "../helpers/processDescription";
import { createContext } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store";
import { FormSelect } from "./Form/FormSelect";

const processFileType = (fileType: string) => {
  if (fileType.includes("pdf")) return "PDF";
  else return "EPUB";
};

type UploadStatus = "idle" | "uploading" | "success" | "error" | "processing";

type FileStatusItem = {
  id: string;
  formDataObject: CreateBookRequest;
  state: boolean;
  file: File;
  uploadStatus: UploadStatus;
};

type multFileContext = {
  filesWithMetadataState: FileStatusItem[];
  updateFilesStatusObject: React.Dispatch<SetStateAction<FileStatusItem[]>>;
};

const MultipleFileContext = createContext<multFileContext>(
  {} as multFileContext,
);

export const useMultipleFiles = () => useContext(MultipleFileContext);

export const MultipleFileProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filesWithMetadataState, updateFilesStatusObject] = useState<
    FileStatusItem[]
  >([]);

  return (
    <MultipleFileContext.Provider
      value={{ filesWithMetadataState, updateFilesStatusObject }}
    >
      {children}
    </MultipleFileContext.Provider>
  );
};

export default function MultipleUploadForm({
  files,
}: {
  files: FileList | null;
}) {
  const { actions: bookActions } = useBookActions();
  const { folders, isLoading: isLoadingFolders } = useMeFolders({ limit: 100 });
  const { actions: folderActions } = useFolderActions();
  const [targetFolderId, setTargetFolderId] = useState<string>("");

  const user = useSelector(selectCurrentUser);
  const { departments, isLoading: isLoadingDepts } = useDepartments(
    user?.school?.id ? { school_id: user.school.id } : undefined,
  );
  const { categories, isLoading: isLoadingCategories } =
    useDiscoverCategories();

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

  function validateBookToBeUploaded(book: CreateBookRequest) {
    const { title, author, description, category, pages, department } = book;
    return (
      title?.length >= 1 &&
      author?.length >= 1 &&
      description?.trim().length >= 10 &&
      category?.length >= 1 &&
      (department?.length ?? 0) >= 1 &&
      pages > 0
    );
  }

  const parseIndividualItemData = async (file: File) => {
    const shape_fake = await prepareForUpload(file);
    const shapeReal = {
      ...shape_fake,
      book_file: file,
      department: "",
    };
    try {
      return shapeReal;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadIndividualItem = async (item: FileStatusItem) => {
    try {
      if (item.state === true) {
        // Mark as uploading
        updateFilesStatusObject((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, uploadStatus: "uploading" } : p,
          ),
        );

        const result = await bookActions.createBook(item.formDataObject);

        // Add to folder if selected
        if (targetFolderId && result?.id) {
          await folderActions.addBookToFolder(
            targetFolderId,
            result.id,
            item.formDataObject.title,
          );
        }

        // Mark as success
        updateFilesStatusObject((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, uploadStatus: "success" } : p,
          ),
        );
      } else {
        updateFilesStatusObject((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, uploadStatus: "error" } : p,
          ),
        );
        addNotification(
          `error`,
          `${item.file.name} could not be uploaded. Reason: Missing or invalid metadata`,
        );
      }
    } catch (error) {
      updateFilesStatusObject((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, uploadStatus: "error" } : p,
        ),
      );
      console.error(error);
    }
  };

  useEffect(() => {
    const doStuff = async () => {
      if (!filesToBeUploaded || filesToBeUploaded.length === 0) return;

      // Identify which files haven't been processed yet based on a unique temporary key (fingerprint)
      const getFileFingerprint = (f: File) =>
        `${f.name}-${f.size}-${f.lastModified || 0}`;

      const processedIdentifiers = new Set(
        filesWithMetadataState.map((item) => getFileFingerprint(item.file)),
      );

      const newFiles = filesToBeUploaded.filter(
        (file) => !processedIdentifiers.has(getFileFingerprint(file)),
      );

      if (newFiles.length === 0) return;

      // Immediately mark these files as "processing" in the UI with a random ID
      const processingItems: FileStatusItem[] = newFiles.map((file) => {
        const randomId =
          Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        return {
          id: randomId,
          state: false,
          formDataObject: {
            title: file.name,
            author: "",
            description: "",
            category: "",
            pages: 0,
            book_file: file,
            coverImage: null,
          },
          file: file,
          uploadStatus: "processing" as UploadStatus,
        };
      });

      // Map temporary deduplication key to the new random ID for the subsequent updates
      const fileToIdMap = new Map(
        processingItems.map((item) => [getFileFingerprint(item.file), item.id]),
      );

      updateFilesStatusObject((prev) => [...prev, ...processingItems]);

      // Process each file individually to update its metadata
      newFiles.forEach(async (file) => {
        const parsedData = await parseIndividualItemData(file);
        const fileKey = getFileFingerprint(file);
        const targetId = fileToIdMap.get(fileKey);

        updateFilesStatusObject((prev) =>
          prev.map((item) => {
            if (item.id === targetId) {
              if (!parsedData) {
                return { ...item, uploadStatus: "error" };
              }
              return {
                ...item,
                state: validateBookToBeUploaded(
                  parsedData as CreateBookRequest,
                ),
                formDataObject: parsedData as CreateBookRequest,
                uploadStatus: "idle" as UploadStatus,
              };
            }
            return item;
          }),
        );
      });
    };

    doStuff();
  }, [filesToBeUploaded]);

  async function uploadAllItems() {
    if (filesWithMetadataState.some((f) => !f.state)) {
      addNotification(
        "error",
        "Please fix file metadata errors before uploading.",
      );
      return;
    }

    updateLoadingState(true);
    try {
      const itemsToUpload = filesWithMetadataState.filter(
        (f) => f.uploadStatus !== "success",
      );

      const results = await Promise.allSettled(
        itemsToUpload.map((file) => uploadIndividualItem(file)),
      );

      let successCount = 0;
      let failCount = 0;
      const successfulIdentifiers = new Set<string>();

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successCount++;
          const item = itemsToUpload[index];
          successfulIdentifiers.add(item.id);
        } else {
          failCount++;
        }
      });

      if (failCount === 0 && successCount > 0) {
        const targetFolder = folders.find((f) => f.id === targetFolderId);
        addNotification(
          "success",
          "Bulk Upload Complete",
          targetFolder
            ? `Successfully uploaded ${successCount} files and added them to your ${targetFolder.name} folder.`
            : `Successfully uploaded all ${successCount} files to your library.`,
          1200000,
          targetFolder
            ? `/app/folders/${targetFolder.slug}`
            : "/app/library?tab=uploads",
        );
        updateFilesStatusObject([]);
        updateFilesToBeUploaded([]);

        const targetSlug = folders.find((f) => f.id === targetFolderId)?.slug;
        if (targetSlug) {
          router.push(`/app/folders/${targetSlug}`);
        } else {
          router.push("/app/library?tab=uploads");
        }
      } else if (successCount > 0) {
        addNotification(
          "warning",
          `Uploaded ${successCount} files, but ${failCount} failed. Please check the errors.`,
        );

        updateFilesStatusObject((prev) =>
          prev.filter((item) => !successfulIdentifiers.has(item.id)),
        );

        updateFilesToBeUploaded((prev) => {
          if (!prev) return null;

          const getFileFingerprint = (f: File) =>
            `${f.name}-${f.size}-${f.lastModified || 0}`;

          const successfulFileFingerprints = new Set(
            itemsToUpload
              .filter((_, index) => results[index].status === "fulfilled")
              .map((item) => getFileFingerprint(item.file)),
          );

          return prev.filter(
            (f) => !successfulFileFingerprints.has(getFileFingerprint(f)),
          );
        });
      } else if (failCount > 0) {
        addNotification("error", `Failed to upload ${failCount} files.`);
      }
    } catch (error) {
      addNotification("error", "An unexpected error occurred during upload.");
    } finally {
      updateLoadingState(false);
    }
  }

  const departmentOptions = departments.map((dept: any) => ({
    value: dept.id,
    label: dept.name,
  }));
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
      <div className="p-8 border-b border-gray-100 dark:border-neutral-800">
        <label
          htmlFor="swag"
          className="flex flex-col items-center justify-center h-40 border border-dashed border-gray-200 dark:border-neutral-800 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <FiUploadCloud className="text-gray-300 dark:text-neutral-700 text-3xl mb-3 group-hover:text-emerald-500 transition-colors" />
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Click or Drag More Files
          </p>

          <input
            id="swag"
            type="file"
            ref={inputRef}
            className="hidden"
            multiple={true}
            onChange={(e) => {
              if (e.target.files) {
                const incomingFiles = toArray(e.target.files);
                updateFilesToBeUploaded((prev) => {
                  const existing = prev || [];
                  const getFileFingerprint = (f: File) =>
                    `${f.name}-${f.size}-${f.lastModified || 0}`;
                  const existingFingerprints = new Set(
                    existing.map((f) => getFileFingerprint(f)),
                  );
                  const uniqueIncoming = incomingFiles.filter(
                    (f) => !existingFingerprints.has(getFileFingerprint(f)),
                  );
                  return [...existing, ...uniqueIncoming];
                });
              }
            }}
          />
        </label>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Files to be Uploaded ({filesWithMetadataState.length})
          </h2>
          {filesWithMetadataState.length > 0 && (
            <button
              onClick={() => {
                updateFilesStatusObject([]);
                updateFilesToBeUploaded([]);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All Selection
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filesWithMetadataState.map(
            ({ id, file, state, formDataObject, uploadStatus }) => (
              <FileToBeUploaded
                key={id}
                id={id}
                file={file}
                uploadStatus={uploadStatus}
                onDelete={() => {
                  const removedFromContext = filesWithMetadataState.filter(
                    (f) => f.id !== id,
                  );
                  updateFilesStatusObject(removedFromContext);
                  const goodFiles = (filesToBeUploaded || []).filter(
                    (f) =>
                      file.name !== f.name ||
                      file.size !== f.size ||
                      (file.lastModified || 0) !== (f.lastModified || 0),
                  );
                  updateFilesToBeUploaded(goodFiles);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                state={state}
                dataObj={formDataObject}
                categoryOptions={categoryOptions}
                departmentOptions={departmentOptions}
                isLoadingCategories={isLoadingCategories}
                isLoadingDepts={isLoadingDepts}
              />
            ),
          )}
        </div>

        <div className="mt-12 flex flex-col md:flex-row md:items-end gap-6 p-8 bg-gray-50/50 dark:bg-neutral-800/20 border border-gray-100 dark:border-neutral-800 rounded-2xl">
          <div className="flex-1">
            <FolderSelectDropdown
              selectedFolderId={targetFolderId}
              onSelect={(id) => setTargetFolderId(id)}
            />
          </div>

          <button
            className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:bg-gray-200 dark:disabled:bg-neutral-800 disabled:text-gray-400 flex items-center gap-3"
            onClick={uploadAllItems}
            disabled={isLoading || filesWithMetadataState.length === 0}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isLoading
              ? "Uploading..."
              : `Start Bulk Upload (${filesWithMetadataState.length} files)`}
          </button>
        </div>
      </div>
    </div>
  );
}

function FileToBeUploaded({
  id,
  file,
  onDelete,
  state,
  dataObj,
  uploadStatus,
  categoryOptions,
  departmentOptions,
  isLoadingCategories,
  isLoadingDepts,
}: {
  id: string;
  file: File;
  onDelete: () => void;
  state: boolean;
  dataObj: CreateBookRequest;
  uploadStatus: UploadStatus;
  categoryOptions: any[];
  departmentOptions: any[];
  isLoadingCategories: boolean;
  isLoadingDepts: boolean;
}) {
  const { updateFilesStatusObject, filesWithMetadataState } =
    useMultipleFiles();
  const user = useSelector(selectCurrentUser);
  const [isExpanded, setIsExpanded] = useState(!state);

  // Form State
  const [formData, setFormData] = useState({
    title: dataObj.title || "",
    author: dataObj.author || "",
    description: dataObj.description
      ? processDescription(dataObj.description)
      : "",
    publisher: dataObj.publisher || "",
    publishedYear: dataObj.publishedYear || "",
    isbn: dataObj.isbn || "",
    department: dataObj.department || "",
    category: dataObj.category || "",
    pages: dataObj.pages || 0,
    tags: (dataObj.tags || []).join(", "),
  });

  // Sync form data once processing is complete
  useEffect(() => {
    if (
      uploadStatus === "idle" &&
      formData.title === file.name &&
      dataObj.title !== file.name
    ) {
      setFormData({
        title: dataObj.title || "",
        author: dataObj.author || "",
        description: dataObj.description
          ? processDescription(dataObj.description)
          : "",
        publisher: dataObj.publisher || "",
        publishedYear: dataObj.publishedYear || "",
        isbn: dataObj.isbn || "",
        department: dataObj.department || user?.department?.id || "",
        category: dataObj.category || "",
        pages: dataObj.pages || 0,
        tags: (dataObj.tags || []).join(", "),
      });
      setIsExpanded(!state);
    }
  }, [uploadStatus, dataObj]);

  const isValid =
    formData.title.length >= 1 &&
    formData.author.length >= 1 &&
    formData.description.trim().length >= 10 &&
    formData.category.length >= 1 &&
    formData.department.length >= 1 &&
    formData.pages > 0;

  const handleUpdate = (e?: React.FormEvent) => {
    e?.preventDefault();

    updateFilesStatusObject((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            formDataObject: {
              ...item.formDataObject,
              ...formData,
              tags: formData.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean),
            },
            state: isValid,
          };
        }
        return item;
      }),
    );
    if (isValid) setIsExpanded(false);
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block">
      {children}
    </label>
  );

  return (
    <div className="border border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-white/5 overflow-hidden transition-all">
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors ${isExpanded ? "border-b border-gray-100 dark:border-neutral-800" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${state ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
          />
          <div className="flex flex-col truncate">
            <span
              className={`text-sm font-medium truncate ${state ? "text-gray-900 dark:text-white" : "text-red-500"}`}
            >
              {file.name}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-gray-400 uppercase font-medium">
                {(file.size / 1048576).toFixed(2)} MB
              </span>
              <span className="text-gray-200 dark:text-neutral-800">•</span>
              <span className="text-[10px] text-gray-400 uppercase font-medium">
                {processFileType(file.type)}
              </span>
              {uploadStatus === "processing" && (
                <>
                  <span className="text-gray-200 dark:text-neutral-800">•</span>
                  <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest animate-pulse">
                    Processing Metadata...
                  </span>
                </>
              )}
              {uploadStatus === "uploading" && (
                <>
                  <span className="text-gray-200 dark:text-neutral-800">•</span>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                    Uploading...
                  </span>
                </>
              )}
              {uploadStatus === "success" && (
                <>
                  <span className="text-gray-200 dark:text-neutral-800">•</span>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                    Uploaded
                  </span>
                </>
              )}
              {uploadStatus === "error" && (
                <>
                  <span className="text-gray-200 dark:text-neutral-800">•</span>
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                    Failed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 ml-4">
          {(uploadStatus === "uploading" || uploadStatus === "processing") && (
            <div
              className={`w-4 h-4 border-2 ${uploadStatus === "processing" ? "border-blue-500" : "border-emerald-500"} border-t-transparent rounded-full animate-spin`}
            />
          )}

          {uploadStatus === "idle" && !state && (
            <div className="hidden md:flex items-center gap-2 text-red-500">
              <FiAlertCircle className="text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Incomplete
              </span>
            </div>
          )}

          {uploadStatus === "success" && (
            <FiCheck className="text-emerald-500" />
          )}

          {uploadStatus === "error" && (
            <FiAlertCircle className="text-red-500 animate-bounce" />
          )}

          {uploadStatus === "idle" && state && (
            <FiCheck className="text-gray-300 dark:text-neutral-700" />
          )}

          <div className="flex items-center gap-3 border-l border-gray-100 dark:border-neutral-800 pl-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <FiTrash className="text-lg" />
            </button>
            <div className="text-gray-300 dark:text-neutral-700">
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${isExpanded ? "block" : "hidden"} p-6 bg-white dark:bg-neutral-900/50`}
      >
        <form
          className="space-y-6"
          onSubmit={handleUpdate}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label>Title</Label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Author</Label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Publisher</Label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publisher: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              label="Category"
              icon={<FiLayout />}
              options={categoryOptions}
              isLoading={isLoadingCategories}
              placeholder="Select Category"
              onChange={(opt: any) =>
                setFormData((prev) => ({ ...prev, category: opt?.value || "" }))
              }
              value={
                categoryOptions.find(
                  (opt: any) => opt.value === formData.category,
                ) || null
              }
            />
            <FormSelect
              label="Department"
              icon={<FiBookOpen />}
              options={departmentOptions}
              isLoading={isLoadingDepts}
              placeholder="Select Department"
              onChange={(opt: any) =>
                setFormData((prev) => ({
                  ...prev,
                  department: opt?.value || "",
                }))
              }
              value={
                departmentOptions.find(
                  (opt: any) => opt.value === formData.department,
                ) || null
              }
            />
            <div className="space-y-1">
              <Label>Year of Publication</Label>
              <input
                type="text"
                maxLength={4}
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publishedYear: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label>ISBN</Label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isbn: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Pages</Label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.pages}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pages: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Tags (Comma separated)</Label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="engineering, exam, study-guide"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description (Min. 10 chars)</Label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-neutral-800 text-sm outline-none focus:border-emerald-500 transition-all resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {!isValid && (
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-900/10 px-4 py-3 border border-red-500/20">
              <FiAlertCircle className="text-sm shrink-0" />
              <span>
                Please fill all required fields:
                {!formData.title && " Title,"}
                {!formData.author && " Author,"}
                {formData.description.trim().length < 10 &&
                  " Description (min 10 chars),"}
                {!formData.category && " Category,"}
                {!formData.department && " Department,"}
                {formData.pages <= 0 && " Page count"}
              </span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={!isValid}
              className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-gray-900 dark:disabled:hover:bg-white"
            >
              Update Metadata
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
