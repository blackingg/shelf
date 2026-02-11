"use client"
import { useEffect, useRef } from "react";
import Epub, { Rendition} from "epubjs"

type BookThemes = 'light' | "dark" | "sepia"

const themes = {
light: {
  body: {
    background : '#ffffff',
    color: '#000000'
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
}

interface EpubProps extends React.ComponentPropsWithRef<'div'>{
  buffer: ArrayBuffer, 
  theme?: BookThemes
}

export function RenderEPub(props: EpubProps){
    const viewRef = useRef(null)
    const renditionRef = useRef<Rendition | null>(null)

    useEffect(() => {
    const book = Epub(props.buffer);
    if (!viewRef.current ) return ; 
    const rendition = book.renderTo(viewRef.current, {
      width: '100%', 
      height: "100%"
    })
    renditionRef.current = rendition;
    rendition.themes.register("light", themes.light);
    rendition.themes.register("dark", themes.dark);
    rendition.themes.register("sepia", themes.sepia);

    rendition.themes.select(props.theme ? props.theme : 'light')



    book.ready.then(
      () => {
        rendition.display();
        
      }
    )
    
    return () => {
      renditionRef.current?.destroy();
      book?.destroy();
    }
  }, [props.buffer, props.theme])

  const nextPage = () => {
    renditionRef.current?.next()
  }

  const prevPage = () => {
    renditionRef.current?.prev()
  }

 

    return(
      <>
      { props.buffer.byteLength > 0 ? 
      <div className="p-4 my-4 grid col-span-10" >
      <div ref={viewRef} style={{
        height: '80vh', width: '70vw'
      }}>
      </div>

      <div className="grid grid-cols-2 w-4/5 justify-self-center">
      <button onClick={() => prevPage()} className="grid justify-self-start">Prev</button>
      <button onClick={() => nextPage()} className="grid justify-self-end">Next</button>
    </div>
    </div> : null}
    </>
    )
}



