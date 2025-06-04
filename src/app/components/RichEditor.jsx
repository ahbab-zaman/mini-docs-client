"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { PiNotePencilBold } from "react-icons/pi";

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        {/* Home Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition"
        >
          <PiNotePencilBold size={22} />
          <span className="font-semibold text-md sm:text-lg">Home</span>
        </button>

        {/* Document Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-700">
          Document Editor
        </h1>

        {/* Save Status */}
        <div className="text-sm text-right min-w-[120px]">
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
      </div>

      {/* Editor Section */}
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
