"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Modal component
function CreateDocumentModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    const id = Date.now().toString();
    onCreate({ id, title });
    onClose();
    setTitle("");
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

// Main section with button + document list
export default function CreateDocumentSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const router = useRouter();

  // Load from localStorage on first load
  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    setDocuments(savedDocs);
  }, []);

  // Save to localStorage whenever documents change
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  const handleCreate = (doc) => {
    setDocuments((prev) => [doc, ...prev]);
    router.push(`/document/${doc.id}?title=${encodeURIComponent(doc.title)}`);
  };

  return (
    <main className="p-10">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        Create New Document
      </button>

      <CreateDocumentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
      />

      {/* Document List */}
      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Documents</h3>
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/document/${doc.id}?title=${encodeURIComponent(doc.title)}`
                  )
                }
              >
                <div className="font-medium">{doc.title}</div>
                <div className="text-sm text-gray-500">ID: {doc.id}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
