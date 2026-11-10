"use client";
import { useState } from "react";
export default function PropertyPhoto({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? <img src={src} alt={title} onError={() => setFailed(true)} loading="lazy" referrerPolicy="no-referrer" className="aspect-video w-full object-cover" /> : <div className="grid min-h-36 place-items-center bg-emerald-50 text-sm text-emerald-900">Photo unavailable</div>;
}
