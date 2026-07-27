import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://directrent.app"),
  title: {
    default: "DirectRent | Verified Rental Homes Directly From Landlords in Tanzania",
    template: "%s | DirectRent",
  },
  description:
    "DirectRent is a Tanzanian PropTech platform connecting tenants directly with verified landlords through trusted listings, transparent pricing, viewing requests and digital rental workflows.",
  keywords: [
    "DirectRent",
    "DirectRent Tanzania",
    "rental homes Tanzania",
    "rent house Dar es Salaam",
    "verified rental homes",
    "landlords Tanzania",
    "tenants Tanzania",
    "PropTech Tanzania",
    "rental marketplace Tanzania",
    "broker-free renting",
  ],
  authors: [{ name: "DirectRent" }],
  creator: "DirectRent",
  publisher: "DirectRent",
  alternates: {
    canonical: "https://directrent.app",
  },
  openGraph: {
    title: "DirectRent — Verified Connections. Transparent Renting.",
    description:
      "Find verified rental homes directly from landlords in Tanzania. Built for safer, faster and more transparent renting.",
    url: "https://directrent.app",
    siteName: "DirectRent",
    type: "website",
    locale: "en_TZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "DirectRent | Verified Rental Homes in Tanzania",
    description:
      "A verified digital rental marketplace connecting tenants directly with landlords in Tanzania.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icons/directrent-app-icon.png",
    shortcut: "/icons/directrent-app-icon.png",
    apple: "/icons/directrent-app-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
