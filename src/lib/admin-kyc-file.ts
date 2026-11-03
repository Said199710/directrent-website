import { API_URL, getAdminToken } from "./admin-api";

export async function getAdminKYCDocument(
  documentId: string,
  signal: AbortSignal,
): Promise<Blob> {
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(documentId)) {
    throw new Error("Invalid document ID.");
  }
  const token = getAdminToken();
  if (!token) throw new Error("Sign in with your admin verification code again.");
  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/admin-console/kyc-documents/${encodeURIComponent(documentId)}/file`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      signal,
    },
  );
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Your admin session cannot open this file. Sign in again.");
    }
    throw new Error(`Unable to open document (${response.status}).`);
  }
  return response.blob();
}
