"use client";
import { useState } from "react";
import Link from "next/link";
import { RevealHeading } from "@/components/motion/RevealHeading";

const disciplines = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend & Interaction",
    headline: "Interfaces that feel inevitable.",
    summary:
      "I build responsive, accessible web applications where real-time inputs, editable predictions, and complex multi-role workflows feel effortless.",
    tools: ["React", "Next.js", "JavaScript", "Three.js / WebGL", "CSS Motion", "Accessibility"],
    proofTitle: "Urbanfit Control Panel & GesturePro",
    proofMeta: "30 screens · 484 interactions · editable live predictions",
    href: "/work/urbanfit/",
    layers: ["State & Input", "Motion Choreography", "Design Tokens"],
  },
  {
    id: "backend",
    index: "02",
    label: "APIs, Data & Systems",
    headline: "Clean boundaries from client to database.",
    summary:
      "I architect full-stack services with explicit contracts—connecting frontend apps to REST APIs, relational persistence, and isolated ML inference workers.",
    tools: ["Python", "FastAPI", "Flask", "Node.js", "PostgreSQL", "Docker"],
    proofTitle: "PocketSaver & Bias Checker",
    proofMeta: "Node proxy → Python /predict · Flask + Docker on HF Spaces",
    href: "#pocketsaver",
    layers: ["Next.js Client", "API Gateway / Proxy", "Postgres + Python Worker"],
  },
  {
    id: "ml",
    index: "03",
    label: "Applied ML & Evaluation",
    headline: "Models people can question and trust.",
    summary:
      "From landmark extraction and fine-tuned classifiers to supervised clinical NLP, I pair model outputs with human-in-the-loop correction and explanation.",
    tools: ["TensorFlow", "RoBERTa + LoRA", "MediaPipe", "GPT-4o", "Label Studio", "NLP"],
    proofTitle: "Bias Checker & Clinical Communication",
    proofMeta: "21 hand landmarks · Calgary-Cambridge & NURSE frameworks",
    href: "/work/clinical-communication/",
    layers: ["Annotated Reference", "Fine-tuned Classifier", "Explanation Layer"],
  },
  {
    id: "research",
    index: "04",
    label: "Product Design & Research",
    headline: "Rooted in how people actually work.",
    summary:
      "Years of leading UX research and personalization across enterprise and retail teams taught me to validate assumptions before writing production code.",
    tools: ["Figma", "Design Systems", "Usability Testing", "A/B Experimentation", "Survey Ops"],
    proofTitle: "John Deere & Capita (Arcadia Group)",
    proofMeta: "−60% survey setup time · +35% engagement · +11% conversion",
    href: "#experience",
    layers: ["Behavioral Discovery", "System Architecture", "Measured Validation"],
  },
];

export function SkillsetsMatrix() {
  const [active, setActive] = useState(0);
  const current = disciplines[active];

  return (
    <section id="skills" className="skillsetsSection wrap" aria-labelledby="skills-title">
      <div className="skillsetsHeader">
        <div>
          <p className="eyebrow">03B / Capabilities &amp; Craft</p>
          <RevealHeading
            id="skills-title"
            lines={["Four disciplines.", "One continuous thread."]}
            italic={1}
          />
        </div>
        <p className="skillsetsLead">
          Trained in human research, sharpened in product design, and engineered
          end-to-end across modern web stacks and applied machine learning.
        </p>
      </div>

      <div className="skillsetsGrid">
        <div className="disciplineList" role="tablist" aria-label="Technical disciplines">
          {disciplines.map((item, idx) => {
            const isSelected = idx === active;
            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${item.id}`}
                className="disciplineTab"
                data-active={isSelected}
                onClick={() => setActive(idx)}
                onMouseEnter={() => setActive(idx)}
              >
                <span className="disciplineIdx">{item.index}</span>
                <span className="disciplineName">{item.label}</span>
                <span className="disciplineArrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>

        <div
          className="disciplineStage"
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
        >
          <div className="disciplineStageInner" key={current.id}>
            <div className="stageTopMeta">
              <span>DISCIPLINE / {current.index}</span>
              <span>{current.label.toUpperCase()}</span>
            </div>

            <h3 className="disciplineHeadline">{current.headline}</h3>
            <p className="disciplineSummary">{current.summary}</p>

            <div className="architectureStack" aria-label="System layers">
              {current.layers.map((layer, i) => (
                <div className="archLayer" key={layer} style={{ "--layer-i": i }}>
                  <span>0{i + 1}</span>
                  <strong>{layer}</strong>
                </div>
              ))}
            </div>

            <div className="disciplineTools" aria-label="Tools and technologies">
              {current.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>

            <div className="disciplineProof">
              <div>
                <small>SHIPPED PROOF</small>
                <strong>{current.proofTitle}</strong>
                <span>{current.proofMeta}</span>
              </div>
              {current.href.startsWith("/") ? (
                <Link className="narrativeAction" data-magnetic href={current.href}>
                  Inspect work <span aria-hidden="true">↗</span>
                </Link>
              ) : (
                <a className="narrativeAction" data-magnetic href={current.href}>
                  Inspect work <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
