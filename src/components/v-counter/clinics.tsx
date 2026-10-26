import Image from "next/image";
import { photos } from "@/content/site";
import { cn } from "@/lib/cn";
import { grid, photo, t, wrap } from "./tokens";

const facts = [
  { name: "In your patients' language", text: "The review page and the WhatsApp messages speak Urdu, Roman Urdu or English." },
  { name: "From your own WhatsApp", text: "Your staff send one message at a time, to patients who visited. No bulk tools." },
  { name: "Priced in rupees", text: "Pay by Raast, JazzCash, Easypaisa or bank transfer, monthly or yearly." },
  { name: "Set up at your counter", text: "We find your Google review link, bring the stand and the card, and train your staff." },
];

/** A photo-led break: the place the product lives, and why it fits a clinic's day here. */
export function Clinics() {
  const big = photos.receptionCounter;
  const small = photos.dentistXray;
  return (
    <section id="clinics" aria-labelledby="clinics-title" className="pb-16 lg:pb-36">
      <div className={cn(wrap, grid, "gap-y-10")}>
        <div className="lg:col-span-7">
          <Image
            src={big.src}
            alt={big.alt}
            width={big.w}
            height={big.h}
            sizes="(min-width: 1440px) 730px, (min-width: 1024px) 55vw, 100vw"
            data-dummy="D22"
            className={cn(photo, "aspect-[4/3] w-full lg:aspect-[4/5]")}
          />
        </div>
        <div className="flex flex-col lg:col-span-5">
          <h2 id="clinics-title" className={cn(t.h2, "max-w-[13ch]")}>
            Made for how clinics here work.
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-1 lg:gap-7">
            {facts.map((f) => (
              <div key={f.name}>
                <dt className={cn(t.body, "font-semibold")}>{f.name}</dt>
                <dd className={cn(t.body, "mt-1 max-w-[38ch]")}>{f.text}</dd>
              </div>
            ))}
          </dl>
          <Image
            src={small.src}
            alt={small.alt}
            width={small.w}
            height={small.h}
            sizes="(min-width: 1440px) 500px, 38vw"
            data-dummy="D22"
            className={cn(photo, "mt-auto hidden aspect-[2/1] w-full lg:mt-12 lg:block")}
          />
        </div>
      </div>
    </section>
  );
}
