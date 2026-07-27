"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import AdminTable from "@/components/admin/AdminTable";
import { adminApi } from "@/lib/admin-api";

export default function TrustCenterPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void adminApi<any[]>("/admin-console/kyc")
      .then(setRows)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <AdminShell title="Trust Center">
      {error && (
        <p className="mb-5 rounded-xl bg-red-500/10 p-4 text-red-300">
          {error}
        </p>
      )}

      <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-5">
        <h2 className="font-bold">KYC applications</h2>
        <p className="mt-2 text-sm text-slate-400">
          Open an application and review all submitted evidence before making
          a decision.
        </p>
      </div>

      <AdminTable
        columns={[
          { key: "user_id", label: "User" },
          { key: "type", label: "KYC Type" },
          { key: "status", label: "Status" },
          { key: "level", label: "Level" },
          { key: "created_at", label: "Submitted" },
        ]}
        rows={rows}
        renderActions={(row) => (
          <Link
            href={`/admin/trust-center/review?kind=${encodeURIComponent(row.type)}&userId=${encodeURIComponent(row.user_id)}`}
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
          >
            Review application
          </Link>
        )}
      />
    </AdminShell>
  );
}
