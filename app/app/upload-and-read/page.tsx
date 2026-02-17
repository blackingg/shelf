"use client";
import { useEffect, useRef, useContext, ChangeEvent, useState } from "react";
import { PdfViewer } from "./PdfViewer";
import { FileBufferContext } from "@/app/context/FileBufferContext";
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

  return (
    <>
      {props.buffer && props.buffer.byteLength > 0 ? (
        <div className="p-2 my-4 grid col-span-10 transition-all duration-150">
          <div
            ref={viewRef}
            style={{
              height: "78vh",
              width: "90vw",
            }}
          ></div>

          <div className="grid grid-cols-2 w-4/5 justify-self-center font-sans">
            <button
              onClick={() => prevPage()}
              className="grid justify-self-start"
            >
              &lt; Prev
            </button>
            <button
              onClick={() => renditionRef.current?.themes.select("light")}
            >
              L
            </button>
            <button
              onClick={() => renditionRef.current?.themes.select("sepia")}
            >
              S
            </button>
            <button onClick={() => renditionRef.current?.themes.select("dark")}>
              D
            </button>
            <button
              onClick={() => nextPage()}
              className="grid justify-self-end"
            >
              Next &gt;
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}



export default function Page() {
  const { buffer, updateBuffer } = useContext(FileBufferContext);
  const [fileType, setFileType] = useState<"epub" | "pdf" | "">("");

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    const file = files ? files[0] : null;
    if (file?.type == "application/pdf") {
      setFileType("pdf");
    } else {
      setFileType("epub");
    }
    if (file) {
      const buffer = await file.arrayBuffer();
      updateBuffer(buffer);
    }
  }

  return (
    <>
      <label
        htmlFor="file"
        className="p-2 rounded-lg text-white h-12  bg-emerald-500 grid col-span-2 items-center justify-center "
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
      {fileType.length < 1 ? (
        <p>Please add a file</p>
      ) : fileType.length > 0 && fileType == "epub" ? (
        <RenderEPub buffer={buffer} />
      ) : (
        <PdfViewer buffer={buffer} />
      )}
    </>
  );
}
