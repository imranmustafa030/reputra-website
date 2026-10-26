"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { demoClinic, contact } from "@/content/site";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
  The product film: a phone lowers onto the Reputra NFC card, taps it, the clinic's
  review page opens, five stars fill, the patient presses "Google pe review dein",
  and the review is posted. Built in HTML/CSS so it is sharp at any size and light
  on budget phones. Driven by GSAP:

  - mode "scroll": scrubbed by the scroll position of `trigger` (optionally pinned)
  - mode "loop":   plays on its own and repeats (for phones, or where pinning is wrong)

  Reduced motion: the final state is shown, nothing moves.
*/

type FilmProps = {
  /**
   * What drives (and is pinned by) the scroll: a CSS selector matched with
   * closest() from the film, e.g. "section" or "[data-film-scene]". Defaults to the film itself.
   */
  trigger?: string;
  mode?: "scroll" | "loop" | "auto";
  /** Pin the trigger while the film plays (scroll mode only). */
  pin?: boolean;
  /** Scroll distance the film takes, e.g. "+=140%". */
  distance?: string;
  /** Show the acrylic QR stand behind the card. */
  stand?: boolean;
  /** Ground colour behind the objects, used for the contact shadow tint. */
  className?: string;
  style?: CSSProperties;
  /** Called with 0..1 as the film plays, e.g. to tick a review counter. */
  onProgress?: (p: number) => void;
  /** ScrollTrigger start/end for the unpinned scroll mode. */
  start?: string;
  end?: string;
};

const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function StarIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d={STAR} fill="currentColor" />
    </svg>
  );
}

export function ProductFilm({
  trigger,
  mode = "auto",
  pin = false,
  distance = "+=140%",
  stand = false,
  className,
  style,
  onProgress,
  start,
  end,
}: FilmProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      const build = (tl: gsap.core.Timeline) => {
        // 0.00–0.30  phone lowers towards the card and tilts to face it
        tl.fromTo(q("[data-phone]"), { y: -40, rotateX: 10, rotateZ: -9 }, { y: 170, rotateX: 48, rotateZ: -4, ease: "power2.inOut", duration: 0.3 }, 0)
          .fromTo(q("[data-phone-shadow]"), { opacity: 0.18, scale: 0.7 }, { opacity: 0.42, scale: 1, ease: "power2.inOut", duration: 0.3 }, 0)
          // 0.30–0.42  contact: the NFC ring pulses out of the card
          .fromTo(q("[data-ring]"), { scale: 0.3, opacity: 0 }, { scale: 1.7, opacity: 0, keyframes: { opacity: [0, 0.9, 0] }, ease: "power1.out", duration: 0.16 }, 0.29)
          .fromTo(q("[data-ring-2]"), { scale: 0.3, opacity: 0 }, { scale: 2.1, opacity: 0, keyframes: { opacity: [0, 0.6, 0] }, ease: "power1.out", duration: 0.2 }, 0.33)
          .fromTo(q("[data-card-glow]"), { opacity: 0 }, { opacity: 1, yoyo: true, repeat: 1, duration: 0.08 }, 0.3)
          // the notification on the lock screen is replaced by the clinic's page
          .to(q("[data-lock]"), { opacity: 0, duration: 0.05 }, 0.36)
          .fromTo(q("[data-page]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.37)
          // phone lifts a little so the screen reads
          .to(q("[data-phone]"), { y: 70, rotateX: 18, rotateZ: -5, ease: "power2.out", duration: 0.2 }, 0.42)
          .to(q("[data-phone-shadow]"), { opacity: 0.28, scale: 0.85, duration: 0.2 }, 0.42);

        // 0.48–0.68  stars fill one by one
        q("[data-star]").forEach((el, i) => {
          tl.fromTo(el, { color: "#E5E7EB", scale: 1 }, { color: "#F5B301", keyframes: { scale: [1, 1.25, 1] }, duration: 0.05, ease: "power1.out" }, 0.48 + i * 0.04);
        });

        // 0.72–0.80  the patient presses the Google button
        tl.fromTo(q("[data-press]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.35, duration: 0.04 }, 0.72)
          .to(q("[data-gbtn]"), { scale: 0.96, duration: 0.03, yoyo: true, repeat: 1 }, 0.72)
          .to(q("[data-press]"), { opacity: 0, duration: 0.04 }, 0.78)
          // 0.80–1.00  review posted
          .to(q("[data-page]"), { opacity: 0, y: -12, duration: 0.06 }, 0.8)
          .fromTo(q("[data-posted]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.84)
          .fromTo(q("[data-posted-star]"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.012, duration: 0.04, ease: "back.out(2)" }, 0.85)
          .to({}, { duration: 0.06 }, 0.94);

        if (onProgress) tl.eventCallback("onUpdate", () => onProgress(tl.progress()));
      };

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
          // gsap.matchMedia only runs this when at least one condition matches: without this
          // key a phone (no reduced motion, not desktop) never builds the film at all.
          phone: "(max-width: 1023.98px)",
        },
        (ctx) => {
          const { reduce, desktop } = ctx.conditions as { reduce: boolean; desktop: boolean };
          const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
          build(tl);

          if (reduce) {
            tl.progress(1);
            onProgress?.(1);
            return;
          }

          const useScroll = mode === "scroll" || (mode === "auto" && desktop);
          const scene = (trigger && root.current?.closest<HTMLElement>(trigger)) || root.current;
          if (useScroll) {
            ScrollTrigger.create({
              trigger: scene,
              start: pin ? "top top" : (start ?? "top 75%"),
              end: pin ? distance : (end ?? "bottom 25%"),
              pin: pin ? scene : false,
              scrub: 0.6,
              animation: tl,
            });
          } else {
            // Loop: play when visible, pause off-screen to save the battery.
            tl.repeat(-1).repeatDelay(1.4).timeScale(1 / 5.5);
            ScrollTrigger.create({
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
            });
          }
        },
      );
    },
    { scope: root, dependencies: [mode, pin, distance, trigger, start, end] },
  );

  return (
    <div
      ref={root}
      data-ui
      className={cn("relative isolate aspect-[5/6] w-full select-none [perspective:1600px]", className)}
      style={style}
      role="img"
      aria-label={`A phone taps the Reputra NFC card. ${demoClinic.name}'s review page opens, the patient gives five stars and posts the review on Google.`}
    >
      {/* Acrylic QR stand (optional) */}
      {stand ? (
        <div className="absolute left-[60%] top-[16%] h-[52%] w-[34%] [transform:rotateY(-18deg)] [transform-style:preserve-3d]" aria-hidden>
          <div className="absolute inset-0 rounded-[6px] border border-white/70 bg-white/35 shadow-[inset_0_0_0_1px_rgba(11,37,69,0.08),inset_14px_0_30px_rgba(255,255,255,0.7)]" />
          <div className="absolute inset-[7%] flex flex-col items-center rounded-[3px] bg-white px-[7%] pt-[9%] text-center text-[#0B2545]">
            <StarIcon className="w-[16%] text-[#F5B301]" />
            <p className="mt-[6%] text-[clamp(8px,1vw,13px)] font-extrabold leading-tight">Scan or tap to review us on Google</p>
            <div className="mt-[8%] grid aspect-square w-[62%] grid-cols-5 grid-rows-5 gap-[6%]">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className={cn("rounded-[1px]", [0, 1, 3, 5, 6, 8, 12, 14, 16, 18, 19, 20, 22, 23, 24].includes(i) ? "bg-[#0B2545]" : "bg-transparent")} />
              ))}
            </div>
            <p className="mt-[8%] text-[clamp(7px,0.75vw,10px)] font-semibold opacity-70">{demoClinic.name}</p>
          </div>
          <div className="absolute -bottom-[3%] left-[-6%] right-[-6%] h-[6%] rounded-[3px] bg-white/60 shadow-[0_1px_0_rgba(11,37,69,0.12)]" />
        </div>
      ) : null}

      {/* NFC card lying on the counter */}
      <div className="absolute left-[8%] top-[52%] w-[74%] [transform-style:preserve-3d] [transform:rotateX(62deg)_rotateZ(-14deg)]" aria-hidden>
        <div className="relative aspect-[85.6/54] w-full overflow-hidden rounded-[5.5%/8.7%] bg-[#0B2545] shadow-[0_40px_60px_-30px_rgba(11,37,69,0.55)]">
          {/* soft sheen of a matte card catching the light */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.16),transparent_55%)]" />
          <p className="absolute left-[7%] top-[11%] text-[clamp(10px,1.5vw,20px)] font-extrabold tracking-[-0.02em] text-white/90">reputra</p>
          <StarIcon className="absolute left-1/2 top-1/2 w-[17%] -translate-x-1/2 -translate-y-1/2 text-[#F5B301] drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
          <p className="absolute bottom-[10%] left-[7%] text-[clamp(7px,0.9vw,12px)] font-bold tracking-[0.14em] text-[#F5B301]">TAP TO REVIEW</p>
          <svg viewBox="0 0 24 24" className="absolute bottom-[8%] right-[6%] w-[7%] text-white/80" aria-hidden>
            <path d="M6 8.5a5 5 0 0 1 0 7M9.5 6a8.5 8.5 0 0 1 0 12M13 3.5a12 12 0 0 1 0 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div data-card-glow className="absolute inset-0 bg-white/12 opacity-0" />
        </div>
        {/* NFC rings */}
        <div data-ring className="absolute left-1/2 top-1/2 aspect-square w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#F5B301] opacity-0" />
        <div data-ring-2 className="absolute left-1/2 top-1/2 aspect-square w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F5B301] opacity-0" />
      </div>

      {/* Phone's contact shadow on the counter */}
      <div data-phone-shadow className="absolute left-[24%] top-[60%] h-[16%] w-[46%] rounded-[50%] bg-[#0B2545] opacity-20 blur-2xl" aria-hidden />

      {/* Phone */}
      <div
        data-phone
        className="absolute left-[28%] top-[4%] w-[40%] [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateZ(-9deg)]"
        aria-hidden
      >
        <div className="relative aspect-[9/19] w-full rounded-[16%/7.6%] bg-[#1B1E24] p-[3.6%] shadow-[0_2px_0_1px_#3A3F48_inset,0_30px_60px_-20px_rgba(11,37,69,0.45)]">
          {/* side buttons */}
          <span className="absolute -left-[1.6%] top-[18%] h-[7%] w-[1.6%] rounded-l bg-[#2A2E35]" />
          <span className="absolute -right-[1.6%] top-[24%] h-[11%] w-[1.6%] rounded-r bg-[#2A2E35]" />
          <div className="relative h-full w-full overflow-hidden rounded-[13%/6.2%] bg-white">
            {/* dynamic island */}
            <span className="absolute left-1/2 top-[1.6%] z-20 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-[#0A0B0D]" />

            {/* Lock screen with the NFC notification */}
            <div data-lock className="absolute inset-0 flex flex-col items-center bg-[#0E2340] px-[7%] pt-[16%] text-white">
              <p className="text-[clamp(18px,3vw,42px)] font-semibold leading-none tracking-[-0.02em]">11:32</p>
              <p className="mt-[3%] text-[clamp(7px,0.8vw,11px)] opacity-70">Tuesday, 14 October</p>
              <div className="mt-[18%] w-full rounded-[14px] bg-white/14 p-[5%] text-left">
                <p className="flex items-center gap-[4%] text-[clamp(7px,0.75vw,10px)] font-semibold opacity-80">
                  <span className="grid aspect-square w-[9%] place-items-center rounded-[4px] bg-[#F5B301]">
                    <StarIcon className="w-[70%] text-[#0B2545]" />
                  </span>
                  NFC · now
                </p>
                <p className="mt-[3%] text-[clamp(8px,0.95vw,13px)] font-bold">{demoClinic.name}</p>
                <p className="text-[clamp(7px,0.85vw,12px)] opacity-90">Tap to review your visit</p>
              </div>
            </div>

            {/* The clinic's review page */}
            <div data-page className="absolute inset-0 flex flex-col items-center px-[8%] pt-[13%] text-center opacity-0">
              <div className="w-full rounded-[8px] bg-[#F2F2F0] py-[2.5%] text-[clamp(6px,0.7vw,10px)] text-[#374151]">
                {contact.domain}/r/{demoClinic.slug}
              </div>
              <span className="mt-[9%] grid aspect-square w-[24%] place-items-center rounded-full bg-[#0E7490] text-[clamp(10px,1.3vw,18px)] font-extrabold text-white">
                {demoClinic.initials}
              </span>
              <p className="mt-[5%] text-[clamp(9px,1.15vw,16px)] font-bold leading-tight text-[#111827]">{demoClinic.name}</p>
              <p className="text-[clamp(6px,0.72vw,10px)] text-[#6B7280]">{demoClinic.area}</p>
              <p className="mt-[9%] text-[clamp(8px,1vw,14px)] font-semibold text-[#111827]">Aap ka experience kaisa tha?</p>
              <div className="mt-[5%] flex w-full justify-center gap-[3%]">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} data-star className="block w-[15%]" style={{ color: "#E5E7EB" }}>
                    <StarIcon className="w-full" />
                  </span>
                ))}
              </div>
              <div data-gbtn className="relative mt-[11%] flex w-full items-center justify-center rounded-[12px] bg-[#0B2545] py-[6%] text-[clamp(8px,0.95vw,13px)] font-bold text-white">
                Google pe review dein
                <span data-press className="absolute left-1/2 top-1/2 aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0" />
              </div>
              <p className="mt-[6%] text-[clamp(6px,0.75vw,10px)] text-[#4B5563] underline">Private feedback bhejein</p>
            </div>

            {/* Review posted */}
            <div data-posted className="absolute inset-0 flex flex-col items-center justify-center px-[10%] text-center opacity-0">
              <span className="grid aspect-square w-[22%] place-items-center rounded-full bg-[#E7F6EE] text-[#0E7C5A]">
                <svg viewBox="0 0 24 24" className="w-1/2" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-[8%] text-[clamp(10px,1.3vw,18px)] font-bold text-[#111827]">Review posted</p>
              <div className="mt-[4%] flex gap-[3%]">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} data-posted-star className="block w-[13%] min-w-[10px] text-[#F5B301]">
                    <StarIcon className="w-full" />
                  </span>
                ))}
              </div>
              <p className="mt-[5%] text-[clamp(7px,0.85vw,12px)] text-[#6B7280]">Shukriya! {demoClinic.name} thanks you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
