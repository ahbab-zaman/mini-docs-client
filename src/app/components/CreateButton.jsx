"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateButton() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(savedDocs);
  }, []);

  const saveToLocalStorage = (docs) => {
    localStorage.setItem("documents", JSON.stringify(docs));
    setDocuments(docs);
  };

  const handleCreateOrUpdate = () => {
    if (title.trim() === "") return;

    if (editMode) {
      const updated = documents.map((doc) =>
        doc.id === editId ? { ...doc, title } : doc
      );
      saveToLocalStorage(updated);
    } else {
      const newDoc = {
        id: uuidv4(),
        title,
        createdAt: new Date().toISOString(),
      };
      const updatedDocs = [...documents, newDoc];
      saveToLocalStorage(updatedDocs);
      router.push(`/editor/${newDoc.id}`);
    }

    setTitle("");
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (id, title) => {
    setTitle(title);
    setEditId(id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (confirmed) {
      const updated = documents.filter((doc) => doc.id !== id);
      saveToLocalStorage(updated);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Create Button with Hover & Scale Animation */}
      <button
        onClick={() => {
          setTitle("");
          setShowModal(true);
          setEditMode(false);
        }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        + Create Document
      </button>

      {/* Document List */}
      <div className="mt-8 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="relative p-5 border border-gray-300 rounded-xl shadow-md group bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div
              onClick={() => router.push(`/editor/${doc.id}`)}
              className="space-y-1"
            >
              <div className="font-semibold text-lg text-gray-800 truncate">
                {doc.title}
              </div>
              <div className="text-sm text-gray-500">
                Created at: {new Date(doc.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Edit/Delete Buttons, slide in on hover */}
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => handleEdit(doc.id, doc.title)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 shadow-sm transition-colors"
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn" />

          {/* Modal Box */}
          <div
            className="fixed inset-0 flex justify-center items-center z-50 px-4"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-transform duration-300 ease-out animate-slideInUp">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editMode ? "Rename Document" : "Create New Document"}
              </h2>
              <input
                type="text"
                autoFocus
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateOrUpdate();
                }}
              />
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition font-semibold"
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setEditId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-md"
                >
                  {editMode ? "Rename" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.35s ease forwards;
        }
      `}</style>
    </div>
  );
}
