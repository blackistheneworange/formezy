import { useEffect, useRef } from "react"

export default function TextEditor({handleChange, className, ...props}){

    const editorRef = useRef(null);

    useEffect(()=>{},[])

    return(
        <div ref={editorRef} contentEditable={true} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-editor-custom ${className}`} onInput={handleChange} {...props}></div>
    )
}