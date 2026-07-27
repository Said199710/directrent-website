"use client";
import { motion } from "framer-motion";
import { BadgeCheck, MapPinned, ShieldCheck } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative mx-auto max-w-2xl">
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute -left-6 top-12 z-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
        <div className="flex items-center gap-3"><ShieldCheck className="text-accent"/><div><p className="text-xs font-bold text-slate-500">Verified</p><p className="font-black text-ink">Landlord KYC</p></div></div>
      </motion.div>
      <motion.div animate={{ y: [0, 14, 0] }} transition={{ repeat: Infinity, duration: 7 }} className="absolute -right-2 bottom-10 z-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-premium">
        <div className="flex items-center gap-3"><MapPinned className="text-brand"/><div><p className="text-xs font-bold text-slate-500">Directions</p><p className="font-black text-ink">Approved Viewing</p></div></div>
      </motion.div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-premium">
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-bold text-brand">DirectRent Dashboard</p><h3 className="text-2xl font-black text-ink">Vacancy Intelligence</h3></div><BadgeCheck className="text-accent"/></div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Verified Homes", "Viewing Requests", "Occupied Units"].map((x, i) => <div key={x} className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-bold text-slate-500">{x}</p><p className="mt-3 text-2xl font-black text-ink">{[128, 43, 87][i]}</p></div>)}
          </div>
          <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
            <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-50 via-emerald-50 to-white p-4">
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-300 text-center"><p className="font-black text-ink">Map + Property Discovery</p><p className="text-sm text-slate-500">Dar es Salaam rental hotspots</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mx-auto w-full max-w-[260px] rounded-[2.5rem] border-8 border-ink bg-white p-3 shadow-premium"><div className="h-[520px] rounded-[1.8rem] bg-slate-50 p-4"><div className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-slate-300"/><p className="text-sm font-bold text-brand">DirectRent</p><h3 className="mt-1 text-2xl font-black text-ink">{title}</h3><p className="mt-2 text-sm text-slate-500">{subtitle}</p><div className="mt-5 space-y-3">{["Verified apartment", "2 bedrooms", "TZS 450,000 / month", "Request viewing"].map((x, i) => <div key={x} className={`rounded-2xl p-4 ${i === 3 ? "bg-brand text-white" : "bg-white text-ink"}`}><p className="text-sm font-bold">{x}</p></div>)}</div></div></div>;
}
