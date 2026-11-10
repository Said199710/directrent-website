"use client";
import { useState } from "react";
import { webRequest } from "@/lib/web-events";
export default function WebFeedback() {
  const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false);
  return <form className="mt-8 grid max-w-xl gap-5" onSubmit={async event => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setBusy(true); setStatus("");
    try { await webRequest("/feedback", { found: data.get("found"), message: data.get("message"), website: data.get("website") }); setStatus("Thank you. Your feedback was sent privately to the DirectRent team."); form.reset(); } catch (error) { setStatus((error as Error).message); } finally { setBusy(false); }
  }}><label className="grid gap-2 font-semibold">Did you find what you needed?<select name="found" required className="rounded-lg border p-3"><option value="">Choose an answer</option><option value="yes">Yes</option><option value="partly">Partly</option><option value="no">No</option></select></label><label className="grid gap-2 font-semibold">Message (optional)<textarea name="message" maxLength={1000} rows={4} className="rounded-lg border p-3" /></label><label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label><p className="text-sm text-slate-600">Feedback is private. Please leave out contact details, payment information and exact addresses.</p><button disabled={busy} className="rounded-lg bg-emerald-800 p-3 font-bold text-white disabled:opacity-50">{busy ? "Sending…" : "Send feedback"}</button><p role="status">{status}</p></form>;
}
