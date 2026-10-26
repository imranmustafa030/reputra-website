"use client";

import { useEffect } from "react";

const TARGETS = "h2, h2 + p, img, [data-ui], table, details, dl, ul";

/**
 * Entrances for the parts of every section below the first screen: heading, then text, then
 * picture, 80ms apart, rising 20px. Nothing is hidden in the server HTML: only parts that are
 * still below the screen when this runs are set to wait, so a failed script leaves the page whole.
 * Photographs also settle from a slight scale. Reduced motion: nothing moves.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = document.querySelectorAll<HTMLElement>(".vc-root main section:not([data-film-scene]), .vc-root #start");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.vcIn = "in";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const fold = window.innerHeight;
    sections.forEach((section) => {
      const parts = Array.from(section.querySelectorAll<HTMLElement>(TARGETS)).filter(
        (el) => !el.parentElement?.closest("[data-ui], table, dl, ul, details") && el.offsetParent !== null,
      );
      parts.slice(0, 8).forEach((el, i) => {
        if (el.getBoundingClientRect().top < fold) return;
        el.dataset.vcIn = "wait";
        el.style.setProperty("--vc-d", `${Math.min(i, 5) * 80}ms`);
        io.observe(el);
      });
    });
    return () => io.disconnect();
  }, []);
  return null;
}
