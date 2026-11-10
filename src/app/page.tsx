import { ArrowRight, CheckCircle2, Mail, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import RentalCatalog from "@/components/RentalCatalog";
import { PhoneMockup } from "@/components/Mockups";
import { Reveal } from "@/components/Motion";
import { features, footer, investorStats, landlordBenefits, problems, steps, tenantBenefits, trust } from "@/lib/data";

export default function Home() {
  return (
    <main id="home" className="overflow-hidden bg-white">
      <Header />
      <section className="bg-slate-950 text-white">
        <div className="container-px mx-auto max-w-7xl py-6 sm:py-10">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">Verified rentals in Tanzania</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-6xl">Find a place to call home.</h1>
          <p className="mt-3 max-w-xl text-base text-slate-300 sm:text-lg">Browse available homes by neighbourhood and monthly budget. Connect with landlords through DirectRent.</p>
          <a href="#properties" className="mt-4 inline-block rounded-xl bg-emerald-300 px-5 py-3 font-bold text-slate-950">Find a home</a>
        </div>
      </section>
      <RentalCatalog />

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

      <section id="landlords" className="section scroll-mt-24 bg-ink text-white">
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
        APK hosted securely on Cloudflare R2: downloads.directrent.app
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


<section id="company" className="section bg-white">
  <div className="container-px mx-auto max-w-7xl">
    <Reveal>
      <span className="badge">Built in Tanzania</span>
      <h2 className="h2 mt-6">A PropTech company focused on trust, verification and direct renting.</h2>
      <p className="lead max-w-3xl">
        DirectRent is being built to modernize rental discovery in Tanzania by reducing broker dependency,
        improving listing quality and giving landlords better digital tools.
      </p>
    </Reveal>

    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {[
        ["Mission", "Make renting safer, faster and more transparent for tenants and landlords."],
        ["Market focus", "Starting with Tanzania’s urban rental markets, with Dar es Salaam as the first growth engine."],
        ["Product vision", "A verified rental marketplace with search, maps, viewing requests, onboarding and management tools."]
      ].map(([title, text]) => (
        <Reveal key={title}>
          <div className="card h-full">
            <h3 className="text-2xl font-black text-ink">{title}</h3>
            <p className="mt-4 leading-7 text-slate-600">{text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>

<section className="section bg-slate-950 text-white">
  <div className="container-px mx-auto max-w-7xl">
    <Reveal>
      <span className="badge border-white/10 bg-white/10 text-white">Roadmap</span>
      <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
        From beta testing to verified rental infrastructure.
      </h2>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        DirectRent is progressing through a practical rollout path: beta APK testing,
        verified listings, landlord onboarding, KYC, payments and scalable market expansion.
      </p>
    </Reveal>

    <div className="mt-12 grid gap-5 md:grid-cols-4">
      {[
        ["01", "Beta Website & APK", "Live website, APK distribution and early user testing."],
        ["02", "Verification Layer", "Landlord, property and tenant verification workflows."],
        ["03", "Rental Operations", "Viewing requests, tenant onboarding, rent tracking and vacancy tools."],
        ["04", "Scale & Partnerships", "Expansion through landlords, property managers, investors and institutions."]
      ].map(([no, title, text]) => (
        <Reveal key={title}>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-black text-emerald-300">{no}</p>
            <h3 className="mt-4 text-xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>


      <section id="founder" className="section bg-white">
        <div className="container-px mx-auto max-w-7xl">
          <Reveal>
            <span className="badge">Founder</span>
            <h2 className="h2 mt-6">Built by a Tanzanian solving a real rental problem.</h2>
            <p className="lead max-w-3xl">
              DirectRent was founded by Said Msham Mbonde, a Computer Engineering student and technology builder focused on creating a trusted digital rental marketplace for Tanzania.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr]">
            <Reveal>
              <div className="card text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 text-4xl font-black text-blue-700">SM</div>
                <h3 className="mt-6 text-2xl font-black text-ink">Said Msham Mbonde</h3>
                <p className="mt-2 text-slate-600">Founder & Lead Developer</p>
                <p className="mt-4 text-sm text-slate-500">
                  BSc Computer Engineering & Information Technology<br />
                  United African University of Tanzania (UAUT)
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="card">
                <h3 className="text-2xl font-black text-ink">Why DirectRent?</h3>
                <p className="mt-5 leading-8 text-slate-600">
                  DirectRent was created to connect tenants and landlords directly through verified listings, transparent rental workflows and modern property technology.
                </p>
                <p className="mt-5 leading-8 text-slate-600">
                  The vision is to become trusted digital rental infrastructure for Tanzania.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

<section id="contact" className="section bg-slate-50">
        <div className="container-px mx-auto max-w-5xl text-center"><Reveal><span className="badge">Contact</span><h2 className="h2 mt-6">Build trust with DirectRent.</h2><p className="lead mx-auto max-w-2xl">For users, investors, partners and support.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{["hello@directrent.app","support@directrent.app","investors@directrent.app","partnerships@directrent.app"].map((email) => <a key={email} href={`mailto:${email}`} className="rounded-2xl border border-slate-200 bg-white p-5 font-black text-ink shadow-sm hover:border-brand"><Mail className="mx-auto mb-2 text-brand"/>{email}</a>)}</div><a href="https://directrent.app" className="mt-8 inline-flex rounded-full bg-brand px-7 py-4 font-black text-white shadow-card">https://directrent.app</a></Reveal></div>
      </section>

      
    </main>
  );
}

function Audience({ title, items }: { title: string; items: string[] }) {
  return <Reveal><div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur"><h2 className="text-3xl font-black">{title}</h2><div className="mt-8 space-y-4">{items.map((i) => <div key={i} className="flex items-center gap-3"><CheckCircle2 className="text-accent"/><span className="font-semibold text-slate-100">{i}</span></div>)}</div></div></Reveal>;
}
