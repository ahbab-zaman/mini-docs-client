"use client";
import { useEffect, useState } from "react";
import DocumentRow from "./DocumentRow";
import { EditModal, DeleteModal } from "./Modals";
import { useUser } from "../utils/UserContext";

export default function Home() {
  const { user } = useUser(); // 👈 Get user from context
  const [documents, setDocuments] = useState([]);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const fetchDocs = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`);
    const data = await res.json();
    setDocuments(data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleRename = async (newTitle) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${editDoc._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setEditDoc(null);
    fetchDocs();
  };

  const handleDelete = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${deleteDoc._id}`,
      {
        method: "DELETE",
      }
    );
    setDeleteDoc(null);
    fetchDocs();
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    if (!user?.fullName) return alert("User info not loaded yet");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        author: user.fullName, // 👈 Use actual user's name
      }),
    });
    setNewTitle("");
    setCreateOpen(false);
    fetchDocs();
  };

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Documents</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          + Create New Document
        </button>
      </div>

      <table className="w-full text-left border">
        <thead className="bg-gray-100 text-sm uppercase">
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Title</th>
            <th className="p-4">Shared By</th>
            <th className="p-4">Created At</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentRow
              key={doc._id}
              doc={doc}
              onRename={() => setEditDoc(doc)}
              onDelete={() => setDeleteDoc(doc)}
            />
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <EditModal
        isOpen={!!editDoc}
        title={editDoc?.title || ""}
        onClose={() => setEditDoc(null)}
        onSave={handleRename}
      />
      <DeleteModal
        isOpen={!!deleteDoc}
        onClose={() => setDeleteDoc(null)}
        onConfirm={handleDelete}
      />

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Document</h2>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Document Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
