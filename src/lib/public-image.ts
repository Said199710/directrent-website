import { publicApi } from "./public-listings";
export function publicImage(value: string | null): string | null {
  if (!value) return null;
  try {
    const image = new URL(value, publicApi);
    if (image.origin === new URL(publicApi).origin && image.pathname.startsWith("/uploads/")) return image.href;
    if (image.protocol === "https:" && image.hostname === "res.cloudinary.com") return image.href;
  } catch { return null; }
  return null;
}
