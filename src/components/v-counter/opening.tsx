import { ChevronRight } from "lucide-react";
import { offer, plans } from "@/content/site";
import { cn } from "@/lib/cn";
import { t, wrap } from "./tokens";
import { StartButton, Wordmark } from "./ui";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#box", label: "In the box" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "Questions" },
];

export function Nav() {
  return (
    <header className="relative z-20">
      <div className={cn(wrap, "flex h-16 items-center justify-between gap-6 lg:h-[76px]")}>
        <a href="#top" className="-mx-2 inline-flex h-11 items-center rounded-full px-2" aria-label="Reputra, back to the top">
          <Wordmark className="text-[25px]" />
        </a>
        <div className="flex items-center gap-2 lg:gap-6">
          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={cn(t.small, "inline-flex h-11 items-center rounded-full px-3 font-medium text-[#0B2545] hover:underline")}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <StartButton size="sm" />
        </div>
      </div>
    </header>
  );
}

/** The first screen's words: centred over the film, which starts inside the same screen. */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative z-10 pb-6 pt-5 text-center lg:pb-10 lg:pt-6">
      <div className={wrap}>
        <h1 id="hero-title" className={cn(t.display, "mx-auto max-w-[13ch] text-balance lg:max-w-none")}>
          <span className="lg:block">One tap.</span> One more Google review.
        </h1>
        <p className={cn(t.lead, "mx-auto mt-4 max-w-[34ch] lg:mt-6 lg:max-w-none")}>
          A stand and a tap card that turn every visit into a Google review.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 lg:mt-8">
          <StartButton />
          <a href="#how" className="group inline-flex h-11 items-center gap-1 rounded-full px-2 text-[17px] font-medium text-[#0B2545] hover:underline">
            See how it works
            <ChevronRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.2} aria-hidden />
          </a>
        </div>
        <p className={cn(t.small, "mx-auto mt-2 max-w-[44ch] text-[#3E5068] lg:mt-3 lg:max-w-none")}>
          {offer.whatsappNote} First month free, then from <span data-dummy="D07">{plans[0].price}</span> a month.
        </p>
      </div>
    </section>
  );
}
