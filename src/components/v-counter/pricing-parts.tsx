import { Check, Minus } from "lucide-react";
import { planRows, plans, whatsappLink } from "@/content/site";
import { cn } from "@/lib/cn";
import { t } from "./tokens";
import { QuietButton, StartButton } from "./ui";

// On phones, rows that are the same on every plan are said once, under the plans.
export const shared = planRows.filter((r) => r.values.every((v) => v === r.values[0]));
export const differing = planRows.filter((r) => !shared.includes(r));

export const intro = "The first month is free. After that, cancel any month; the stand and the card stay with you.";

const talkMessage = "Assalam o Alaikum! I'd like to talk about Reputra for a clinic with several branches.";

export function PlanAction({ i }: { i: number }) {
  const plan = plans[i];
  if (plan.cta !== "Start free month") return <QuietButton href={whatsappLink(talkMessage)}>{plan.cta}</QuietButton>;
  return plan.featured ? (
    <StartButton />
  ) : (
    <QuietButton href={whatsappLink(`Assalam o Alaikum! I'd like to start a free month of Reputra (${plan.name}) for my clinic.`)}>
      {plan.cta}
    </QuietButton>
  );
}

/** "PKR 7,999": the currency set small, the figure at heading size. */
export function Price({ price, className }: { price: string; className?: string }) {
  const [cur, ...rest] = price.split(" ");
  return (
    <span className={cn("flex items-baseline gap-2", className)} data-dummy="D07">
      <span className={cn(t.lead, "font-semibold")}>{cur}</span>
      <span className="text-[clamp(30px,3.7vw,54px)] font-semibold leading-none tracking-[-0.035em] tabular-nums">{rest.join(" ")}</span>
    </span>
  );
}

export function Value({ v }: { v: string }) {
  if (v === "Included")
    return (
      <span className="inline-flex items-center gap-2">
        <Check className="size-[18px] shrink-0" strokeWidth={2.4} aria-hidden />
        Included
      </span>
    );
  if (v === "Not included")
    return (
      <span className="inline-flex items-center gap-2 text-[#3E5068]">
        <Minus className="size-[18px] shrink-0" strokeWidth={2.2} aria-hidden />
        Not included
      </span>
    );
  return <>{v}</>;
}


export const sharedLine = `Every plan includes ${shared
  .map((r) => (/^[A-Z][a-z]/.test(r.label) ? r.label.charAt(0).toLowerCase() + r.label.slice(1) : r.label))
  .join(", and ")}.`;
