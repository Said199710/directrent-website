"use client";
import AdminShell from '@/components/admin/AdminShell';
export default function Page(){return <AdminShell title="Your workspace"><p className="rounded-xl border border-white/10 bg-slate-900 p-6">Your account is authenticated. No operational permissions are currently assigned. Ask a super admin to assign a role, then reload this page.</p></AdminShell>}
