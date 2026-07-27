import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        brand: "#2563EB",
        accent: "#10B981",
        success: "#22C55E"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(15, 23, 42, 0.12)",
        card: "0 12px 40px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
export default config;
