export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

export class AdminApiError extends Error {
  constructor(message:string,public status:number){super(message);this.name='AdminApiError'}
}

export function isAccessDenial(error:unknown){
  return error instanceof AdminApiError && [401,403,404].includes(error.status);
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
    const detail = Array.isArray(body.detail) ? body.detail.map((x: {msg?:string})=>x.msg || 'Invalid field').join('; ') : body.detail;
    throw new AdminApiError(detail || `Request failed (${response.status})`,response.status);
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
