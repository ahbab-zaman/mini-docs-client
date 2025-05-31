// components/JoditEditorComponent.jsx
"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function QuillEditor({ value, onChange }) {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={value}
      onChange={onChange}
      config={{
        readonly: false,
        height: 400,
      }}
    />
  );
}
