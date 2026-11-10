export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-slate-950">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-5xl font-black">Privacy Policy</h1>
        <p className="mt-6 text-slate-600">
          DirectRent protects user privacy by collecting only information required
          to support verified rental discovery, landlord communication, viewing
          requests, tenant onboarding and fraud prevention.
        </p>

        <div className="mt-10 space-y-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Information We Collect</h2>
            <p className="mt-3">We may collect name, phone number, email, role, property details, verification documents, viewing requests and app usage data.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">How We Use Data</h2>
            <p className="mt-3">We use data to verify listings, improve safety, connect tenants with landlords, manage requests and improve the DirectRent platform.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Website feedback, comments and statistics</h2>
            <p className="mt-3">Website feedback is private to authorized administrators. Property comments are reviewed before they become public. Please do not include contact details or exact addresses in comments. We count searches by a fixed neighbourhood category, no-result searches, property views and download or store clicks. Analytics events do not contain raw search text, contact details or precise locations. Clicks do not confirm app installs. Short-lived, hashed network identifiers help limit spam and are separate from usage counts.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Contact</h2>
            <p className="mt-3">For privacy requests, contact support@directrent.app.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
