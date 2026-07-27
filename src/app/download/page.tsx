const apkUrl = "https://downloads.directrent.app/directrent-latest.apk";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-slate-950">
      <section className="mx-auto max-w-5xl text-center">
        <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-600">
          DirectRent Android APK
        </p>

        <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
          Download DirectRent App
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Install the latest Android testing build for verified property discovery,
          viewing requests, landlord tools, tenant onboarding and rental management.
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-left shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Latest Android Build</h2>
              <p className="mt-2 text-slate-600">Version: DirectRent Beta</p>
              <p className="text-slate-600">Platform: Android APK</p>
              <p className="text-slate-600">File size: about 56 MB</p>
            </div>

            <a
              href={apkUrl}
              className="inline-flex justify-center rounded-full bg-blue-600 px-8 py-4 text-center font-bold text-white hover:bg-blue-700"
            >
              Download APK
            </a>
          </div>

          <div className="mt-8 rounded-3xl bg-white p-6">
            <h3 className="font-black">Release notes</h3>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Verified property discovery and listing browsing.</li>
              <li>• Viewing request workflow for tenants.</li>
              <li>• Landlord listing and vacancy management tools.</li>
              <li>• Tenant onboarding foundation for rental tracking.</li>
            </ul>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            This APK is provided for DirectRent testing before Play Store release.
            Android may ask you to allow installation from your browser or file manager.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 text-left">
          <h3 className="text-xl font-black">iPhone users</h3>
          <p className="mt-3 text-slate-600">
            iOS support will be prepared later through Apple App Store or approved TestFlight distribution.
          </p>
        </div>
      </section>
    </main>
  );
}
