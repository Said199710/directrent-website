"use client";
import { useState } from "react";
import { webEvent } from "@/lib/web-events";
import TrackedLink from "./TrackedLink";
export default function OpenPropertyApp({ id }: { id: number }) {
 const [status,setStatus]=useState("");
 const url=`/properties/${id}?open=app`;
 return <section className="my-6 rounded-xl border bg-slate-50 p-5"><h2 className="text-xl font-bold">Request a viewing in DirectRent</h2><p className="mt-2 text-slate-600">Use the same property in the app. Viewing approval is required before the exact location is shared.</p><div className="mt-4 flex flex-wrap gap-3"><a href={url} className="rounded-xl bg-emerald-800 px-5 py-3 font-bold text-white" onClick={event=>{
   webEvent('app_click',{target:'open_app',listing_id:id});
   if (/Android/i.test(navigator.userAgent)) {
     event.preventDefault();
     const fallback=new URL(`/properties/${id}`,window.location.origin).href;
     window.location.href=`intent://directrent.app/properties/${id}#Intent;scheme=https;package=com.example.directrent_app;S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
   } else {
     event.preventDefault();
     setStatus(/iPhone|iPad|iPod/i.test(navigator.userAgent)?'The iPhone app is not available for download yet. You can keep browsing this property here.':'Open this property’s shared link on an Android phone with a supported DirectRent build, or get the Android beta below.');
   }
 }}>Open in DirectRent</a><TrackedLink href={`/download?property=${id}`} target="download" listingId={id} className="rounded-xl border px-5 py-3 font-bold">Download options</TrackedLink></div><p role="status" className="mt-3 text-sm text-slate-600">{status}</p><p className="text-sm text-slate-600">Android beta available. Google Play and iPhone release links are not yet confirmed. Older beta builds may not support property links.</p></section>;
}
