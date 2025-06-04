"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import io from "socket.io-client";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// Create the socket connection once outside the component
const socket = io("http://localhost:5000"); // Your backend URL

const RichEditor = ({ docId }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState("<p>Loading document...</p>");
  const [isUpdatingFromSocket, setIsUpdatingFromSocket] = useState(false);

  useEffect(() => {
    if (!docId) return;

    // Join document room
    socket.emit("join-doc", docId);

    // Listen for changes from server (other users)
    const handleReceiveChanges = (newContent) => {
      setIsUpdatingFromSocket(true);
      setContent(newContent);
      if (editorRef.current) {
        editorRef.current.setContent(newContent);
      }
      setIsUpdatingFromSocket(false);
    };

    socket.on("receive-changes", handleReceiveChanges);

    // Cleanup on unmount or docId change
    return () => {
      socket.emit("leave-room", docId);
      socket.off("receive-changes", handleReceiveChanges);
    };
  }, [docId]);

  // Emit changes when user edits content (avoid feedback loops)
  const handleEditorChange = (newContent) => {
    setContent(newContent);

    if (!isUpdatingFromSocket) {
      socket.emit("content-change", { docId, content: newContent });
    }
  };

  return (
    <div>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={content}
        onEditorChange={handleEditorChange}
        apiKey={"ulke50is6kx5hxrisolo6yrbn85rvhggxkyqfbmzy71qgzr9"}
        tinymceScriptSrc="https://cdn.tiny.cloud/1/ulke50is6kx5hxrisolo6yrbn85rvhggxkyqfbmzy71qgzr9/tinymce/6/tinymce.min.js"
        init={{
          height: 600,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
};

export default RichEditor;
