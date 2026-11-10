import assert from "node:assert/strict";
import { needsAdapterBridge } from "./cloudflare-public-preview-build.mjs";
const env = { CF_PAGES: "1", CF_PAGES_BRANCH: "staging/public-marketplace" };
assert.equal(needsAdapterBridge("phase-production-build", env), true);
assert.equal(needsAdapterBridge("phase-production-build", { ...env, DIRECTRENT_ADAPTER_INNER_BUILD: "1" }), false);
for (const branch of ["main", "staging/admin-refresh", "other"]) assert.equal(needsAdapterBridge("phase-production-build", { ...env, CF_PAGES_BRANCH: branch }), false);
assert.equal(needsAdapterBridge("phase-development-server", env), false);
assert.equal(needsAdapterBridge("phase-production-build", { CF_PAGES_BRANCH: env.CF_PAGES_BRANCH }), false);
console.log("PASS: bridge runs only for the public GitHub Preview production-build phase; recursion/main/admin/dev cases excluded.");
