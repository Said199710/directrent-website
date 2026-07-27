export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.directrent.app";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("directrent_admin_token");
}

export function setAdminToken(token: string) {
  sessionStorage.setItem("directrent_admin_token", token);
}

export function clearAdminToken() {
  sessionStorage.removeItem("directrent_admin_token");
}

export async function adminApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${response.status})`);
  }
  return response.json();
}


export function resolveApiFileUrl(fileUrl?: string | null) {
  if (!fileUrl) return "";
  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://") ||
    fileUrl.startsWith("data:")
  ) {
    return fileUrl;
  }

  return `${API_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
}
