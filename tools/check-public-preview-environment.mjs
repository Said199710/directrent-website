import assert from "node:assert/strict";
import { resolvePublicApi } from "./public-preview-environment.mjs";
const preview = { CF_PAGES_BRANCH: "staging/public-marketplace", NEXT_PUBLIC_API_URL: "https://api.directrent.app" };
assert.throws(() => resolvePublicApi(preview), /STAGING_PUBLIC_API_URL/);
for (const value of ["https://api.directrent.app", "http://localhost:8020", "https://127.0.0.1", "https://private.local", "https://example.invalid", "https://user:secret@example.com", "https://example.com/api", "https://example.com?key=1"]) {
  assert.throws(() => resolvePublicApi({ ...preview, STAGING_PUBLIC_API_URL: value }), /blocked/i);
}
assert.equal(resolvePublicApi({ ...preview, STAGING_PUBLIC_API_URL: "https://staging-api.example.com" }), "https://staging-api.example.com");
assert.equal(resolvePublicApi({ CF_PAGES_BRANCH: "staging/admin-refresh", NEXT_PUBLIC_API_URL: "https://api.directrent.app" }), "https://api.directrent.app");
assert.equal(resolvePublicApi({ CF_PAGES_BRANCH: "main" }), "https://api.directrent.app");
console.log("PASS: public preview rejects missing/production/local origins; explicit staging API selected; existing branch behavior preserved.");
