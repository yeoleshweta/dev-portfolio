// The chapter order is also the morph-target order. Keep one source of truth.
export const storyStages = [
  { id: "intro", label: "Human insight", caption: "An idea, taking shape." },
  { id: "work", label: "Interface", caption: "Structure becomes interface." },
  {
    id: "gesturepro",
    label: "Intelligence",
    caption: "Motion becomes meaning.",
  },
  {
    id: "clinical",
    label: "Interpretation",
    caption: "Language becomes evidence.",
  },
  {
    id: "bias-checker",
    label: "Accountability",
    caption: "A prediction comes into focus.",
  },
  {
    id: "pocketsaver",
    label: "Foresight",
    caption: "A system reveals what’s ahead.",
  },
];
export const lastStoryStage = storyStages.length - 1;
export const storyWeights = (stage) =>
  storyStages.map((_, index) => Math.max(0, 1 - Math.abs(stage - index)));
