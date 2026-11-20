# Reference study and content provenance

## Reference: Areef Syed, classic portfolio

Reviewed https://www.areefsyed.com/?view=classic on 2026-11-19 in the browser, including the profile, project detail drawer, categorized capabilities, career, personal archive, and contact sections.

Patterns adapted:

- Immediate access to a hiring summary, résumé, and source code.
- Project descriptions grounded in ownership, system responsibilities, and decisions.
- Skills connected to specific work rather than an isolated list of technologies.
- Expandable detail for readers who want depth without forcing everyone through it.
- A personal section and a direct, practical contact ending.

The cream/plum identity and continuous Three.js sculpture remain original to this portfolio. No reference-site assets or personal claims were copied. Bias Checker and PocketSaver now continue the same six-stage story. The separate dark engineering explorer was removed in favor of architecture disclosures within the relevant chapters. The shared stage stays on the page’s light paper background.

## Content sources

- `public/shweta-sharma-resume.pdf`: education (MS CS, AI & ML; Drexel; 2024–2026; GPA 3.97), updated employment dates, Bias Checker ownership and stack, CentralPerk development status, John Deere survey platform scope and setup-time reduction, Urbanfit platform engagement lift, Capita conversion lift, relocation preference, GitHub profile.
- https://github.com/yeoleshweta/Bias-Checker-Healthcare/blob/main/README.md: Next.js frontend, Flask backend, RoBERTa + LoRA, explanation layer, Docker/Hugging Face deployment architecture.
- https://github.com/yeoleshweta/PocketSaver/blob/main/README.md: frontend/backend/PostgreSQL separation, forecast proxy and prediction endpoints, separately started Python forecast service, Docker Compose scope. Repository existence and ownership were checked through the GitHub connector.
- https://github.com/yeoleshweta/gesture-pro-backend/blob/main/README.md: MediaPipe and FastAPI backend; original project content supplies ownership, 21 landmarks, and six usability participants.
- Existing `src/content/profile.js`: original three case studies, Course Assistant role, personal biography, and project metrics.

Employment metrics are attributed to the corresponding role, not to the Urbanfit control-panel prototype. Prototype screen/interaction counts are separate. Public source links are not presented as evidence of a currently running service. Diagrams explain architecture; they do not run inference or send user data.

## Interaction and accessibility

- Native architecture disclosures are part of the corresponding main-story chapters and work with keyboard input.
- The hiring brief uses a native dialog, contains keyboard focus, closes on Escape, restores focus, and unlocks body scroll on cleanup.
- Archive entries use native disclosure elements and work without JavaScript.
- Reduced-motion rules disable added animations. The original continuous story already provides discrete reduced-motion states.
- No additional animation package, model service, or API credential is required.


## Personal gallery

Five photographs were sourced from the existing sibling portfolio’s `public/assets/SelfImages/` folder, inspected visually, and resized to WebP without creative alterations. The originals remain untouched. Captions describe visible scenes rather than inventing travel destinations. `src/content/gallery.js` records display titles, alt text, and thumbnail focal positions. The full-image viewer preserves the complete photograph and supports Previous/Next, arrow keys, Escape, and return focus to the originating card.


### Gallery revision: the photo desk

Reference study on 2026-11-20:

- [Codrops: Infinite WebGL Scrolling Gallery](https://tympanus.net/Tutorials/InfiniteAutoScrollingGallery/index.html), visually reviewed in the browser: varying image scale, irregular spacing, and oversized typography give the collection a spatial identity.
- [Codrops: Infinite Canvas](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/): a reference for direct manipulation and exploratory photography layouts.
- [Codrops: Infinite GSAP Scroll Gallery](https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/): scattered images and transitions between collection/detail views.

The implementation adapts those interaction ideas into a finite, five-print desk using the existing photographs, cream/plum typography, CSS transforms, and native document scrolling. No reference code or assets were copied and no animation library was added. Prints spread from a shared stack with a CSS view timeline; unsupported browsers receive the finished composition. The “In order” control rearranges the same elements into a contact sheet. Desktop pointer dragging is bounded to the desk; a drag does not trigger the image viewer. Reset restores the composition.

At narrow widths the desk becomes a native horizontal scroll-snap strip with previous/next buttons, keeping all prints distinct and touch targets separate. Reduced-motion styling removes the spread and layout animations. The existing native full-image dialog retains keyboard arrows, Escape, and focus restoration.


### Shared-photo viewer

The gallery viewer now occupies the native dialog top layer without a separate modal-card shell. It measures the clicked print’s live position, accumulated rotation/scale, and object-position crop, including drag offsets. A fixed photo mask and inversely scaled image expand with the Web Animations API; only transforms change during the flight. Sampled inverse transforms preserve the photograph’s aspect ratio while its crop opens into the complete image. The paper veil and controls reveal around the photograph.

Closing measures the current print destination and reverses the spatial journey. Escape during opening reverses the in-progress animations. Browsing selects the corresponding return print; the mobile strip brings that print into place behind the overlay. Native modal focus containment remains intact, scroll styles restore on close/unmount, and focus returns without scrolling. Reduced-motion users receive immediate open/close states. Resizing recalculates the full-photo fit, and an off-screen destination after an orientation change is revealed before returning.
