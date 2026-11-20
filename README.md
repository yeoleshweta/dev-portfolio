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
- `src/content/profile.js`: biography, experience, and project content.
- `src/styles/globals.css`: responsive styling and visual tokens.
- `public/`: images and downloadable résumé.

Use the `@/` alias for imports from `src`. Keep content in the content module and keep client components limited to features requiring browser state. Do not commit generated `out/`, `.next/`, dependencies, or environment secrets.

## Design conventions

Preserve the cream, plum, and rust palette. Editorial serif headings pair with a system-native Avenir text stack. Cards use nested surfaces; primary actions use circular inset arrows. Motion uses transforms and opacity, with reduced-motion support. The mobile navigation uses a native dialog for keyboard focus containment and Escape dismissal. Content remains visible without JavaScript; scroll scenes progressively enhance the portfolio.

Before shipping, run the production build and check navigation, scroll sequences, all case studies, mobile layouts, keyboard focus, and reduced-motion behavior. Update factual claims only from verified portfolio material.

## Scroll storytelling

- `ContinuousPortfolio.jsx` places the project narratives beside one persistent visual stage. On mobile, the same stage remains above the flowing narrative.
- `SignalSculpture.jsx` dynamically loads one WebGL renderer and retains a CSS sculpture when WebGL is unavailable.
- `src/lib/visuals/sculptureGeometry.mjs` creates six matching-topology forms: ribbon knot, rounded interface frame, hand-landmark network, conversation waveform, Bias Checker lens, and PocketSaver forecast curve.
- `src/lib/visuals/createSculpture.js` morphs the original mesh and registers the dashboard image to the camera's frame dimensions. The renderer is never replaced between chapters.
- `useContinuousStory.js` supplies one eased scroll coordinate to both geometry and UI. It suspends outside the story and while the document is hidden. Reduced-motion users get discrete state changes without morph animation.
- `src/styles/continuity.css` owns the continuous layout, stage overlays, technical typography, and responsive choreography.

The GesturePro input is an editable illustration, not a camera or inference service. Existing case-study facts remain the source of all project claims.

Run `node --test tests/sculpture-geometry.test.mjs` to verify matching topology across all six forms, normalized transition weights, finite positions/normals, the 21 landmarks, and the frame dimensions used to align the actual project image. Run `npm run build` for route compilation and static export.

### Design research

[Bruno Simon](https://bruno-simon.com/) uses interaction as a demonstration of craft. [Lusion](https://lusion.co/) connects 3D art direction and storytelling. [NN/g's portfolio guidance](https://www.nngroup.com/articles/ux-design-portfolios/) emphasizes scannability, role clarity, process, and outcomes. This design uses a signature sculptural object while retaining direct access to case studies and contact information.

## Engineering evidence and hiring overview

- `src/content/engineering.js`: sourced system architecture, disciplines, and additional project summaries.
- `SystemNotes.jsx`: native architecture disclosures inside the GesturePro, Bias Checker, and PocketSaver story chapters. The separate engineering explorer has been removed.
- `HiringBrief.jsx`: an accessible 30-second summary with résumé, project, and contact links.
- `src/styles/portfolio-depth.css`: skills, education, personal section, archive, and brief dialog.
- `PersonalGallery.jsx`, `src/content/gallery.js`, and `src/styles/gallery.css`: interactive photo desk with scroll-driven spreading, scattered/contact-sheet arrangements, a mobile swipe strip, and an accessible full-image viewer.
- `useGalleryViewer.js` and `src/lib/visuals/galleryTransition.mjs`: interruptible shared-photo expansion and return, exact crop/rotation mapping, scroll/focus restoration, and reduced-motion handling. Run `node --test tests/gallery-transition.test.mjs` for the viewport-fit and undistorted-flight checks.
- `usePhotoDesk.js`: bounded desktop pointer dragging without per-frame React renders; drag/click separation and reset.
- `public/gallery/`: resized WebP versions of the existing portfolio’s personal photographs.
- `docs/design-reference.md`: reference-site observations, content provenance, and interaction conventions.

The portfolio keeps model demonstrations illustrative. It does not send vignette text or camera input to a live service. New employment and education details were checked against the bundled résumé; source-linked architecture was checked against the corresponding public repositories.


The main story now keeps a single paper background throughout. Fine geometry uses a deeper plum material for contrast. `src/lib/visuals/storyStages.mjs` defines the shared order/count used by scroll progress, morph targets, chapter navigation, and tests. The renderer checks for discrete progress changes in reduced-motion mode, without animating between forms.
