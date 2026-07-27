export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-slate-950">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-5xl font-black">Terms of Service</h1>
        <p className="mt-6 text-slate-600">
          By using DirectRent, users agree to provide accurate information,
          respect platform rules and avoid fraudulent rental activities.
        </p>

        <div className="mt-10 space-y-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Platform Use</h2>
            <p className="mt-3">DirectRent connects tenants and landlords through verified rental workflows. Users remain responsible for lawful agreements and truthful information.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Verification</h2>
            <p className="mt-3">DirectRent may review landlord, tenant and property information to reduce fraud and increase trust.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Contact</h2>
            <p className="mt-3">For support, contact support@directrent.app.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
