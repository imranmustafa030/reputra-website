"use client";

import { useId, useState } from "react";
import { plans } from "@/content/site";
import { cn } from "@/lib/cn";
import { t } from "./tokens";
import { differing, PlanAction, Price, sharedLine } from "./pricing-parts";
import { Star } from "./ui";

const featured = Math.max(0, plans.findIndex((p) => p.featured));

/** Phones: a segmented control shows one plan at a time, starting on the recommended one. */
export function PlanPicker() {
  const [i, setI] = useState(featured);
  const id = useId();
  const p = plans[i];
  const dark = true;
  return (
    <div className="mt-10 lg:hidden">
      <div role="tablist" aria-label="Plans" className="grid grid-cols-3 gap-1 rounded-full bg-[#F4F4F2] p-1">
        {plans.map((plan, j) => (
          <button
            key={plan.name}
            role="tab"
            type="button"
            id={`${id}-tab-${j}`}
            aria-selected={i === j}
            aria-controls={`${id}-panel`}
            onClick={() => setI(j)}
            className={cn(
              "h-11 rounded-full text-[15px] font-semibold transition-colors duration-300",
              i === j ? "bg-[#0B2545] text-white" : "text-[#0B2545]",
            )}
          >
            {plan.name}
          </button>
        ))}
      </div>
      <article
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${i}`}
        className={cn("mt-4 rounded-[28px] p-6 sm:p-8", dark ? "bg-[#0B2545] text-white vc-dark" : "bg-[#F4F4F2]")}
      >
        <h3 className={cn(t.lead, "flex items-center gap-2 font-semibold")}>
          {p.name}
          {p.featured ? <Star className="size-[0.8em]" /> : null}
        </h3>
        <Price price={p.price} className="mt-3" />
        <p className={cn(t.body, "mt-2", dark ? "text-white/80" : "text-[#3E5068]")}>{p.period}</p>
        <dl className={cn(t.small, "mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2")} data-dummy="D11">
          {differing.map((row) => (
            <div key={row.label} className="contents">
              <dt className={dark ? "text-white/80" : "text-[#3E5068]"}>{row.label}</dt>
              <dd className="text-right font-medium">{row.values[i]}</dd>
            </div>
          ))}
        </dl>
        <p className={cn(t.small, "mt-4", dark ? "text-white/80" : "text-[#3E5068]")}>{sharedLine}</p>
        <div className="mt-6 [&>a]:w-full">
          <PlanAction i={i} />
        </div>
      </article>
    </div>
  );
}
