import type { Metadata } from "next";
import { cormorant } from "@/styles/fonts";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kimondo", template: "%s" },
  description:
    "Handwoven garments crafted on traditional looms. Each piece carries the mark of its maker.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cormorant.variable}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-screen flex flex-col">
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
                borderRadius: "0px",
                padding: "12px 24px",
                fontSize: "14px",
                fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif",
                letterSpacing: "0.2px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
