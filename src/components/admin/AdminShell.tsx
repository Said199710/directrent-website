"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarChart3, Users, Building2, ShieldCheck, Scale, CreditCard, Wallet, ScrollText, LogOut, Inbox, Menu, X } from "lucide-react";
import { adminApi, clearAdminToken, getAdminToken } from "@/lib/admin-api";

const links = [
  ["/admin", "Dashboard", BarChart3], ["/admin/users", "Users", Users],
  ["/admin/listings", "Properties", Building2], ["/admin/trust-center", "Trust Center", ShieldCheck],
  ["/admin/inbox", "Inbox", Inbox],
  ["/admin/disputes", "Disputes", Scale], ["/admin/payments", "Payments", CreditCard],
  ["/admin/withdrawals", "Withdrawals", Wallet],
] as const;

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [superAdmin, setSuperAdmin] = useState(false);
  useEffect(() => {
    if (!getAdminToken()) return;
    const controller = new AbortController();
    void adminApi<{ super_admin: boolean }>("/admin-console/capabilities", { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) setSuperAdmin(result.super_admin); })
      .catch(() => { if (!controller.signal.aborted) setSuperAdmin(false); });
    return () => controller.abort();
  }, []);
  const visibleLinks = superAdmin
    ? [...links, ["/admin/super-admin", "Super Admin", ShieldCheck] as const,
        ["/admin/audit-logs", "Audit Logs", ScrollText] as const]
    : links;
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    menu.current?.close();
  }, [pathname]);

  useEffect(() => {
    function closeOnDesktop() {
      if (menuButton.current && menuButton.current.getClientRects().length === 0) {
        menu.current?.close();
      }
    }
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  function logout() {
    menu.current?.close();
    clearAdminToken();
    router.push("/admin/login");
  }

  const navigation = (
    <>
      <nav aria-label="Admin navigation" className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {visibleLinks.map(([href, label, Icon]) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => menu.current?.close()}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={18} aria-hidden="true" />{label}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={logout} className="mt-4 flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <LogOut size={17} aria-hidden="true" />Secure logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-white/10 bg-slate-950/95 p-6 lg:flex">
        <div className="mb-9 flex shrink-0 items-center gap-3">
          <img src="/icons/directrent-app-icon.png" className="h-10 w-10 rounded-xl" alt="" />
          <div><b>DirectRent</b><p className="text-xs text-slate-400">Admin Command Center</p></div>
        </div>
        {navigation}
      </aside>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          #admin-mobile-menu[open] { animation: admin-menu-enter 180ms ease-out; }
          @keyframes admin-menu-enter {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        }
      `}</style>
      <dialog
        ref={menu}
        id="admin-mobile-menu"
        aria-labelledby="admin-mobile-menu-title"
        className="fixed inset-y-0 left-0 right-auto m-0 h-full max-h-none w-72 max-w-[85vw] overflow-hidden bg-slate-950 p-0 text-slate-100 backdrop:bg-black/60"
        onClick={event => { if (event.target === event.currentTarget) menu.current?.close(); }}
      >
        <div className="flex h-full min-h-0 flex-col border-r border-white/10 p-4">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-2">
            <h2 id="admin-mobile-menu-title" className="font-semibold">Admin Command Center</h2>
            <button type="button" aria-label="Close menu" className="rounded-lg p-3 hover:bg-white/10" onClick={() => menu.current?.close()}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          {navigation}
        </div>
      </dialog>

      <main className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-slate-950/85 px-5 py-5 backdrop-blur lg:px-9">
          <button
            ref={menuButton}
            type="button"
            aria-haspopup="dialog"
            aria-controls="admin-mobile-menu"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-sm lg:hidden"
            onClick={() => menu.current?.showModal()}
          >
            <Menu size={20} aria-hidden="true" />Menu
          </button>
          <h1 className="min-w-0 break-words text-xl font-bold">{title}</h1>
        </header>
        <div className="p-5 lg:p-9">{children}</div>
      </main>
    </div>
  );
}
