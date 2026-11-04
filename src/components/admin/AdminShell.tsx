"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Users, Building2, ShieldCheck, Scale, CreditCard, Wallet, ScrollText, LogOut, Inbox } from "lucide-react";
import { clearAdminToken } from "@/lib/admin-api";

const links = [
  ["/admin", "Dashboard", BarChart3], ["/admin/users", "Users", Users],
  ["/admin/listings", "Properties", Building2], ["/admin/trust-center", "Trust Center", ShieldCheck],
  ["/admin/inbox", "Inbox", Inbox],
  ["/admin/disputes", "Disputes", Scale], ["/admin/payments", "Payments", CreditCard],
  ["/admin/withdrawals", "Withdrawals", Wallet], ["/admin/audit-logs", "Audit Logs", ScrollText],
] as const;

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname(); const router = useRouter();
  return <div className="min-h-screen bg-slate-950 text-slate-100">
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/95 p-6 lg:block">
      <div className="mb-9 flex items-center gap-3"><img src="/icons/directrent-app-icon.png" className="h-10 w-10 rounded-xl" alt=""/><div><b>DirectRent</b><p className="text-xs text-slate-400">Admin Command Center</p></div></div>
      <nav className="space-y-1">{links.map(([href,label,Icon]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${pathname===href ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18}/>{label}</Link>)}</nav>
      <button onClick={()=>{clearAdminToken();router.push('/admin/login')}} className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"><LogOut size={17}/>Secure logout</button>
    </aside>
    <main className="lg:pl-72"><header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 px-5 py-5 backdrop-blur lg:px-9"><div className="flex items-center justify-between gap-3"><h1 className="text-xl font-bold">{title}</h1><Link href="/admin/inbox" className="text-sm text-blue-300 lg:hidden">Inbox</Link></div></header><div className="p-5 lg:p-9">{children}</div></main>
  </div>
}
