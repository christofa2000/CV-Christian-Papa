"use client";
import knowledge from "@/data/knowledge.json";
import { expand } from "@/lib/chunker";
import { buildIndex } from "@/lib/rag.simple";
import { useState } from "react";

export default function Reindex() {
  const [status, setStatus] = useState("idle");
  return (
    <div className="mx-auto max-w-md p-6">
      <button
        onClick={async () => {
          setStatus("building");
          await buildIndex(expand(knowledge as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
          setStatus("done");
        }}
        className="rounded border px-3 py-2"
      >
        Reindex
      </button>
      <p className="mt-4">Estado: {status}</p>
    </div>
  );
}
