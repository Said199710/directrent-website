"use client";
import { webEvent } from "@/lib/web-events";
export default function TrackedLink({ href, target, listingId=0, className, children }: { href: string; target: "download" | "open_app" | "android_beta" | "google_play" | "apple_store"; listingId?: number; className?: string; children: React.ReactNode }) {
 return <a href={href} className={className} onClick={()=>webEvent(target==='google_play'||target==='apple_store'?'store_click':'app_click',{target,listing_id:listingId})}>{children}</a>;
}
