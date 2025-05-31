"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDocumentModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleCreate = () => {
    const id = Date.now().toString(); // You can use UUID or MongoDB _id
    router.push(`/document/${id}?title=${encodeURIComponent(title)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Document</h2>
        <input
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
