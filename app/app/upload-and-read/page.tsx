"use client"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import Epub, { Rendition } from "epubjs";
import { FileBufferContext } from "@/app/context/FileBufferContext";
import { error } from "console";
import next from "next";

export default function UploadAndReadPage() {
  const [name, updateName] = useState("");
  const [size, updateSize] = useState(0);
  const {buffer, updateBuffer}= useContext(FileBufferContext)


  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    const file = files ? files[0] : null;
    if (file) {
      const { name, size } = file;
      updateName(name);
      updateSize(size);
      const buffer = await file.arrayBuffer();
      updateBuffer(buffer)
    }
  }

  function RenderEPub(props: {buffer: ArrayBuffer}){
    
    const viewRef = useRef(null)
    const renditionRef = useRef<Rendition | null>(null)

    useEffect(() => {
    const book = Epub(props.buffer);
    if (!viewRef.current ) return ; 
    const rendition = book.renderTo(viewRef.current, {
      width: '100%', 
      height: "90%"
    })
    renditionRef.current = rendition;

    book.ready.then(
      () => {
        rendition.display();
      }
    )
    
    return () => {
      renditionRef.current?.destroy();
      book?.destroy();
    }
  }, [props.buffer])

  const nextPage = () => {
    renditionRef.current?.next()
  }

  const prevPage = () => {
    renditionRef.current?.prev()
  }

    return(
      <>
      <div className="p-2" ref={viewRef} style={{
        height: '80vh', width: '100%'
      }}>

      </div>
      <button onClick={() => prevPage()}>Prev</button>
      <button onClick={() => nextPage()}>Next</button>
    </>
    )
}
  return (
      <div className="p-2 mx-auto my-2 w-full">
        <p>Upload and Read Page!</p>
        <div className="grid grid-cols-5 gap-x-3 items-center p-2 my-1">
          <div className="col-span-1 text-center">
            <label
              htmlFor="file"
              className="p-2 rounded-lg text-white bg-emerald-500 grid items-center justify-center "
            >
              <span className="text-center w-full">Upload Book Here</span>
              <input
                type="file"
                name="file"
                id="file"
                accept=".epub"
                style={{
                  visibility: "hidden",
                  height: 0,
                }}
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <div className="col-span-4">
            <p>{name}</p>
            <p> {(size / 1048576).toFixed(2)} MB</p>
            <RenderEPub buffer={buffer} />
          </div>
        </div>
      </div>
  );
}
