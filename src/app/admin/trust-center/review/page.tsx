"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/admin-api";
import PrivateKYCDocument from "@/components/admin/PrivateKYCDocument";

function Field({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-slate-200">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : String(value)}
      </p>
    </div>
  );
}

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const kind = searchParams.get("kind") || "";
  const userId = searchParams.get("userId") || "";

  const [data, setData] = useState<any>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!["tenant", "landlord"].includes(kind) || !/^\d+$/.test(userId)) {
      setError("KYC type or user ID is missing.");
      return;
    }

    try {
      setError("");

      const result = await adminApi<any>(
        `/admin-console/kyc/${kind}/${userId}`,
      );

      setData(result);
      setNote(result.application?.review_notes || "");
    } catch (err: any) {
      setError(err?.message || "Failed to load KYC application.");
    }
  }

  useEffect(() => {
    void load();
  }, [kind, userId]);

  async function decide(status: string) {
    if (status !== "approved" && !note.trim()) {
      setError("Review note is required for changes or rejection.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm KYC decision: ${status.replaceAll("_", " ")}?`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      await adminApi(
        `/admin-console/kyc/${kind}/${userId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            note: note.trim(),
          }),
        },
      );

      await load();
      window.alert("KYC decision saved successfully.");
    } catch (err: any) {
      setError(err?.message || "Failed to save KYC decision.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !data) {
    return (
      <AdminShell title="KYC Review">
        <button
          onClick={() => router.push("/admin/trust-center")}
          className="mb-5 text-sm font-semibold text-blue-400"
        >
          ← Back to Trust Center
        </button>

        <p className="rounded-xl bg-red-500/10 p-4 text-red-300">
          {error}
        </p>
      </AdminShell>
    );
  }

  if (!data) {
    return (
      <AdminShell title="KYC Review">
        <p className="text-slate-400">Loading application...</p>
      </AdminShell>
    );
  }

  const user = data.user;
  const application = data.application;
  const documents = data.documents || [];
  const trust = data.trust;

  return (
    <AdminShell title="KYC Application Review">
      <button
        onClick={() => router.push("/admin/trust-center")}
        className="mb-5 text-sm font-semibold text-blue-400 hover:text-blue-300"
      >
        ← Back to Trust Center
      </button>

      {error && (
        <p className="mb-5 rounded-xl bg-red-500/10 p-4 text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 xl:col-span-2">
          <h2 className="text-xl font-bold">Applicant profile</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={user.full_name} />
            <Field label="Role" value={user.role} />
            <Field label="Email" value={user.email} />
            <Field label="Phone number" value={user.phone_number} />

            <Field
              label="Email verified"
              value={user.email_verified ? "Yes" : "No"}
            />

            <Field
              label="Phone verified"
              value={user.phone_verified ? "Yes" : "No"}
            />

            <Field
              label="Identity verified"
              value={user.identity_verified ? "Yes" : "No"}
            />

            <Field
              label="Joined"
              value={
                user.joined_at
                  ? new Date(user.joined_at).toLocaleString()
                  : null
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Risk summary</h2>

          <div className="mt-5 space-y-4">
            <Field label="Trust score" value={`${trust.score}/100`} />
            <Field label="Risk level" value={trust.risk_level} />
            <Field
              label="Documents submitted"
              value={trust.documents_submitted}
            />
            <Field label="Application status" value={application.status} />
            <Field label="KYC type" value={application.type} />
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Submitted evidence</h2>

        <p className="mt-2 text-sm text-slate-400">
          Review every submitted document before making a decision.
        </p>

        {documents.length === 0 ? (
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-200">
            No KYC documents were found. Approval has been disabled.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((document: any) => (
              <PrivateKYCDocument key={document.id} document={document} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Admin decision</h2>

        <label className="mt-5 block text-sm font-semibold text-slate-300">
          Review notes
        </label>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Explain the verification decision..."
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-4 outline-none focus:border-blue-500"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            disabled={saving || documents.length === 0}
            onClick={() => decide("approved")}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Approve KYC
          </button>

          <button
            disabled={saving}
            onClick={() => decide("reupload_required")}
            className="rounded-xl bg-amber-600 px-5 py-3 font-bold text-white hover:bg-amber-500 disabled:opacity-40"
          >
            Request changes
          </button>

          <button
            disabled={saving}
            onClick={() => decide("rejected")}
            className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-40"
          >
            Reject application
          </button>
        </div>
      </section>
    </AdminShell>
  );
}

export default function KYCReviewPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="KYC Review">
          <p className="text-slate-400">Loading application...</p>
        </AdminShell>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
