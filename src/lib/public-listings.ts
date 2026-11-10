export const publicApi = (process.env.PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.directrent.app").replace(/\/+$/, "");
export type PublicListing = { id: number; title: string; area: string | null; monthly_price: number; bedrooms: number | null; property_type: string | null; image_url: string | null };
export async function publicListing(id: string): Promise<PublicListing | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const response = await fetch(`${publicApi}/listings/public-web/${id}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Property service unavailable");
  return response.json();
}
