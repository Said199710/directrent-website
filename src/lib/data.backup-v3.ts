import { BadgeCheck, Building2, ChartNoAxesCombined, Compass, KeyRound, LandPlot, LockKeyhole, MapPinned, MessagesSquare, Search, ShieldCheck, Smartphone, UserCheck, UsersRound } from "lucide-react";

export const nav = ["Home", "About", "Features", "Investors", "Contact"];
export const problems = ["Broker fraud and duplicated listings", "Fake properties and edited photos", "Hidden fees before viewing", "No trusted landlord identity", "Wasted time moving around the city"];
export const steps = ["Search Verified Properties", "Request Viewing", "Connect Directly With Landlord", "Move In"];
export const tenantBenefits = ["Verified listings", "Real photos", "Transparent pricing", "Directions to properties", "Safer renting experience"];
export const landlordBenefits = ["Faster occupancy", "Better tenant discovery", "Vacancy management", "Digital tenant onboarding", "Rental tracking"];
export const trust = [
  { title: "Property Verification", icon: Building2, text: "Listings are reviewed to reduce fake and misleading properties." },
  { title: "Landlord Verification", icon: UserCheck, text: "Landlord profiles can be verified before tenant engagement." },
  { title: "KYC Process", icon: BadgeCheck, text: "Identity checks support safer rental interactions." },
  { title: "Secure Communication", icon: LockKeyhole, text: "Controlled contact flows protect both tenants and landlords." },
  { title: "Fraud Prevention", icon: ShieldCheck, text: "Verification badges and review processes increase trust." }
];
export const features = [
  { title: "Smart Search", icon: Search, text: "Filter by price, location, bedrooms and property type." },
  { title: "Property Maps", icon: MapPinned, text: "Explore nearby homes and get directions after approval." },
  { title: "Viewing Requests", icon: Compass, text: "Request and manage viewings digitally." },
  { title: "Tenant Onboarding", icon: UsersRound, text: "Invite and onboard existing or new tenants." },
  { title: "Rental Management", icon: KeyRound, text: "Track occupancy, units and rental status." },
  { title: "Verification Badges", icon: BadgeCheck, text: "Show verified properties and trusted landlords." },
  { title: "Analytics", icon: ChartNoAxesCombined, text: "Understand occupancy, demand and listings performance." },
  { title: "Mobile Access", icon: Smartphone, text: "Built for tenants and landlords on mobile-first workflows." }
];
export const testimonials = [
  { name: "Asha M.", role: "Tenant, Kigamboni", quote: "DirectRent makes the process feel safer. I can see verified homes and understand prices before moving around." },
  { name: "Mr. Joseph K.", role: "Landlord, Dar es Salaam", quote: "The platform helps me organize vacant units and receive serious viewing requests faster." },
  { name: "Neema R.", role: "Young professional", quote: "The direct landlord connection is exactly what renters in Tanzania need." }
];
export const investorStats = [
  { label: "Urban rental demand", value: "Rising" },
  { label: "Broker friction", value: "High" },
  { label: "Mobile adoption", value: "Growing" },
  { label: "Market focus", value: "Tanzania" }
];
export const footer = ["Home", "About", "Privacy Policy", "Terms of Service", "Contact", "Careers", "Partnerships"];
