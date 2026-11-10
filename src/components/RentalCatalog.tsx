"use client";

import { webEvent, demandArea } from "@/lib/web-events";
import PropertyPhoto from "@/components/PropertyPhoto";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const api = (process.env.NEXT_PUBLIC_API_URL || "https://api.directrent.app").replace(/\/+$/, "");

type Home = {
  id: number;
  title: string;
  area: string | null;
  monthly_price: number;
  bedrooms: number | null;
  property_type: string | null;
  image_url: string | null;
};
type Page = { items: Home[]; next_offset: number | null };

function publicImage(value: string | null) {
  if (!value) return null;
  try {
    const image = new URL(value, api);
    if (image.origin === new URL(api).origin && image.pathname.startsWith("/uploads/")) return image.href;
    if (image.protocol === "https:" && image.hostname === "res.cloudinary.com") return image.href;
  } catch {
    return null;
  }
  return null;
}

export default function RentalCatalog() {
  const [filters, setFilters] = useState({ location: "", budget: "", offset: 0 });
  const [page, setPage] = useState<Page | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ offset: String(filters.offset) });
    if (filters.location) query.set("location", filters.location);
    if (filters.budget !== "") query.set("max_price", filters.budget);
    fetch(`${api}/listings/public-web?${query}`, { signal: controller.signal, credentials: "omit", cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        const data: Page = await response.json();
        if (!Array.isArray(data.items)) throw new Error("Invalid catalogue response");
        if (!controller.signal.aborted) { setPage(data); if (request > 0) { webEvent("search", { area: demandArea(filters.location) }); if (!data.items.length) webEvent("no_results", { area: demandArea(filters.location) }); } }
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters, request]);

  function load(location: string, budget: string, offset: number) {
    setLoading(true);
    setError(false);
    setPage(null);
    setRequest(value => value + 1);
    setFilters({ location, budget, offset });
  }

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    load(String(values.get("location") || "").trim(), String(values.get("budget") || ""), 0);
  }

  return (
    <section id="properties" className="container-px mx-auto max-w-7xl scroll-mt-24 py-8 sm:py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">DirectRent marketplace</p>
      <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Explore available homes</h2>
      <form aria-label="Search homes" onSubmit={search} className="my-6 grid gap-4 rounded-2xl border bg-slate-50 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="grid gap-1 text-sm font-semibold">Neighbourhood
          <input className="min-w-0 w-full rounded-lg border bg-white p-3" name="location" maxLength={100} placeholder="e.g. Kigamboni" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">Maximum monthly price (TZS)
          <input className="min-w-0 w-full rounded-lg border bg-white p-3" name="budget" type="number" min={0} step={1} placeholder="Any budget" />
        </label>
        <button className="rounded-lg bg-emerald-800 px-5 py-3 font-bold text-white">Search homes</button>
      </form>
      <div role="status" aria-live="polite" className="mb-4 text-slate-700">
        {loading ? "Loading homes…" : error ? "Homes could not be loaded. Try searching again." : !page?.items.length ? "No homes match this search." : `${page.items.length} ${page.items.length === 1 ? "home" : "homes"} on this page`}
      </div>
      {error && <button type="button" className="mb-5 rounded-lg border px-5 py-3 font-bold text-emerald-800" onClick={() => load(filters.location, filters.budget, filters.offset)}>Try again</button>}
      {!loading && !error && page?.items.length === 0 && <p className="mb-5 text-slate-600">Try a nearby neighbourhood or a higher budget. New homes appear after verification when they have availability.</p>}
      <div aria-busy={loading} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {page?.items.map(home => {
          const image = publicImage(home.image_url);
          return (
            <article key={home.id} className="overflow-hidden rounded-2xl border bg-white">
              <a href={`/properties/${home.id}`} aria-label={`View ${home.title}`} className="block"><PropertyPhoto src={image} title={home.title} /></a>
              <div className="p-5">
                <p className="text-sm font-bold text-emerald-800">Verified property</p>
                <h3 className="mt-1 text-xl font-bold"><a href={`/properties/${home.id}`} className="break-words hover:underline">{home.title}</a></h3>
                <p className="mt-1 text-slate-600">{[home.area, home.property_type, home.bedrooms == null ? null : `${home.bedrooms} ${home.bedrooms === 1 ? "bedroom" : "bedrooms"}`].filter(Boolean).join(" · ")}</p>
                <p className="mt-3 font-bold">TZS {new Intl.NumberFormat("en-TZ").format(home.monthly_price)} / month</p>
              <a href={`/properties/${home.id}`} className="mt-4 inline-flex min-h-11 items-center font-bold text-emerald-800 underline">View property →</a>
              </div>
            </article>
          );
        })}
      </div>
      {page && (
        <div className="mt-5 flex gap-5">
          {filters.offset > 0 && <button className="font-bold text-emerald-800" onClick={() => load(filters.location, filters.budget, Math.max(0, filters.offset - 12))}>Previous homes</button>}
          {page.next_offset !== null && <button className="font-bold text-emerald-800" onClick={() => load(filters.location, filters.budget, page.next_offset!)}>Next homes</button>}
        </div>
      )}
    </section>
  );
}
