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
        display: [
          "var(--font-display)",
          "Cormorant Garamond",
          "EB Garamond",
          "Georgia",
          "serif",
        ],
        sans: [
          "Gill Sans",
          "Gill Sans MT",
          "Calibri",
          "sans-serif",
        ],
        admin: [
          "var(--font-admin)",
          "Hanken Grotesk",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        ink: "#000000",
        canvas: "#ffffff",
        muted: {
          DEFAULT: "#666666",
          foreground: "#1a1a1a",
        },
        surface: "#f8f8f8",
        border: "rgba(0,0,0,0.12)",
        "border-strong": "#000000",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      keyframes: {
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-in-left": "slide-in-left 0.25s ease-out",
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "0px",
        md: "0px",
        sm: "0px",
        none: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
