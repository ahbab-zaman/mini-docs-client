"use client";

import { useState } from "react";
import CreateDocumentModal from "./CreateDocumentModal";
const CreateDocumentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <main className="p-10">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          Create New Document
        </button>
        <CreateDocumentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </main>
    </div>
  );
};

export default CreateDocumentButton;
