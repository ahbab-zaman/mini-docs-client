"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateDocumentSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents`);
    setDocuments(res.data);
  };

  const handleCreateOrUpdate = async () => {
    if (!title.trim()) return;

    if (editId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${editId}`,
        {
          title,
        }
      );
    } else {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents`,
        {
          title,
        }
      );
      router.push(
        `/document/${res.data._id}?title=${encodeURIComponent(res.data.title)}`
      );
    }

    setTitle("");
    setEditId(null);
    setIsOpen(false);
    fetchDocuments();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`);
    fetchDocuments();
  };

  const handleEdit = (doc) => {
    setTitle(doc.title);
    setEditId(doc._id);
    setIsOpen(true);
  };

  return (
    <main className="p-10">
      <button
        onClick={() => {
          setIsOpen(true);
          setTitle("");
          setEditId(null);
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        Create New Document
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Document" : "Create New Document"}
            </h2>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Documents</h3>
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div
                  onClick={() =>
                    router.push(
                      `/document/${doc._id}?title=${encodeURIComponent(
                        doc.title
                      )}`
                    )
                  }
                  className="cursor-pointer"
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-gray-500">ID: {doc._id}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
