"use client";
import { useContext, ChangeEvent, useState } from "react";
import { PdfViewer } from "./PdfViewer";
import { FileBufferContext } from "@/app/context/FileBufferContext";
import { useEffect, useRef } from "react";
import Epub, { Rendition } from "epubjs";

const themes = {
  light: {
    body: {
      background: "#ffffff",
      color: "#000000",
    },
  },
  dark: {
    body: {
      background: "#1a1a1a",
      color: "#eaeaea",
    },
  },
  sepia: {
    body: {
      background: "#f4ecd8",
      color: "#5b4636",
    },
  },
};

interface EpubProps extends React.ComponentPropsWithRef<"div"> {
  buffer: ArrayBuffer;
}

export function RenderEPub(props: EpubProps) {
  const viewRef = useRef(null);
  const renditionRef = useRef<Rendition | null>(null);

  useEffect(() => {
    const book = Epub(props.buffer);
    if (!viewRef.current) return;
    const rendition = book.renderTo(viewRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
    });
    renditionRef.current = rendition;
    rendition.themes.register("light", themes.light);
    rendition.themes.register("dark", themes.dark);
    rendition.themes.register("sepia", themes.sepia);

    rendition.themes.select("light");

    book.ready.then(() => {
      rendition.display();
    });

    return () => {
      renditionRef.current?.destroy();
      book?.destroy();
    };
  }, [props.buffer]);

  const nextPage = () => {
    renditionRef.current?.next();
  };

  const prevPage = () => {
    renditionRef.current?.prev();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props.buffer]);

  return (
    <>
      {props.buffer && props.buffer.byteLength > 0 ? (
        <div className="grid transition-all duration-150 relative">
          <div className="grid grid-cols-12 w-full justify-self-center p-1 md:p-2 controls opacity-0 hover:opacity-100 transition-all absolute -bottom-[10]- z-10 bg-[#1a1a1a] duration-500">
            <button
              onClick={() => prevPage()}
              className="grid justify-self-start"
            >
              &lt; Prev
            </button>
            <div className="grid col-span-10 justify-items-center">
              <div className="flex justify-center md:gap-x-4 gap-x-2">
                <button
                  className="grid"
                  onClick={() => renditionRef.current?.themes.select("light")}
                >
                  Light
                </button>
                <button
                  className="grid"
                  onClick={() => renditionRef.current?.themes.select("sepia")}
                >
                  Sepia
                </button>
                <button
                  className="grid"
                  onClick={() => renditionRef.current?.themes.select("dark")}
                >
                  Dark
                </button>
              </div>
            </div>

            <button
              onClick={() => nextPage()}
              className="grid justify-self-end"
            >
              Next &gt;
            </button>
          </div>

          <div
            ref={viewRef}
            style={{
              height: "72.5vh",
              width: "80vw",
              overflowX: "hidden",
            }}
          ></div>
        </div>
      ) : null}
    </>
  );
}

export default function Page() {
  const { buffer, updateBuffer } = useContext(FileBufferContext);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");
  const [fileName, setFileName] = useState("");
  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    const file = files ? files[0] : null;

    if (file?.type == "application/pdf") {
      setFileType("pdf");
    } else {
      setFileType("epub");
    }
    if (file) {
      setFileName(file.name);
      const buffer = await file.arrayBuffer();
      updateBuffer(buffer);
    }
  }

  return (
    <div className="relative grid">
      <div className="grid w-full grid-cols-12 p-2 md:p-4 bg-[#1a1a1a] items-center gap-2 md:gap-4 sticky top-0 z-20 text-xs">
        <div className={`${fileName.length > 0 ? "col-span-8" : "hidden"}`}>
          <p>{fileName}</p>
        </div>
        <label
          htmlFor="file"
          className="p-1 rounded-xl text-white h-12 place-items-center place-content-center bg-emerald-500 grid col-span-4 "
        >
          <span className="text-center w-full">Upload Book Here</span>
          <input
            type="file"
            name="file"
            id="file"
            accept=".epub, .pdf"
            style={{
              visibility: "hidden",
              height: 0,
            }}
            onChange={handleFileUpload}
          />
        </label>
      </div>
      <div className="p-1 w-full grid place-items-center mx-auto overflow-x-hidden">
        {fileType.length < 1 ? (
          <p className="w-full text-xl p-2 font-bold">Please add a file</p>
        ) : fileType.length > 0 && fileType == "epub" ? (
          <RenderEPub buffer={buffer} />
        ) : (
          <PdfViewer buffer={buffer} />
        )}
      </div>
    </div>
  );
}
