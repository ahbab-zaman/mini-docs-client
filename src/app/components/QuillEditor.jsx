"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Editor to disable SSR
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export default function QuillEditor({ value, onChange }) {
  return (
    <Editor
      value={value}
      onEditorChange={onChange}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      init={{
        height: 500,
        menubar: true,
        skin: "oxide-dark",
        content_css: "dark",
        plugins: [
          "preview",
          "importcss",
          "searchreplace",
          "autolink",
          "autosave",
          "save",
          "directionality",
          "code",
          "visualblocks",
          "visualchars",
          "fullscreen",
          "image",
          "link",
          "media",
          "template",
          "codesample",
          "table",
          "charmap",
          "pagebreak",
          "nonbreaking",
          "anchor",
          "insertdatetime",
          "advlist",
          "lists",
          "wordcount",
          "help",
          "charmap",
          "emoticons",
          "tinycomments",
          "spellchecker",
          "quickbars",
          "ai",
        ],
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | " +
          "link image media table | codesample | numlist bullist checklist | emoticons charmap | " +
          "template customButton | removeformat preview fullscreen",
        toolbar_sticky: true,
        autosave_interval: "30s",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author Name",
        codesample_languages: [
          { text: "HTML/XML", value: "markup" },
          { text: "JavaScript", value: "javascript" },
          { text: "CSS", value: "css" },
          { text: "Python", value: "python" },
          { text: "Java", value: "java" },
        ],
        templates: [
          {
            title: "Meeting Notes",
            description: "Template for meeting notes",
            content:
              "<h2>Meeting Notes</h2><ul><li>Agenda</li><li>Discussion</li><li>Action Items</li></ul>",
          },
          {
            title: "Simple Quote",
            description: "Insert a blockquote",
            content: "<blockquote>Your quote here</blockquote>",
          },
        ],
        images_upload_handler: (blobInfo, success, failure) => {
          // Mock upload
          const mockURL = "https://via.placeholder.com/150";
          success(mockURL);
        },
        ai_request: (request, respondWith) =>
          respondWith.string(() =>
            Promise.reject("AI Assistant not implemented")
          ),
        setup: (editor) => {
          editor.ui.registry.addButton("customButton", {
            text: "💡 Insert Tip",
            onAction: () => {
              editor.insertContent(
                "<p><strong>💡 Tip:</strong> Always write clean, semantic HTML!</p>"
              );
            },
          });
        },
      }}
      initialValue="<p>Welcome to your enhanced TinyMCE Editor!</p>"
    />
  );
}
