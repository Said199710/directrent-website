"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminTable from "@/components/admin/AdminTable";
import PrivateKYCDocument from "@/components/admin/PrivateKYCDocument";
import { adminApi, API_URL } from "@/lib/admin-api";

type Row = { id: number; title: string; location: string; price: number; owner_id: number; status: string };
type Media = { id: number; file_url: string; media_type: string };
type Evidence = { id: string; document_type: string; status: string };
type Review = { note?: string; site_visit_completed_at?: string; site_visit_by?: number; site_visit_notes?: string; requested_at?: string };
type Detail = {
  id: number; title: string; description: string; approximate_location: string; exact_location: string;
  exact_latitude: number | null; exact_longitude: number | null; property_type: string; bedrooms: number;
  bathrooms: number; is_furnished: boolean; has_parking: boolean; price: number; minimum_months: number;
  total_units: number; occupied_units: number; availability_status: string; verification_status: string;
  image_url: string | null; revision: string; media: Media[]; review: Review;
  owner: { id: number; name: string | null; email: string | null; phone: string | null; identity_verified: boolean; landlord_verified: boolean } | null;
  owner_documents: Evidence[]; history: { id: number; actor_id: number; value: string }[];
};
const button = "rounded-lg border border-white/20 px-3 py-2 text-sm disabled:opacity-40";
function mediaUrl(value?: string | null) {
  if (!value) return "";
  try {
    const url = new URL(value, API_URL);
    if (url.protocol !== "https:" && url.origin !== new URL(API_URL).origin) return "";
    if (!value.startsWith("https://") && !value.startsWith("/uploads/")) return "";
    return url.href;
  } catch { return ""; }
}
function message(error: unknown) { return error instanceof Error ? error.message : "Request failed"; }
export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [confirmVisit, setConfirmVisit] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void adminApi<Row[]>("/admin-console/listings", { signal: controller.signal }).then(setRows)
      .catch(e => { if (!controller.signal.aborted) setError(message(e)); });
    return () => controller.abort();
  }, [reload]);
  useEffect(() => {
    setDetail(null); setNote(""); setError(""); setConfirmVisit(false);
    if (selected === null) return;
    const controller = new AbortController();
    void adminApi<Detail>(`/admin-console/listings/${selected}`, { signal: controller.signal }).then(setDetail)
      .catch(e => { if (!controller.signal.aborted) setError(message(e)); });
    return () => controller.abort();
  }, [selected, reload]);
  async function review(status: string) {
    if (!detail || busy || !note.trim()) return;
    setBusy(true); setError("");
    try {
      await adminApi(`/admin-console/listings/${detail.id}`, {
        method: "PATCH", body: JSON.stringify({ status, note: note.trim(), revision: detail.revision }),
      });
      setReload(n => n + 1);
    } catch (e) {
      setError(message(e));
      // A fresh preview is required after any uncertain or conflicting outcome.
      setDetail(null);
    } finally { setBusy(false); }
  }
  const media = detail ? [...detail.media] : [];
  if (detail?.image_url && !media.some(m => m.file_url === detail.image_url)) {
    media.unshift({ id: -1, file_url: detail.image_url, media_type: "image" });
  }
  const coords = detail && typeof detail.exact_latitude === "number" && typeof detail.exact_longitude === "number"
    ? `${detail.exact_latitude},${detail.exact_longitude}` : "";
  const canReview = detail && ["pending", "site_visit_required"].includes(detail.verification_status);
  return <AdminShell title="Property Moderation">
    {error && <p role="alert" className="mb-4 text-red-300">{error}</p>}
    <p className="mb-4 text-slate-400">Each listing is reviewed separately. Open its evidence before making a decision.</p>
    <AdminTable columns={[
      { key: "id", label: "ID" }, { key: "title", label: "Property" }, { key: "location", label: "Location" },
      { key: "price", label: "Price (TZS/month)" }, { key: "owner_id", label: "Owner" }, { key: "status", label: "Status" },
    ]} rows={rows} renderActions={row => <button className={button} onClick={() => setSelected(row.id)}>Preview / Review</button>} />
    {selected !== null && <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5" aria-label="Property review">
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className="text-xl font-bold">Property #{selected}{detail ? ` — ${detail.title}` : ""}</h2>
        <div className="flex gap-2">
          <button className={button} disabled={busy} onClick={() => setReload(n => n + 1)}>Reload preview</button>
          <button className={button} disabled={busy} onClick={() => setSelected(null)}>Close</button>
        </div>
      </div>
      {!detail ? <p className="my-5">{error ? "Reload the preview to continue." : "Loading evidence…"}</p> : <>
        <p className="my-3">Status: <strong>{detail.verification_status}</strong></p>
        <p className="whitespace-pre-wrap">{detail.description || "No description provided"}</p>
        <dl className="my-5 grid gap-3 sm:grid-cols-2">
          {Object.entries({
            "Approximate location": detail.approximate_location, "Exact address": detail.exact_location,
            "GPS": coords || "Not saved", "Type": detail.property_type,
            "Bedrooms / Bathrooms": `${detail.bedrooms} / ${detail.bathrooms}`,
            "Furnished / Parking": `${detail.is_furnished ? "Yes" : "No"} / ${detail.has_parking ? "Yes" : "No"}`,
            "Monthly price": `TZS ${Number(detail.price).toLocaleString()}`, "Minimum months": detail.minimum_months,
            "Units / Occupied / Available": `${detail.total_units} / ${detail.occupied_units} / ${Math.max(0, detail.total_units - detail.occupied_units)}`,
            "Availability": detail.availability_status,
          }).map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd>{String(value ?? "—")}</dd></div>)}
        </dl>
        {coords && <a className="text-blue-300 underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`} target="_blank" rel="noopener noreferrer">Open exact location in Google Maps</a>}
        <h3 className="mt-6 font-bold">Listing photos and video</h3>
        {!media.length && <p>No listing media uploaded.</p>}
        <div className="my-3 grid gap-4 md:grid-cols-2">{media.map(m => {
          const url = mediaUrl(m.file_url);
          return <div key={m.id} className="rounded-xl bg-black/20 p-3">{!url ? <p>Media URL unavailable</p> : <>
            {m.media_type === "video" ? <video controls preload="metadata" className="max-h-80 w-full" src={url} />
              : <img className="max-h-80 w-full object-contain" src={url} alt="Property evidence" />}
            <a className="text-blue-300 underline" href={url} target="_blank" rel="noopener noreferrer">Open full media</a>
          </>}</div>;
        })}</div>
        <h3 className="mt-6 font-bold">Owner</h3>
        <p>{detail.owner?.name || "Name not provided"} — #{detail.owner?.id}</p>
        <p>{detail.owner?.phone} {detail.owner?.email}</p>
        <p>Identity verified: {detail.owner?.identity_verified ? "Yes" : "No"}; landlord verified: {detail.owner?.landlord_verified ? "Yes" : "No"}</p>
        <details className="my-4"><summary className="cursor-pointer">Owner KYC documents ({detail.owner_documents.length})</summary>
          <p className="my-3 text-slate-400">These belong to the owner. They are not automatically proof of ownership of this listing. Check that any ownership document identifies this property.</p>
          <div className="grid gap-4 md:grid-cols-2">{detail.owner_documents.map(document => <PrivateKYCDocument key={document.id} document={document} />)}</div>
        </details>
        <p className="my-3">Latest notes: {detail.review.note || "None"}</p>
        {detail.review.site_visit_completed_at && <p>Site visit recorded: {detail.review.site_visit_completed_at}; admin #{detail.review.site_visit_by}. {detail.review.site_visit_notes}</p>}
        {canReview && <div className="my-5 border-t border-white/10 pt-4">
          <label htmlFor="property-note">Review / site visit notes (required)</label>
          <textarea id="property-note" className="my-2 w-full rounded-lg border border-white/20 bg-slate-950 p-3" maxLength={2000} value={note} disabled={busy} onChange={e => setNote(e.target.value)} />
          {detail.verification_status === "site_visit_required" && <label className="mb-3 flex gap-2"><input type="checkbox" checked={confirmVisit} disabled={busy} onChange={e => setConfirmVisit(e.target.checked)} />I physically inspected this property and recorded the findings above.</label>}
          <div className="flex flex-wrap gap-2">
            <button className={button} disabled={busy || !note.trim() || detail.verification_status === "site_visit_required"} onClick={() => void review("verified")}>Approve property</button>
            <button className={button} disabled={busy || !note.trim()} onClick={() => void review("rejected")}>Reject</button>
            <button className={button} disabled={busy || !note.trim()} onClick={() => void review("reupload_required")}>Request changes</button>
            {detail.verification_status === "pending" && <button className={button} disabled={busy || !note.trim()} onClick={() => void review("site_visit_required")}>Require site visit</button>}
            {detail.verification_status === "site_visit_required" && <button className={button} disabled={busy || !note.trim() || !confirmVisit} onClick={() => void review("site_visit_completed")}>Record completed site visit</button>}
          </div>
        </div>}
        <details className="mt-5"><summary>Verification history</summary>{detail.history.map(event => <pre className="my-3 whitespace-pre-wrap break-words text-xs" key={event.id}>Admin/user #{event.actor_id}: {event.value}</pre>)}</details>
      </>}
    </section>}
  </AdminShell>;
}
