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
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // {type: "success"|"error", message: string, id: string}
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(savedDocs);
  }, []);

  const saveToLocalStorage = (docs) => {
    localStorage.setItem("documents", JSON.stringify(docs));
    setDocuments(docs);
  };

  const showAlert = (type, message) => {
    const id = uuidv4();
    setAlert({ type, message, id });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleCreateOrUpdate = async () => {
    if (title.trim() === "") {
      showAlert("error", "Title cannot be empty");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (editMode) {
        const updated = documents.map((doc) =>
          doc.id === editId ? { ...doc, title } : doc
        );
        saveToLocalStorage(updated);
        showAlert("success", "Document renamed successfully");
      } else {
        const newDoc = {
          id: uuidv4(),
          title,
          createdAt: new Date().toISOString(),
        };
        const updatedDocs = [...documents, newDoc];
        saveToLocalStorage(updatedDocs);
        showAlert("success", "Document created successfully");
        router.push(`/editor/${newDoc.id}`);
      }

      setTitle("");
      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      setLoading(false);
    }, 1000); // simulate delay
  };

  const handleDelete = () => {
    const updated = documents.filter((doc) => doc.id !== deleteId);
    saveToLocalStorage(updated);
    showAlert("success", "Document deleted");
    setDeleteId(null);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      {/* Alert Banner */}
      {alert && (
        <div
          key={alert.id}
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold flex items-center space-x-3
          ${
            alert.type === "success"
              ? "bg-green-500"
              : alert.type === "error"
              ? "bg-red-500"
              : "bg-gray-700"
          } animate-slideDown`}
        >
          {alert.type === "success" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Create Button with Gradient & Shadow */}
      <button
        onClick={() => {
          setTitle("");
          setShowModal(true);
          setEditMode(false);
        }}
        className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-500 text-white px-8 py-3 rounded-2xl shadow-xl hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-400"
      >
        + Create Document
      </button>

      {/* Document List */}
      <div className="mt-10 space-y-5">
        {documents.length === 0 && (
          <p className="text-gray-400 text-center italic">No documents yet</p>
        )}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="relative p-6 border border-gray-300 rounded-2xl shadow-md group bg-white hover:shadow-2xl transition-shadow duration-400 cursor-pointer flex justify-between items-center"
          >
            <div
              onClick={() => router.push(`/editor/${doc.id}`)}
              className="flex flex-col space-y-1 max-w-[75%]"
            >
              <div className="font-semibold text-xl text-gray-900 truncate">
                {doc.title}
              </div>
              <div className="text-sm text-gray-500 select-none">
                Created at: {new Date(doc.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Edit/Delete Buttons, fade in on hover */}
            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => {
                  setTitle(doc.title);
                  setEditId(doc.id);
                  setEditMode(true);
                  setShowModal(true);
                }}
                className="text-indigo-700 hover:text-indigo-900 font-semibold px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 shadow-sm transition-colors"
                aria-label={`Rename ${doc.title}`}
              >
                Rename
              </button>
              <button
                onClick={() => setDeleteId(doc.id)}
                className="text-red-700 hover:text-red-900 font-semibold px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 shadow-sm transition-colors"
                aria-label={`Delete ${doc.title}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Backdrop */}
      {(showModal || deleteId) && (
        <div
          className="fixed inset-0 backdrop-blur-md backdrop-saturate-150 bg-white/10 z-50"
          onClick={() => {
            if (!loading) {
              setShowModal(false);
              setEditMode(false);
              setEditId(null);
              setDeleteId(null);
            }
          }}
        />
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 px-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 transform transition-transform duration-300 ease-out animate-scaleUp">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 select-none">
              {editMode ? "Rename Document" : "Create New Document"}
            </h2>

            <input
              type="text"
              autoFocus
              disabled={loading}
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleCreateOrUpdate();
              }}
            />

            <div className="mt-10 flex justify-end space-x-6">
              <button
                onClick={() => {
                  if (!loading) {
                    setShowModal(false);
                    setEditMode(false);
                    setEditId(null);
                    setTitle("");
                  }
                }}
                className="px-8 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition font-semibold"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleCreateOrUpdate}
                disabled={loading}
                className="relative px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold shadow-lg hover:brightness-110 transition focus:outline-none focus:ring-4 focus:ring-indigo-400 flex items-center justify-center space-x-3"
              >
                {loading && (
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                )}
                <span>{editMode ? "Rename" : "Create"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 px-6"
          role="dialog"
          aria-modal="true"
          onClick={() => !loading && setDeleteId(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform transition-transform duration-300 ease-out animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 select-none">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease forwards;
        }

        @keyframes scaleUp {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleUp {
          animation: scaleUp 0.35s ease forwards;
        }
      `}</style>
    </div>
  );
}
