# Implementation cleanup

All previous implementation files below were removed before creating the new application. Paths present again contain new implementations/configuration, not preserved UI. Git history was not modified. Asset relocations are recorded separately in manifest.json.

- `.gitignore`
- `.node-version`
- `README.md`
- `eslint.config.js`
- `index.html`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `public/404.html`
- `public/_headers`
- `public/images/README.md`
- `public/images/projects/README.md`
- `public/models/README.md`
- `public/robots.txt`
- `src/App.tsx`
- `src/components/layout/Header.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/CompanySection.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/sections/ProjectsSection.tsx`
- `src/components/sections/ServiceCard.tsx`
- `src/components/sections/TeamPanel.tsx`
- `src/components/sections/TeamSection.tsx`
- `src/components/sections/WhatWeDoSection.tsx`
- `src/components/sections/WhyChooseSection.tsx`
- `src/data/projects.ts`
- `src/data/services.ts`
- `src/data/team.ts`
- `src/features/three/FixedCamera.tsx`
- `src/features/three/HeroImage.tsx`
- `src/features/three/LogoScene.tsx`
- `src/features/three/ProjectCard3D.tsx`
- `src/features/three/ProjectCards3D.tsx`
- `src/features/three/cardLayout.ts`
- `src/features/three/useCardHover.ts`
- `src/hooks/useMediaQuery.ts`
- `src/lib/projectNavigation.ts`
- `src/main.tsx`
- `src/styles/company.css`
- `src/styles/prototype.css`
- `src/styles/responsive.css`
- `src/styles/sections.css`
- `src/styles/services.css`
- `src/styles/team.css`
- `tests/card-hover.spec.ts`
- `tests/company-sections.spec.ts`
- `tests/project-card.spec.ts`
- `tests/project-navigation.spec.ts`
- `tests/responsive.spec.ts`
- `tests/static-logo.spec.ts`
- `tsconfig.json`
- `vite.config.ts`

Old node_modules, dist, test-results, local .env, and .DS_Store files were also removed. New dependencies and dist were generated from the fresh application.
