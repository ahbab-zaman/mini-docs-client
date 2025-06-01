"use client";

import { useState } from "react";
import CreateDocumentModal from "./CreateDocumentModal";
const CreateDocumentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <main>
        <CreateDocumentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </main>
    </div>
  );
};

export default CreateDocumentButton;
