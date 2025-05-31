"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import QuillEditor from "@/app/components/QuillEditor"; // adjust path if needed

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Untitled Document";
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-[794px] mx-auto bg-white p-10 shadow-lg border">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>
        <QuillEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
