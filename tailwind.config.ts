import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-lora)", "Georgia", "serif"],
        ui: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        muted: {
          DEFAULT: "#757575",
          foreground: "#1a1a1a",
        },
        surface: "#f5f5f5",
        border: "rgba(0,0,0,0.16)",
        "border-strong": "rgba(0,0,0,0.28)",
      },
      borderRadius: {
        DEFAULT: "12px",
        lg: "12px",
        md: "12px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
