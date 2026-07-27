export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-slate-950">
      <section className="mx-auto max-w-5xl text-center">
        <p className="inline-flex rounded-full border px-5 py-2 text-sm font-bold text-blue-600">
          Partnerships
        </p>
        <h1 className="mt-8 text-5xl font-black md:text-7xl">
          Partner with DirectRent.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          We work with landlords, property managers, developers, verification
          partners, financial institutions and ecosystem partners.
        </p>
        <a
          href="mailto:partnerships@directrent.app"
          className="mt-10 inline-flex rounded-full bg-blue-600 px-10 py-4 font-bold text-white"
        >
          partnerships@directrent.app
        </a>
      </section>
    </main>
  );
}
