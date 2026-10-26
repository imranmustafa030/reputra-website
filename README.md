# Reputra website (code)

Next.js 16 + Tailwind 4 + Motion + GSAP + React Three Fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (add ?dummy to outline every dummy item)
npm run build      # production build
```

## Where things are

| What | Where |
|---|---|
| **All text, prices, numbers, contact details** | `src/content/site.ts` (dummy values are marked `⚑ Dxx`, see `../TO-CHANGE.md`) |
| Page sections | `src/components/sections/` |
| 3D hero scene (phone + NFC card) | `src/components/three/hero-scene.tsx` |
| React Bits components | `src/components/reactbits/` |
| Brand colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Images | `public/images/` (AI stand-ins ⚑ D21 / D33, Unsplash photo ⚑ D22) |

## Motion and accessibility
- Desktop only: Lenis smooth scroll, GSAP pinned "How it works".
- `prefers-reduced-motion`: no smooth scroll, no pinning, no 3D movement, numbers jump straight to their value.
- No WebGL or slow device: the hero shows the still render instead of the 3D scene.
