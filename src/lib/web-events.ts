const api = (process.env.NEXT_PUBLIC_API_URL || "https://api.directrent.app").replace(/\/+$/, "");
export function demandArea(value: string) {
  const area = value.trim().toLowerCase();
  return ["kigamboni", "kinondoni", "ilala", "ubungo", "temeke"].includes(area) ? area : area ? "other" : "all";
}
export function webEvent(event: "search" | "no_results" | "property_view" | "app_click" | "store_click", fields: { area?: string; listing_id?: number; target?: string } = {}) {
  void fetch(`${api}/web/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, ...fields }), credentials: "omit", keepalive: true }).catch(() => {});
}
export async function webRequest(path: string, body?: unknown) {
  const response = await fetch(`${api}/web${path}`, { method: body ? "POST" : "GET", headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, cache: "no-store", credentials: "omit" });
  if (!response.ok) throw new Error(response.status === 429 ? "Too many submissions. Please wait a minute." : "Unable to submit. Check your message and try again.");
  return response.json();
}
