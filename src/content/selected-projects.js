// Featured project content shared by the portfolio presentation variants.
import { projects } from "./profile";
import { systems } from "./engineering";

const featuredProjects = [
  {
    id: "bias-checker",
    num: "01",
    year: "2025–2026",
    title: "Bias Checker",
    field: "Healthcare · Applied AI",
    headline: "A prediction needs an explanation.",
    summary:
      "Solo-built healthcare bias-detection system connecting a fine-tuned RoBERTa + LoRA classifier, GPT-4o explanation layer, Flask API, and Next.js interface deployed via Docker on Hugging Face Spaces.",
    stack: ["Next.js", "Flask", "RoBERTa + LoRA", "GPT-4o", "Docker"],
    repo: systems[0].repository,
    nodes: systems[0].nodes,
    decision: systems[0].decision,
    blueprint: {
      kicker: "PIPELINE SPECIMEN · 01 → 04",
      diagram: "Clinical Vignette → RoBERTa + LoRA → GPT-4o Explainability → Review",
      foot: "Solo full-stack build · Hugging Face Spaces",
    },
  },
  {
    id: "gesturepro",
    num: "02",
    year: "2025",
    title: "GesturePro",
    field: "Computer Vision · Interaction",
    headline: "Keep the signer in control.",
    summary:
      "Browser prototype reading 21 MediaPipe hand landmarks per frame into editable text, validated with six usability testing participants.",
    stack: ["Next.js", "FastAPI", "MediaPipe", "TensorFlow"],
    image: projects[0].image,
    alt: projects[0].alt,
    caseHref: `/work/${projects[0].slug}/`,
    repo: projects[0].repository,
    nodes: systems[1].nodes,
    decision: systems[1].decision,
  },

  {
    id: "klyro", num: "03", year: "Live site", title: "Klyro",
    field: "Applied AI · Website Copilot",
    headline: "Your website, ready for questions.",
    summary: "An embeddable AI website copilot built around your own sources. Klyro brings together knowledge retrieval, a configurable voice, a private test chat, and a branded website widget.",
    stack: ["RAG", "Source attribution", "Embeddable widget"],
    liveHref: "https://klyro-pro.vercel.app/",
    decision: "Ground answers in supplied knowledge and let the site owner test conversations before embedding the copilot.",
    blueprint: { kicker: "WEBSITE COPILOT", diagram: "Connect sources → Shape the voice → Test → Embed", foot: "Knowledge retrieval · Source attribution" },
  },
  {
    id: "inout", num: "04", year: "Built", title: "InOut",
    field: "Proptech · Visual Evidence",
    headline: "A clearer record of every room.",
    summary: "A renter-focused app for guided move-in and move-out walkthroughs. Timestamped photos and before-and-after comparisons help renters document changes and organize deposit evidence.",
    stack: ["Image comparison", "Photo storage", "Rules engine"],
    decision: "Keep original photos and their timestamps intact. AI flags possible changes for human review; it does not make the final damage assessment.",
    blueprint: { kicker: "PRODUCT BUILD", diagram: "Capture rooms → Compare photos → Review changes → Organize evidence", foot: "Timestamped photos · Before-and-after comparison" },
  },
  {
    id: "shelfie", num: "05", year: "Built", title: "Shelfie",
    field: "Consumer AI · Skincare",
    headline: "Make more of what is on your shelf.",
    summary: "A skincare organizer that reads product labels and builds a simple AM/PM routine from what you own. Features include duplicate checks, ingredient-rule checks, and reminders based on when a product was opened.",
    stack: ["Label recognition", "Ingredient rules", "Scheduled reminders"],
    decision: "Pair label recognition with explicit rules and user corrections. Keep recommendations to general product organization, with no diagnosis or treatment advice.",
    blueprint: { kicker: "PRODUCT BUILD", diagram: "Scan labels → Confirm products → Organize routine → Track opening dates", foot: "Label recognition · Routine organization · Opening-date reminders" },
  },
  {
    id: "open-slot-matcher", num: "06", year: "Built", title: "Open-slot matcher",
    field: "Healthcare · Scheduling",
    headline: "Turn a cancellation into an earlier visit.",
    summary: "A scheduling app matching canceled appointments with patients on a waitlist, based on availability and travel distance. Time-limited offers and a clinic dashboard help teams fill open slots.",
    stack: ["Matching & ranking", "Event queues", "Concurrency testing"],
    decision: "Design slot acceptance so only one patient can claim an appointment. Concurrency and burst-load testing are central to validating booking behavior with synthetic schedules.",
    blueprint: { kicker: "PRODUCT BUILD", diagram: "Slot opens → Match waitlist → Send offer → Confirm one booking", foot: "Waitlist matching · Time-limited offers · Clinic dashboard" },
  },
];

// Preserve each presentation's existing visual layout and blueprint vocabulary.
export const selectedProjects = featuredProjects.map((project, index) => ({
  ...project,
  discipline: project.field,
  pigment: ["violet", "blue", "gold", "blue", "violet", "gold"][index],
  span: ["wide", "tall", "normal", "normal", "tall", "wide"][index],
  blueprint: project.blueprint && {
    ...project.blueprint,
    code: project.blueprint.kicker,
    formula: project.blueprint.diagram,
    metrics: [project.blueprint.foot],
    tag: project.blueprint.kicker,
    flow: project.blueprint.diagram,
  },
}));
