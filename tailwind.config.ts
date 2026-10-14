import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        signal: "0 8px 20px -8px var(--signal-shadow)",
        "signal-sm": "0 4px 12px -4px var(--signal-shadow)",
      },
    },
  },
  plugins: [],
};
export default config;