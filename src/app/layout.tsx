import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import { DummyMode } from "@/components/dummy-mode";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reputra.pk"), // ⚑ D06
  title: "Reputra · More Google reviews for your clinic",
  description:
    "Reputra asks every patient for a Google review, using a QR stand, an NFC tap card or WhatsApp, in Urdu or English. Made for clinics in Pakistan.",
  openGraph: {
    title: "Reputra · More Google reviews for your clinic",
    description: "QR stands, NFC tap cards and WhatsApp messages that ask every patient for a Google review.",
    images: ["/images/stand-card.jpg"], // ⚑ D25 replace with a designed 1200×630 share image
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${nastaliq.variable} antialiased`}>
      <head>
        {/* If JavaScript fails, never leave scroll-reveal content hidden */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">
        <DummyMode />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
