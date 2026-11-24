"use client";
import { useEffect, useRef, useState } from "react";
import { PhaseFieldCanvas } from "@/components/v6/PhaseFieldCanvas";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { profile } from "@/content/profile";

const PHASES = [
  {
    id: "research",
    num: "01",
    short: "UX Research",
    accent: "#e8a848",
    kicker: "PHASE 01 / DISCOVERY & TAXONOMY",
    title: "Start with the human question.",
    body: "Before a component exists, I map how people actually work — contextual inquiry, clinical scoring rubrics (Calgary-Cambridge, NURSE), and affinity synthesis that cut John Deere survey setup time by 60%.",
    proof: "John Deere (250+ products) · ABIM Annotation Taxonomy",
    tools: ["Contextual Inquiry", "Usability Studies", "Label Studio", "IRR Protocols"],
  },
  {
    id: "frontend",
    num: "02",
    short: "Frontend UI",
    accent: "#6fb6ff",
    kicker: "PHASE 02 / INTERFACE & DESIGN SYSTEMS",
    title: "Crystallize complexity into one grammar.",
    body: "Wireframes harden into atomic design tokens, accessible typography, and responsive React & Next.js interfaces — built for multi-role clarity (Urbanfit's 30 screens & 484 interactions) and human-in-the-loop editing.",
    proof: "Urbanfit (+35% engagement) · Next.js & Atomic Systems",
    tools: ["React", "Next.js", "Figma", "Tailwind CSS", "WCAG 2.1"],
  },
  {
    id: "backend",
    num: "03",
    short: "Backend APIs",
    accent: "#3ee09c",
    kicker: "PHASE 03 / SERVICES & PERSISTENCE",
    title: "Wire explicit contracts end to end.",
    body: "The interface tilts open to reveal clean service boundaries — Node.js and Flask/FastAPI endpoints, PostgreSQL persistence, and containerized Docker Compose stacks with predictable latency.",
    proof: "PocketSaver (Next.js → Node → PostgreSQL + Python) · Flask API",
    tools: ["FastAPI", "Flask", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "ai",
    num: "04",
    short: "AI & ML",
    accent: "#a76bff",
    kicker: "PHASE 04 / APPLIED ML & EXPLAINABILITY",
    title: "Pair predictions with inspectable reasoning.",
    body: "Fine-tuned RoBERTa + LoRA classifiers, 21-landmark MediaPipe vision pipelines, and GPT-4o explanation layers snap directly into the product so clinicians and users can audit every model output.",
    proof: "Solo-built Bias Checker (ABIM) · GesturePro · CentralPerk",
    tools: ["RoBERTa + LoRA", "GPT-4o", "TensorFlow", "MediaPipe", "LangGraph"],
  },
  {
    id: "testing",
    num: "05",
    short: "Tested & Live",
    accent: "#e8b85a",
    kicker: "PHASE 05 / EVALUATION & PRODUCTION",
    title: "Validate in the real world, then ship.",
    body: "All layers seal into one production artifact — verified through moderated usability testing, inter-rater reliability checks, A/B experimentation (+11% conversion at Capita), and live Docker deployment.",
    proof: "Capita (+11% conversion) · GesturePro (n=6) · Drexel 3.97 GPA",
    tools: ["LLM Evaluation", "A/B Testing", "Usability Testing", "HF Spaces"],
  },
];

export function ProductMorphStage() {
  const trackRef = useRef(null);
  const rigRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentP = 0;
    let targetP = 0;
    let curRx = 0;
    let curRy = 0;
    let raf = 0;

    const onPointer = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetP = Math.min(1, Math.max(0, -rect.top / scrollable));

      currentP += (targetP - currentP) * (reduced ? 1 : 0.12);
      progressRef.current = currentP;

      const nextPhase = Math.min(4, Math.floor(currentP * 5));
      setPhaseIdx((prev) => (prev === nextPhase ? prev : nextPhase));
      setPct(Math.round(currentP * 100));

      // Compute continuous 3D transform for the central morphing product rig
      const rig = rigRef.current;
      if (!rig) return;

      // Keyframed 3D orientation & layer explosion across progress 0..1:
      // 0.00 (Research): gentle flat blueprint tilt (rx: 8, ry: -10, rz: 0, explode: 0)
      // 0.25 (Frontend): crisp front-facing UI (rx: 4, ry: -6, rz: 0, explode: 0)
      // 0.50 (Backend): dramatic isometric exploded stack (rx: 48, ry: -8, rz: -20, explode: 1)
      // 0.75 (AI & ML): lifted neural inspection angle (rx: 32, ry: 12, rz: -10, explode: 0.78)
      // 1.00 (Shipped): sealed triumphant hero slab (rx: 6, ry: -4, rz: 0, explode: 0)
      const smooth = (a, b, t) => {
        const k = Math.max(0, Math.min(1, (t - a) / (b - a)));
        return k * k * (3 - 2 * k);
      };

      const explodeIn = smooth(0.32, 0.50, currentP);
      const explodeOut = 1 - smooth(0.76, 0.90, currentP);
      const explode = explodeIn * explodeOut;

      const baseRx = 6 + explode * 40 - smooth(0.62, 0.78, currentP) * explode * 14;
      const baseRy = -8 + smooth(0.55, 0.78, currentP) * 18 - smooth(0.82, 0.96, currentP) * 14;
      const baseRz = -explode * 18;

      const ptrX = reduced ? 0 : pointerRef.current.x * 6;
      const ptrY = reduced ? 0 : -pointerRef.current.y * 5;

      curRx += (baseRx + ptrY - curRx) * 0.1;
      curRy += (baseRy + ptrX - curRy) * 0.1;

      rig.style.setProperty("--rx", `${curRx.toFixed(2)}deg`);
      rig.style.setProperty("--ry", `${curRy.toFixed(2)}deg`);
      rig.style.setProperty("--rz", `${baseRz.toFixed(2)}deg`);
      rig.style.setProperty("--explode", explode.toFixed(3));
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  function jumpToPhase(index) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
    const targetY = top + ((index + 0.08) / 5) * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  const phase = PHASES[phaseIdx];

  return (
    <section
      id="morph"
      ref={trackRef}
      className="v6MorphTrack"
      style={{ "--phase-accent": phase.accent }}
    >
      <div className="v6MorphSticky">
        <PhaseFieldCanvas progressRef={progressRef} />
        <div className="v6MorphVignette" aria-hidden="true" />

        <div className="v6Wrap v6MorphGrid">
          {/* LEFT — EDITORIAL NARRATIVE + PHASE STORY */}
          <div className="v6MorphCopy">
            <div className="v6IntroMeta">
              <span className="v6PhaseBadge">
                <i aria-hidden="true" />
                {phase.kicker}
              </span>
              <span className="v6ScrollPct">BUILD {String(pct).padStart(2, "0")}%</span>
            </div>

            <div className="v6StorySwap" key={phase.id}>
              <h1 className="v6MorphTitle">
                {phaseIdx === 0 ? (
                  <>
                    From raw research
                    <br />
                    to <em>shipped AI.</em>
                  </>
                ) : (
                  phase.title
                )}
              </h1>
              <p className="v6MorphBody">{phase.body}</p>

              <div className="v6MorphTools">
                {phase.tools.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="v6MorphProof">
                <small>SHIPPED EVIDENCE</small>
                <strong>{phase.proof}</strong>
              </div>
            </div>

            <div className="v6MorphActions">
              <HiringBrief triggerClassName="v6BtnSolid" biasHref="#works" />
              <a
                className="v6BtnLink"
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Résumé (PDF) ↗
              </a>
              <a
                className="v6BtnLink"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* RIGHT — THE 3D MORPHING PRODUCT ARTIFACT */}
          <div className="v6StageWrap">
            <div
              ref={rigRef}
              className="v6ProductRig"
              data-phase={phase.id}
            >
              {/* BOTTOM LAYER — INFRASTRUCTURE & DATABASE (visible when exploded) */}
              <div className="v6Layer v6LayerInfra">
                <div className="v6LayerTag">03 / DATA &amp; RUNTIME</div>
                <div className="v6InfraGrid">
                  <div className="v6InfraBox">
                    <small>POSTGRESQL</small>
                    <strong>vignettes · rubrics · logs</strong>
                  </div>
                  <div className="v6InfraBox">
                    <small>DOCKER COMPOSE</small>
                    <strong>HF Spaces · Healthy ✓</strong>
                  </div>
                </div>
              </div>

              {/* MIDDLE LAYER — API BUS & AI INFERENCE ENGINE */}
              <div className="v6Layer v6LayerCore">
                <div className="v6LayerTag">
                  {phaseIdx >= 3 ? "02 / AI INFERENCE & EXPLAINABILITY" : "02 / API GATEWAY"}
                </div>

                <div className="v6ApiStream">
                  <div className="v6EndpointRow">
                    <span className="v6Method">POST</span>
                    <code>/api/analyze</code>
                    <span className="v6Status">200 OK · 42ms</span>
                  </div>
                  <div className="v6PulseTrack" aria-hidden="true">
                    <span />
                  </div>
                  <div className="v6NeuralNodes">
                    <div className="v6NodeChip" data-lit={phaseIdx >= 3}>
                      <small>CLASSIFIER</small>
                      <strong>RoBERTa + LoRA</strong>
                    </div>
                    <i aria-hidden="true">→</i>
                    <div className="v6NodeChip" data-lit={phaseIdx >= 3}>
                      <small>REASONING</small>
                      <strong>GPT-4o Explain</strong>
                    </div>
                    <i aria-hidden="true">→</i>
                    <div className="v6NodeChip" data-lit={phaseIdx >= 3}>
                      <small>VISION</small>
                      <strong>MediaPipe 21pt</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP LAYER — MORPHS FROM WIREFRAME → FRONTEND UI → AI WORKBENCH → SHIPPED APP */}
              <div className="v6Layer v6LayerSurface">
                <div className="v6ChromeBar">
                  <div className="v6Dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="v6ChromeTitle">
                    {phaseIdx === 0
                      ? "research-canvas.fig — Discovery & Rubric Taxonomy"
                      : phaseIdx === 1
                        ? "BiasChecker.tsx — Next.js Atomic UI"
                        : phaseIdx === 2
                          ? "BiasChecker.tsx ⇄ Flask / FastAPI"
                          : phaseIdx === 3
                            ? "BiasChecker AI — Live Model Audit"
                            : "BiasChecker v1.0 — Production Verified"}
                  </span>
                  <span className="v6ChromePill">
                    {phaseIdx === 4 ? "LIVE ✓" : `STAGE 0${phaseIdx + 1}`}
                  </span>
                </div>

                {/* Phase 01 Research Wireframe Overlay */}
                <div className="v6SurfaceResearch" data-show={phaseIdx === 0}>
                  <div className="v6StickyCluster">
                    <div className="v6StickyNote">
                      <small>INTERVIEW #04</small>
                      <p>“A score without reasoning won’t pass clinical review.”</p>
                    </div>
                    <div className="v6StickyNote isAlt">
                      <small>RUBRIC TAXONOMY</small>
                      <p>Calgary-Cambridge · NURSE · IRR Protocol</p>
                    </div>
                  </div>
                  <div className="v6WireSkeleton">
                    <span className="w-70" />
                    <span className="w-100" />
                    <span className="w-55" />
                  </div>
                  <div className="v6FlowSketch">
                    <span>Input Vignette</span>
                    <i>→</i>
                    <span>Audit Label</span>
                    <i>→</i>
                    <span>Human Control</span>
                  </div>
                </div>

                {/* Phase 02–05 Crystallized High-Fidelity Application */}
                <div className="v6SurfaceApp" data-show={phaseIdx >= 1}>
                  <div className="v6AppSidebar">
                    <span className="v6AppLogo">BC</span>
                    <i className="isOn" />
                    <i />
                    <i />
                  </div>

                  <div className="v6AppMain">
                    <div className="v6AppHeaderRow">
                      <strong>Clinical Vignette Assessment</strong>
                      <span>{phaseIdx >= 3 ? "RoBERTa+LoRA · Active" : "Next.js · Ready"}</span>
                    </div>

                    <div className="v6VignetteCard">
                      <p>
                        “54-year-old patient reports recurring chest discomfort;{" "}
                        <mark className={phaseIdx >= 3 ? "isLit" : ""}>
                          symptoms attributed to stress before ECG workup
                        </mark>
                        .”
                      </p>
                    </div>

                    <div className="v6AiOutputCard" data-lit={phaseIdx >= 3}>
                      <div className="v6AiTop">
                        <span>DIAGNOSTIC BIAS SIGNAL</span>
                        <strong>{phaseIdx >= 3 ? "94.2% confidence" : "Awaiting inference"}</strong>
                      </div>
                      <p>
                        {phaseIdx >= 3
                          ? "GPT-4o Explanation: Premature attribution to anxiety risks anchoring bias; recommend standard cardiac rubric check."
                          : "Structured output slot prepared for explainable classification."}
                      </p>
                    </div>

                    {/* Phase 05 Testing & Shipped Verification Strip */}
                    <div className="v6TestStrip" data-show={phaseIdx === 4}>
                      <span>Usability n=6 ✓</span>
                      <span>IRR Rubric ✓</span>
                      <span>WCAG 2.1 ✓</span>
                      <span>Docker Live ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SCRUBBER & PHASE SELECTOR */}
        <div className="v6Wrap v6MorphFooter">
          <div className="v6PhaseRail" role="tablist" aria-label="Product build phases">
            {PHASES.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={phaseIdx === idx}
                className="v6PhaseBtn"
                onClick={() => jumpToPhase(idx)}
              >
                <small>{p.num}</small>
                <span>{p.short}</span>
              </button>
            ))}
          </div>
          <span className="v6ScrollCue">
            {phaseIdx < 4 ? "SCROLL TO TRANSFORM ↓" : "SCROLL FOR FULL PORTFOLIO ↓"}
          </span>
        </div>
      </div>
    </section>
  );
}
