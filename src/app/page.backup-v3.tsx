import { ArrowRight, CheckCircle2, Mail, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import { HeroMockup, PhoneMockup } from "@/components/Mockups";
import { Reveal } from "@/components/Motion";
import { features, footer, investorStats, landlordBenefits, problems, steps, tenantBenefits, testimonials, trust } from "@/lib/data";

export default function Home() {
  return (
    <main id="home" className="overflow-hidden bg-white">
      <Header />
      <section className="relative bg-gradient-to-b from-white via-blue-50/50 to-white pt-32">
        <div className="absolute inset-0 -z-0 bg-grid bg-[size:44px_44px] opacity-60" />
        <div className="container-px relative mx-auto grid max-w-7xl items-center gap-14 pb-20 pt-8 lg:grid-cols-[1.05fr_.95fr] lg:pb-28">
          <Reveal>
            <div>
              <span className="badge">Verified Connections. Transparent Renting.</span>
              <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl">Find Verified Rental Homes Directly From Landlords</h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">DirectRent helps tenants find trusted rental properties while helping landlords fill vacancies faster.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="/download" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-black text-white shadow-premium hover:bg-slate-800">Download App <ArrowRight size={18}/></a>
                <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 font-black text-ink shadow-sm hover:border-brand">Explore Properties</a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-center">
                {["No brokers", "Verified listings", "Direct landlords"].map((x) => <div key={x} className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-black text-slate-700 shadow-sm">{x}</div>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}><HeroMockup /></Reveal>
        </div>
      </section>

      <section id="about" className="section container-px mx-auto max-w-7xl">
        <Reveal><span className="badge">The problem</span><h2 className="h2 mt-6">Rental search in Tanzania needs trust, speed and transparency.</h2><p className="lead max-w-3xl">DirectRent is designed around the real pain points tenants and landlords face every day.</p></Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-5">{problems.map((p) => <Reveal key={p}><div className="card h-full"><CheckCircle2 className="mb-4 text-red-500"/><p className="font-black text-ink">{p}</p></div></Reveal>)}</div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-px mx-auto max-w-7xl">
          <Reveal><span className="badge">The solution</span><h2 className="h2 mt-6">A verified rental marketplace built for Tanzania.</h2><p className="lead max-w-3xl">DirectRent removes broker friction, improves property discovery and gives landlords digital tools to manage demand.</p></Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">{["Verified supply", "Direct communication", "Digital rental workflows"].map((x, i) => <Reveal key={x} delay={i*.05}><div className="card min-h-56"><div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand"><TrendingUp /></div><h3 className="text-2xl font-black text-ink">{x}</h3><p className="mt-4 leading-7 text-slate-600">Premium trust layer, mobile-first UX and landlord tools that make renting faster and safer.</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="section container-px mx-auto max-w-7xl">
        <Reveal><span className="badge">How it works</span><h2 className="h2 mt-6">From search to move-in in four simple steps.</h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-4">{steps.map((s, i) => <Reveal key={s}><div className="card"><div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-ink font-black text-white">{i+1}</div><h3 className="text-xl font-black text-ink">{s}</h3></div></Reveal>)}</div>
      </section>

      <section className="section bg-ink text-white">
        <div className="container-px mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <Audience title="For Tenants" items={tenantBenefits} />
          <Audience title="For Landlords" items={landlordBenefits} />
        </div>
      </section>

      <section className="section container-px mx-auto max-w-7xl">
        <Reveal><span className="badge">Trust & verification</span><h2 className="h2 mt-6">A safer renting layer for the market.</h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">{trust.map(({title, text, icon: Icon}) => <Reveal key={title}><div className="card h-full"><Icon className="mb-5 text-accent"/><h3 className="font-black text-ink">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></div></Reveal>)}</div>
      </section>

      <section id="features" className="section bg-slate-50">
        <div className="container-px mx-auto max-w-7xl">
          <Reveal><span className="badge">Platform features</span><h2 className="h2 mt-6">Built like a serious PropTech platform.</h2></Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{features.map(({title, text, icon: Icon}) => <Reveal key={title}><div className="card h-full"><Icon className="mb-5 text-brand"/><h3 className="text-lg font-black text-ink">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section id="app" className="section container-px mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]"><Reveal><div><span className="badge">App showcase</span><h2 className="h2 mt-6">Mobile-first experience for tenants and landlords.</h2><p className="lead">Realistic app flows for verified listing discovery, viewing approval and property management.</p></div></Reveal><div className="grid gap-8 md:grid-cols-2"><PhoneMockup title="Find homes" subtitle="Verified rental listings near you."/><PhoneMockup title="Manage units" subtitle="Landlord vacancy and tenant tools."/></div></div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-px mx-auto max-w-7xl"><Reveal><span className="badge">Testimonials</span><h2 className="h2 mt-6">Designed around real rental pain.</h2></Reveal><div className="mt-12 grid gap-6 lg:grid-cols-3">{testimonials.map((t) => <Reveal key={t.name}><div className="card"><p className="text-lg leading-8 text-slate-700">“{t.quote}”</p><div className="mt-6"><p className="font-black text-ink">{t.name}</p><p className="text-sm text-slate-500">{t.role}</p></div></div></Reveal>)}</div></div>
      </section>

      <section id="investors" className="section container-px mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-gradient-to-br from-ink via-slate-900 to-blue-950 p-8 text-white shadow-premium lg:p-12">
          <Reveal><span className="badge border-white/10 bg-white/10 text-white">Investor-ready opportunity</span><h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Positioned for Tanzania’s digital rental transformation.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">DirectRent targets broker-heavy rental workflows with verification, mobile adoption and landlord tooling.</p></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-4">{investorStats.map((s) => <div key={s.label} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur"><p className="text-sm text-slate-300">{s.label}</p><p className="mt-3 text-3xl font-black">{s.value}</p></div>)}</div>
        </div>
      </section>

      
<section id="download" className="px-6 py-24 bg-slate-950 text-white">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
    <div>
      <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold mb-6">
        Android APK
      </div>
      <h2 className="text-4xl md:text-6xl font-black tracking-tight">
        Download the latest DirectRent app.
      </h2>
      <p className="mt-6 text-lg text-slate-300 max-w-2xl">
        Get the latest Android build for testing verified rental discovery, viewing requests,
        landlord tools and tenant onboarding.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://downloads.directrent.app/directrent-latest.apk"
          download
          className="rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-lg hover:bg-blue-700 transition"
        >
          Download APK
        </a>
        <a
          href="#contact"
          className="rounded-full border border-white/20 px-8 py-4 font-bold text-white hover:bg-white/10 transition"
        >
          Request Support
        </a>
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Latest APK: downloads.directrent.app/directrent-latest.apk
      </p>
    </div>

    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
      <div className="rounded-[1.5rem] bg-white text-slate-950 p-8">
        <p className="text-sm font-bold text-blue-600">DirectRent Mobile</p>
        <h3 className="mt-2 text-3xl font-black">Testing build</h3>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-100 p-4 font-semibold">Verified listings</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-semibold">Viewing requests</div>
          <div className="rounded-2xl bg-slate-100 p-4 font-semibold">Landlord dashboard</div>
          <div className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">Updated APK available</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="contact" className="section bg-slate-50">
        <div className="container-px mx-auto max-w-5xl text-center"><Reveal><span className="badge">Contact</span><h2 className="h2 mt-6">Build trust with DirectRent.</h2><p className="lead mx-auto max-w-2xl">For users, investors, partners and support.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{["hello@directrent.app","support@directrent.app","investors@directrent.app","partnerships@directrent.app"].map((email) => <a key={email} href={`mailto:${email}`} className="rounded-2xl border border-slate-200 bg-white p-5 font-black text-ink shadow-sm hover:border-brand"><Mail className="mx-auto mb-2 text-brand"/>{email}</a>)}</div><a href="https://directrent.app" className="mt-8 inline-flex rounded-full bg-brand px-7 py-4 font-black text-white shadow-card">https://directrent.app</a></Reveal></div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10"><div className="container-px mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row"><p className="font-black text-ink">DirectRent <span className="font-medium text-slate-500">© 2026</span></p><div className="flex flex-wrap gap-5">{footer.map((f) => <a key={f} href="#home" className="text-sm font-semibold text-slate-500 hover:text-brand">{f}</a>)}</div></div></footer>
    </main>
  );
}

function Audience({ title, items }: { title: string; items: string[] }) {
  return <Reveal><div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur"><h2 className="text-3xl font-black">{title}</h2><div className="mt-8 space-y-4">{items.map((i) => <div key={i} className="flex items-center gap-3"><CheckCircle2 className="text-accent"/><span className="font-semibold text-slate-100">{i}</span></div>)}</div></div></Reveal>;
}
