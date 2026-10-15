# WER1 Group

React + TypeScript + Vite website for the existing Cloudflare Pages project at https://wer1group.in/. The latest refinement keeps the approved branding and project data, simplifies the homepage and moves detailed editorial content to About Us. Contact remains available. No deployment was performed.

## Development

Use Node 22 (or Node >=20.19).

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Build output is `dist/`, with Vite base `/`. No new runtime dependencies were added.

## Approved branding

The exact root file `WER1_Logo.png` is imported by the reusable Logo component and used by the header, homepage opening statement, footer, favicon and Apple touch icon. It is a 2084 × 2084 PNG with transparency, near-black #0f0f10 and gold #c4932c. Its complete original canvas and proportions are preserved; no cropping, recoloring, stretching or derived image editing is applied. Production logo bytes match the original SHA-256 checksum. Vite emits a content-hashed URL so browsers receive the new artwork rather than a cached old JPEG.

Manrope is the primary typeface and Cormorant Garamond is the editorial accent. Latin variable WOFF2 files are locally hosted and bundled with content hashes. Both SIL Open Font Licenses are preserved in `src/assets/fonts/`. Visitors make no external font requests. Darker gold is used for small text to preserve contrast; the original logo gold is used for restrained accents.

## Homepage content

The homepage is organized as hero slideshow → opening statement → project showcase → Our Expertise → Our Philosophy → Why Choose → closing contact CTA.

The complete approved copy remains in `src/data/company.ts`. The homepage retains the full opening statement and uses concise editorial previews from `src/data/homepage.ts`. Full expertise descriptions, philosophy, values, numbered approach and closing copy are available on `/about`, alongside the company introduction, mission and vision.

The five approved Why Choose titles now have short descriptions grounded in the existing company messaging, as requested in the refinement brief. No achievements or project details were added.

The reusable header retains desktop/mobile navigation. About points to `/about`; Home and Projects point to homepage sections; Contact points to `/contact`; Media opens the existing enquiry dialog. Footer navigation includes Home, About, Projects, Expertise and Contact. Project detail links are rendered only when a real detail path is configured; none exist yet.

## Project source and image mapping

`src/data/projects.ts` contains typed id, name, location, projectType, completionYear, status, landArea, totalUnits, description, images and displayOrder, plus media presentation settings.

The listing order is explicit and is never sorted automatically:

| Project | Location | Status | Completion | Image |
| --- | --- | --- | --- | --- |
| Sukhada Apartment | Punawale | Completed | 2023 | sukhada-apartment.webp |
| Sinclair Place | Punawale | Completed | 2024 | sinclair-place.webp |
| Aikyam | Punawale | Completed | 2025 | aikyam.webp |
| Marunji | Marunji | Ongoing | Expected 2027 | marunji.webp |
| Punawale | Punawale | Upcoming | Expected 2027 | Coming Soon placeholder only |
| Chinchwad | Chinchwad | Ongoing | Expected 2028 | chinchwad.webp |

Every entry uses the client-approved `Residential + Complex` projectType. Descriptions are restrained editorial sentences based only on names, localities, completion years and status.

The hero has a distinct explicit sequence: **Aikyam → Chinchwad → Sinclair Place → Sukhada Apartment → Marunji**. It contains exactly five project images, changes every 5 seconds, uses an 800ms crossfade, loops continuously and supports arrows, dots, keyboard arrows and horizontal touch gestures. Manual interaction restarts the countdown, including selecting the active dot. There is no playback toggle or hover/focus pause. StrictMode cleanup retains one timer. Reduced-motion settings disable animation while keeping automatic advancement.

Existing served WebP copies at `public/media/projects/` match the originals in `assets/projects/` byte-for-byte. No project asset was moved, renamed, overwritten or deleted in this update. ProjectMedia provides a consistent missing-image fallback. Punawale has an empty image array, is absent from the hero and displays a neutral branded Coming Soon visual with its name and expected completion. No historical Punawale photograph is referenced or requested by the app.

## Measurement verification

The complete `wer1 profile.pdf` was inspected. It contains no total-unit counts and no land-area figures for the five named completed/ongoing projects. Its two different upcoming Punawale specifications cannot be combined or mapped to the single public entry without client confirmation.

All six entries therefore keep landArea and totalUnits as null and display **Details Coming Soon**. Residential floor area is never substituted for unit counts. The historical measurements and original PDF classifications are retained outside the public content model in `assets/PROJECT_SOURCE_NOTES.md`.

## Contact

The dedicated `/contact` page and footer use the approved address; the homepage closing CTA links to Contact without repeating these details:

VTP Altitude, 5th Floor, Office No. 526, Aundh–Ravet BRTS Road, Wakad, Pune – 411033, Maharashtra, India.

Both phones (+91 9011881133 and +91 7887700722) are click-to-call. The published email is wer1infra@gmail.com. The proposed enquiry@wer1group.in address is stored separately as unverified and is not published.

Instagram is @wer1_group at the exact client-provided URL. Links use a recognizable icon, open in a new tab and include noopener/noreferrer. No follower counts or posts are fabricated. Contact actions open email/call links; no backend enquiry delivery is claimed.

## Routing and Cloudflare

Build command: `npm run build`; output directory: `dist/`; Vite base: `/`. Deploy the entire output of one build, never `index.html` alone or a mixture of deployments.

The build verification script checks all CSS/JS references in `dist/index.html`, verifies CSS font/image dependencies, generates identical React entry HTML for `/about`, `/contact`, and `/projects`, and writes exact immutable cache rules for emitted fingerprinted assets. `public/404.html` disables Cloudflare Pages' implicit SPA fallback. Unknown assets and routes return 404; `_redirects` only canonicalizes trailing slashes on supported page URLs. The current app has no configured project detail routes or `detailPath` links. When adding a route later (including project details), add its generated shell and HTML revalidation rules too.

HTML routes revalidate (`max-age=0, must-revalidate`). Only existing hashed asset URLs receive one-year immutable caching. There is deliberately no `/assets/*` immutable rule: a missing file must not inherit it. A stable `-delivery-` filename namespace bypasses previously poisoned browser asset caches; do not change this prefix on every release. Vite content hashes handle future updates automatically. Existing media revalidation and security headers remain intact.

### CSS delivery incident — verified 15 October 2026

At investigation time, live HTML referenced `/assets/index-Wl1tbQ0K.css` and `/assets/index-DIJdseVc.js`. Both returned correct MIME types and matched a clean build of commit `8da99d8` byte-for-byte. The HTML response was `CF-Cache-Status: DYNAMIC` with revalidation enabled. A cache-busted CSS request returned identical CSS. Stale HTML or the exact original failing asset could not be established from these responses.

Confirmed live failure mechanism: `/assets/delivery-probe-not-present.css` returned **200**, **text/html**, and **Cache-Control: public, max-age=31536000, immutable**. Its body exactly matched the homepage. This combines the default Pages SPA fallback with an overly broad immutable asset header, allowing a missing/stale asset request to be stored as HTML. The fix disables that fallback and limits immutable headers to actual build outputs. It does not disguise HTML as CSS or alter website design.

No Wrangler config, Pages Functions, service worker, or custom rewrite was present in the repository before this fix. Account-level Cloudflare Cache Rules, Page Rules, Workers routes, production branch, and build settings are not inspectable from repository files.

### Local delivery verification (no deployment)

```sh
npm ci
npm run build
npx --yes wrangler@4.86.0 pages dev dist --port 4174 --compatibility-date=2026-05-03
# In another terminal:
node scripts/check-delivery.mjs http://localhost:4174
# Automated browser audit starts its own Pages emulator on port 4176:
npx playwright test --config=playwright.pages.config.ts
```

The explicit compatibility date works with the locally tested Wrangler 4.86.0 runtime. `scripts/check-delivery.mjs` checks asset MIME types, immutable cache rules, HTML revalidation, route/query preservation, and real 404s for missing CSS/JS/images. Vite preview does not emulate Pages `_headers`, `_redirects`, or its fallback behavior. `tests/asset-delivery.spec.ts` covers browser asset loading, seven responsive widths, direct loads and refreshes, trailing-slash URLs, query filters, and hash deep links; the existing project-navigation tests cover filters, refresh, links, and mobile navigation.

### Cloudflare Dashboard actions for the release owner

1. Verify the intended Pages project and production branch point to the reviewed commit, the build command is `npm run build`, and the output directory is `dist`. Publish the complete build only after deployment approval.
2. Check zone Cache Rules/Page Rules and Workers routes: remove any override that caches HTML without revalidation, rewrites missing `/assets/*` to `/`, or serves another deployment. Do not apply a blanket Cache Everything rule to HTML or error responses.
3. After the approved deployment, purge the zone cache (or affected HTML and old asset URLs) and verify the custom domain and the deployment's `pages.dev` URL. Existing browser immutable entries cannot be purged from the Dashboard; the changed asset filenames bypass them.
4. Run the delivery checker against both URLs and confirm the new CSS and JS return their proper MIME types, while a nonexistent asset returns 404. Cloudflare documents the default fallback at https://developers.cloudflare.com/pages/configuration/serving-pages/ and header behavior at https://developers.cloudflare.com/pages/configuration/headers/.

No push, deployment, Dashboard change, or production purge was performed by this fix.

## Previous brand/content update — changed files

Modified:
- `src/data/company.ts`, `src/data/projects.ts`
- `src/components/Header.tsx`, `Footer.tsx`, `ProjectCard.tsx`, `ProjectFacts.tsx`, `ProjectMedia.tsx`
- `src/sections/AboutSection.tsx`, `ServicesSection.tsx`, `WhyChooseSection.tsx`, `ContactSection.tsx`
- `src/pages/HomePage.tsx`, `src/App.tsx`
- `src/styles/global.css`, `src/styles/homepage.css`
- `index.html`, `public/_headers`
- `tests/homepage.spec.ts`, `tests/homepage-projects.spec.ts`, `README.md`

Created:
- `src/components/Logo.tsx`, `InstagramLink.tsx`, `MediaDialog.tsx`, `PageMetadata.tsx`
- `src/sections/PhilosophySection.tsx`, `ValuesSection.tsx`, `ApproachSection.tsx`, `ClosingSection.tsx`
- `src/pages/ContactPage.tsx`, `src/vite-env.d.ts`
- Two WOFF2 font files and their licenses in `src/assets/fonts/`
- `assets/PROJECT_SOURCE_NOTES.md`

The supplied original `WER1_Logo.png` is used unchanged. Git history and archived assets are preserved.

## Verification and remaining input

`npm run build` passes TypeScript and Vite production compilation. All 25 browser checks pass against production output, including all seven widths (1920, 1440, 1366, 1024, 768, 430, 390), navigation, brand image proportions, five-slide order and wraparound, manual countdown resets, 800ms fade, reduced motion, six-project filter order, accurate facts, pending measurement fields, asset mapping, image fallbacks, no Punawale/old-logo requests, safe Instagram links, direct Contact and About URLs, preservation of complete editorial copy, cross-page anchor navigation and visible content without IntersectionObserver. Normal browsing produces no console errors or missing assets. Screenshots are saved under ignored `test-results/`.

Remaining client input: all six land areas and unit counts; precise attribution of the historical Punawale records; verification if the proposed business email is activated; approved content for other internal pages. Higher-resolution project originals would improve large-screen image sharpness.

Recommended next step: review the refined homepage and About page, then supply missing project facts and authorize Projects detail pages. Deployment requires separate approval.

## Homepage refinement

Responsive spacing and type tokens live in `src/styles/refinements.css`. The introduction has balanced columns and a compact original logo. Expertise uses five equal-width editorial rows. Sinclair Place's existing image anchors the philosophy preview. Why Choose uses readable headings with supporting descriptions. Detailed Values and Approach sections are reused on About rather than repeated on the homepage.

The closing section retains its approved headline and dark background, with one prominent Contact CTA. Full contact details and Instagram remain in the footer alongside new navigation.

Scroll enhancement in `src/hooks/useScrollReveal.ts` animates a small number of section introductions only when visible. Content is visible even without IntersectionObserver; reduced-motion preferences disable animations. Cross-page fragment links resolve after the React page and local fonts load.

Created: `src/data/homepage.ts`, `src/hooks/useScrollReveal.ts`, `src/pages/AboutPage.tsx`, `src/styles/refinements.css`, `tests/editorial.spec.ts`.

Modified: App/main entry points, HomePage, Header, Footer, AboutSection, ServicesSection, PhilosophySection, WhyChooseSection, ClosingSection, existing browser tests, About cache rules and this documentation. The original logo, project data, carousel implementation and all project assets remain unchanged.
