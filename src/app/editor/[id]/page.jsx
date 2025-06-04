"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RichEditor from "../../components/RichEditor";

export default function EditorPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    const doc = savedDocs.find((d) => d.id === id);
    if (doc) setTitle(doc.title);
  }, [id]);

  if (!id) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Document Title: {title}</h2>
      <RichEditor docId={id} />
    </div>
  );
}
