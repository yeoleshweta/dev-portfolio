# Shweta Sharma — portfolio

Next.js App Router portfolio with a static export. Node.js 22 or newer is required.

## Development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to validate all routes and generate the static site in `out/`.

## Structure

- `src/app/`: route entries, layout, and route metadata. Project pages are generated from content.
- `src/components/layout/`: shared navigation.
- `src/components/portfolio/`: portfolio-specific interactive components.
- `src/components/ui/`: shared interaction primitives.
- `src/content/profile.js`: biography, experience, and project content.
- `src/styles/globals.css`: responsive styling and visual tokens.
- `public/`: images and downloadable résumé.

Use the `@/` alias for imports from `src`. Keep content in the content module and keep client components limited to features requiring browser state. Do not commit generated `out/`, `.next/`, dependencies, or environment secrets.

## Design conventions

Preserve the cream, plum, and rust palette. Editorial serif headings pair with a system-native Avenir text stack. Cards use nested surfaces; primary actions use circular inset arrows. Motion uses transforms and opacity, with reduced-motion support. The mobile navigation uses a native dialog for keyboard focus containment and Escape dismissal. Content remains visible without JavaScript; scroll reveals progressively enhance offscreen sections.

Before shipping, run the production build and check navigation, project filters, all case studies, mobile layouts, keyboard focus, and reduced-motion behavior. Update factual claims only from verified portfolio material.
