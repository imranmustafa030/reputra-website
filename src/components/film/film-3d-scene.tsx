"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { contact, demoClinic } from "@/content/site";

/*
  A modelled phone, NFC card and acrylic stand, lit like a product shot.
  `progress` (0..1) is written by GSAP from outside; the scene reads it every frame.
  Beats (same as the HTML film): lower 0–0.30 · tap 0.30–0.42 · page 0.37 ·
  stars 0.48–0.68 · press 0.72 · posted 0.84.
*/

const INK = "#0B2545";
const GOLD = "#F5B301";

type Screen = { state: "lock" | "page" | "posted"; stars: number; pressed: boolean };

function screenFor(p: number): Screen {
  if (p < 0.37) return { state: "lock", stars: 0, pressed: false };
  if (p >= 0.82) return { state: "posted", stars: 5, pressed: false };
  const stars = p < 0.48 ? 0 : Math.min(5, Math.floor((p - 0.48) / 0.04) + 1);
  return { state: "page", stars, pressed: p >= 0.72 && p < 0.8 };
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p: number, a: number, b: number) => ease(THREE.MathUtils.clamp((p - a) / (b - a), 0, 1));

/* ---------- geometry helpers ---------- */

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** A flat rounded-rect plane whose UVs run 0..1 across its bounds (ShapeGeometry's don't). */
function roundedPlane(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

function starShape(outer = 0.5, inner = 0.21) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

/* ---------- canvas textures ---------- */

function pageFont() {
  return typeof document === "undefined" ? "sans-serif" : getComputedStyle(document.body).fontFamily || "sans-serif";
}

function star2d(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.42;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    else ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawScreen(ctx: CanvasRenderingContext2D, W: number, H: number, s: Screen) {
  const f = pageFont();
  ctx.textAlign = "center";
  if (s.state === "lock") {
    ctx.fillStyle = "#0E2340";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `600 230px ${f}`;
    ctx.fillText("11:32", W / 2, 520);
    ctx.globalAlpha = 0.72;
    ctx.font = `500 52px ${f}`;
    ctx.fillText("Tuesday, 14 October", W / 2, 610);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.roundRect(70, 1080, W - 140, 300, 56);
    ctx.fill();
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.roundRect(120, 1130, 76, 76, 18);
    ctx.fill();
    star2d(ctx, 158, 1170, 28, INK);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `600 40px ${f}`;
    ctx.fillText("NFC · now", 222, 1184);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 56px ${f}`;
    ctx.fillText(demoClinic.name, 120, 1278);
    ctx.font = `500 48px ${f}`;
    ctx.globalAlpha = 0.9;
    ctx.fillText("Tap to review your visit", 120, 1344);
    ctx.globalAlpha = 1;
    return;
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  if (s.state === "posted") {
    ctx.fillStyle = "#E7F6EE";
    ctx.beginPath();
    ctx.arc(W / 2, 900, 130, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0E7C5A";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(W / 2 - 58, 905);
    ctx.lineTo(W / 2 - 14, 950);
    ctx.lineTo(W / 2 + 64, 860);
    ctx.stroke();
    ctx.fillStyle = "#111827";
    ctx.font = `700 84px ${f}`;
    ctx.fillText("Review posted", W / 2, 1170);
    for (let i = 0; i < 5; i++) star2d(ctx, W / 2 - 240 + i * 120, 1300, 48, GOLD);
    ctx.fillStyle = "#6B7280";
    ctx.font = `500 46px ${f}`;
    ctx.fillText(`Shukriya! ${demoClinic.name}`, W / 2, 1450);
    ctx.fillText("thanks you.", W / 2, 1510);
    return;
  }

  // the clinic's review page
  ctx.fillStyle = "#F2F2F0";
  ctx.beginPath();
  ctx.roundRect(70, 200, W - 140, 96, 28);
  ctx.fill();
  ctx.fillStyle = "#374151";
  ctx.font = `500 40px ${f}`;
  ctx.fillText(`${contact.domain}/r/${demoClinic.slug}`, W / 2, 262);

  ctx.fillStyle = "#0E7490";
  ctx.beginPath();
  ctx.arc(W / 2, 520, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 96px ${f}`;
  ctx.fillText(demoClinic.initials, W / 2, 553);

  ctx.fillStyle = "#111827";
  ctx.font = `700 76px ${f}`;
  ctx.fillText(demoClinic.name, W / 2, 790);
  ctx.fillStyle = "#6B7280";
  ctx.font = `500 46px ${f}`;
  ctx.fillText(demoClinic.area, W / 2, 860);

  ctx.fillStyle = "#111827";
  ctx.font = `600 62px ${f}`;
  ctx.fillText("Aap ka experience kaisa tha?", W / 2, 1060);
  for (let i = 0; i < 5; i++) star2d(ctx, W / 2 - 360 + i * 180, 1220, 72, i < s.stars ? GOLD : "#E5E7EB");

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(90, 1400, W - 180, 190, 48);
  ctx.fill();
  if (s.pressed) {
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.arc(W / 2, 1495, 120, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 60px ${f}`;
  ctx.fillText("Google pe review dein", W / 2, 1516);
  ctx.fillStyle = "#4B5563";
  ctx.font = `500 44px ${f}`;
  ctx.fillText("Private feedback bhejein", W / 2, 1700);
}

function useScreenTexture(screen: Screen) {
  const { gl } = useThree();
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1080;
    c.height = 2240;
    return c;
  }, []);
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return t;
  }, [canvas, gl]);
  const [fonts, setFonts] = useState(0);
  useEffect(() => {
    document.fonts?.ready.then(() => setFonts((n) => n + 1));
  }, []);
  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawScreen(ctx, canvas.width, canvas.height, screen);
    // eslint-disable-next-line react-hooks/immutability -- three.js textures are updated in place
    tex.needsUpdate = true;
  }, [canvas, tex, screen, fonts]);
  return tex;
}

function useCardFace() {
  const { gl } = useThree();
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1292;
    const ctx = c.getContext("2d")!;
    const f = pageFont();
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "rgba(242,239,232,0.92)";
    ctx.font = `800 104px ${f}`;
    ctx.fillText("reputra", 130, 230);
    ctx.fillStyle = GOLD;
    ctx.font = `700 64px ${f}`;
    ctx.fillText("Tap to review", 130, 1150);
    ctx.strokeStyle = "rgba(242,239,232,0.8)";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(1800, 1110, 44 + i * 40, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return t;
  }, [gl]);
}

function useStandPrint() {
  const { gl } = useThree();
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1448;
    const ctx = c.getContext("2d")!;
    const f = pageFont();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, c.width, c.height);
    star2d(ctx, 512, 170, 64, GOLD);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.font = `800 62px ${f}`;
    ctx.fillText("Scan or tap to", 512, 330);
    ctx.fillText("review us on Google", 512, 405);
    // QR-like code (decorative, not scannable)
    const cells = 21;
    const size = 560;
    const x0 = 512 - size / 2;
    const y0 = 480;
    const cell = size / cells;
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const finder = (fx: number, fy: number) => {
      ctx.fillStyle = INK;
      ctx.fillRect(x0 + fx * cell, y0 + fy * cell, cell * 7, cell * 7);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x0 + (fx + 1) * cell, y0 + (fy + 1) * cell, cell * 5, cell * 5);
      ctx.fillStyle = INK;
      ctx.fillRect(x0 + (fx + 2) * cell, y0 + (fy + 2) * cell, cell * 3, cell * 3);
    };
    ctx.fillStyle = INK;
    for (let y = 0; y < cells; y++)
      for (let x = 0; x < cells; x++) {
        const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        if (!inFinder && rnd() > 0.52) ctx.fillRect(x0 + x * cell, y0 + y * cell, cell, cell);
      }
    finder(0, 0);
    finder(14, 0);
    finder(0, 14);
    ctx.fillStyle = "#4B5563";
    ctx.font = `600 44px ${f}`;
    ctx.fillText(demoClinic.name, 512, 1180);
    ctx.font = `500 34px ${f}`;
    ctx.fillText(`${contact.domain}/r/${demoClinic.slug}`, 512, 1240);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return t;
  }, [gl]);
}

/* ---------- objects ---------- */

const PHONE_W = 1.52;
const PHONE_H = 3.12;
const PHONE_R = 0.25;
const PHONE_D = 0.16;

function Phone({ screen }: { screen: Screen }) {
  const screenTex = useScreenTexture(screen);
  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(PHONE_W - 0.06, PHONE_H - 0.06, PHONE_R - 0.03), {
      depth: PHONE_D - 0.06,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 8,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);
  const glass = useMemo(() => roundedPlane(PHONE_W - 0.02, PHONE_H - 0.02, PHONE_R - 0.01), []);
  const display = useMemo(() => roundedPlane(PHONE_W - 0.13, PHONE_H - 0.13, PHONE_R - 0.07), []);
  const island = useMemo(() => roundedPlane(0.42, 0.11, 0.055), []);
  const cameraPlate = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(0.62, 0.62, 0.16), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 4, curveSegments: 16 });
    g.center();
    return g;
  }, []);
  const z = PHONE_D / 2;

  return (
    <group>
      {/* titanium frame and back */}
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#26292F" metalness={0.9} roughness={0.32} clearcoat={0.5} clearcoatRoughness={0.2} envMapIntensity={0.9} />
      </mesh>
      {/* black glass front */}
      <mesh geometry={glass} position={[0, 0, z + 0.001]}>
        <meshPhysicalMaterial color="#050608" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {/* the display */}
      <mesh geometry={display} position={[0, 0, z + 0.002]}>
        <meshBasicMaterial map={screenTex} toneMapped={false} />
      </mesh>
      {/* reflections on the glass over the display */}
      <mesh geometry={glass} position={[0, 0, z + 0.004]}>
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.04} metalness={0} clearcoat={1} envMapIntensity={2.4} depthWrite={false} />
      </mesh>
      {/* dynamic island */}
      <mesh geometry={island} position={[0, PHONE_H / 2 - 0.2, z + 0.005]}>
        <meshBasicMaterial color="#020203" />
      </mesh>
      {/* side buttons */}
      <mesh position={[PHONE_W / 2 + 0.005, 0.45, 0]}>
        <boxGeometry args={[0.02, 0.42, 0.06]} />
        <meshStandardMaterial color="#26292F" metalness={0.9} roughness={0.32} />
      </mesh>
      <mesh position={[-PHONE_W / 2 - 0.005, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.22, 0.06]} />
        <meshStandardMaterial color="#26292F" metalness={0.9} roughness={0.32} />
      </mesh>
      <mesh position={[-PHONE_W / 2 - 0.005, 0.38, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.06]} />
        <meshStandardMaterial color="#26292F" metalness={0.9} roughness={0.32} />
      </mesh>
      {/* camera island on the back */}
      <group position={[-0.36, PHONE_H / 2 - 0.5, -z - 0.012]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={cameraPlate}>
          <meshPhysicalMaterial color="#2F333A" metalness={0.6} roughness={0.35} clearcoat={1} />
        </mesh>
        {[
          [-0.13, 0.13],
          [-0.13, -0.13],
          [0.13, 0],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.03, 32]} />
            <meshPhysicalMaterial color="#0B0C0E" metalness={0.4} roughness={0.1} clearcoat={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Card({ ringRef, glowRef }: { ringRef: MutableRefObject<THREE.Mesh | null>; glowRef: MutableRefObject<THREE.MeshBasicMaterial | null> }) {
  const face = useCardFace();
  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(3.2, 2.02, 0.13), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3, curveSegments: 20 });
    g.center();
    return g;
  }, []);
  const facePlane = useMemo(() => roundedPlane(3.2, 2.02, 0.13), []);
  const star = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(starShape(0.3, 0.13), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3 });
    g.center();
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#081C35" roughness={0.75} clearcoat={0.15} clearcoatRoughness={0.5} envMapIntensity={0.15} />
      </mesh>
      <mesh geometry={facePlane} position={[0, 0, 0.0185]}>
        <meshPhysicalMaterial map={face} roughness={0.75} clearcoat={0.15} clearcoatRoughness={0.5} envMapIntensity={0.12} color="#C9CFDA" />
      </mesh>
      <mesh geometry={facePlane} position={[0, 0, 0.0195]}>
        <meshBasicMaterial ref={glowRef} color={GOLD} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh geometry={star} position={[0, 0.08, 0.035]}>
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.22} emissive="#5A3A00" emissiveIntensity={0.25} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.05, 0.03]}>
        <ringGeometry args={[0.48, 0.54, 96]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Stand() {
  const print = useStandPrint();
  return (
    <group>
      {/* the printed card inside the acrylic */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.42, 2.0]} />
        <meshStandardMaterial map={print} roughness={0.75} envMapIntensity={0.35} />
      </mesh>
      {/* clear acrylic block */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.62, 2.24, 0.06]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.14} roughness={0.03} metalness={0} clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={1.6} depthWrite={false} />
      </mesh>
      {/* bent acrylic foot */}
      <mesh position={[0, -1.12, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.62, 0.5, 0.05]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.18} roughness={0.03} clearcoat={1} envMapIntensity={1.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Rig({ progress, stand, reduced }: { progress: MutableRefObject<number>; stand: boolean; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh | null>(null);
  const glow = useRef<THREE.MeshBasicMaterial | null>(null);
  const [screen, setScreen] = useState<Screen>(() => screenFor(reduced ? 1 : progress.current));
  const key = useRef("");
  const { pointer, viewport } = useThree();
  const narrow = viewport.aspect < 0.85;

  useFrame((state, delta) => {
    const p = reduced ? 1 : progress.current;
    const t = state.clock.elapsedTime;

    const s = screenFor(p);
    const k = `${s.state}-${s.stars}-${s.pressed}`;
    if (k !== key.current) {
      key.current = k;
      setScreen(s);
    }

    if (root.current) {
      const tx = reduced ? 0 : pointer.y * 0.06;
      const ty = reduced ? 0 : pointer.x * 0.14;
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, tx, 3, delta);
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, ty, 3, delta);
    }

    if (phone.current) {
      const down = seg(p, 0, 0.3);
      const lift = seg(p, 0.42, 0.62);
      const float = reduced ? 0 : Math.sin(t * 1.1) * 0.03 * (1 - down + lift);
      // hover → touching the card → lifted towards the viewer to show the screen
      phone.current.position.set(
        THREE.MathUtils.lerp(0.5, 0.1, down) + lift * 0.12,
        THREE.MathUtils.lerp(1.05, 0.16, down) + lift * 0.72 + float,
        THREE.MathUtils.lerp(0.45, 0.12, down) + lift * 0.4,
      );
      phone.current.rotation.set(
        THREE.MathUtils.lerp(-0.42, -1.22, down) + lift * 0.62,
        THREE.MathUtils.lerp(-0.12, 0, down) - lift * 0.06,
        THREE.MathUtils.lerp(-0.22, -0.08, down) + lift * 0.02,
      );
    }

    if (ring.current) {
      const r = (p - 0.3) / 0.14;
      const on = r >= 0 && r <= 1 && !reduced;
      ring.current.visible = on;
      ring.current.scale.setScalar(0.5 + Math.max(0, r) * 2.2);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = on ? 0.85 * (1 - r) : 0;
    }
    if (glow.current) {
      const gph = 1 - Math.abs((p - 0.36) / 0.06);
      glow.current.opacity = reduced ? 0 : Math.max(0, gph) * 0.18;
    }
  });

  const scale = narrow ? 0.82 : 1;
  return (
    <group ref={root} scale={scale} position={[0, narrow ? 0.15 : 0, 0]}>
      {/* the counter: card lying flat */}
      <group position={[-0.15, -0.55, 0.2]} rotation={[-Math.PI / 2, 0, 0.26]}>
        <Card ringRef={ring} glowRef={glow} />
      </group>
      {stand ? (
        <group position={[1.55, 0.6, -1.0]} rotation={[-0.08, -0.38, 0]}>
          <Stand />
        </group>
      ) : null}
      <group ref={phone}>
        <Phone screen={screen} />
      </group>
      <ContactShadows position={[0, -0.57, 0]} scale={10} opacity={0.42} blur={2.4} far={2.6} resolution={1024} color={INK} frames={Infinity} />
    </group>
  );
}

export default function Film3DScene({
  progress,
  stand,
  reduced,
  active,
  onReady,
}: {
  progress: MutableRefObject<number>;
  stand: boolean;
  reduced: boolean;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.6, 7.4], fov: 30 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0.35, 0);
        onReady();
      }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Environment resolution={512} frames={1}>
        <color attach="background" args={["#f4f4f2"]} />
        {/* a studio: big soft key from above, two strip lights, a warm kicker */}
        <Lightformer form="rect" intensity={4} position={[0, 6, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[-5, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[8, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[5, 2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 1.2, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#FFE7B0" position={[2, 1, 6]} scale={3} />
      </Environment>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 6, 4]} intensity={1.1} />
      <Rig progress={progress} stand={stand} reduced={reduced} />
    </Canvas>
  );
}
