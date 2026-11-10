import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyPhoto from "@/components/PropertyPhoto";
import PropertyCommunity from "@/components/PropertyCommunity";
import OpenPropertyApp from "@/components/OpenPropertyApp";
import Header from "@/components/Header";
import { publicImage } from "@/lib/public-image";
import { publicListing } from "@/lib/public-listings";
export const runtime = "edge";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const home = await publicListing(id);
  if (!home) return { title: "Property unavailable | DirectRent", robots: { index: false } };
  const title = `${home.title} | DirectRent`;
  const description = `Rent ${home.title}${home.area ? ` in ${home.area}` : ""} for TZS ${home.monthly_price.toLocaleString("en-TZ")} per month. Explore this verified property with DirectRent.`;
  const url = `https://directrent.app/properties/${home.id}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website" }, twitter: { card: "summary", title, description } };
}
export default async function Property({ params }: Props) {
  const home = await publicListing((await params).id);
  if (!home) notFound();
  return <><Header /><main className="container-px mx-auto max-w-4xl py-10"><a href="/#properties" className="font-bold text-emerald-800">← Explore homes</a><p className="mt-10 font-bold text-emerald-800">Verified property</p><h1 className="mt-3 text-4xl font-black">{home.title}</h1><p className="mt-3 text-slate-600">{[home.area, home.property_type, home.bedrooms == null ? null : `${home.bedrooms} ${home.bedrooms === 1 ? "bedroom" : "bedrooms"}`].filter(Boolean).join(" · ")}</p><p className="my-6 text-2xl font-bold">TZS {home.monthly_price.toLocaleString("en-TZ")} / month</p><OpenPropertyApp id={home.id} /><div className="my-6 overflow-hidden rounded-2xl"><PropertyPhoto src={publicImage(home.image_url)} title={home.title} /></div><p>Exact location is shared through the app’s viewing approval process.</p><PropertyCommunity id={home.id} /></main></>;
}
