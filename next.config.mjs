import { resolvePublicApi } from "./tools/public-preview-environment.mjs";
import { buildPublicPreview, needsAdapterBridge } from "./tools/cloudflare-public-preview-build.mjs";

export default async function nextConfig(phase) {
  const api = resolvePublicApi();
  // Pages currently invokes `npx next build` and publishes `out`. Only this
  // dedicated branch delegates to the adapter. Its child runs the normal Next
  // build with an explicit recursion guard. Main/admin source is unchanged.
  if (needsAdapterBridge(phase)) {
    await buildPublicPreview();
    // The child completed the full production build. Exit the outer CLI rather
    // than running a second build that would overwrite its generated worker.
    process.exit(0);
  }
  return { env: { PUBLIC_API_URL: api, NEXT_PUBLIC_API_URL: api }, images: { unoptimized: true } };
}
