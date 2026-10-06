# WER1 GROUP scroll experience

`npm run dev` serves http://127.0.0.1:5173/. `npm run lint` checks the source; `npm run build` creates `dist/`. `npm run test:e2e` checks the seven-card sequence and stationary centerpiece against the running development server.

App renders a 400vh scroll container and fixed full-screen canvas. The header labels and navigation layout are preserved, with champagne gold on a near-black background.

The centerpiece is the supplied, unmodified `Luxurious_WER1_Group_Gold_Logo.webp`, served from `public/images/hero/`. `App.tsx` displays the full native-aspect image in a fixed centered layer. Narrow CSS edge masks blend its outer background into the navy-black page without cropping the logo/platform.

`HeroImage.tsx` reuses the same image on a camera-aligned silhouette mesh for depth occlusion. Readable cards sit in front of this plane; departing cards pass behind the lettering/platform outline. The full image remains visible underneath the transparent card canvas. No generated lettering, platform, lighting, environment, or GLB is rendered. `FixedCamera.tsx` preserves the existing card camera orientation and framing.

Seven data-driven `ProjectCard3D` instances reuse the Aikyam texture design, perspective, depth testing and enter/read/retreat animation. Each is independent of the static logo centerpiece. All render images are extracted from `wer1 profile.pdf`; provenance and web dimensions are in `public/images/projects/README.md`. Every card uses **Residential + Commercial**, as instructed.

| Project | Side | Global scroll interval |
| --- | --- | --- |
| Aikyam | Left | 8–20% |
| Sinclair Place | Right | 20–32% |
| Sukhada Apartment | Left | 32–44% |
| Chinchwad | Right | 44–56% |
| Marunji | Left | 56–68% |
| Punawale Phase 1 | Right, wider panel | 68–82% |
| Punawale Phase 2 | Left, wider panel | 82–96% |

Each interval contains entry (0–18%), approach (18–45%), stable reading (45–73%), and depth retreat/fade (73–100%). All images retain their complete source aspect ratio; upcoming cards use a wider presentation. No card remains at the end of the scroll. The original 400vh page / 300vh scrolling distance is unchanged. The logo and camera remain fixed throughout.

`ProjectCards3D` prepares only cards near the current scroll position (at most two), including the approaching card. Generated canvas textures are disposed when their card unmounts, and reverse scrolling remounts the correct card using cached static images. Card loading does not suspend or replace the centerpiece. No PDF parsing occurs at runtime.

## Responsive behavior

The approved desktop layout and card values remain the baseline at 1024px and above. `styles/responsive.css` owns tablet (768–1023px) and mobile (below 768px) layout overrides. Compact layouts use stable viewport height, shared spacing tokens, and a DPR cap of 1.25. A short-landscape override keeps the image and card side by side after orientation changes.

`features/three/cardLayout.ts` keeps the original desktop coordinates separate from compact card positions. The image occlusion mesh reads the compact image bounds so the supplied WebP and its depth mask remain aligned. Reduced-motion mode retains readable cards with fades, without spatial travel. Touch cards keep a persistent EXPLORE cue and the same project-anchor action.

The mobile header uses a native modal dialog for focus containment, Escape dismissal, and scroll locking. About and Projects stack on mobile; tablet retains paired columns and wraps the metrics. Existing desktop screenshots, all nine requested viewports, project anchors, touch, orientation changes, and reduced motion are covered by the Playwright suite.
