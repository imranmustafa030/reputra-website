"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useInView } from "motion/react";
import { ProductFilm } from "@/components/film/product-film";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { demoClinic } from "@/content/site";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Film3DScene = dynamic(() => import("@/components/film/film-3d-scene"), { ssr: false });

type Props = {
  trigger?: string;
  mode?: "scroll" | "loop" | "auto";
  pin?: boolean;
  distance?: string;
  stand?: boolean;
  className?: string;
  style?: CSSProperties;
  onProgress?: (p: number) => void;
  start?: string;
  end?: string;
};

let webglOk: boolean | null = null;
function hasWebGL() {
  if (webglOk === null) {
    try {
      const c = document.createElement("canvas");
      webglOk = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglOk = false;
    }
  }
  return webglOk;
}
const noop = () => () => {};

/**
 * The product film with a modelled 3D phone, NFC card and acrylic stand.
 * Same props and the same beats as ProductFilm; falls back to it when WebGL
 * is missing or the visitor prefers reduced motion.
 */
export function ProductFilm3D(props: Props) {
  const webgl = useSyncExternalStore(noop, hasWebGL, () => false);
  const reduced = useReducedMotion();
  if (!webgl || reduced) return <ProductFilm {...props} />;
  return <Film3D {...props} />;
}

function Film3D({ trigger, mode = "auto", pin = false, distance = "+=140%", stand = false, className, style, onProgress, start, end }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [ready, setReady] = useState(false);
  const inView = useInView(root, { margin: "200px" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)" }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const proxy = { p: 0 };
        const tween = gsap.to(proxy, {
          p: 1,
          ease: "none",
          paused: true,
          onUpdate: () => {
            progress.current = proxy.p;
            onProgress?.(proxy.p);
          },
        });
        const scene = (trigger && root.current?.closest<HTMLElement>(trigger)) || root.current;
        const useScroll = mode === "scroll" || (mode === "auto" && desktop);
        if (useScroll) {
          ScrollTrigger.create({
            trigger: scene,
            start: pin ? "top top" : (start ?? "top 75%"),
            end: pin ? distance : (end ?? "bottom 25%"),
            pin: pin ? scene : false,
            scrub: 0.6,
            animation: tween,
          });
        } else {
          tween.duration(5.5).repeat(-1).repeatDelay(1.4);
          ScrollTrigger.create({
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
          });
        }
      });
    },
    { scope: root, dependencies: [mode, pin, distance, trigger, start, end] },
  );

  return (
    <div
      ref={root}
      className={cn("relative isolate aspect-[5/6] w-full select-none", className)}
      style={style}
      role="img"
      aria-label={`A phone taps the Reputra NFC card. ${demoClinic.name}'s review page opens, the patient gives five stars and posts the review on Google.`}
      data-ui
    >
      <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
        <Film3DScene progress={progress} stand={stand} reduced={false} active={inView} onReady={() => setReady(true)} />
      </div>
    </div>
  );
}
