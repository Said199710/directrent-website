import { resolvePublicApi } from "./tools/public-preview-environment.mjs";

const api = resolvePublicApi();
const nextConfig = {
  env: { PUBLIC_API_URL: api, NEXT_PUBLIC_API_URL: api },
  images: { unoptimized: true },
};
export default nextConfig;
