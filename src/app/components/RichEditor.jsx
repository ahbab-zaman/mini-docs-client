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

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

const RichEditor = ({ docId }) => {
  const editorRef = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");

  useEffect(() => {
    if (!docId) return;

    socket.emit("join-doc", docId);

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

    return () => {
      socket.emit("leave-doc", docId);
      socket.off("receive-changes");
      socket.off("load-document");
    };
  }, [docId]);

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
    socket.emit("content-change", {
      docId,
      content: newContent,
      source: socket.id,
    });
    debouncedSave(newContent);
  };

  // ===== Export Handlers =====

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
