import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-admin",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
