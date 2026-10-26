import Image from "next/image";
import { founder, foundingOffer, photos, rules } from "@/content/site";
import { cn } from "@/lib/cn";
import { grid, photo, t, wrap } from "./tokens";
import { Star } from "./ui";

const hasRealName = !founder.name.includes("[");

function initials(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

/** The founder's slot: a real photo when there is one, otherwise a navy monogram. Never a stranger's face. */
function FounderMark() {
  return (
    <span
      data-dummy="D36"
      className="relative grid size-[88px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#0B2545] lg:size-[104px]"
      role="img"
      aria-label={founder.photo ? founder.name : `${founder.role}, monogram`}
    >
      {founder.photo ? (
        <Image src={founder.photo} alt="" fill sizes="104px" className="object-cover" />
      ) : hasRealName ? (
        <span className="text-[25px] font-semibold tracking-[-0.03em] text-white">{initials(founder.name)}</span>
      ) : (
        <Star className="size-9 lg:size-10" />
      )}
    </span>
  );
}

/** Honest framing right after the film: we are new, here is the person and the promise. */
export function Promise() {
  const p = photos.clinicReception;
  return (
    <section id="promise" aria-labelledby="promise-title" className="py-16 lg:py-36">
      <div className={cn(wrap, grid, "gap-y-12 lg:items-center")}>
        <div className="lg:col-span-6">
          <h2 id="promise-title" className={cn(t.h2, "max-w-[15ch]")}>
            We&apos;re new, so here&apos;s what we promise.
          </h2>
          <p className={cn(t.lead, "mt-6 max-w-[34ch]")}>
            <strong className="font-semibold" data-dummy="D38">
              {foundingOffer.line}
            </strong>{" "}
            {foundingOffer.spotsNote}
          </p>
          <figure className="mt-12 flex items-start gap-6 lg:mt-16">
            <FounderMark />
            <div>
              <blockquote className={cn(t.body, "max-w-[44ch] font-medium")} data-dummy="D37">
                “{founder.note}”
              </blockquote>
              <figcaption className={cn(t.body, "mt-3")}>
                <span className="font-semibold" data-dummy="D35">
                  {founder.name}
                </span>
                <span className="text-[#3E5068]">
                  {" "}
                  · {founder.role}, {founder.city}
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
        <div className="lg:col-span-6">
          <Image
            src={p.src}
            alt={p.alt}
            width={p.w}
            height={p.h}
            sizes="(min-width: 1440px) 624px, (min-width: 1024px) 45vw, 100vw"
            data-dummy="D22"
            className={cn(photo, "aspect-[4/3] w-full lg:aspect-[4/5]")}
          />
        </div>
      </div>
    </section>
  );
}

/** The rules, as a deep navy band: what Reputra will not do, for any clinic, on any plan. */
export function Never() {
  return (
    <section id="never" aria-labelledby="never-title" className="vc-dark bg-[#0B2545] py-20 text-white lg:py-32">
      <div className={cn(wrap, grid, "gap-y-10")}>
        <div className="lg:col-span-5">
          <h2 id="never-title" className={cn(t.h2, "max-w-[12ch]")}>
            What we will never do.
          </h2>
          <p className={cn(t.lead, "mt-6 max-w-[30ch] text-white/85")}>
            Reputra is built around Google&apos;s review rules. If a clinic wants any of these broken, Reputra is not for that clinic.
          </p>
          <p className={cn(t.body, "mt-6 max-w-[40ch] text-white/75")}>
            Hiding the Google button from unhappy patients is called review gating. It is against Google&apos;s policy, and no plan offers it.
          </p>
        </div>
        <ul className="lg:col-span-6 lg:col-start-7">
          {rules.map((r, i) => (
            <li key={r} className={cn("py-5 lg:py-7", i > 0 && "mt-1")}>
              <p className="text-[clamp(22px,2.3vw,34px)] font-semibold leading-[1.18] tracking-[-0.025em]">{r}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
