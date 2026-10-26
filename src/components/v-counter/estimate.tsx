"use client";

import { useId, useState } from "react";
import { estimate } from "@/content/site";
import { cn } from "@/lib/cn";
import { t, wrap } from "./tokens";
import { Star } from "./ui";

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={cn(t.body, "font-medium")}>
          {label}
        </label>
        <span className={cn(t.lead, "font-semibold tabular-nums")} aria-hidden>
          {value}
        </span>
      </div>
      <div className="relative mt-2">
        {/* the track and its fill are drawn here, flat, under a transparent range input */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E6E6E3]" aria-hidden>
          <span className="block h-full rounded-full bg-[#0B2545]" style={{ width: `${fill}%` }} />
        </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vc-range relative"
      />
      </div>
    </div>
  );
}

/** The live thing: set your clinic's day and read what one month could add. Final value on first paint. */
export function Estimate() {
  const [patients, setPatients] = useState(estimate.defaultPatients);
  const [now, setNow] = useState(estimate.defaultReviews);
  const added = Math.round(patients * estimate.workingDays * estimate.reviewRate);
  const next = now + added;

  return (
    <section id="estimate" aria-labelledby="estimate-title" className="py-16 lg:py-36">
      <div className={cn(wrap, "grid gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-0")}>
        <div className="lg:col-span-5 lg:row-start-1 lg:pt-4">
          <h2 id="estimate-title" className={cn(t.h2, "max-w-[14ch]")}>
            What one month could add.
          </h2>
          <p className={cn(t.lead, "mt-5 max-w-[30ch]")}>Set the sliders to your clinic&apos;s usual day.</p>
        </div>
        <div className="flex flex-col justify-between gap-8 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:min-h-[480px]">
          <div>
            <output aria-live="polite" className={cn(t.figure, "flex items-start gap-3")}>
              {next}
              <Star className="mt-[0.06em] size-[0.22em]" />
              <span className="sr-only"> Google reviews by the end of next month</span>
            </output>
            <p className={cn(t.lead, "mt-5 max-w-[30ch]")}>
              Google reviews by the end of next month: {now} today, about {added} more from {patients} patients a day.
            </p>
          </div>
          <p className={cn(t.small, "max-w-[52ch] text-[#3E5068]")} data-dummy="D12">
            Assumes {Math.round(estimate.reviewRate * 100)} in 100 patients you ask leave a review, over {estimate.workingDays} working
            days. An estimate, not a promise.
          </p>
        </div>
        <div className="space-y-8 lg:col-span-5 lg:row-start-2 lg:self-end lg:pb-4" data-dummy="D14">
          <Slider label="Patients a day" value={patients} min={estimate.minPatients} max={estimate.maxPatients} onChange={setPatients} />
          <Slider label="Google reviews now" value={now} min={0} max={estimate.maxReviews} onChange={setNow} />
        </div>
      </div>
    </section>
  );
}
