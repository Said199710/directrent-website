export default function CareersPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <section className="mx-auto max-w-5xl text-center">
        <p className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
          Careers
        </p>
        <h1 className="mt-8 text-5xl font-black md:text-7xl">
          Build the future of renting in Tanzania.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          DirectRent is building a trusted PropTech platform for tenants,
          landlords and property operators.
        </p>
        <a
          href="mailto:careers@directrent.app"
          className="mt-10 inline-flex rounded-full bg-blue-600 px-10 py-4 font-bold text-white"
        >
          careers@directrent.app
        </a>
      </section>
    </main>
  );
}
