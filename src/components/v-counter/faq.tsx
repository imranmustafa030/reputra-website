import { Plus } from "lucide-react";
import { faqs } from "@/content/site";
import { cn } from "@/lib/cn";
import { grid, t, wrap } from "./tokens";

/** Questions: native details elements, one open at a time, opening with a slow height ease. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="pb-16 lg:pb-36">
      <div className={cn(wrap, grid, "gap-y-8")}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-12">
            <h2 id="faq-title" className={cn(t.h2, "max-w-[12ch]")}>
              Questions clinics ask us.
            </h2>
            <p className={cn(t.body, "mt-5 max-w-[32ch]")}>Anything else, ask on WhatsApp. You will get an answer from a person.</p>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => (
            <details key={f.q} name="vc-faq" className="vc-faq" open={i === 0}>
              <summary className="flex min-h-[64px] items-center justify-between gap-6 py-4 lg:py-5">
                <span className={cn(t.lead, "font-semibold")}>{f.q}</span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0B2545] text-white">
                  <Plus className="vc-faq-icon size-5" strokeWidth={2.2} aria-hidden />
                </span>
              </summary>
              <p className={cn(t.body, "max-w-[60ch] pb-6 pr-16")}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
