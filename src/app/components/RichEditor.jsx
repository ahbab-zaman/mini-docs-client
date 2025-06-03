"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

const RichEditor = () => {
  const editorRef = useRef(null);
  console.log("Tiny API key:", process.env.NEXT_PUBLIC_TINY_KEY);

  const logContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        apiKey={"ulke50is6kx5hxrisolo6yrbn85rvhggxkyqfbmzy71qgzr9"}
        tinymceScriptSrc="https://cdn.tiny.cloud/1/ulke50is6kx5hxrisolo6yrbn85rvhggxkyqfbmzy71qgzr9/tinymce/6/tinymce.min.js"
        initialValue="<p>Write your content here...</p>"
        init={{
          height: 600,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "print",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "paste",
            "help",
            "wordcount",
            "autosave",
            "emoticons",
            "mentions",
            "codesample",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic underline strikethrough | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "link image media | codesample emoticons | " +
            "removeformat | fullscreen | help",
          autosave_interval: "30s",
          autosave_prefix: "tinymce-autosave-{path}{query}-{id}-",
          autosave_restore_when_empty: true,
          autosave_retention: "2m",

          automatic_uploads: true,
          file_picker_types: "image media",
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  callback(reader.result, { alt: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }
          },

          mentions_selector: ".mymention",
          mentions_fetch: function (pattern, success) {
            const users = [
              { id: "1", name: "John Doe" },
              { id: "2", name: "Jane Smith" },
              { id: "3", name: "Billy Bob" },
            ];
            const matches = users.filter((user) =>
              user.name.toLowerCase().includes(pattern.toLowerCase())
            );
            success(matches);
          },

          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={logContent} style={{ marginTop: 20 }}>
        Log Content
      </button>
    </div>
  );
};

export default RichEditor;
