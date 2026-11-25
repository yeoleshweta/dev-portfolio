"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { V6Header } from "@/components/v6/V6Header";
import { SculpturalArtifactCanvas } from "@/components/v6/SculpturalArtifactCanvas";
import { AetherglintCanvas } from "@/components/v4/AetherglintCanvas";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { ProjectViewModal } from "@/components/portfolio/ProjectViewModal";
import { profile, experience } from "@/content/profile";
import "@/styles/gallery.css";
import { selectedProjects } from "@/content/selected-projects";

const CHAPTERS = [
  { id: "arrival", num: "01", label: "Intro", accent: "#e8b85a", accentLight: "#a66c14", side: "right", state: "01 · RAW GRAIN MASS", mapping: "Unshaped mineral cloud — scroll to sculpt it through 5 builds" },
  { id: "research", num: "02", label: "UX Research", accent: "#e8a848", accentLight: "#b56510", side: "left", state: "02 · SIX AFFINITY CLUSTERS", mapping: "Splits into 6 discovery clusters & bridges → UX Research" },
  { id: "frontend", num: "03", label: "Frontend UI", accent: "#6fb6ff", accentLight: "#1d63b8", side: "right", state: "03 · MODULAR 3D GRID CUBE", mapping: "Snaps into a crisp 3×3 structural grid → React & Figma UI" },
  { id: "backend", num: "04", label: "Backend APIs", accent: "#3ee09c", accentLight: "#0d8456", side: "left", state: "04 · FLOWING TORUS PIPELINE", mapping: "Unwinds into a continuous data loop → APIs & PostgreSQL" },
  { id: "ai", num: "05", label: "AI & ML", accent: "#a76bff", accentLight: "#6a32c9", side: "right", state: "05 · DUAL-HEMISPHERE NEURAL BRAIN", mapping: "Folds into a firing neural network → Applied AI & Eval" },
  { id: "testing", num: "06", label: "Tested & Shipped", accent: "#e8b85a", accentLight: "#a66c14", side: "left", state: "06 · BRILLIANT-CUT DIAMOND", mapping: "Compressed, faceted & verified → QA, Usability & Shipped" },
  { id: "works", num: "07", label: "Selected Builds", accent: "#e8b85a", accentLight: "#a66c14", side: "center", state: "SELECTED PROJECTS", mapping: "Explore the projects and their architecture" },
  { id: "craft", num: "08", label: "Craft & Toolkit", accent: "#e8b85a", accentLight: "#a66c14", side: "center", state: "CRAFT & TOOLKIT", mapping: "Every framework & method behind the shipped work" },
  { id: "trajectory", num: "09", label: "Trajectory", accent: "#d992b4", accentLight: "#a33f6e", side: "center", state: "THE FINISHED CUT", mapping: "Six years of craft + MS AI & ML (3.97 GPA)" },
  { id: "contact", num: "10", label: "Next Build", accent: "#f093c4", accentLight: "#f093c4", side: "center", state: "READY FOR WHAT'S NEXT", mapping: "Let's shape the next product from research to shipped AI" },
];

const shippedWorks = selectedProjects;

const craftFilters = [
  { id: "all", label: "All Craft" },
  { id: "engineering", label: "Frontend & APIs" },
  { id: "ai", label: "Applied AI & ML" },
  { id: "design", label: "Design Systems" },
  { id: "research", label: "Research & Data" },
];

const craftTokens = [
  { name: "React", cat: "engineering", italic: false, proof: "Production interfaces across CentralPerk, dashboards, and design-system handoffs." },
  { name: "Next.js", cat: "engineering", italic: true, proof: "App Router frontends for Bias Checker (ABIM), GesturePro, and PocketSaver." },
  { name: "Python", cat: "ai", italic: false, proof: "Clinical NLP pipelines at ABIM, FastAPI/Flask backends, and forecasting services." },
  { name: "Figma", cat: "design", italic: true, proof: "Urbanfit's 30-screen atomic design system and John Deere's 250+ product survey platform." },
  { name: "RoBERTa + LoRA", cat: "ai", italic: false, proof: "Fine-tuned healthcare bias classifier deployed in Bias Checker on Hugging Face Spaces." },
  { name: "FastAPI", cat: "engineering", italic: false, proof: "Real-time hand-landmark inference backend in GesturePro and CentralPerk API layer." },
  { name: "Design Systems", cat: "design", italic: true, proof: "Atomic component libraries built from scratch at Urbanfit and maintained across 7 UK brands at Capita." },
  { name: "LLM Evaluation", cat: "ai", italic: false, proof: "Rubric-based clinical evaluation frameworks at ABIM covering accuracy, IRR, and edge cases." },
  { name: "Usability Testing", cat: "research", italic: true, proof: "Moderated studies across 6+ John Deere teams, Urbanfit (+35% engagement), and GesturePro." },
  { name: "Flask", cat: "engineering", italic: false, proof: "Served classification and GPT-4o explainability endpoints for Bias Checker." },
  { name: "GPT-4o", cat: "ai", italic: false, proof: "Few-shot explainability layer giving clinicians auditable reasoning beside model labels." },
  { name: "PostgreSQL", cat: "engineering", italic: true, proof: "Containerized relational persistence orchestrated alongside Node.js and Python in PocketSaver." },
  { name: "Label Studio", cat: "ai", italic: false, proof: "Annotated clinical dialogue reference sets mapped to Calgary-Cambridge, NURSE, and SHARE." },
  { name: "TensorFlow", cat: "ai", italic: false, proof: "Trained the sign classification model behind GesturePro's browser-to-text flow." },
  { name: "MediaPipe", cat: "ai", italic: true, proof: "Extracted 21 real-time hand landmarks per webcam frame in GesturePro." },
  { name: "Docker", cat: "engineering", italic: false, proof: "Multi-service Compose topology in PocketSaver and containerized Bias Checker deployment." },
  { name: "LangGraph", cat: "ai", italic: true, proof: "Stateful multi-agent orchestration powering CentralPerk's transparent handoff UX." },
  { name: "A/B Testing", cat: "research", italic: false, proof: "Behavioral segmentation and experimentation on Qubit's ML platform (+11% conversion at Capita)." },
  { name: "Information Architecture", cat: "design", italic: true, proof: "Self-serve survey platform across 250+ John Deere products (−60% setup time)." },
  { name: "WCAG 2.1", cat: "design", italic: false, proof: "Accessible contrast, keyboard navigation, and inclusive interaction patterns." },
  { name: "Behavioral Analytics", cat: "research", italic: false, proof: "Hotjar, FullStory, Google Analytics, Amplitude, SQL, Tableau, and Power BI." },
];

const DISCIPLINE_CHAPTERS = [
  {
    id: "research",
    align: "right",
    kicker: "01 / UX RESEARCH & DISCOVERY",
    titleLead: "Start with ",
    titleEm: "real human friction.",
    lead: "I uncover what people actually struggle with through contextual inquiry, usability studies, clinical rubrics, and behavioral analytics before writing code.",
    craftCat: "research",
    metrics: [
      { value: "−60%", label: "Survey setup time (250+ John Deere products)" },
      { value: "+11%", label: "Retail conversion lift (7 UK brands, Capita)" },
    ],
    skills: [
      { name: "Contextual Inquiry", tip: "Established John Deere’s India UX research practice across 6+ product teams." },
      { name: "Usability Testing", tip: "Moderated studies across John Deere, Urbanfit (+35% engagement), and GesturePro (n=6)." },
      { name: "Information Architecture", tip: "Designed a self-serve survey platform serving 250+ internal products without dev bottlenecks." },
      { name: "A/B Testing", tip: "Behavioral segmentation & experimentation on Qubit’s ML platform at Capita." },
      { name: "IRR Protocols", tip: "Translated Calgary-Cambridge, NURSE & SHARE rubrics into validated clinical NLP datasets at ABIM." },
      { name: "Hotjar · SQL", tip: "Combined behavioral funnels with 120+ feedback channels to cut Urbanfit bounce rate by 28%." },
    ],
    links: [
      { title: "Clinical Communication", subtitle: "Rubric taxonomy & NLP", tip: "ABIM · Annotated doctor-patient dialogue mapped to Calgary-Cambridge & NURSE rubrics.", caseHref: "/work/clinical-communication/" },
      { title: "InOut", subtitle: "Guided room walkthroughs", tip: "Timestamped move-in/move-out walkthroughs with before-and-after visual evidence.", projectId: "inout" },
    ],
  },
  {
    id: "frontend",
    align: "left",
    kicker: "02 / FRONTEND UI & DESIGN SYSTEMS",
    titleLead: "Interfaces that keep ",
    titleEm: "people in command.",
    lead: "I turn complex workflows into atomic Figma design systems and responsive React & Next.js apps where users always stay in control.",
    craftCat: "design",
    metrics: [
      { value: "30 / 484", label: "Screens & interactions (Urbanfit)" },
      { value: "+35%", label: "Engagement lift & −28% bounce" },
    ],
    skills: [
      { name: "React", tip: "Production interfaces across CentralPerk, interactive dashboards, and design-system handoffs." },
      { name: "Next.js", tip: "App Router frontends for Bias Checker (ABIM), GesturePro live editor, and PocketSaver." },
      { name: "Figma & Atomic Design", tip: "Built Urbanfit’s 30-screen multi-role design system from scratch (admin, warehouse, franchise)." },
      { name: "Tailwind CSS", tip: "Token-consistent, responsive UI systems shipped across React and Next.js builds." },
      { name: "JavaScript", tip: "Real-time client state, webcam landmark loops, and smooth interaction choreography." },
      { name: "WCAG 2.1", tip: "Accessible contrast, keyboard navigation, and human-in-the-loop correction patterns." },
    ],
    links: [
      { title: "Urbanfit Control Panel", subtitle: "Multi-role design system", tip: "30 screens & 484 connected prototype interactions uniting admin, warehouse & franchise roles.", caseHref: "/work/urbanfit/" },
      { title: "GesturePro", subtitle: "Live webcam sign editor", tip: "Browser webcam-to-text interface where signers edit predicted messages in real time.", projectId: "gesturepro" },
    ],
  },
  {
    id: "backend",
    align: "right",
    kicker: "03 / BACKEND, APIS & PERSISTENCE",
    titleLead: "Clean contracts ",
    titleEm: "across the stack.",
    lead: "I own the services behind the UI — REST & ML inference APIs, Node.js proxies, PostgreSQL schemas, and containerized Docker stacks.",
    craftCat: "engineering",
    metrics: [
      { value: "4-tier", label: "Web → API → DB → ML services" },
      { value: "100%", label: "Containerized Docker & HF Spaces" },
    ],
    skills: [
      { name: "Python", tip: "Core runtime for clinical NLP pipelines, Flask/FastAPI inference APIs, and forecast services." },
      { name: "FastAPI", tip: "Real-time hand-landmark classification backend in GesturePro and CentralPerk agent API." },
      { name: "Flask", tip: "Served fine-tuned RoBERTa classification and GPT-4o explanation endpoints in Bias Checker." },
      { name: "Node.js", tip: "API proxy & routing layer connecting Next.js, PostgreSQL, and Python forecasting in PocketSaver." },
      { name: "PostgreSQL", tip: "Relational persistence schemas orchestrated with multi-service Docker Compose." },
      { name: "Docker Compose", tip: "Reproducible multi-container local stacks and Hugging Face Spaces cloud deployments." },
    ],
    links: [
      { title: "Open-slot matcher", subtitle: "Concurrency-safe queues", tip: "Waitlist ranking, event queues & burst-load tested single-claim appointment booking.", projectId: "open-slot-matcher" },
      { title: "Bias Checker", subtitle: "Flask API + Docker deploy", tip: "Solo-built Flask inference & explanation API deployed via Docker on Hugging Face Spaces.", projectId: "bias-checker" },
    ],
  },
  {
    id: "ai",
    align: "left",
    kicker: "04 / APPLIED AI & EXPLAINABILITY",
    titleLead: "Models people can ",
    titleEm: "question and trust.",
    lead: "Pairing an MS in AI & ML with clinical NLP at ABIM, I fine-tune classifiers and vision pipelines with human-auditable GPT-4o reasoning.",
    craftCat: "ai",
    metrics: [
      { value: "3.97", label: "MS AI & ML GPA · Drexel" },
      { value: "21 pts", label: "Hand landmarks / frame" },
    ],
    skills: [
      { name: "RoBERTa + LoRA", tip: "Fine-tuned clinical bias classifier built solo at ABIM and deployed end to end." },
      { name: "GPT-4o", tip: "Few-shot explainability layer giving clinicians inspectable reasoning beside each label." },
      { name: "TensorFlow", tip: "Trained the hand-sign gesture classification model powering GesturePro." },
      { name: "MediaPipe (21pt)", tip: "Extracted 21 hand landmarks per webcam frame for browser-to-text recognition." },
      { name: "LangGraph", tip: "Stateful multi-agent orchestration with transparent completed vs. deferred handoffs." },
      { name: "Label Studio", tip: "Curated clinical dialogue reference datasets aligned to medical communication rubrics." },
    ],
    links: [
      { title: "Bias Checker", subtitle: "RoBERTa + GPT-4o explain", tip: "Separates classification from few-shot explanation so clinicians can audit every flag.", projectId: "bias-checker" },
      { title: "Klyro", subtitle: "Source-grounded RAG copilot", tip: "Embeddable AI website copilot with knowledge retrieval, private test chat & attribution.", projectId: "klyro" },
    ],
  },
  {
    id: "testing",
    align: "right",
    kicker: "05 / TESTING, EVALUATION & SHIPPED",
    titleLead: "Validated before ",
    titleEm: "a line ships.",
    lead: "Every release is backed by moderated usability studies, clinical IRR rubric audits, concurrency testing, and live A/B experiments.",
    craftCat: "research",
    metrics: [
      { value: "n = 6", label: "Usability study (GesturePro)" },
      { value: "3 rubrics", label: "Clinical IRR audit frameworks" },
    ],
    skills: [
      { name: "Usability Testing", tip: "Validated GesturePro’s live text-correction flow with six participants before handoff." },
      { name: "IRR Rubric Audits", tip: "Measured clinical label consistency and edge-case accuracy across ABIM evaluation sets." },
      { name: "A/B Testing", tip: "Live personalization experiments driving +11% retail conversion across 7 UK brands." },
      { name: "Concurrency Testing", tip: "Burst-load synthetic schedule testing in Open-slot matcher so only one patient claims a slot." },
      { name: "Safety Guardrails", tip: "Paired AI label recognition with deterministic ingredient & routine rules in Shelfie." },
      { name: "Docker Release", tip: "Reproducible containerized deployments verified end to end before handoff." },
    ],
    links: [
      { title: "GesturePro", subtitle: "Validated capstone build", tip: "Usability-tested webcam-to-text capstone prototype with full case study.", projectId: "gesturepro" },
      { title: "Shelfie", subtitle: "Rule-checked AI routines", tip: "Skincare organizer pairing label recognition with explicit ingredient rules & reminders.", projectId: "shelfie" },
    ],
    footerCta: { label: "Explore all 6 selected projects ↓", href: "#works" },
  },
];

const roleImpact = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

export function V6Portfolio() {
  const progressRef = useRef(0);
  const filmstripRef = useRef(null);
  const trajWrapRef = useRef(null);
  const trajRailRef = useRef(null);
  const trajBarRef = useRef(null);

  const [theme, setTheme] = useState("dark");
  const [chapterIdx, setChapterIdx] = useState(0);
  const [activeBuildIdx, setActiveBuildIdx] = useState(0);
  const [activeTrajIdx, setActiveTrajIdx] = useState(0);
  const [selectedWorkIdx, setSelectedWorkIdx] = useState(null);
  const [craftCat, setCraftCat] = useState("all");
  const [hoveredToken, setHoveredToken] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("v6-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.v6Theme = theme;
    try {
      localStorage.setItem("v6-theme", theme);
    } catch {}
    return () => {
      delete document.documentElement.dataset.v6Theme;
    };
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Measure exact continuous chapterProgress (0.0 .. 10.0) + sticky scroll-driven horizontal trajectory rail
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = () => window.innerWidth >= 960;
    const sectionIds = [
      "arrival",
      "research",
      "frontend",
      "backend",
      "ai",
      "testing",
      "works",
      "craft",
      "trajectory",
      "offscreen",
      "contact",
    ];
    let currentTraj = 0;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const viewCenter = window.innerHeight * 0.5;
      const centers = sectionIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        // Keep tall sticky runway pinned at its chapter index while traversing horizontally
        if (id === "trajectory" && r.top <= viewCenter && r.bottom >= viewCenter) {
          return viewCenter;
        }
        return r.top + r.height * 0.5;
      });

      let chP = 0;
      if (centers[0] >= viewCenter) {
        chP = 0;
      } else if (centers[centers.length - 1] <= viewCenter) {
        chP = centers.length - 1;
      } else {
        for (let i = 0; i < centers.length - 1; i++) {
          if (centers[i] <= viewCenter && centers[i + 1] >= viewCenter) {
            const span = Math.max(1, centers[i + 1] - centers[i]);
            chP = i + (viewCenter - centers[i]) / span;
            break;
          }
        }
      }

      progressRef.current = chP;

      // Map 11 DOM sections (with offscreen at index 9) to CHAPTERS (0..9)
      const nearest = Math.round(chP);
      const mappedChapter = nearest === 9 ? 8 : nearest >= 10 ? 9 : nearest;
      setChapterIdx((prev) => (prev === mappedChapter ? prev : mappedChapter));

      // Drive horizontal Trajectory timeline directly from vertical scroll (same silky feel as v2)
      if (trajWrapRef.current && trajRailRef.current) {
        if (isDesktop() && !reduced) {
          const rect = trajWrapRef.current.getBoundingClientRect();
          const scrollable = Math.max(1, rect.height - window.innerHeight);
          const targetTraj = Math.min(1, Math.max(0, -rect.top / scrollable));
          currentTraj += (targetTraj - currentTraj) * 0.11;

          const rail = trajRailRef.current;
          const parent = rail.parentElement;
          const padLeft = parent ? parseFloat(getComputedStyle(parent).paddingLeft) || 0 : 0;
          const maxShift = Math.max(0, padLeft * 2 + rail.scrollWidth - window.innerWidth);
          rail.style.transform = `translate3d(${(-currentTraj * maxShift).toFixed(2)}px, 0, 0)`;

          if (trajBarRef.current) {
            trajBarRef.current.style.transform = `scaleX(${Math.max(0.08, currentTraj).toFixed(4)})`;
          }
          const idx = Math.min(
            experience.length - 1,
            Math.round(currentTraj * (experience.length - 1))
          );
          setActiveTrajIdx((prev) => (prev === idx ? prev : idx));
        } else {
          trajRailRef.current.style.transform = "none";
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);



  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  function scrollRail(ref, delta) {
    if (!ref.current) return;
    ref.current.scrollBy({ left: delta, behavior: "smooth" });
  }

  function stepTrajectory(delta) {
    const nextIdx = Math.max(0, Math.min(experience.length - 1, activeTrajIdx + delta));
    if (window.innerWidth >= 960 && trajWrapRef.current) {
      const wrapTop = trajWrapRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(1, trajWrapRef.current.offsetHeight - window.innerHeight);
      const targetY = wrapTop + (nextIdx / (experience.length - 1)) * scrollable;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    } else if (trajRailRef.current?.parentElement) {
      trajRailRef.current.parentElement.scrollBy({ left: delta * 360, behavior: "smooth" });
    }
  }

  function openProjectById(projectId) {
    const idx = shippedWorks.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      setActiveBuildIdx(idx);
      setSelectedWorkIdx(idx);
    }
  }

  function jumpToToolkit(cat) {
    setCraftCat(cat);
    setHoveredToken(null);
    document.getElementById("craft")?.scrollIntoView({ behavior: "smooth" });
  }

  const activeChapter = CHAPTERS[chapterIdx];
  const activeAccent = theme === "light" ? activeChapter.accentLight : activeChapter.accent;
  const currentBuild = shippedWorks[activeBuildIdx];
  const focusedToken =
    hoveredToken ??
    craftTokens.find((t) => craftCat === "all" || t.cat === craftCat) ??
    craftTokens[0];

  return (
    <div
      className="v6CanvasRoot"
      data-v6-theme={theme}
      style={{ "--phase-accent": activeAccent }}
    >
      <V6Header theme={theme} onToggleTheme={toggleTheme} />

      {/* ===================================================================
          THE ONE PERSISTENT SCULPTURAL 3D ARTIFACT (LIVE FROM 0% TO 100%)
          =================================================================== */}
      <div className="v6FixedStage" aria-hidden="true">
        <SculpturalArtifactCanvas progressRef={progressRef} theme={theme} />
        <div className="v6StageAura" />
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
        {/* CHAPTER 01 — ARRIVAL (Left copy, Grain Mass blooms right) */}
        <section id="arrival" className="v6Chapter v6AlignLeft v6ChapterHero">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">
                SHWETA SHARMA · FULLSTACK ENGINEER &amp; APPLIED ML
              </span>
              <h1 className="v6HeroTitle">
                Design-led engineer.
                <br />
                <em>Full-stack to AI.</em>
              </h1>
              <p className="v6Lead">
                I’m Shweta Sharma — six years leading UX research and product
                design across 250+ products, paired with an MS in AI &amp;
                Machine Learning (3.97 GPA). I take ambiguous problems from user
                discovery through production interfaces, resilient APIs, and
                explainable ML.
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
                EXPLORE HOW I BUILD ↓
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTERS 02–06 — UNBOXED EDITORIAL MONOGRAPH CHAPTERS FLOATING BESIDE THE 3D SCULPTURE */}
        {DISCIPLINE_CHAPTERS.map((chapter, chIdx) => {
          const chapterNum = String(chIdx + 1).padStart(2, "0");
          return (
            <section
              key={chapter.id}
              id={chapter.id}
              className={`v6Chapter v6ChapterEditorial ${chapter.align === "right" ? "v6AlignRight" : "v6AlignLeft"}`}
            >
              <div className="v6Wrap">
                <div className="v6EditorialColumn">
                  <span className="v6ChapterGhostNum" aria-hidden="true">
                    {chapterNum}
                  </span>

                  <div className="v6KickerRow">
                    <i className="v6KickerDot" aria-hidden="true" />
                    <span className="v6Kicker">{chapter.kicker}</span>
                    <span className="v6KickerRule" aria-hidden="true" />
                  </div>

                  <h2 className="v6ChapterTitle v6EditorialTitle">
                    {chapter.titleLead}
                    <em>{chapter.titleEm}</em>
                  </h2>
                  <p className="v6Lead">{chapter.lead}</p>

                  <div className="v6EditorialMetrics">
                    {chapter.metrics.map((metric) => (
                      <div className="v6EditorialStat" key={metric.value}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="v6ChapterSubHead">
                    <span>SKILLS · HOVER FOR PROOF</span>
                    <button
                      type="button"
                      className="v6MiniLink"
                      onClick={() => jumpToToolkit(chapter.craftCat)}
                    >
                      Toolkit →
                    </button>
                  </div>

                  <div className="v6SkillStream">
                    {chapter.skills.map((skill, idx) => (
                      <span className="v6SkillStreamItem" key={skill.name}>
                        <span className="v6TipWord" tabIndex={0}>
                          {skill.name}
                          <span className="v6Tooltip" role="tooltip">
                            <b>{skill.name}</b>
                            {skill.tip}
                          </span>
                        </span>
                        {idx < chapter.skills.length - 1 && (
                          <span className="v6SkillSlash" aria-hidden="true">
                            /
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="v6ChapterProofs">
                    <span className="v6ChapterProofLabel">PROVEN IN</span>
                    <div className="v6ProofIndexGrid">
                      {chapter.links.map((item) =>
                        item.projectId ? (
                          <button
                            key={item.title}
                            type="button"
                            className="v6ProofIndexItem"
                            onClick={() => openProjectById(item.projectId)}
                          >
                            <strong>
                              {item.title} <i aria-hidden="true">↗</i>
                            </strong>
                            <span>{item.subtitle}</span>
                            <span className="v6Tooltip v6TooltipCard" role="tooltip">
                              <b>{item.title}</b>
                              {item.tip}
                            </span>
                          </button>
                        ) : (
                          <Link
                            key={item.title}
                            href={item.caseHref}
                            className="v6ProofIndexItem"
                          >
                            <strong>
                              {item.title} <i aria-hidden="true">↗</i>
                            </strong>
                            <span>{item.subtitle}</span>
                            <span className="v6Tooltip v6TooltipCard" role="tooltip">
                              <b>{item.title}</b>
                              {item.tip}
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>

                  {chapter.footerCta && (
                    <div className="v6CtaRow" style={{ marginTop: "24px" }}>
                      <a className="v6BtnPlain" href={chapter.footerCta.href}>
                        {chapter.footerCta.label}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* CHAPTER 07 — SELECTED BUILDS SPOTLIGHT + HORIZONTAL 6-PLATE SELECTOR */}
        <section id="works" className="v6WideBand">
          <div className="v6Wrap">
            <div className="v6BandHead">
              <div>
                <span className="v6Kicker">06 / SELECTED BUILDS</span>
                <h2 className="v6ChapterTitle">
                  Work carried <em>from question to code.</em>
                </h2>
              </div>
              <div className="v6BandHeadRight">
                <p className="v6Lead">
                  Select any plate along the horizontal strip below to inspect
                  the project details, approach, and current status.
                </p>
                <div className="v6RailControls">
                  <button
                    type="button"
                    className="v6RailBtn"
                    onClick={() => scrollRail(filmstripRef, -320)}
                    aria-label="Scroll builds left"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="v6RailBtn"
                    onClick={() => scrollRail(filmstripRef, 320)}
                    aria-label="Scroll builds right"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Frosted Glass Spotlight */}
            <div className="v6SpotlightStack">
              {shippedWorks.map((currentBuild, index) => (
            <div
              className="v6GlassSpotlight"
              key={currentBuild.id}
              aria-hidden={index !== activeBuildIdx}
              inert={index !== activeBuildIdx}
              style={{ visibility: index === activeBuildIdx ? "visible" : "hidden" }}
            >
              <div
                className="v6SpotlightVisual"
                onClick={() => setSelectedWorkIdx(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedWorkIdx(index);
                  }
                }}
              >
                {currentBuild.image ? (
                  <Image
                    src={currentBuild.image}
                    alt={currentBuild.alt}
                    width={1100}
                    height={680}
                    sizes="(max-width: 960px) 92vw, 48vw"
                  />
                ) : (
                  <div className="v6BlueprintSpecimen">
                    <small>{currentBuild.blueprint.kicker}</small>
                    <p>{currentBuild.blueprint.diagram}</p>
                    <span>{currentBuild.blueprint.foot}</span>
                  </div>
                )}
              </div>

              <div className="v6SpotlightCopy">
                <div className="v6SpotlightTopMeta">
                  <span>
                    PLATE {currentBuild.num} · {currentBuild.field.toUpperCase()}
                  </span>
                  <small>{currentBuild.year}</small>
                </div>

                <h3>{currentBuild.title}</h3>
                <p className="v6SpotlightSub">{currentBuild.headline}</p>
                <p className="v6SpotlightSummary">{currentBuild.summary}</p>

                <div className="v6SkillStrip" style={{ margin: "20px 0 24px" }}>
                  {currentBuild.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="v6SpotlightBtns">
                  <button
                    type="button"
                    className="v6BtnPrimary"
                    onClick={() => setSelectedWorkIdx(index)}
                  >
                    Inspect Architecture ↗
                  </button>
                  {currentBuild.liveHref && (<a className="v6BtnPlain" href={currentBuild.liveHref} target="_blank" rel="noreferrer">Visit live site ↗</a>)}
                  {currentBuild.caseHref && (
                    <Link className="v6GlassPillBtn" href={currentBuild.caseHref}>
                      Case Study ↗
                    </Link>
                  )}
                  {currentBuild.repo && (
                    <a
                      className="v6GlassPillBtn"
                      href={currentBuild.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </div>

              ))}
            </div>

            {/* Horizontally Scrollable 6-Plate Selector Strip */}
            <div
              ref={filmstripRef}
              className="v6HStrip"
              role="tablist"
              aria-label="Choose a project"
            >
              {shippedWorks.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={activeBuildIdx === idx}
                  className="v6HPlate"
                  onClick={() => setActiveBuildIdx(idx)}
                >
                  <small>{b.num}</small>
                  <strong>{b.title}</strong>
                  <span>{b.field}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER 07 — CRAFT & TOOLKIT (INTERACTIVE FROSTED-GLASS TYPOGRAPHIC INDEX) */}
        <section id="craft" className="v6WideBand">
          <div className="v6Wrap">
            <div className="v6GlassVessel">
              <div className="v6CraftHead">
                <div>
                  <span className="v6Kicker">07 / CRAFT &amp; TOOLKIT</span>
                  <h2 className="v6ChapterTitle" style={{ marginBottom: 0 }}>
                    The tools behind <em>the work.</em>
                  </h2>
                </div>

                <div className="v6CraftFilters" role="tablist" aria-label="Filter craft">
                  {craftFilters.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="tab"
                      aria-selected={craftCat === f.id}
                      className="v6CraftFilterBtn"
                      onClick={() => {
                        setCraftCat(f.id);
                        setHoveredToken(null);
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="v6CraftWall"
                data-has-hover={hoveredToken !== null}
                onMouseLeave={() => setHoveredToken(null)}
              >
                {craftTokens.map((tok, i) => {
                  const matches = craftCat === "all" || tok.cat === craftCat;
                  const isActive = hoveredToken?.name === tok.name;
                  return (
                    <span className="v6CraftTokenWrap" key={tok.name}>
                      <button
                        type="button"
                        className={`v6CraftToken${tok.italic ? " isItalic" : ""}`}
                        data-match={matches}
                        data-active={isActive}
                        onMouseEnter={() => setHoveredToken(tok)}
                        onFocus={() => setHoveredToken(tok)}
                        onClick={() => setHoveredToken(tok)}
                      >
                        {tok.name}
                      </button>
                      {i < craftTokens.length - 1 && (
                        <span className="v6CraftDot" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>

              <div className="v6CraftReadout" aria-live="polite">
                <strong>{focusedToken.name}</strong>
                <p>{focusedToken.proof}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 08 — THE TRAJECTORY (STICKY SCROLL-DRIVEN HORIZONTAL TIMELINE LIKE V2) */}
        <section id="trajectory" ref={trajWrapRef} className="v6TrajRunway">
          <div className="v6TrajSticky">
            <div className="v6Wrap">
              <div className="v6BandHead" style={{ marginBottom: "28px" }}>
                <div>
                  <span className="v6Kicker">08 / THE TRAJECTORY</span>
                  <h2 className="v6ChapterTitle" style={{ marginBottom: "10px" }}>
                    Different roles. <em>One curiosity.</em>
                  </h2>
                  <p className="v6Lead">
                    From establishing enterprise UX research practices from
                    scratch to building clinical NLP and full-stack AI evaluation
                    tools.
                  </p>
                </div>

                <div className="v6TrajRight">
                  <div className="v6DrexelGlass">
                    <div>
                      <small>DREXEL UNIVERSITY · 2024–2026</small>
                      <strong>MS Computer Science — AI &amp; Machine Learning</strong>
                    </div>
                    <em>3.97 / 4.0 GPA</em>
                  </div>

                  <div className="v6TrajCounter">
                    <span>{String(activeTrajIdx + 1).padStart(2, "0")}</span>
                    <i aria-hidden="true">/</i>
                    <small>{String(experience.length).padStart(2, "0")}</small>
                  </div>

                  <div className="v6RailControls">
                    <button
                      type="button"
                      className="v6RailBtn"
                      onClick={() => stepTrajectory(-1)}
                      aria-label="Previous role"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="v6RailBtn"
                      onClick={() => stepTrajectory(1)}
                      aria-label="Next role"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="v6TrajViewport">
              <div ref={trajRailRef} className="v6HTimeline">
                {experience.map(([dates, company, role, detail], idx) => (
                  <article
                    className="v6HTimelineItem"
                    data-active={activeTrajIdx === idx ? "true" : "false"}
                    key={company}
                  >
                    <div className="v6HTimelineRail" aria-hidden="true">
                      <span className="v6HTimelineNode" />
                      <i className="v6HTimelineLine" />
                    </div>
                    <div className="v6HTimelineCard">
                      <div className="v6HTimelineTop">
                        <small>{dates}</small>
                        <span>{roleImpact[company] || role}</span>
                      </div>
                      <h3>{company}</h3>
                      <strong>{role}</strong>
                      <p>{detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="v6Wrap v6TrajScrub">
              <span>SCROLL TO TRAVERSE TRAJECTORY</span>
              <div className="v6TrajTrack">
                <i ref={trajBarRef} style={{ transform: "scaleX(0.08)" }} />
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
                <span className="v6Kicker">09 / BEYOND THE SCREEN</span>
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

        {/* CHAPTER 09 — COLOPHON (AETHERGLINT TWILIGHT MEADOW FOOTER) */}
        <section id="contact" className="v6Colophon">
          <AetherglintCanvas />
          <div className="v6ColophonVeil" aria-hidden="true" />
          <div className="v6Wrap v6ColophonInner">
            <span className="v6Kicker">10 / READY FOR THE NEXT BUILD</span>
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
              </div>
              <a href="#main">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>

      {/* V1 PROJECT VIEW MODAL */}
      <ProjectViewModal
        projects={shippedWorks}
        selectedIndex={selectedWorkIdx}
        onSelectIndex={setSelectedWorkIdx}
        onClose={() => setSelectedWorkIdx(null)}
      />
    </div>
  );
}
