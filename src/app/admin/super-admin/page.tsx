"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/admin-api";

type Member = {
  id: number;
  name: string | null;
  email: string | null;
  mfa_enabled: boolean;
  role: string;
};

export default function SuperAdminPage() {
  const [team, setTeam] = useState<Member[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void adminApi<Member[]>("/admin-console/super-admin/team", { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) setTeam(result); })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "Could not load administrator accounts");
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <AdminShell title="Super Admin">
      {error && <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-300">{error}</p>}
      {!team && !error && <p role="status">Loading administrator accounts…</p>}
      {team && (
        <section aria-label="Administrator accounts">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Administrator accounts ({team.length})</h2>
            <Link className="rounded-lg border border-white/20 px-3 py-2 text-sm text-blue-300" href="/admin/audit-logs">
              Open audit logs
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {team.map(member => (
              <li key={member.id} className="min-w-0 rounded-xl border border-white/10 bg-slate-900 p-4">
                <h3 className="break-words font-semibold">{member.name || `Admin #${member.id}`}</h3>
                <p className="break-all text-sm text-slate-400">{member.email || "No email recorded"}</p>
                <p className="mt-2 text-sm">
                  {member.role} · {member.mfa_enabled ? "MFA enabled" : "MFA setup pending"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminShell>
  );
}
