import { publicApi, type PublicListing } from "@/lib/public-listings";
export const runtime = "edge";
export const dynamic = "force-dynamic";
export async function GET() {
  const urls = ["/", "/download", "/privacy", "/terms", "/careers", "/partnerships"];
  let offset: number | null = 0;
  while (offset !== null) {
    const response = await fetch(`${publicApi}/listings/public-web?offset=${offset}`, { cache: "no-store" });
    if (!response.ok) return new Response("Catalogue unavailable", { status: 503 });
    const page: { items: PublicListing[]; next_offset: number | null } = await response.json();
    for (const home of page.items) urls.push(`/properties/${home.id}`);
    if (page.next_offset !== null && page.next_offset <= offset) return new Response("Invalid pagination", { status: 503 });
    offset = page.next_offset;
  }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>https://directrent.app${path}</loc></url>`).join("")}</urlset>`, { headers: { "Content-Type": "application/xml", "Cache-Control": "no-store" } });
}
