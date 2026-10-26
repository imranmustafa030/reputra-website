import { planRows, plans, setupPack, yearlyOffer } from "@/content/site";
import { cn } from "@/lib/cn";
import { t, wrap } from "./tokens";
import { Star } from "./ui";
import { intro, PlanAction, Price, Value } from "./pricing-parts";
import { PlanPicker } from "./plan-picker";

/** Pricing as one clean comparison. Pro, the recommended plan, is set as a navy column. */
export function Pricing() {
  const proCell = (j: number) => (plans[j].featured ? "bg-[#0B2545] text-white" : "");
  const soft = (j: number) => (plans[j].featured ? "text-white/80" : "text-[#3E5068]");
  return (
    <section id="pricing" aria-label="Pricing" className="pb-16 lg:pb-40">
      <div className={wrap}>
        <div className="lg:hidden">
          <h2 className={t.h2}>Plans in rupees.</h2>
          <p className={cn(t.lead, "mt-5 max-w-[40ch]")}>{intro}</p>
        </div>

        {/* Desktop: one comparison table */}
        <table className="hidden w-full table-fixed border-separate border-spacing-0 lg:table" data-dummy="D11">
          <caption className="sr-only">What each plan includes</caption>
          <colgroup>
            <col className="w-[28%]" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <td rowSpan={2} className="pr-10 pt-10 align-top">
                <h2 className={t.h2}>Plans in rupees.</h2>
                <p className={cn(t.lead, "mt-5 max-w-[24ch]")}>{intro}</p>
              </td>
              {plans.map((p, j) => (
                <th key={p.name} scope="col" className={cn("rounded-t-[28px] px-8 pt-10 text-left align-top font-normal", proCell(j))}>
                  <span className={cn(t.lead, "flex items-center gap-2 font-semibold")}>
                    {p.name}
                    {p.featured ? <Star className="size-[0.8em]" /> : null}
                  </span>
                  <Price price={p.price} className="mt-5" />
                  <span className={cn(t.body, "mt-2 block", soft(j))}>{p.period}</span>
                </th>
              ))}
            </tr>
            <tr>
              {plans.map((p, j) => (
                <td key={p.name} className={cn("px-8 pb-10 pt-8", proCell(j))}>
                  <PlanAction i={j} />
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {planRows.map((row, r) => (
              <tr key={row.label}>
                <th scope="row" className={cn(t.body, "py-4 pr-6 text-left align-top font-medium", r === planRows.length - 1 && "pb-10")}>
                  {row.label}
                </th>
                {row.values.map((v, j) => (
                  <td
                    key={j}
                    className={cn(
                      t.body,
                      "px-8 py-4 align-top",
                      proCell(j),
                      r === planRows.length - 1 && "rounded-b-[28px] pb-10",
                    )}
                  >
                    <Value v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phone and tablet: one plan at a time, Pro first */}
        <PlanPicker />

        <p className={cn(t.body, "mx-auto mt-12 max-w-[72ch] text-center text-[#2F4058] lg:mt-14")}>
          Setup pack <span data-dummy="D08">{setupPack}</span>. Pay by Raast, JazzCash, Easypaisa or bank transfer.{" "}
          <span data-dummy="D09">{yearlyOffer}</span>
        </p>
      </div>
    </section>
  );
}
