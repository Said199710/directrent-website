// Public signing metadata only. Never trust a local debug certificate by default.
export const dynamic = "force-static";
export function GET() {
  const fingerprints = (process.env.ANDROID_APP_SHA256_FINGERPRINTS || "").split(",").map(value => value.trim().toUpperCase()).filter(Boolean);
  if (fingerprints.some(value => !/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(value))) throw new Error("Invalid Android signing SHA-256 fingerprint");
  return Response.json(fingerprints.length ? [{ relation: ["delegate_permission/common.handle_all_urls"], target: { namespace: "android_app", package_name: "com.example.directrent_app", sha256_cert_fingerprints: fingerprints } }] : []);
}
