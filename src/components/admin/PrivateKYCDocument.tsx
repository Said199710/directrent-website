"use client";

import { useEffect, useState } from "react";
import { getAdminKYCDocument } from "@/lib/admin-kyc-file";

type Evidence = { id: string; document_type: string; status: string };

export default function PrivateKYCDocument({ document }: { document: Evidence }) {
  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const id = String(document.id);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let objectUrl: string | null = null;
    setPreview(null);
    setError("");
    void getAdminKYCDocument(id, controller.signal)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPreview({ url: objectUrl, type: blob.type.toLowerCase() });
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unable to load evidence.");
      });
    return () => {
      active = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, attempt]);

  const image = preview && ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(preview.type);
  const pdf = preview?.type === "application/pdf";
  const label = String(document.document_type).replaceAll("_", " ");

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
      <div className="grid min-h-64 place-items-center bg-black/30">
        {error ? (
          <div className="p-5 text-center">
            <p role="alert" className="text-sm text-red-300">{error}</p>
            <button onClick={() => setAttempt((n) => n + 1)} className="mt-3 text-sm text-blue-400">Retry document</button>
          </div>
        ) : !preview ? (
          <p role="status" className="p-5 text-sm text-slate-400">Loading private document...</p>
        ) : image ? (
          <img src={preview.url} alt={label} className="h-64 w-full object-contain" />
        ) : pdf ? (
          <iframe src={preview.url} title={`${label} PDF`} sandbox="" className="h-80 w-full bg-white" />
        ) : (
          <p className="p-5 text-center text-sm text-slate-400">Preview is unavailable. Download the document for review.</p>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold capitalize">{label}</h3>
        <p className="mt-2 text-sm text-slate-400">Status: {document.status}</p>
        {preview && (
          <a href={preview.url}
             download={`kyc-${id}${image ? "." + preview.type.split("/")[1] : pdf ? ".pdf" : ".bin"}`}
             className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500">
            Download document
          </a>
        )}
      </div>
    </article>
  );
}
