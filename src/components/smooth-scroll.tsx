"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Smooth scroll on desktop only. Phones and reduced-motion users keep native scrolling.
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -88 } });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
