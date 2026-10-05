import type { Metadata } from "next";
import { playfair, lora, inter } from "@/styles/fonts";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kimondo",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-ui min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#000",
                color: "#fff",
                borderRadius: "9999px",
                padding: "12px 24px",
                fontSize: "14px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
