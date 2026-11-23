"use client";
import { useState } from "react";
import Image from "next/image";

const chapters = [
  {
    id: "people",
    num: "01",
    label: "THE ORIGIN · RESEARCH",
    title: "Engineering shaped by how people actually work.",
    body: "Six years leading UX research and personalization across John Deere, Urbanfit, and seven UK retail brands taught me to diagnose human friction before writing production code.",
    statValue: "−60%",
    statLabel: "Survey setup time across 250+ John Deere products",
    visualType: "photo",
    image: "/mountains.jpg",
    alt: "Shweta at Grace Hopper Celebration 2025",
    caption: "GRACE HOPPER CELEBRATION · 2025",
  },
  {
    id: "interaction",
    num: "02",
    label: "THE INTERFACE · SYSTEMS",
    title: "Complex workflows distilled into one clear language.",
    body: "Whether unifying admin, warehouse, and franchise views across 30 screens or turning 21 webcam hand landmarks into editable text, the person always stays in command.",
    statValue: "484",
    statLabel: "Connected prototype interactions in Urbanfit Control Panel",
    visualType: "photo",
    image: "/urbanfit.jpg",
    alt: "Urbanfit multi-role inventory control panel",
    caption: "URBANFIT CONTROL PANEL · ROLE-BASED ARCHITECTURE",
  },
  {
    id: "intelligence",
    num: "03",
    label: "THE MODEL · APPLIED ML",
    title: "Predictions that explain themselves.",
    body: "With an MS in AI & Machine Learning (3.97 GPA) and clinical NLP work at ABIM, I pair fine-tuned classifiers with explicit explanation layers people can inspect and question.",
    statValue: "3.97",
    statLabel: "MS Computer Science (AI & ML) · Drexel University",
    visualType: "pipeline",
  },
];

const pipelineStages = [
  {
    id: "input",
    code: "01 / INPUT",
    title: "Clinical Vignette",
    tech: "Next.js Client",
    detail: "Captures structured doctor-patient dialogue or clinical notes for evaluation.",
  },
  {
    id: "classify",
    code: "02 / CLASSIFY",
    title: "RoBERTa + LoRA",
    tech: "Fine-Tuned Model",
    detail: "Identifies medical bias categories against an explicit clinical taxonomy.",
  },
  {
    id: "explain",
    code: "03 / EXPLAIN",
    title: "GPT-4o Layer",
    tech: "Few-Shot Reasoning",
    detail: "Generates inspectable reasoning separate from classification so reviewers can audit.",
  },
  {
    id: "serve",
    code: "04 / DELIVER",
    title: "Flask API + Docker",
    tech: "Hugging Face Spaces",
    detail: "Serves both prediction and explanation cleanly back to the human reviewer.",
  },
];

export function StoryAperture() {
  const [active, setActive] = useState(0);
  const [pipeStep, setPipeStep] = useState(1);
  const current = chapters[active];

  return (
    <section id="story" className="apertureSection">
      <div className="atelierWrap">
        <div className="apertureTop">
          <span className="chapterMarker">01 / THE PRACTICE IN THREE ACTS</span>
          <div className="apertureCounter">
            {chapters.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                className="aperturePill"
                aria-pressed={active === idx}
                onClick={() => setActive(idx)}
              >
                <span>{c.num}</span>
                <small>{c.label.split("·")[1]?.trim()}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="apertureGrid">
          {/* LEFT: SHUTTER-WIPING VISUAL FRAME */}
          <div className="apertureStage">
            <div className="apertureFrame" key={current.id}>
              {current.visualType === "photo" ? (
                <>
                  <Image
                    src={current.image}
                    alt={current.alt}
                    width={960}
                    height={680}
                    sizes="(max-width: 960px) 92vw, 48vw"
                  />
                  <div className="apertureCaptionBar">
                    <span>{current.caption}</span>
                    <span>PLATE {current.num} / 03</span>
                  </div>
                </>
              ) : (
                <div className="aperturePipeline">
                  <div className="pipeHead">
                    <span>LIVE ARCHITECTURE SPECIMEN · BIAS CHECKER</span>
                    <span>CLICK ANY NODE</span>
                  </div>
                  <div className="pipeNodes">
                    {pipelineStages.map((stage, i) => (
                      <button
                        key={stage.id}
                        type="button"
                        className="pipeNode"
                        data-active={pipeStep === i}
                        onClick={() => setPipeStep(i)}
                      >
                        <small>{stage.code}</small>
                        <strong>{stage.title}</strong>
                        <span>{stage.tech}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pipeReadout" key={pipeStep}>
                    <small>{pipelineStages[pipeStep].code} — {pipelineStages[pipeStep].tech}</small>
                    <p>{pipelineStages[pipeStep].detail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: INTERACTIVE EDITORIAL CHAPTER LIST */}
          <div className="apertureChapters">
            {chapters.map((ch, idx) => {
              const isOpen = active === idx;
              return (
                <article
                  key={ch.id}
                  className="apertureRow"
                  data-active={isOpen}
                  onClick={() => setActive(idx)}
                  onMouseEnter={() => setActive(idx)}
                >
                  <div className="apertureRowHead">
                    <span className="apertureRowNum">{ch.num}</span>
                    <span className="apertureRowLabel">{ch.label}</span>
                  </div>
                  <h3>{ch.title}</h3>
                  <div className="apertureRowExpand">
                    <p>{ch.body}</p>
                    <div className="apertureStat">
                      <strong>{ch.statValue}</strong>
                      <span>{ch.statLabel}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
