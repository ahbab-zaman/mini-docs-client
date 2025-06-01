"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuillEditor from "@/app/components/QuillEditor"; // Adjust path if needed

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const initialTitle = searchParams.get("title") || "Untitled Document";

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState("");

  // Optional: Update page title dynamically
  useEffect(() => {
    document.title = title || "Document";
  }, [title]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-semibold mb-6 bg-transparent outline-none"
        placeholder="Document Title"
      />
      <QuillEditor value={content} onChange={setContent} />
    </div>
  );
}
