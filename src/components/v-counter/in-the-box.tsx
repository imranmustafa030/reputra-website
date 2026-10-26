import Image from "next/image";
import { cn } from "@/lib/cn";
import { t, wrap } from "./tokens";

const specs = [
  { name: "Acrylic QR stand", text: "Stands on the reception counter, printed with your clinic's own review code." },
  { name: "NFC tap card", text: "Patients hold their phone to it. Nothing to install, nothing to sign in to." },
  { name: "WhatsApp messages", text: "Ready-made in Urdu, Roman Urdu and English, sent one at a time from your number." },
  { name: "Your dashboard", text: "Scans, Google clicks and requests, a staff leaderboard and a monthly report." },
];

/** In the box: the product photographed whole in one rounded stage, the four parts set in its open studio space. */
export function InTheBox() {
  return (
    <section id="box" aria-labelledby="box-title" className="py-16 lg:py-36">
      <div className={wrap}>
        <div className="relative overflow-hidden rounded-[28px] bg-[#E6E6E4]">
          <Image
            src="/images/stand-card.jpg"
            alt="The Reputra acrylic QR stand with its review code, the navy NFC card with the gold star, and a phone held just above the card."
            width={1376}
            height={768}
            sizes="(min-width: 1440px) 1376px, 100vw"
            data-dummy="D21"
            className="aspect-[4/3] w-full object-cover object-[80%_50%] lg:aspect-[1376/768] lg:object-center"
          />
          <div className="px-6 pb-10 pt-2 sm:px-10 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[46%] lg:flex-col lg:justify-center lg:p-14 xl:p-16">
            <h2 id="box-title" className={cn(t.h2, "max-w-[14ch]")}>
              What you get, set up in one visit.
            </h2>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-1 lg:gap-6">
              {specs.map((s) => (
                <div key={s.name}>
                  <dt className={cn(t.body, "font-semibold")}>{s.name}</dt>
                  <dd className={cn(t.body, "mt-1 max-w-[40ch] text-[#2F4058]")}>{s.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
