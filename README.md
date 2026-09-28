# WER1 Group

Static homepage based on the approved Stitch **WER1 Group — Homepage V2**:

- Project: `11805015439516923329`
- Screen: `1b08d3c063c0420c9d83cca3ac4e05d5`

## Local review

Requires Node.js 20 or newer for the optional development scripts. No package installation is needed.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Open http://127.0.0.1:4173. Stop the preview with Ctrl+C. The preview serves only public files, never `.env`, `.git`, or source modules.

## Editing

- `src/components.mjs`: reusable header/navigation, buttons, section headings, project cards/grid, philosophy grid and footer.
- `src/homepage.mjs`: homepage section composition.
- `src/data.mjs`: verified project content, business areas, credibility points and navigation.
- `style.css`: exact WER1 color tokens, typography, responsive layouts and restrained interactions.
- `assets/navigation.js`: progressive, keyboard-accessible mobile navigation.
- `assets/images/`: locally hosted imagery from the approved Stitch screen; `-small` variants support responsive loading.
- `index.html`: generated, complete HTML. Regenerate after editing the source modules and include the updated file in any future commit.

The page remains readable and navigable without JavaScript. Only the mobile disclosure menu needs JavaScript. Cormorant Garamond and Inter load through Google Fonts with `display=swap` and local fallbacks. No runtime framework, Tailwind CDN, icon font, animation library, or application environment variables are required.

## Deployment continuity

The existing site served `index.html` and `style.css` from the repository root. That contract is preserved: **the deployment directory remains the repository root, and no Cloudflare build command is required**. The generated `index.html` is included rather than requiring deployment-time generation. There was no checked-in Cloudflare/Wrangler configuration or CI workflow to change; any dashboard-side settings remain outside this repository's visibility.

The existing `.env`, `.gitignore`, Git remote and branch configuration are unchanged. `.env` contains a local Stitch credential; it is not used or referenced by the website and must stay out of published artifacts. No commit, push or deployment is performed by the scripts.

## Content and future pages

Only `/` is implemented. Navigation uses working in-page anchors; enquiry opens `wer1infra@gmail.com`. Future `/about`, `/projects`, `/projects/[slug]` and `/contact` pages can reuse the modules and design tokens without placeholder routes today.

Company and project facts come from `docs/wer1-codex-profile.md`. The portfolio contains all three completed, two ongoing and two upcoming projects, using their corresponding extracted images under `public/images/projects/`. Unnamed projects have neutral location labels; upcoming phases remain internal identifiers. Cards show documented types where available and distinguish completion, expected completion and launch dates. No project detail routes exist yet.

The confirmed enquiry email is `wer1infra@gmail.com`; both profile phone numbers are included. No office address is supplied. The Stitch hero and contact backgrounds remain decorative illustrations, not project photography; the hero retains its illustrative imagery label. Layout, typography, colors and responsive behavior are preserved.

## Intentional production differences from Stitch

- Responsive 3/2/1 project grids, a functioning mobile menu and accessible focus/reduced-motion behavior.
- Actual WER1 CSS tokens replace the export's extra generated theme colors; low-contrast small text on ivory uses dark text.
- Unsupported geographic/business/financial claims, archive dates and monograph metadata were removed or replaced with conservative copy.
- The known email is an active mail link; CTAs no longer link to themselves.
- Project cards have no nonexistent detail-page destinations. A section note explains the source and unnamed project labels.
- The footer is simplified to brand, navigation and contact, omitting the prototype's extra Monograph column.
- Hero height adapts to the viewport instead of the export's fixed 870px; spacing adapts on smaller screens.
- The hero image's baked-in prototype navigation is cropped out with CSS. Philosophy numerals use the muted-text token for sufficient large-text contrast on ivory.

## Checks

```sh
node scripts/build.mjs
node --check assets/navigation.js
node --check src/components.mjs
node --check src/homepage.mjs
node --check src/data.mjs
node --check scripts/serve.mjs
git diff --check
```

There is no existing lint or TypeScript toolchain. Browser review should cover 375, 768, 1024 and 1440px widths, keyboard navigation, reduced motion and image loading. Browser test dependencies are intentionally kept outside the production repository.

Implementation verification (2026-09-26): static build, JavaScript syntax, exact palette, reproducible generation and Git whitespace checks passed. Headless Chrome checks at 375, 768, 1024, 1440 and 1920px found no horizontal overflow, missing images/anchors, console errors or automated axe WCAG A/AA violations. Mobile menu opening, Escape/focus return and link selection passed, as did reduced-motion and navigation without JavaScript. Desktop/mobile screenshots were visually reviewed against the Stitch source. Automated accessibility checks do not replace a full manual audit.
