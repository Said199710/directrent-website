"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/admin-api";

type Work = { id: number; title: string; status: string };
type Notice = { id: number; title: string; listing_id: number; is_read: boolean; created_at: string };
type Inbox = { items: Notice[]; next_before_id: number | null };
const button = "rounded-lg border border-white/20 px-3 py-2 text-sm disabled:opacity-40";
const listingUrl = (id: number) => `/admin/listings?review=${id}`;

export default function AdminInbox() {
  const [work, setWork] = useState<Work[]>([]);
  const [inbox, setInbox] = useState<Inbox>({ items: [], next_before_id: null });
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void Promise.all([
      adminApi<Work[]>("/admin-console/property-work", { signal: controller.signal }),
      adminApi<Inbox>("/admin-console/inbox", { signal: controller.signal }),
    ]).then(([nextWork, nextInbox]) => {
      if (!controller.signal.aborted) {
        setWork(nextWork);
        setInbox(nextInbox);
      }
    }).catch(e => {
      if (!controller.signal.aborted) setError(String(e));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [reload]);

  async function markRead(id: number) {
    setBusy(true);
    setError("");
    try {
      await adminApi(`/admin-console/inbox/${id}/read`, { method: "PUT" });
      setInbox(current => ({
        ...current,
        items: current.items.map(item => item.id === id ? { ...item, is_read: true } : item),
      }));
    } catch (e) {
      setError(String(e));
    } finally { setBusy(false); }
  }

  async function loadOlder(beforeId: number) {
    setBusy(true);
    setError("");
    try {
      const older = await adminApi<Inbox>(`/admin-console/inbox?before_id=${beforeId}`);
      setInbox(current => ({
        ...older,
        items: [...current.items, ...older.items],
      }));
    } catch (e) {
      setError(String(e));
    } finally { setBusy(false); }
  }

  return <AdminShell title="Admin Inbox">
    <button className={button} disabled={loading || busy} onClick={() => setReload(n => n + 1)}>Refresh inbox</button>
    {loading && <p className="mt-3" role="status">Loading inbox…</p>}
    {error && <p className="mt-3 text-red-300" role="alert">{error}</p>}
    <section className="my-6" aria-label="My work">
      <h2 className="mb-3 text-xl font-semibold">My work</h2>
      {!loading && !error && work.length === 0 && <p>No active property assignments.</p>}
      {work.length === 200 && <p>Showing up to 200 active assignments.</p>}
      <ul className="space-y-2">
        {work.map(item => <li key={item.id}>
          <Link className="text-blue-300 underline" href={listingUrl(item.id)}>{item.title} (#{item.id})</Link>
          <span className="ml-3 text-sm text-slate-400">{item.status.replaceAll("_", " ")}</span>
        </li>)}
      </ul>
    </section>
    <section aria-label="Assignment notifications">
      <h2 className="mb-3 text-xl font-semibold">Assignment notifications</h2>
      {!loading && !error && inbox.items.length === 0 && <p>No assignment notifications.</p>}
      <ul className="space-y-3">
        {inbox.items.map(item => <li key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 p-3">
          <Link className="text-blue-300 underline" href={listingUrl(item.listing_id)}>{item.title} · #{item.listing_id}</Link>
          <span className="text-sm text-slate-400">{new Date(item.created_at).toLocaleString()}</span>
          {item.is_read ? <span className="text-sm text-slate-400">Read</span> :
            <button className={button} disabled={busy || loading} onClick={() => void markRead(item.id)}>Mark as read</button>}
        </li>)}
      </ul>
      {inbox.next_before_id !== null && <button className={`mt-4 ${button}`} disabled={busy || loading}
        onClick={() => { if (inbox.next_before_id !== null) void loadOlder(inbox.next_before_id); }}>Load older</button>}
    </section>
  </AdminShell>;
}
