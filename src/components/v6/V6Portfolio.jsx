"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { V6Header } from "@/components/v6/V6Header";
import { SculpturalArtifactCanvas } from "@/components/v6/SculpturalArtifactCanvas";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import "@/styles/gallery.css";

const CHAPTERS = [
  { id: "arrival", num: "01", label: "Intro", accent: "#e8b85a", side: "right", state: "01 · RAW GRAIN MASS", mapping: "Unshaped mineral cloud — scroll to sculpt it through 5 builds" },
  { id: "research", num: "02", label: "UX Research", accent: "#e8a848", side: "left", state: "02 · SIX AFFINITY CLUSTERS", mapping: "Splits into 6 discovery clusters & bridges → UX Research" },
  { id: "frontend", num: "03", label: "Frontend UI", accent: "#6fb6ff", side: "right", state: "03 · MODULAR 3D GRID CUBE", mapping: "Snaps into a crisp 3×3 structural grid → React & Figma UI" },
  { id: "backend", num: "04", label: "Backend APIs", accent: "#3ee09c", side: "left", state: "04 · FLOWING TORUS PIPELINE", mapping: "Unwinds into a continuous data loop → APIs & PostgreSQL" },
  { id: "ai", num: "05", label: "AI & ML", accent: "#a76bff", side: "right", state: "05 · DUAL-HEMISPHERE NEURAL BRAIN", mapping: "Folds into a firing neural network → Applied AI & Eval" },
  { id: "testing", num: "06", label: "Tested & Shipped", accent: "#e8b85a", side: "left", state: "06 · BRILLIANT-CUT DIAMOND", mapping: "Compressed, faceted & verified → QA, Usability & Shipped" },
  { id: "works", num: "07", label: "Selected Builds", accent: "#e8b85a", side: "center", state: "SHIPPED BUILDS", mapping: "Inspect every shipped system & architecture" },
  { id: "craft", num: "08", label: "Craft & Toolkit", accent: "#e8b85a", side: "center", state: "CRAFT & TOOLKIT", mapping: "Every framework & method behind the shipped work" },
  { id: "trajectory", num: "09", label: "Trajectory", accent: "#d992b4", side: "center", state: "THE FINISHED CUT", mapping: "Six years of craft + MS AI & ML (3.97 GPA)" },
  { id: "contact", num: "10", label: "Next Build", accent: "#e8b85a", side: "center", state: "READY FOR WHAT'S NEXT", mapping: "Let's shape the next product from research to shipped AI" },
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
    id: "urbanfit",
    num: "03",
    year: "2022",
    title: "Urbanfit Control Panel",
    field: "Product Design · Systems",
    headline: "One inventory, three perspectives.",
    summary:
      "Multi-role desktop workspace spanning 30 screens and 484 connected interactions for administrators, warehouse teams, and franchise shops.",
    stack: ["Figma", "Design Systems", "Interaction Design"],
    image: projects[1].image,
    alt: projects[1].alt,
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
    blueprint: {
      kicker: "TOPOLOGY SPECIMEN · MULTI-SERVICE",
      diagram: "Next.js Client → Node /api/forecast → PostgreSQL + Python /predict",
      foot: "Docker Compose stack · Explicit service boundaries",
    },
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
    image: projects[2].image,
    alt: projects[2].alt,
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
    blueprint: {
      kicker: "ACTIVE RESEARCH · MULTI-AGENT",
      diagram: "LangGraph Orchestrator → Agent Handoff → Visible Human Ledger",
      foot: "In active development · Deliberate non-capture UX",
    },
  },
];

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

const roleImpact = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

export function V6Portfolio() {
  const progressRef = useRef(0);
  const sheetRef = useRef(null);
  const filmstripRef = useRef(null);
  const timelineRef = useRef(null);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [activeBuildIdx, setActiveBuildIdx] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [craftCat, setCraftCat] = useState("all");
  const [hoveredToken, setHoveredToken] = useState(null);
  const [copied, setCopied] = useState(false);

  // Measure exact continuous chapterProgress (0.0 .. 10.0) directly from live DOM section centers
  useEffect(() => {
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
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const viewCenter = window.innerHeight * 0.5;
      const centers = sectionIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
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
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

  function scrollRail(ref, delta) {
    if (!ref.current) return;
    ref.current.scrollBy({ left: delta, behavior: "smooth" });
  }

  const activeChapter = CHAPTERS[chapterIdx];
  const currentBuild = shippedWorks[activeBuildIdx];
  const focusedToken =
    hoveredToken ??
    craftTokens.find((t) => craftCat === "all" || t.cat === craftCat) ??
    craftTokens[0];

  return (
    <div
      className="v6CanvasRoot"
      style={{ "--phase-accent": activeChapter.accent }}
    >
      <V6Header />

      {/* ===================================================================
          THE ONE PERSISTENT SCULPTURAL 3D ARTIFACT (LIVE FROM 0% TO 100%)
          =================================================================== */}
      <div className="v6FixedStage" aria-hidden="true">
        <SculpturalArtifactCanvas progressRef={progressRef} />
        <div className="v6StageAura" />

        {/* Live Lifecycle Caption anchored directly beneath the 3D Sculpture */}
        <div className="v6ArtifactCaption" data-side={activeChapter.side}>
          <div className="v6ArtifactCaptionInner" key={activeChapter.id}>
            <span className="v6ArtifactState">
              <i /> {activeChapter.state}
            </span>
            <p>{activeChapter.mapping}</p>
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
        {/* CHAPTER 01 — ARRIVAL (Left copy, Grain Mass blooms right) */}
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

        {/* CHAPTER 02 — UX RESEARCH */}
        <section id="research" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">01 / UX RESEARCH &amp; DISCOVERY</span>
              <h2 className="v6ChapterTitle">
                First, dissolve into <em>raw human signal.</em>
              </h2>
              <p className="v6Lead">
                Watch the swirling grain mass pull together into six orbiting
                affinity clusters bridged by amber threads. Every build begins
                here: contextual inquiry, clinical rubrics (Calgary-Cambridge,
                NURSE), and behavioral analytics before a single component is
                drawn.
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

        {/* CHAPTER 03 — FRONTEND UI */}
        <section id="frontend" className="v6Chapter v6AlignLeft">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">02 / FRONTEND UI &amp; DESIGN SYSTEMS</span>
              <h2 className="v6ChapterTitle">
                Clusters snap into <em>a modular grid.</em>
              </h2>
              <p className="v6Lead">
                On the right, those six loose clouds lock into a razor-sharp
                ice-cobalt 3D grid cube. I turn ambiguous research into atomic
                Figma design systems and responsive React &amp; Next.js
                interfaces where people stay effortlessly in command.
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

        {/* CHAPTER 04 — BACKEND & APIS */}
        <section id="backend" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">03 / BACKEND, APIS &amp; PERSISTENCE</span>
              <h2 className="v6ChapterTitle">
                The grid unwinds into <em>a live pipeline.</em>
              </h2>
              <p className="v6Lead">
                The rigid cube twists into a continuous emerald torus-knot data
                loop — representing explicit API contracts, Node.js proxies,
                Flask &amp; FastAPI endpoints, PostgreSQL schemas, and
                containerized Docker Compose stacks.
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

        {/* CHAPTER 05 — APPLIED AI & ML */}
        <section id="ai" className="v6Chapter v6AlignLeft">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">04 / APPLIED AI &amp; EXPLAINABILITY</span>
              <h2 className="v6ChapterTitle">
                The flow folds into <em>a neural brain.</em>
              </h2>
              <p className="v6Lead">
                On the right, the stream sculpts itself into a firing
                dual-hemisphere violet neural cortex. Pairing an MS in AI &amp;
                Machine Learning (3.97 GPA) with clinical NLP at ABIM, I attach
                human-auditable reasoning to every prediction.
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

        {/* CHAPTER 06 — TESTING, EVALUATION & SHIPPED (DEDICATED FULL-GROWN DIAMOND REVEAL) */}
        <section id="testing" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">05 / TESTING, EVALUATION &amp; SHIPPED</span>
              <h2 className="v6ChapterTitle">
                Cut, tested, <em>crystallized.</em>
              </h2>
              <p className="v6Lead">
                On the left, all 38,000 grains compress into a razor-sharp,
                brilliant-cut champagne-gold diamond. Nothing ships unverified:
                I validate every interface with moderated usability studies,
                clinical inter-rater reliability (IRR) rubrics, and live A/B
                experimentation.
              </p>
              <div className="v6SkillStrip">
                <span>Usability Testing (n=6)</span>
                <span>IRR Rubric Audits</span>
                <span>A/B Experimentation</span>
                <span>Calgary-Cambridge</span>
                <span>NURSE · SHARE</span>
                <span>Dockerized Release</span>
              </div>
              <div className="v6ProofBox">
                <strong>Audited in clinic · Proven in production</strong>
                <span>
                  Validated GesturePro with six participants, audited clinical
                  NLP at ABIM, and shipped across 250+ John Deere products.
                </span>
              </div>
              <div className="v6CtaRow" style={{ marginTop: "22px" }}>
                <a className="v6BtnPlain" href="#works">
                  Inspect the shipped builds ↓
                </a>
              </div>
            </div>
          </div>
        </section>

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
                  the live system, or open its full architecture pipeline.
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
            <div className="v6GlassSpotlight" key={currentBuild.id}>
              <div
                className="v6SpotlightVisual"
                onClick={() => setSelectedWork(currentBuild)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedWork(currentBuild);
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
                    onClick={() => setSelectedWork(currentBuild)}
                  >
                    Inspect Architecture ↗
                  </button>
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

            {/* Horizontally Scrollable 6-Plate Selector Strip */}
            <div
              ref={filmstripRef}
              className="v6HStrip"
              role="tablist"
              aria-label="Choose a shipped build"
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
                  <span className="v6Kicker">06 / CRAFT &amp; TOOLKIT</span>
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

        {/* CHAPTER 08 — THE TRAJECTORY (HORIZONTALLY SCROLLABLE DETAILED GLASS TIMELINE) */}
        <section id="trajectory" className="v6WideBand">
          <div className="v6Wrap">
            <div className="v6BandHead">
              <div>
                <span className="v6Kicker">07 / THE TRAJECTORY</span>
                <h2 className="v6ChapterTitle">
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

                <div className="v6RailControls">
                  <button
                    type="button"
                    className="v6RailBtn"
                    onClick={() => scrollRail(timelineRef, -440)}
                    aria-label="Scroll experience left"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="v6RailBtn"
                    onClick={() => scrollRail(timelineRef, 440)}
                    aria-label="Scroll experience right"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div ref={timelineRef} className="v6HTimeline">
              {experience.map(([dates, company, role, detail]) => (
                <article className="v6HTimelineItem" key={company}>
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
                <span className="v6Kicker">08 / BEYOND THE SCREEN</span>
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

        {/* CHAPTER 09 — COLOPHON */}
        <section id="contact" className="v6Colophon">
          <div className="v6Wrap v6ColophonInner">
            <span className="v6Kicker">09 / READY FOR THE NEXT BUILD</span>
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
