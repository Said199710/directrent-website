import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/images/directrent-logo.png"
            alt="DirectRent logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />
          <span className="text-xl font-black text-slate-950">DirectRent</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
          <a href="/">Home</a>
          <a href="/#about">About</a>
          <a href="/#features">Features</a>
          <a href="/#investors">Investors</a>
          <a href="/download">Download</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/download"
            className="hidden rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-50 md:inline-flex"
          >
            Download App
          </a>
          <a
            href="/#contact"
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
