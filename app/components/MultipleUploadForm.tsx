import { useEffect } from "react";
import { FiCheck, FiUploadCloud } from "react-icons/fi";

const processFileType = (fileType: string) => {
  if (fileType.includes("pdf")) return "PDF";
  else return "EPUB";
};

export default function MultipleUploadForm({
  files,
}: {
  files: FileList | null;
}) {
  useEffect(
    () =>
      files ? console.log(files[0].arrayBuffer()) : console.log("No buffer"),
    [],
  );

  return (
    <div className="p-6 md:p-12 w-full mx-auto bg-white dark:bg-neutral-900">
      <div className="flex items-center gap-4 px-6 text-center">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]"></p>
          <p className="text-[10px] text-gray-400 uppercase"></p>
        </div>
      </div>
      <>
        {/*File Upload Form for later */}
        <FiUploadCloud className="text-gray-300 dark:text-neutral-700 text-2xl mb-2" />
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
          Click or Drag File
        </p>
      </>

      <p className="text-emerald-400 text-lg underline my-1">
        {files?.length} Files to be Uploaded:{" "}
      </p>

      <div className="grid grid-cols-5 py-1 gap-x-1">
        <div className="text-left grid col-span-3">Name</div>
        <div className="text-center">File Size</div>
        <div className="text-center">File Type</div>
      </div>
      <hr className="text-emerald-400" />
      <div>
        {files &&
          Array.from(files).map((file) => (
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
    </div>
  );
}
