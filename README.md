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

- `StoryCenterpiece.jsx` composes the headline and the three-stage sculpture story.
- `SignalSculpture.jsx` loads the WebGL renderer separately and retains a CSS sculpture if WebGL is unavailable.
- `src/lib/visuals/createSculpture.js` constructs original ribbon geometry and morphs it from a knot into a halo and a coil. No remote model or image dependency.
- `ProjectScenes.jsx` contains Urbanfit's assembling role cards, GesturePro's landmark network and editable example, and the clinical evidence sequence.
- `useScrollScene.js` samples only visible scenes, updates CSS progress without a React render per frame, and stops when the document is hidden. No wheel interception or scroll event handlers.
- `src/styles/story.css` owns scene transforms, responsive layouts, and reduced-motion alternatives. Mobile scenes flow normally rather than pinning a tall stage.

The GesturePro input is an editable illustration, not a camera or inference service. Clinical dialogue in the visual is explicitly synthetic. Existing case-study facts remain the source of project claims.

### Design research

[Bruno Simon](https://bruno-simon.com/) uses interaction as a demonstration of craft. [Lusion](https://lusion.co/) connects 3D art direction and storytelling. [NN/g's portfolio guidance](https://www.nngroup.com/articles/ux-design-portfolios/) emphasizes scannability, role clarity, process, and outcomes. This design uses a signature sculptural object while retaining direct access to case studies and contact information.
