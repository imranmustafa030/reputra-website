import Image from "next/image";
import { ArrowRight, CheckCheck, Lock } from "lucide-react";
import { demoClinic, feedbackExample, leaderboard, monthlyReport, photos, weeklyStats } from "@/content/site";
import { cn } from "@/lib/cn";
import { grid, photo, t, wrap } from "./tokens";
import { Star } from "./ui";

const maxLead = Math.max(...leaderboard.map((l) => l.count));

function Sample({ className }: { className?: string }) {
  return <span className={cn(t.small, "shrink-0 whitespace-nowrap font-medium", className)}>Sample data</span>;
}

/** The owner's dashboard for the example clinic: the real product, drawn in HTML. */
function Dashboard() {
  const stats = [
    { label: "Scans", value: weeklyStats.scans },
    { label: "Google clicks", value: weeklyStats.clicks },
    { label: "WhatsApp sent", value: weeklyStats.whatsapp },
  ];
  return (
    <div data-ui className="w-full overflow-hidden rounded-[22px] bg-white text-[#0B2545]" data-dummy="D18">
      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-[#0E7490] text-[13px] font-bold text-white">{demoClinic.initials}</span>
          <div>
            <p className="text-[15px] font-semibold leading-tight">{demoClinic.name}</p>
            <p className={cn(t.small, "text-[#3E5068]")}>{monthlyReport.month} · dashboard</p>
          </div>
        </div>
        <Sample className="text-[#3E5068]" />
      </div>

      <div className="grid grid-cols-2 gap-2 px-3 sm:px-4" data-dummy="D19">
        <div className="rounded-[14px] bg-[#F4F4F2] px-4 py-4">
          <p className={cn(t.small, "text-[#3E5068]")}>Google reviews</p>
          <p className="mt-1 flex items-center gap-2 text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            <span className="text-[#3E5068]">{monthlyReport.reviewsBefore}</span>
            <ArrowRight className="size-4 text-[#3E5068]" aria-label="to" />
            {monthlyReport.reviewsAfter}
          </p>
          <p className={cn(t.small, "mt-2 font-semibold text-[#0E7C5A]")}>+{monthlyReport.newReviews} this month</p>
        </div>
        <div className="rounded-[14px] bg-[#F4F4F2] px-4 py-4">
          <p className={cn(t.small, "text-[#3E5068]")}>Rating on Google</p>
          <p className="mt-1 flex items-center gap-2 text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            <span className="text-[#3E5068]">{monthlyReport.ratingBefore}</span>
            <ArrowRight className="size-4 text-[#3E5068]" aria-label="to" />
            {monthlyReport.rating}
            <Star className="size-5" />
          </p>
          <p className={cn(t.small, "mt-2 text-[#3E5068]")}>Since joining</p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 px-3 pt-2 sm:px-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[14px] bg-[#F4F4F2] px-3 py-3">
            <dt className={cn(t.small, "text-[#3E5068]")}>{s.label}</dt>
            <dd className="mt-1 text-[22px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className={cn(t.small, "px-5 pt-2 text-[#3E5068] sm:px-6")}>This week</p>

      <div className="px-5 pb-6 pt-5 sm:px-6" data-dummy="D17">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-semibold">Staff leaderboard</p>
          <p className={cn(t.small, "text-[#3E5068]")}>Reviews brought in</p>
        </div>
        <ol className="mt-3 space-y-2.5">
          {leaderboard.map((l, i) => (
            <li key={l.name} className="grid grid-cols-[84px_1fr_28px] items-center gap-3">
              <span className="text-[15px] font-medium">{l.name}</span>
              <span className="h-2 rounded-full bg-[#ECECE9]">
                <span className={cn("block h-full rounded-full", i === 0 ? "bg-[#0B2545]" : "bg-[#8E9BAD]")} style={{ width: `${(l.count / maxLead) * 100}%` }} />
              </span>
              <span className="text-right text-[15px] font-semibold tabular-nums">{l.count}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Your month at a glance: a clinic photographed, the dashboard on it, the report and an alert beside. */
export function Month() {
  const p = photos.dentistPatient;
  const r = monthlyReport;
  return (
    <section id="month" aria-labelledby="month-title" className="pb-16 lg:pb-36">
      <div className={wrap}>
        <div className={cn(grid, "items-end gap-y-5")}>
          <h2 id="month-title" className={cn(t.h2, "lg:col-span-6")}>
            Your month, at a glance.
          </h2>
          <p className={cn(t.lead, "max-w-[40ch] lg:col-span-5 lg:col-start-8")}>
            What the owner of <span data-dummy="D15">{demoClinic.name}</span> would see after {r.month}. An example with sample numbers, not a
            real clinic.
          </p>
        </div>

        <div className="relative mt-10 lg:mt-14">
          <Image
            src={p.src}
            alt={p.alt}
            width={p.w}
            height={p.h}
            sizes="(min-width: 1440px) 1280px, 100vw"
            data-dummy="D22"
            className={cn(photo, "hidden aspect-[16/9] w-full object-[70%_50%] sm:block lg:aspect-[1280/760]")}
          />
          <div className="mt-4 lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-[440px] lg:items-center lg:p-10">
            <Dashboard />
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-2 lg:gap-6">
          {/* The monthly report, as it arrives on WhatsApp */}
          <div data-ui className="rounded-[22px] bg-[#EFEAE2] p-5 sm:p-7" data-dummy="D19">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[17px] font-semibold">Monthly report on WhatsApp</h3>
              <Sample className="text-[#4A4A44]" />
            </div>
            <div className="mt-4 max-w-[46ch] rounded-[14px] rounded-tl-[4px] bg-white px-4 py-3.5 text-[#111B21]">
              <p className="text-[15px] font-semibold">Reputra · {r.month} report</p>
              <p className="mt-2 text-[16px] leading-[1.5]">
                {demoClinic.name}: <strong className="font-semibold">+{r.newReviews} new Google reviews</strong> this month ({r.reviewsBefore} →{" "}
                {r.reviewsAfter}). Rating {r.ratingBefore} → {r.rating}. Top staff: {r.topStaff}.
              </p>
              <p className="mt-1.5 flex items-center justify-end gap-1 text-[13px] text-[#54656F]">
                1 Nov, 09:00
                <CheckCheck className="size-3.5 text-[#53BDEB]" aria-hidden />
              </p>
            </div>
          </div>

          {/* A private-feedback alert */}
          <div data-ui className="rounded-[22px] bg-[#0B2545] p-5 text-white sm:p-7" data-dummy="D20">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="inline-flex items-center gap-2 text-[17px] font-semibold">
                <Lock className="size-4" aria-hidden />
                Private feedback
              </h3>
              <Sample className="text-white/75" />
            </div>
            <p className="mt-4 text-[clamp(19px,1.75vw,25px)] leading-[1.4] tracking-[-0.014em]">“{feedbackExample.message}”</p>
            <p className={cn(t.body, "mt-3 text-white/80")}>
              {feedbackExample.name} · {feedbackExample.time}, sent only to you. The Google button stayed on her screen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
