"use client";
import { useState, createContext, SetStateAction } from "react";

export const FileBufferContext = createContext<{
  buffer: ArrayBuffer;
  updateBuffer: React.Dispatch<SetStateAction<ArrayBuffer>>;
  fileType: "epub" | "pdf" | "";
  setFileType: React.Dispatch<SetStateAction<"epub" | "pdf" | "">>;
}>({} as any);

export const BufferProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [buffer, updateBuffer] = useState({} as ArrayBuffer);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");

  return (
    <FileBufferContext
      value={{
        buffer,
        updateBuffer,
        fileType,
        setFileType,
      }}
    >
      {children}
    </FileBufferContext>
  );
};
