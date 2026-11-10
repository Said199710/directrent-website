const productionHosts = new Set(["directrent.app", "www.directrent.app", "admin.directrent.app", "api.directrent.app", "directrent.pages.dev"]);

export function resolvePublicApi(environment = process.env) {
  const branch = environment.CF_PAGES_BRANCH || "";
  const staging = branch.startsWith("staging/public-marketplace") || environment.DIRECTRENT_REQUIRE_STAGING_API === "1";
  if (!staging) return environment.PUBLIC_API_URL || environment.NEXT_PUBLIC_API_URL || "https://api.directrent.app";
  const value = environment.STAGING_PUBLIC_API_URL;
  if (!value) throw new Error("Public preview blocked: STAGING_PUBLIC_API_URL must name the confirmed isolated staging API; production/local fallback is disabled.");
  let url;
  try { url = new URL(value); } catch { throw new Error("Public preview blocked: invalid staging API origin."); }
  const host = url.hostname.toLowerCase();
  const local = host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".test") || host.endsWith(".invalid") || host.includes(":") || host.includes("[") || /^\d+(?:\.\d+){3}$/.test(host);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/" || url.port || local || productionHosts.has(host)) {
    throw new Error("Public preview blocked: use a credential-free, non-production HTTPS staging API origin without a path, query or port.");
  }
  return url.origin;
}
