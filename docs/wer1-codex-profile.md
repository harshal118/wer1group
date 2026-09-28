# WeR1 Infra - Website Content & Asset Reference

Source: `wer1 profile.pdf` (company profile supplied by client)

> This file is intended as source material for Codex while developing the WeR1 Group / WeR1 Infra website. Keep source facts separate from marketing copy added later. Project names are only provided in the source for completed projects; the ongoing and upcoming projects are unnamed.

## Company identity

- Brand/company name used throughout profile: **WeR1 Infra**
- Descriptor: **Residential & Commercial Construction · Real Estate**
- Closing brand line: **Constructing Happiness**
- Founded: **2022**
- Completed projects: **3**
- Ongoing projects: **2**
- Upcoming projects: **2**

### About

Founded in 2022, WeR1 Infra is a construction and real estate company delivering residential and commercial projects. Since inception, the company has built a track record of completed developments and continues to grow its portfolio with ongoing and upcoming projects.

The stated approach combines disciplined project execution with genuine collaboration, centered around better living, better value, better projects, better quality, trust, transparency, and timely delivery.

## Mission

Building with quality, safety, integrity, and innovation to create lasting value for society with excellence and sustainable development.

## Vision

To grow as a trusted construction company, recognized for excellence, integrity, innovation, and successful delivery of landmark projects that contribute to a better future.

## Core business areas

### Residential Construction
Designing and building residential developments with quality construction, thoughtful planning, and lasting value.

### Commercial Construction
Delivering commercial spaces from concept to completion, backed by reliable timelines and lasting construction standards.

### Real Estate
Partnering with landowners and guiding projects from land acquisition through development to strong outcomes.

### End-to-End Construction Solutions
From concept to completion, delivering construction solutions with quality, precision, and reliability.

## Completed projects

### Aikyam
- Category: Residential + Commercial
- Location: Punawale
- Completed: 2025
- Asset: `images/projects/completed/aikyam.png`

### Sinclair Place
- Category: Residential
- Location: Punawale
- Completed: 2024
- Asset: `images/projects/completed/sinclair-place.png`

### Sukhada Apartment
- Category: Residential
- Location: Punawale
- Completed: 2023
- Asset: `images/projects/completed/sukhada-apartment.png`

## Ongoing projects

> The profile does not provide project names. Use location-based temporary slugs/titles in code until the client supplies official names.

### Chinchwad project
- Status: Ongoing / under construction
- Location: Chinchwad
- Expected completion: 2028
- Asset: `images/projects/ongoing/chinchwad-project.png`

### Marunji project
- Status: Ongoing / under construction
- Location: Marunji
- Expected completion: 2027
- Asset: `images/projects/ongoing/marunji-project.png`

## Upcoming projects

> Both upcoming developments are described as Punawale projects along the Aundh-Ravet BRT Road. The profile does not provide official project names. Keep them as Phase 1 / Phase 2 or neutral temporary identifiers internally; do not present invented names publicly.

### Punawale upcoming project - Phase 1
- Status: Upcoming / launching soon
- Location: Punawale
- Road/corridor: Aundh-Ravet BRT Road
- Launch: Early 2027
- Land area: 50,000 sq. ft.
- Residential space: approx. 1,63,000 sq. ft.
- Commercial space: 61,000 sq. ft.
- Development type: Residential + Commercial
- Source positioning: contemporary luxury / modern living / skyline-oriented landmark development
- Asset: `images/projects/upcoming/punawale-phase-1.png`

### Punawale upcoming project - Phase 2
- Status: Upcoming / launching soon
- Location: Punawale
- Road/corridor: Aundh-Ravet BRT Road
- Launch: By end of 2027
- Land area: 41,000 sq. ft.
- Residential space: 2,20,000 sq. ft.
- Development type: Residential (the source only specifies residential space)
- Source positioning: refined architecture / contemporary design / elevated urban living
- Asset: `images/projects/upcoming/punawale-phase-2.png`

## Project geography / map

The profile contains a project-location map covering the Punawale / Tathawade / Wakad-Chinchwad-Marunji area. It visually marks:

- Completed Aikyam
- Completed Sinclair
- Completed Sukhada
- Upcoming Punawale Phase 1
- Upcoming Punawale Phase 2
- Ongoing Chinchwad
- Ongoing Marunji

Extracted map asset: `images/project-location-map.png`

For the production website, prefer an interactive map with verified coordinates rather than treating the profile screenshot as authoritative geospatial data.

## Team

### Management Team
The management team holds master's degrees and brings specialized expertise in project planning, execution, and stakeholder relations.

### Engineering Team
Civil engineering professionals with 5+ years of hands-on field experience, focused on quality and precision.

## Why choose WeR1 Infra

### Experienced Team
Specialized management and civil engineers with 5+ years of field experience.

### Proven Track Record
Multiple completed residential and commercial projects since 2022.

### Trusted Partnerships
Collaboration with landowners and transparent engagement with clients.

### Growing Portfolio
Active roadmap of ongoing and upcoming residential and commercial projects.

## Contact details in source profile

- Phone: +91 9011881133
- Phone: +91 7887700722
- Email in PDF: wer1infra@gmail.com
- Closing statement: **Together, We Build the Future.**
- Supporting line: We look forward to partnering with you to turn our vision into reality.

### Website implementation note

The source PDF lists `wer1infra@gmail.com`. The current website project context previously specified `enquiry@wer1group.in` for enquiries. Do not silently replace one with the other; treat this as a content decision to confirm with the client / existing website requirements.

## Suggested data model

```ts
interface Project {
  slug: string;
  name?: string;
  temporaryLabel?: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  type?: 'residential' | 'commercial' | 'residential-commercial';
  location: string;
  corridor?: string;
  completionYear?: number;
  launchPeriod?: string;
  landAreaSqFt?: number;
  residentialAreaSqFt?: number;
  commercialAreaSqFt?: number;
  image: string;
  description?: string;
}
```

## Asset manifest

The extracted images supplied with this reference are direct embedded assets from the PDF. Project renderings are suitable as initial website content assets, subject to client approval and optimization (WebP/AVIF, responsive sizes, alt text).

- `images/brand/wer1-cover-logo.png` - cover graphic/logo asset
- `images/projects/completed/aikyam.png`
- `images/projects/completed/sinclair-place.png`
- `images/projects/completed/sukhada-apartment.png`
- `images/projects/ongoing/chinchwad-project.png`
- `images/projects/ongoing/marunji-project.png`
- `images/projects/upcoming/punawale-phase-1.png`
- `images/projects/upcoming/punawale-phase-2.png`
- `images/project-location-map.png`

Small icon assets from the profile were not included in the curated website set because they are low-resolution (63-95 px) and should be recreated as SVG/UI icons in the production design.
