import TrackedLink from "@/components/TrackedLink";
export default function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-black">DirectRent</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Verified Connections. Transparent Renting.
          </p>
          <p className="mt-4 text-sm text-slate-500">https://directrent.app</p>
        </div>

        <div>
          <h4 className="font-black">Platform</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a className="block hover:text-white" href="/">Home</a>
            <a className="block hover:text-white" href="/feedback">Give feedback</a>
            <a className="block hover:text-white" href="/#features">Features</a>
            <TrackedLink target="download" className="block hover:text-white" href="/download">Download App</TrackedLink>
            <a className="block hover:text-white" href="/#investors">Investors</a>
          </div>
        </div>

        <div>
          <h4 className="font-black">Company</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a className="block hover:text-white" href="/careers">Careers</a>
            <a className="block hover:text-white" href="/partnerships">Partnerships</a>
            <a className="block hover:text-white" href="/#contact">Contact</a>
          </div>
        </div>

        <div>
          <h4 className="font-black">Legal</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a className="block hover:text-white" href="/privacy">Privacy Policy</a>
            <a className="block hover:text-white" href="/terms">Terms of Service</a>
            <a className="block hover:text-white" href="mailto:support@directrent.app">Support</a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        © 2026 DirectRent. All rights reserved.
      </div>
    </footer>
  );
}
