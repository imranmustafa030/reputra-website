"use client";

import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProductFilm } from "@/components/film/product-film";
import { ProductFilm3D } from "@/components/film/product-film-3d";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";
import { t, wrap } from "./tokens";

const beats = [
  {
    step: "Tap the card",
    title: "The patient taps the card.",
    line: "Or scans the QR stand, or opens the WhatsApp message your receptionist sends from the clinic's own number.",
  },
  {
    step: "Pick five stars",
    title: "Your page opens, in Urdu or English.",
    line: "No app and no login. Your clinic's page asks one question, and the patient picks the stars.",
    urdu: "آپ کا تجربہ کیسا تھا؟",
  },
  {
    step: "Post on Google",
    title: "Five stars, straight to Google.",
    line: "One button opens Google's own review box. Unhappy patients can write to you privately, and the Google button stays on screen.",
  },
];

/*
  Phones run the light HTML film for now: ProductFilm3D's gsap.matchMedia lists only a
  "desktop" condition, so on a phone it never builds its scroll trigger and never reports
  progress. Once that is fixed, set this to true: phones then get the 3D film in the same scene.
*/
const PHONE_3D = false;

const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (cb: () => void) => {
  const m = window.matchMedia(DESKTOP);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
function useDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => false);
}

/** Which beat the film is on: the page opens at about 0.38, the Google button is pressed at about 0.72. */
const beatAt = (p: number) => (p < 0.38 ? 0 : p < 0.72 ? 1 : 2);
/** The product docks over the first 14% of the run, while the first caption slides in. */
const dockAt = (p: number) => {
  const x = Math.min(1, Math.max(0, p / 0.14));
  return x * x * (3 - 2 * x);
};

function UrduLine({ text }: { text: string }) {
  return (
    <span lang="ur" dir="rtl" data-dummy="D34" className="urdu mt-1 block text-left text-[19px] leading-[2] lg:text-[22px]">
      {text}
    </span>
  );
}

/**
 * The signature scene, on the counter plane. It pins for a short run (+=120%) on every width.
 * The product starts centred and large; as the scroll films the tap it docks left (on phones it
 * also scales to 70%), while the caption and the step indicator slide in from the right and
 * change with the film's beats.
 */
export function FilmScene() {
  const scene = useRef<HTMLElement>(null);
  const filmCol = useRef<HTMLDivElement>(null);
  const dock = useRef(0);
  const [beat, setBeat] = useState(0);
  const reduced = useReducedMotion();
  const desktop = useDesktop();
  const Film = desktop || PHONE_3D ? ProductFilm3D : ProductFilm;

  // Desktop: how far the film column sits from the centre of the screen, so it can start centred.
  useLayoutEffect(() => {
    const el = scene.current;
    const col = filmCol.current;
    if (!el || !col) return;
    const measure = () => {
      const r = col.getBoundingClientRect();
      const dx = Number.parseFloat(el.style.getPropertyValue("--dx") || "0");
      const base = r.left - dx * (1 - dock.current);
      el.style.setProperty("--dx", `${(window.innerWidth / 2 - (base + r.width / 2)).toFixed(1)}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [desktop]);

  const onProgress = useCallback((p: number) => {
    const s = dockAt(p);
    dock.current = s;
    scene.current?.style.setProperty("--s", s.toFixed(4));
    const next = beatAt(p);
    setBeat((prev) => (prev === next ? prev : next));
  }, []);

  const active = reduced ? -1 : beat;

  return (
    <section ref={scene} id="how" data-film-scene aria-labelledby="how-title" className="vc-scene bg-[#F4F4F2]">
      <div className={cn(wrap, "vc-scene-grid")}>
        <div ref={filmCol} className="vc-film-col">
          <div className="vc-film">
            <Film key={desktop ? "d" : "p"} trigger="[data-film-scene]" mode="scroll" pin distance="+=120%" stand onProgress={onProgress} />
          </div>
          <ol aria-label="What the film shows" className="vc-steps">
            {beats.map((b, i) => (
              <li key={b.step} className="vc-step" data-active={reduced || active === i}>
                <span className="vc-step-dot" aria-hidden />
                {b.step}
              </li>
            ))}
          </ol>
        </div>

        <div className="vc-captions">
          {reduced ? (
            <ol className="vc-static">
              {beats.map((b, i) => {
                const Heading = i === 0 ? "h2" : "h3";
                return (
                  <li key={b.title}>
                    <Heading id={i === 0 ? "how-title" : undefined} className={t.h2}>
                      {b.title}
                    </Heading>
                    <p className={cn(t.body, "mt-3 max-w-[44ch]")}>
                      {b.line}
                      {b.urdu ? <UrduLine text={b.urdu} /> : null}
                    </p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <>
              <h2 id="how-title" className={cn(t.h2, "vc-stack max-w-[17ch]")}>
                {beats.map((b, i) => (
                  <span key={b.title} className="block" data-on={active === i} data-vc-cap>
                    {b.title}{" "}
                  </span>
                ))}
              </h2>
              <div className="vc-stack mt-3 lg:mt-6">
                {beats.map((b, i) => (
                  <p key={b.title} className={cn(t.body, "max-w-[44ch]")} data-on={active === i} data-vc-cap>
                    {b.line}
                    {b.urdu ? <UrduLine text={b.urdu} /> : null}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Without JavaScript nothing scrubs: the product sits docked and every caption shows. */}
      <noscript>
        <style>{`.vc-scene{--s:1!important;height:auto!important}.vc-stack{display:flex!important;flex-direction:column;gap:12px}[data-vc-cap]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
    </section>
  );
}
