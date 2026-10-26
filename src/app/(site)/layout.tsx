import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/components/v-counter/counter.css";

// One family for the whole page: Geist, from the display line down to the table figures.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reputra · One tap. One more Google review.",
  description:
    "A QR stand and an NFC card for your clinic's reception counter. Patients tap, review you in Urdu or English, and it lands on Google. First month free.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geist.variable} ${geist.className} vc-root`}>{children}</div>;
}
