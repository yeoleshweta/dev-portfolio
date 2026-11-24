"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { V6Header } from "@/components/v6/V6Header";
import { PhaseFieldCanvas } from "@/components/v6/PhaseFieldCanvas";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import "@/styles/gallery.css";

const CHAPTERS = [
  { id: "arrival", num: "01", label: "Intro", accent: "#e8b85a" },
  { id: "research", num: "02", label: "UX Research", accent: "#e8a848" },
  { id: "frontend", num: "03", label: "Frontend UI", accent: "#6fb6ff" },
  { id: "backend", num: "04", label: "Backend APIs", accent: "#3ee09c" },
  { id: "ai", num: "05", label: "AI & ML", accent: "#a76bff" },
  { id: "works", num: "06", label: "Shipped", accent: "#e8b85a" },
  { id: "trajectory", num: "07", label: "Trajectory", accent: "#d992b4" },
  { id: "contact", num: "08", label: "Next Build", accent: "#e8b85a" },
];

const shippedWorks = [
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
    caseHref: `/work/${projects[0].slug}/`,
    repo: projects[0].repository,
    nodes: systems[1].nodes,
    decision: systems[1].decision,
  },
  {
    id: "urbanfit",
    num: "03",
    year: "2022",
    title: "Urbanfit Control Panel",
    field: "Product Design · Systems",
    headline: "One inventory, three perspectives.",
    summary:
      "Multi-role desktop workspace spanning 30 screens and 484 connected interactions for administrators, warehouse teams, and franchise shops.",
    stack: ["Figma", "Design Systems", "Interaction Design"],
    caseHref: `/work/${projects[1].slug}/`,
    decision:
      "Anchor three distinct operational roles to one shared navigation grammar and consistent table patterns.",
  },
  {
    id: "pocketsaver",
    num: "04",
    year: "2025",
    title: "PocketSaver",
    field: "Fullstack · Forecasting",
    headline: "Follow the request end to end.",
    summary:
      "Finance application orchestrating Next.js, a Node.js API proxy, PostgreSQL persistence, and an isolated Python forecasting service in Docker Compose.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python", "Docker"],
    repo: systems[2].repository,
    nodes: systems[2].nodes,
    decision: systems[2].decision,
  },
  {
    id: "clinical-communication",
    num: "05",
    year: "2025",
    title: "Clinical Communication",
    field: "ABIM · Supervised NLP",
    headline: "Making clinical dialogue legible.",
    summary:
      "Supervised NLP annotation workflow mapping doctor-patient dialogue behaviors to Calgary-Cambridge and NURSE rubrics.",
    stack: ["Python", "NLP", "Label Studio"],
    caseHref: `/work/${projects[2].slug}/`,
    decision:
      "Connect every model output to named clinical communication frameworks so reviewers can audit predictions.",
  },
  {
    id: "centralperk",
    num: "06",
    year: "In Progress",
    title: "CentralPerk",
    field: "Multi-Agent Systems",
    headline: "Transparent agent handoffs.",
    summary: archive[0].description,
    stack: ["LangGraph", "FastAPI", "React", "Tailwind CSS"],
    decision:
      "Surface completed versus deferred agent work explicitly at the interface layer.",
  },
];

const roleImpact = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

// Continuous keyframe interpolation for the single persistent 3D artifact across 0..1 page scroll
// Each keyframe: [scrollProgress, xVw, yVh, scale, rotX, rotY, rotZ, explode, stageOpacity]
const KEYFRAMES = [
  [0.00,  22,   0, 1.00,  6,  -12,   0, 0.00, 1.00], // 01 Arrival (right)
  [0.14, -22,   0, 0.98,  9,   14,  -2, 0.00, 1.00], // 02 UX Research (left — blueprint wireframe)
  [0.29,  22,   0, 1.00,  5,  -12,   1, 0.00, 1.00], // 03 Frontend UI (right — crystallized app)
  [0.44, -21,   2, 0.92, 48,   -8, -20, 1.00, 1.00], // 04 Backend APIs (left — exploded 3D stack)
  [0.58,  21,   0, 0.95, 30,   14, -10, 0.78, 1.00], // 05 AI & ML (right — ignited neural core)
  [0.72, -22,   0, 0.98,  6,   10,   0, 0.00, 1.00], // 06 Shipped & Tested (left — sealed production app)
  [0.85,  24,   2, 0.80, 12,  -16,   4, 0.15, 0.72], // 07 Trajectory (right — subtle companion seal)
  [0.93,   0,  -4, 0.86,  8,    0,   0, 0.00, 0.18], // Gallery breathing room (recedes softly)
  [1.00,   0,   0, 0.94,  6,    0,   0, 0.00, 0.34], // 08 Colophon (centered monolithic aura)
];

function sampleKeyframes(p) {
  const clamped = Math.max(0, Math.min(1, p));
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (clamped >= a[0] && clamped <= b[0]) {
      const span = Math.max(0.0001, b[0] - a[0]);
      const raw = (clamped - a[0]) / span;
      const t = raw * raw * (3 - 2 * raw); // smoothstep
      return {
        x: a[1] + (b[1] - a[1]) * t,
        y: a[2] + (b[2] - a[2]) * t,
        scale: a[3] + (b[3] - a[3]) * t,
        rx: a[4] + (b[4] - a[4]) * t,
        ry: a[5] + (b[5] - a[5]) * t,
        rz: a[6] + (b[6] - a[6]) * t,
        explode: a[7] + (b[7] - a[7]) * t,
        opacity: a[8] + (b[8] - a[8]) * t,
      };
    }
  }
  const last = KEYFRAMES[KEYFRAMES.length - 1];
  return {
    x: last[1], y: last[2], scale: last[3],
    rx: last[4], ry: last[5], rz: last[6],
    explode: last[7], opacity: last[8],
  };
}

export function V6Portfolio() {
  const stageRef = useRef(null);
  const rigRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const sheetRef = useRef(null);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [copied, setCopied] = useState(false);

  // Drive the ONE persistent 3D artifact continuously across the entire page scroll
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let curP = 0;
    let curPtrX = 0;
    let curPtrY = 0;
    let raf = 0;

    const onPointer = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const targetP = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      curP += (targetP - curP) * (reduced ? 1 : 0.11);
      progressRef.current = curP;

      // Determine active narrative chapter from actual section positions
      let active = 0;
      const mid = window.innerHeight * 0.48;
      for (let i = 0; i < CHAPTERS.length; i++) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.getBoundingClientRect().top <= mid) {
          active = i;
        }
      }
      setChapterIdx((prev) => (prev === active ? prev : active));

      curPtrX += ((reduced ? 0 : pointerRef.current.x * 5) - curPtrX) * 0.08;
      curPtrY += ((reduced ? 0 : -pointerRef.current.y * 4) - curPtrY) * 0.08;

      const kf = sampleKeyframes(curP);
      const stage = stageRef.current;
      const rig = rigRef.current;
      if (stage && rig) {
        stage.style.setProperty("--stage-op", kf.opacity.toFixed(3));
        rig.style.setProperty("--tx", `${kf.x.toFixed(2)}vw`);
        rig.style.setProperty("--ty", `${kf.y.toFixed(2)}vh`);
        rig.style.setProperty("--sc", kf.scale.toFixed(3));
        rig.style.setProperty("--rx", `${(kf.rx + curPtrY).toFixed(2)}deg`);
        rig.style.setProperty("--ry", `${(kf.ry + curPtrX).toFixed(2)}deg`);
        rig.style.setProperty("--rz", `${kf.rz.toFixed(2)}deg`);
        rig.style.setProperty("--explode", kf.explode.toFixed(3));
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (selectedWork && !d.open) {
      document.body.style.overflow = "hidden";
      d.showModal();
    } else if (!selectedWork && d.open) {
      document.body.style.overflow = "";
      d.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedWork]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  const activeChapter = CHAPTERS[chapterIdx];
  const isBlueprint = chapterIdx <= 1;
  const isUiReady = chapterIdx >= 2;
  const isAiLit = chapterIdx >= 4;
  const isVerified = chapterIdx >= 5;

  return (
    <div
      className="v6CanvasRoot"
      style={{ "--phase-accent": activeChapter.accent }}
    >
      <V6Header />

      {/* ===================================================================
          THE ONE PERSISTENT FULL-PAGE STAGE (FOLLOWS YOU FROM 0% TO 100%)
          =================================================================== */}
      <div ref={stageRef} className="v6FixedStage" aria-hidden="true">
        <PhaseFieldCanvas progressRef={progressRef} />
        <div className="v6StageAura" />

        <div className="v6PerspectivePlane">
          <div
            ref={rigRef}
            className="v6ArtifactRig"
            data-blueprint={isBlueprint}
            data-chapter={activeChapter.id}
          >
            {/* LAYER 1 (BOTTOM) — DATA & INFRASTRUCTURE */}
            <div className="v6Layer v6LayerInfra">
              <div className="v6LayerLabel">03 / PERSISTENCE &amp; RUNTIME</div>
              <div className="v6InfraCards">
                <div>
                  <small>POSTGRESQL</small>
                  <strong>vignettes · rubrics · audit_logs</strong>
                </div>
                <div>
                  <small>DOCKER COMPOSE</small>
                  <strong>HF Spaces · Container Live ✓</strong>
                </div>
              </div>
            </div>

            {/* LAYER 2 (MIDDLE) — API BUS + AI INFERENCE ENGINE */}
            <div className="v6Layer v6LayerCore">
              <div className="v6LayerLabel">
                {isAiLit
                  ? "02 / AI INFERENCE & EXPLAINABILITY"
                  : "02 / SERVICE BOUNDARIES & API"}
              </div>
              <div className="v6CoreStack">
                <div className="v6ApiBar">
                  <span className="v6Method">POST</span>
                  <code>/api/analyze</code>
                  <span className="v6Latency">200 OK · 42ms</span>
                </div>
                <div className="v6BusTrack">
                  <span />
                </div>
                <div className="v6NeuralRow">
                  <div className="v6ModelPill" data-lit={isAiLit}>
                    <small>CLASSIFIER</small>
                    <strong>RoBERTa + LoRA</strong>
                  </div>
                  <i>→</i>
                  <div className="v6ModelPill" data-lit={isAiLit}>
                    <small>REASONING</small>
                    <strong>GPT-4o Explain</strong>
                  </div>
                  <i>→</i>
                  <div className="v6ModelPill" data-lit={isAiLit}>
                    <small>VISION</small>
                    <strong>MediaPipe 21pt</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* LAYER 3 (TOP) — MORPHS FROM BLANK/RESEARCH WIREFRAME -> UI -> AI AUDIT -> VERIFIED APP */}
            <div className="v6Layer v6LayerTop">
              <div className="v6TopChrome">
                <div className="v6ChromeDots">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="v6ChromeFile">
                  {chapterIdx === 0
                    ? "shweta-sharma / artifact.canvas"
                    : chapterIdx === 1
                      ? "01-discovery.fig — Taxonomy & Stickies"
                      : chapterIdx === 2
                        ? "02-interface.tsx — Atomic Next.js UI"
                        : chapterIdx === 3
                          ? "03-services.py ⇄ Flask · FastAPI · SQL"
                          : chapterIdx === 4
                            ? "04-inference.py — RoBERTa + GPT-4o"
                            : "BiasChecker v1.0 — Verified & Live"}
                </span>
                <span className="v6ChromeTag">
                  {isVerified ? "LIVE ✓" : `0${Math.min(5, chapterIdx + 1)}/05`}
                </span>
              </div>

              {/* Phase 0–1: Research Wireframe & Stickies */}
              <div className="v6FaceResearch" data-show={isBlueprint}>
                <div className="v6StickyPair">
                  <div className="v6Sticky">
                    <small>CONTEXTUAL INQUIRY</small>
                    <p>“A score without reasoning won’t pass clinical review.”</p>
                  </div>
                  <div className="v6Sticky isSoft">
                    <small>TAXONOMY RUBRIC</small>
                    <p>Calgary-Cambridge · NURSE · IRR Protocol</p>
                  </div>
                </div>
                <div className="v6WireLines">
                  <span style={{ width: "68%" }} />
                  <span style={{ width: "100%" }} />
                  <span style={{ width: "52%" }} />
                </div>
                <div className="v6WireFlow">
                  <span>01 Discover</span>
                  <i>→</i>
                  <span>02 Prototype</span>
                  <i>→</i>
                  <span>03 Ship</span>
                </div>
              </div>

              {/* Phase 2–8: Crystallized App + AI Audit + Shipped Verification */}
              <div className="v6FaceApp" data-show={isUiReady}>
                <div className="v6AppRail">
                  <span className="v6AppMark">BC</span>
                  <i className="isOn" />
                  <i />
                  <i />
                </div>
                <div className="v6AppBody">
                  <div className="v6AppBar">
                    <strong>Clinical Vignette Assessment</strong>
                    <span>{isAiLit ? "RoBERTa+LoRA · Active" : "Next.js · Ready"}</span>
                  </div>
                  <div className="v6Vignette">
                    “54-year-old patient reports recurring chest discomfort;{" "}
                    <mark className={isAiLit ? "isLit" : ""}>
                      symptoms attributed to stress before ECG workup
                    </mark>
                    .”
                  </div>
                  <div className="v6ExplainBox" data-lit={isAiLit}>
                    <div className="v6ExplainHead">
                      <span>EXPLAINABLE SIGNAL</span>
                      <strong>{isAiLit ? "94.2% confidence" : "Model slot ready"}</strong>
                    </div>
                    <p>
                      {isAiLit
                        ? "GPT-4o: Premature attribution to anxiety risks anchoring bias; recommend standard cardiac rubric check."
                        : "Structured output container prepared for human-auditable inference."}
                    </p>
                  </div>
                  <div className="v6ChecksRow" data-show={isVerified}>
                    <span>Usability n=6 ✓</span>
                    <span>IRR Rubric ✓</span>
                    <span>A/B +11% ✓</span>
                    <span>WCAG 2.1 ✓</span>
                    <span>Docker ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED LEFT CHAPTER PROGRESS SPINE */}
      <nav className="v6Spine" aria-label="Story chapters">
        {CHAPTERS.map((c, idx) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="v6SpineDot"
            aria-current={chapterIdx === idx ? "step" : undefined}
          >
            <i aria-hidden="true" />
            <span>
              {c.num} {c.label}
            </span>
          </a>
        ))}
      </nav>

      {/* ===================================================================
          CONTINUOUS SCROLLING STORY CHAPTERS FLOWING AROUND THE ONE ARTIFACT
          =================================================================== */}
      <main id="main" className="v6StoryStream">
        {/* CHAPTER 01 — ARRIVAL (Left copy, artifact floats right) */}
        <section id="arrival" className="v6Chapter v6AlignLeft v6ChapterHero">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">
                SHWETA SHARMA · FULLSTACK ENGINEER &amp; APPLIED ML
              </span>
              <h1 className="v6HeroTitle">
                One builder.
                <br />
                <em>Every layer.</em>
              </h1>
              <p className="v6Lead">
                Scroll to watch a single product assemble itself across my
                entire skillset — from raw UX research and atomic React
                interfaces to Flask/FastAPI services, fine-tuned AI models, and
                real-world testing.
              </p>
              <div className="v6CtaRow">
                <HiringBrief triggerClassName="v6BtnPrimary" biasHref="#works" />
                <a
                  className="v6BtnPlain"
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  Résumé (PDF) ↗
                </a>
                <a
                  className="v6BtnPlain"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
              <p className="v6ScrollHint">
                SCROLL TO BUILD THE ARTIFACT ↓
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER 02 — UX RESEARCH (Artifact glides left, copy on right) */}
        <section id="research" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">01 / UX RESEARCH &amp; DISCOVERY</span>
              <h2 className="v6ChapterTitle">
                Before a line of code, <em>the human question.</em>
              </h2>
              <p className="v6Lead">
                Six years leading mixed-methods research taught me that the best
                engineering starts with field observation. I translate
                contextual inquiry, clinical rubrics (Calgary-Cambridge, NURSE,
                SHARE), and behavioral funnels into clear product architecture.
              </p>
              <div className="v6SkillStrip">
                <span>Contextual Inquiry</span>
                <span>Usability Testing</span>
                <span>Information Architecture</span>
                <span>A/B Testing</span>
                <span>IRR Protocols</span>
                <span>Hotjar · Amplitude · SQL</span>
              </div>
              <div className="v6ProofBox">
                <strong>−60% setup time · +11% conversion</strong>
                <span>
                  Established John Deere’s India UX research practice across
                  250+ products, and drove retail personalization at Capita.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03 — FRONTEND UI (Artifact glides right, copy on left) */}
        <section id="frontend" className="v6Chapter v6AlignLeft">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">02 / FRONTEND UI &amp; DESIGN SYSTEMS</span>
              <h2 className="v6ChapterTitle">
                Wireframes crystallize into <em>calm interfaces.</em>
              </h2>
              <p className="v6Lead">
                Watch the dashed sketch harden into solid tokens. I build
                atomic design systems in Figma and ship responsive React and
                Next.js interfaces where complex data and human-in-the-loop
                controls feel effortless.
              </p>
              <div className="v6SkillStrip">
                <span>React</span>
                <span>Next.js</span>
                <span>JavaScript</span>
                <span>Tailwind CSS</span>
                <span>Figma</span>
                <span>Atomic Design</span>
                <span>WCAG 2.1</span>
              </div>
              <div className="v6ProofBox">
                <strong>30 screens · 484 interactions · +35% engagement</strong>
                <span>
                  Built Urbanfit’s atomic design system from scratch and
                  engineered live editable interfaces for GesturePro and Bias
                  Checker.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 04 — BACKEND & APIS (Artifact explodes left, copy on right) */}
        <section id="backend" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">03 / BACKEND, APIS &amp; PERSISTENCE</span>
              <h2 className="v6ChapterTitle">
                Peel back the surface to <em>explicit services.</em>
              </h2>
              <p className="v6Lead">
                The UI lifts off its foundation to reveal clean service
                boundaries — Node.js proxies, Flask and FastAPI inference
                endpoints, PostgreSQL schemas, and containerized Docker Compose
                stacks built for reliable deployment.
              </p>
              <div className="v6SkillStrip">
                <span>Python</span>
                <span>FastAPI</span>
                <span>Flask</span>
                <span>Node.js</span>
                <span>PostgreSQL</span>
                <span>Docker Compose</span>
                <span>Git</span>
              </div>
              <div className="v6ProofBox">
                <strong>End-to-end service ownership</strong>
                <span>
                  PocketSaver (Next.js → Node /api/forecast → PostgreSQL +
                  Python /predict) and Bias Checker Flask API on Hugging Face
                  Spaces.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 05 — APPLIED AI & ML (Artifact ignites right, copy on left) */}
        <section id="ai" className="v6Chapter v6AlignLeft">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">04 / APPLIED AI &amp; EXPLAINABILITY</span>
              <h2 className="v6ChapterTitle">
                Models people can <em>question and audit.</em>
              </h2>
              <p className="v6Lead">
                Pairing an MS in Computer Science (AI &amp; Machine Learning,
                3.97 GPA) with clinical NLP work at ABIM, I fine-tune models and
                attach human-legible explanation layers so no prediction is a
                black box.
              </p>
              <div className="v6SkillStrip">
                <span>RoBERTa + LoRA</span>
                <span>GPT-4o</span>
                <span>TensorFlow</span>
                <span>MediaPipe (21pt)</span>
                <span>LangGraph</span>
                <span>Label Studio</span>
                <span>LLM Evaluation</span>
              </div>
              <div className="v6ProofBox">
                <strong>Solo-built Bias Checker AI · 21 landmarks/frame</strong>
                <span>
                  Fine-tuned clinical bias detection at ABIM, real-time webcam
                  sign recognition in GesturePro, and multi-agent handoffs in
                  CentralPerk.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 06 — TESTED & SHIPPED WORKS (Artifact seals left, interactive index on right) */}
        <section id="works" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard v6CardWide">
              <span className="v6Kicker">05 / TESTED, VERIFIED &amp; SHIPPED</span>
              <h2 className="v6ChapterTitle">
                Sealed into <em>six real builds.</em>
              </h2>
              <p className="v6Lead">
                Every layer collapses back into a tested, shipped artifact.
                Select any project below to inspect its full architecture sheet.
              </p>

              <div className="v6WorksList">
                {shippedWorks.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className="v6WorkLine"
                    onClick={() => setSelectedWork(w)}
                  >
                    <small>{w.num}</small>
                    <div>
                      <strong>{w.title}</strong>
                      <span>{w.field} · {w.headline}</span>
                    </div>
                    <i>Inspect ↗</i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 07 — TRAJECTORY & HUMAN CONTEXT (Artifact shrinks right, career on left) */}
        <section id="trajectory" className="v6Chapter v6AlignLeft">
          <div className="v6Wrap">
            <div className="v6ChapterCard v6CardWide">
              <span className="v6Kicker">06 / THE TRAJECTORY</span>
              <h2 className="v6ChapterTitle">
                Different roles. <em>One curiosity.</em>
              </h2>

              <div className="v6DrexelBar">
                <div>
                  <small>DREXEL UNIVERSITY · 2024–2026</small>
                  <strong>MS Computer Science — AI &amp; Machine Learning</strong>
                </div>
                <em>3.97 / 4.0 GPA</em>
              </div>

              <div className="v6ExpList">
                {experience.map(([dates, company, role, detail]) => (
                  <article className="v6ExpRow" key={company}>
                    <div className="v6ExpHead">
                      <strong>{company}</strong>
                      <span>{roleImpact[company] || role}</span>
                    </div>
                    <small>{dates} · {role}</small>
                    <p>{detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INTERLUDE — BEYOND THE SCREEN + ORIGINAL SCATTERED PHOTO DESK */}
        <section id="offscreen" className="v6OffscreenBand">
          <div className="v6Wrap">
            <div className="v6HumanIntro">
              <figure className="v6HumanPhoto">
                <Image
                  src="/mountains.jpg"
                  alt="Shweta at Grace Hopper Celebration 2025"
                  width={900}
                  height={700}
                  sizes="(max-width: 960px) 92vw, 44vw"
                />
                <figcaption>
                  <span>FIELD NOTE / 01</span>
                  <strong>Grace Hopper Celebration · 2025</strong>
                </figcaption>
              </figure>
              <div className="v6HumanText">
                <span className="v6Kicker">07 / BEYOND THE SCREEN</span>
                <h2 className="v6ChapterTitle">
                  A little more <em>human context.</em>
                </h2>
                <p className="v6Lead">
                  Away from the screen, curiosity looks like mountain motorcycle
                  trips, scuba dives, and running through Philadelphia. Drag or
                  click any print on the desk below.
                </p>
              </div>
            </div>
          </div>

          <div className="v6Darkroom">
            <PersonalGallery />
          </div>
        </section>

        {/* CHAPTER 08 — COLOPHON (Artifact returns softly centered behind closing call) */}
        <section id="contact" className="v6Colophon">
          <div className="v6Wrap v6ColophonInner">
            <span className="v6Kicker">08 / READY FOR THE NEXT BUILD</span>
            <h2 className="v6ColophonTitle">
              Thoughtful people.
              <br />
              <em>Ambitious work.</em>
            </h2>
            <p className="v6Lead" style={{ marginInline: "auto" }}>
              Open to fullstack and applied AI engineering roles where craft,
              interaction design, and technical rigor live together.
            </p>

            <div className="v6ContactActions">
              <a className="v6EmailBig" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                type="button"
                className="v6BtnPrimary"
                onClick={copyEmail}
              >
                {copied ? "Copied to clipboard ✓" : "Copy address"}
              </button>
            </div>

            <footer className="v6Footer">
              <span>© 2026 SHWETA SHARMA</span>
              <div className="v6FooterLinks">
                <a href={profile.resume} target="_blank" rel="noreferrer">
                  Résumé ↗
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                <Link href="/v1">v1</Link>
                <Link href="/v2">v2</Link>
                <Link href="/v3">v3</Link>
                <Link href="/v4">v4</Link>
                <Link href="/v5">v5</Link>
              </div>
              <a href="#main">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>

      {/* ARCHITECTURE MONOGRAPH DIALOG */}
      <dialog
        ref={sheetRef}
        className="v6Sheet"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedWork(null);
        }}
        onCancel={() => setSelectedWork(null)}
      >
        {selectedWork && (
          <div className="v6SheetInner">
            <div className="v6SheetTop">
              <span>
                PLATE {selectedWork.num} / {selectedWork.field.toUpperCase()}
              </span>
              <button type="button" onClick={() => setSelectedWork(null)}>
                Close ×
              </button>
            </div>
            <div className="v6SheetBody">
              <h2>{selectedWork.title}</h2>
              <p className="v6SheetHeadline">{selectedWork.headline}</p>
              <p className="v6SheetSummary">{selectedWork.summary}</p>
              <div className="v6TagRow">
                {selectedWork.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <blockquote className="v6SheetQuote">
                <small>ARCHITECTURAL DECISION</small>
                <p>“{selectedWork.decision}”</p>
              </blockquote>
              {selectedWork.nodes && (
                <div className="v6SheetNodes">
                  <small className="v6SheetSub">SYSTEM PIPELINE</small>
                  {selectedWork.nodes.map((node) => (
                    <div className="v6NodeRow" key={node.layer}>
                      <span>{node.layer}</span>
                      <div>
                        <strong>
                          {node.title} · <em>{node.technology}</em>
                        </strong>
                        <p>{node.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="v6SheetActions">
                {selectedWork.caseHref && (
                  <Link
                    className="v6BtnPrimary"
                    href={selectedWork.caseHref}
                    onClick={() => setSelectedWork(null)}
                  >
                    Read Full Case Study ↗
                  </Link>
                )}
                {selectedWork.repo && (
                  <a
                    className="v6BtnPlain"
                    href={selectedWork.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore Source on GitHub ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
