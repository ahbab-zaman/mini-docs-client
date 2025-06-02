"use client";
import { useState } from "react";
import { format } from "date-fns";

export default function DocumentRow({ doc, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <img src="https://i.ibb.co/bMkvJGsd/google-docs.png" alt="doc" className="w-12 h-12" />
      </td>
      <td className="p-4 font-medium">{doc.title}</td>
      <td className="p-4">{doc.author}</td>
      <td className="p-4 text-gray-500">
        {format(new Date(doc.createdAt), "PPpp")}
      </td>
      <td className="p-4 relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl">
          ⋮
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-32">
            <button
              onClick={() => {
                setMenuOpen(false);
                onRename(doc);
              }}
              className="w-full px-4 py-2 hover:bg-gray-100"
            >
              Rename
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(doc);
              }}
              className="w-full px-4 py-2 hover:bg-red-100 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
