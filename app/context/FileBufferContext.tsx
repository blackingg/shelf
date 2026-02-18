'use client'
import { useState, createContext, SetStateAction } from "react";

export const FileBufferContext
= createContext<
{
    buffer: ArrayBuffer, 
    updateBuffer: React.Dispatch<SetStateAction<ArrayBuffer>>

}>({} as any)

export const BufferProvider: React.FC<{
    children: React.ReactNode
}> = ({children}) => {
    const [buffer, updateBuffer] = useState({} as ArrayBuffer)
    return(
        <FileBufferContext value = {{
            buffer, updateBuffer
        }}>
            {children}
        </FileBufferContext>
    )
}