"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import htmlDocx from "html-docx-js/dist/html-docx";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// Initialize socket once outside the component to avoid multiple connections
const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

const RichEditor = ({ docId, currentUser }) => {
  const editorRef = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!docId) return;

    // Join document room and send user info to server
    socket.emit("join-doc", { docId, user: currentUser });

    socket.on("load-document", (doc) => {
      setContent(doc.content || "");
      if (editorRef.current) {
        editorRef.current.setContent(doc.content || "", { format: "raw" });
      }
    });

    socket.on("receive-changes", ({ content: serverContent, source }) => {
      if (!editorRef.current) return;
      if (source === socket.id) return;

      const currentContent = editorRef.current.getContent({ format: "raw" });
      if (serverContent !== currentContent) {
        editorRef.current.setContent(serverContent, { format: "raw" });
      }
    });

    // Listen for online users updates
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.emit("leave-doc", { docId, user: currentUser });
      socket.off("receive-changes");
      socket.off("load-document");
      socket.off("online-users");
    };
  }, [docId, currentUser]);

  const saveContent = async (newContent) => {
    setSaveStatus("Saving...");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      });
      setSaveStatus("Saved");
    } catch (err) {
      console.error("Failed to save document:", err);
      setSaveStatus("Error");
    }
  };

  const debouncedSave = useRef(
    debounce((newContent) => {
      saveContent(newContent);
    }, 1000)
  ).current;

  const handleEditorChange = (newContent) => {
    setContent(newContent);

    // Emit content changes to socket
    socket.emit("content-change", {
      docId,
      content: newContent,
      source: socket.id,
    });

    // Save with debounce
    debouncedSave(newContent);
  };

  // Export handlers
  const handleExportHTML = () => {
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.html";
    link.click();
  };

  const handleExportDOCX = () => {
    const styledContent = `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `;
    const docxBlob = htmlDocx.asBlob(styledContent);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(docxBlob);
    link.download = "document.docx";
    link.click();
  };

  const handleExportPDF = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(content);
    iframe.onload = () => {
      html2pdf().from(iframe.contentDocument.body).save("document.pdf");
      document.body.removeChild(iframe);
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Save Status */}
      <div className="text-sm text-right min-w-[120px] mb-2">
        <AnimatePresence>
          {saveStatus === "Saving..." && (
            <motion.span
              key="saving"
              className="flex items-center gap-1 text-yellow-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FaSpinner className="animate-spin" /> Saving...
            </motion.span>
          )}
          {saveStatus === "Saved" && (
            <motion.span
              key="saved"
              className="text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ✓ Saved
            </motion.span>
          )}
          {saveStatus === "Error" && (
            <motion.span
              key="error"
              className="text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ⚠ Error
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Online Users */}
      <div className="mb-4">
        <h4 className="font-semibold mb-1">Currently online:</h4>
        <div className="flex items-center gap-3 overflow-x-auto max-w-full">
          {onlineUsers.length === 0 && (
            <span className="text-gray-500">No one else is online.</span>
          )}
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center text-center min-w-[60px]"
              title={user.fullName || user.name || ""}
              s
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.name || ""}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
                  {(user.fullName || user.name || "").charAt(0)}
                </div>
              )}
              <span className="text-xs mt-1 truncate max-w-[60px]">
                {user.fullName || user.name || "Unknown"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExportHTML}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export as HTML
        </button>
        <button
          onClick={handleExportDOCX}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Export as DOCX
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Export as PDF
        </button>
      </div>

      {/* Editor */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Editor
          apiKey="ulke50is6kx5hxrisolo6yrbn85rvhggxkyqfbmzy71qgzr9"
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={content}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist autolink lists link image charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table code help wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onEditorChange={handleEditorChange}
        />
      </motion.div>
    </div>
  );
};

export default RichEditor;
