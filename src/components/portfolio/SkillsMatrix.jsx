"use client";
import { useState } from "react";

const categories = [
  { id: "all", label: "All", num: "00" },
  { id: "engineering", label: "Frontend & Fullstack", num: "01" },
  { id: "ai", label: "Applied AI & ML", num: "02" },
  { id: "design", label: "Product & Systems", num: "03" },
  { id: "research", label: "Research & Analytics", num: "04" },
];

const skills = [
  {
    name: "React",
    cat: "engineering",
    italic: false,
    context: "Production web interfaces across CentralPerk, interactive dashboards, and design-system handoffs.",
  },
  {
    name: "Next.js",
    cat: "engineering",
    italic: true,
    context: "App Router frontends for Bias Checker (ABIM), GesturePro live sign editor, and PocketSaver.",
  },
  {
    name: "Python",
    cat: "ai",
    italic: false,
    context: "Core language across clinical NLP pipelines at ABIM, ML inference APIs, and forecasting services.",
  },
  {
    name: "Figma",
    cat: "design",
    italic: true,
    context: "Atomic design system for Urbanfit (30 screens, 484 interactions) and John Deere's 250+ product survey tool.",
  },
  {
    name: "RoBERTa + LoRA",
    cat: "ai",
    italic: false,
    context: "Fine-tuned healthcare bias classifier deployed end-to-end in Bias Checker via Flask & Hugging Face Spaces.",
  },
  {
    name: "FastAPI",
    cat: "engineering",
    italic: false,
    context: "Real-time hand-landmark inference backend in GesturePro and multi-agent API layer in CentralPerk.",
  },
  {
    name: "Design Systems",
    cat: "design",
    italic: true,
    context: "Built Urbanfit's atomic component library from scratch and maintained multi-brand retail libraries at Capita.",
  },
  {
    name: "LLM Evaluation",
    cat: "ai",
    italic: false,
    context: "Rubric-based evaluation frameworks at ABIM measuring clinical accuracy, label consistency, and edge cases.",
  },
  {
    name: "Usability Testing",
    cat: "research",
    italic: true,
    context: "Moderated studies across 6+ John Deere teams, Urbanfit (+35% engagement), and GesturePro's 6-participant validation.",
  },
  {
    name: "Flask",
    cat: "engineering",
    italic: false,
    context: "Served RoBERTa classification and GPT-4o explainability endpoints in the solo-built Bias Checker tool.",
  },
  {
    name: "GPT-4o",
    cat: "ai",
    italic: false,
    context: "Few-shot explainability layer paired with fine-tuned classification in Bias Checker so clinicians can audit outputs.",
  },
  {
    name: "Node.js",
    cat: "engineering",
    italic: false,
    context: "API proxy and service routing layer connecting Next.js, PostgreSQL, and Python forecasting in PocketSaver.",
  },
  {
    name: "PostgreSQL",
    cat: "engineering",
    italic: true,
    context: "Containerized relational persistence layer orchestrated with Docker Compose in PocketSaver.",
  },
  {
    name: "Label Studio",
    cat: "ai",
    italic: false,
    context: "Built annotated doctor-patient dialogue reference sets at ABIM mapped to Calgary-Cambridge & NURSE rubrics.",
  },
  {
    name: "Interaction Design",
    cat: "design",
    italic: false,
    context: "Multi-role operational grammars and human-in-the-loop correction patterns across web and AI workflows.",
  },
  {
    name: "TensorFlow",
    cat: "ai",
    italic: false,
    context: "Trained the hand-sign gesture classification model powering GesturePro's browser-to-text experience.",
  },
  {
    name: "MediaPipe",
    cat: "ai",
    italic: true,
    context: "Extracted 21 real-time hand landmarks per webcam frame for GesturePro's computer vision pipeline.",
  },
  {
    name: "Docker",
    cat: "engineering",
    italic: false,
    context: "Multi-service local orchestration in PocketSaver and containerized deployment on Hugging Face Spaces.",
  },
  {
    name: "A/B Testing",
    cat: "research",
    italic: false,
    context: "Combined behavioral segmentation and experimentation on Qubit's ML platform for an 11% conversion lift at Capita.",
  },
  {
    name: "LangGraph",
    cat: "ai",
    italic: true,
    context: "Stateful multi-agent orchestration powering CentralPerk's transparent agent-handoff interface.",
  },
  {
    name: "JavaScript",
    cat: "engineering",
    italic: false,
    context: "Interactive client state, custom motion choreography, and production web engineering across shipped builds.",
  },
  {
    name: "Tailwind CSS",
    cat: "engineering",
    italic: false,
    context: "Rapid, token-consistent UI implementation across React + Vite and Next.js frontends.",
  },
  {
    name: "Information Architecture",
    cat: "design",
    italic: true,
    context: "Eliminated developer dependency for 250+ John Deere products with a self-serve survey platform (−60% setup time).",
  },
  {
    name: "Annotation Taxonomy",
    cat: "ai",
    italic: false,
    context: "Translated clinical scoring rubrics (Calgary-Cambridge, NURSE, SHARE) into IRR-validated NLP categories at ABIM.",
  },
  {
    name: "WCAG 2.1",
    cat: "design",
    italic: false,
    context: "Accessible contrast, keyboard navigation, and inclusive interaction standards across enterprise and consumer products.",
  },
  {
    name: "Contextual Inquiry",
    cat: "research",
    italic: true,
    context: "Field and stakeholder research establishing John Deere's UX practice in India across 6+ product teams.",
  },
  {
    name: "Behavioral Analytics",
    cat: "research",
    italic: false,
    context: "Hotjar, FullStory, Google Analytics, and Amplitude funnels driving Urbanfit's 28% bounce-rate drop.",
  },
  {
    name: "SQL & Tableau",
    cat: "research",
    italic: false,
    context: "Synthesized 120+ feedback channels into core product KPIs alongside Power BI (DAX) and Dovetail.",
  },
];

const categoryNameMap = Object.fromEntries(
  categories.map((c) => [c.id, c.label.toUpperCase()])
);

export function SkillsMatrix() {
  const [activeCat, setActiveCat] = useState("all");
  const [hovered, setHovered] = useState(null);

  const focusedSkill = hovered ?? skills.find((s) => activeCat === "all" || s.cat === activeCat) ?? skills[0];

  return (
    <section
      id="skills"
      className="skillsSection atelierWrap"
      aria-labelledby="skills-title"
    >
      <div className="skillsTopBar" data-reveal>
        <div>
          <span className="chapterMarker">SKILLS &amp; TOOLKIT</span>
          <h2 id="skills-title" className="skillsHeading">
            The working <em>index.</em>
          </h2>
        </div>

        <div className="skillsFilterRail" role="tablist" aria-label="Filter skills by discipline">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCat === cat.id}
              className="skillsFilterBtn"
              onClick={() => {
                setActiveCat(cat.id);
                setHovered(null);
              }}
            >
              <small>{cat.num}</small>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="skillsSpecimenWall"
        data-has-hover={hovered !== null}
        onMouseLeave={() => setHovered(null)}
        data-reveal
      >
        {skills.map((skill, idx) => {
          const matchesFilter = activeCat === "all" || skill.cat === activeCat;
          const isHovered = hovered?.name === skill.name;
          return (
            <span className="skillTokenWrap" key={skill.name}>
              <button
                type="button"
                className={`skillToken${skill.italic ? " isItalic" : ""}`}
                data-match={matchesFilter}
                data-active={isHovered}
                onMouseEnter={() => setHovered(skill)}
                onFocus={() => setHovered(skill)}
                onClick={() => setHovered(skill)}
              >
                {skill.name}
              </button>
              {idx < skills.length - 1 && (
                <span className="skillSlash" aria-hidden="true">
                  /
                </span>
              )}
            </span>
          );
        })}
      </div>

      <div className="skillsReadout" aria-live="polite" data-reveal>
        <div className="skillsReadoutMeta">
          <span>{categoryNameMap[focusedSkill.cat]}</span>
          <strong>{focusedSkill.name}</strong>
        </div>
        <p className="skillsReadoutText">{focusedSkill.context}</p>
      </div>
    </section>
  );
}
