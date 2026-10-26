import { contact, offer, photos } from "@/content/site";
import { cn } from "@/lib/cn";
import { grid, t, wrap } from "./tokens";
import { StartButton, Wordmark } from "./ui";

// Only the photographs this page shows are credited.
const used = [photos.clinicReception, photos.receptionCounter, photos.dentistXray, photos.dentistPatient];

/** The close: one deep navy field holding the last call, the plain fallbacks and the footer. */
export function Close() {
  return (
    <div className="vc-dark bg-[#0B2545] text-white">
      <section id="start" aria-labelledby="start-title" className="pb-20 pt-24 lg:pb-28 lg:pt-36">
        <div className={cn(wrap, grid, "gap-y-12 lg:items-end")}>
          <div className="lg:col-span-7">
            <h2 id="start-title" className={cn(t.display, "max-w-[11ch] text-balance")}>
              Your counter is next.
            </h2>
            <p className={cn(t.lead, "mt-6 max-w-[34ch] text-white/85 lg:mt-8")}>
              Message us on WhatsApp. We visit, set up the stand and the card, and show your staff how to ask.
            </p>
            <div className="mt-8 lg:mt-10">
              <StartButton />
              <p className={cn(t.small, "mt-3 text-white/75")}>{offer.whatsappNote}</p>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className={cn(t.body, "text-white/80")}>Rather not use WhatsApp?</p>
            <ul className={cn(t.lead, "mt-3 space-y-1 font-semibold")}>
              <li>
                <a href={`mailto:${contact.email}`} className="underline decoration-white/40 hover:decoration-white" data-dummy="D02">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:+${contact.whatsappNumber}`} className="whitespace-nowrap underline decoration-white/40 hover:decoration-white" data-dummy="D01">
                  {contact.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="pb-10 pt-4 lg:pb-12">
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Wordmark className="text-[25px]" />
            <p className={cn(t.small, "text-white/75")}>
              © 2026 Reputra · <span data-dummy="D03">{contact.city}</span>
            </p>
          </div>
          <nav aria-label="Legal">
            <ul className={cn(t.small, "-mx-2 flex flex-wrap items-center gap-x-2")}>
              {[
                ["/privacy", "Privacy"],
                ["/terms", "Terms"],
                ["/refunds", "Refunds"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="inline-flex h-11 items-center rounded-full px-2 font-medium hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(t.small, "max-w-[110ch] text-white/70")} data-dummy="D22">
          Sample photographs from Unsplash:{" "}
          {used.map((p, i) => (
            <span key={p.src}>
              <a href={p.url} className="underline decoration-white/40" target="_blank" rel="noopener noreferrer">
                {p.who}
              </a>
              {i < used.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          The product render is a stand-in.
        </p>
      </div>
    </footer>
  );
}
