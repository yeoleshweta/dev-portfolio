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
  { id: "arrival", num: "01", label: "Intro", accent: "#e8b85a", side: "right", state: "01 · LATENT SEED SPHERE", mapping: "One raw idea — scroll to watch it morph through 5 builds" },
  { id: "research", num: "02", label: "UX Research", accent: "#e8a848", side: "left", state: "02 · SIX AFFINITY CLUSTERS", mapping: "Splits into 6 discovery clusters & bridges → UX Research" },
  { id: "frontend", num: "03", label: "Frontend UI", accent: "#6fb6ff", side: "right", state: "03 · MODULAR 3D GRID CUBE", mapping: "Snaps into a crisp 3×3 structural grid → React & Figma UI" },
  { id: "backend", num: "04", label: "Backend APIs", accent: "#3ee09c", side: "left", state: "04 · FLOWING TORUS PIPELINE", mapping: "Unwinds into a continuous data loop → APIs & PostgreSQL" },
  { id: "ai", num: "05", label: "AI & ML", accent: "#a76bff", side: "right", state: "05 · DUAL-HEMISPHERE NEURAL BRAIN", mapping: "Folds into a firing neural network → Applied AI & Eval" },
  { id: "works", num: "06", label: "Tested & Shipped", accent: "#e8b85a", side: "left", state: "06 · BRILLIANT-CUT DIAMOND", mapping: "Compressed, faceted & verified → QA, Usability & Shipped" },
  { id: "trajectory", num: "07", label: "Trajectory", accent: "#d992b4", side: "right", state: "THE FINISHED CUT", mapping: "Six years of craft + MS AI & ML (3.97 GPA)" },
  { id: "contact", num: "08", label: "Next Build", accent: "#e8b85a", side: "center", state: "READY FOR WHAT'S NEXT", mapping: "Let's shape the next product from research to shipped AI" },
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

export function V6Portfolio() {
  const progressRef = useRef(0);
  const sheetRef = useRef(null);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [copied, setCopied] = useState(false);

  // Measure exact continuous chapterProgress (0.0 .. 8.0) directly from live DOM section positions
  // so the 3D sculpture is ALWAYS on the exact opposite half from the visible card — zero overlap!
  useEffect(() => {
    const sectionIds = [
      "arrival",
      "research",
      "frontend",
      "backend",
      "ai",
      "works",
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

      // Compute continuous index 0..(N-1) where integer i means section i is centered in viewport
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

      // Map 9 DOM sections (including offscreen at index 7) to CHAPTERS (0..7)
      const nearest = Math.round(chP);
      const mappedChapter = nearest === 7 ? 6 : nearest >= 8 ? 7 : nearest;
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

  const activeChapter = CHAPTERS[chapterIdx];

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

        {/* CHAPTER 02 — UX RESEARCH (Sculpture dissolves into raw signal cloud + affinity threads) */}
        <section id="research" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard">
              <span className="v6Kicker">01 / UX RESEARCH &amp; DISCOVERY</span>
              <h2 className="v6ChapterTitle">
                First, dissolve into <em>raw human signal.</em>
              </h2>
              <p className="v6Lead">
                Watch the seed split apart into six orbiting affinity clusters
                bridged by amber threads. Every build begins here: contextual
                inquiry, clinical rubrics (Calgary-Cambridge, NURSE), and
                behavioral analytics before a single component is drawn.
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

        {/* CHAPTER 03 — FRONTEND UI (Clusters snap into crisp 3D modular grid cube) */}
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

        {/* CHAPTER 04 — BACKEND & APIS (Cube unwinds into a flowing torus-knot pipeline) */}
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

        {/* CHAPTER 05 — APPLIED AI & ML (Pipeline folds into dual-hemisphere neural brain) */}
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

        {/* CHAPTER 06 — TESTED & SHIPPED (Brain crystallizes into brilliant-cut gold diamond) */}
        <section id="works" className="v6Chapter v6AlignRight">
          <div className="v6Wrap">
            <div className="v6ChapterCard v6CardWide">
              <span className="v6Kicker">05 / TESTING, EVALUATION &amp; SHIPPED</span>
              <h2 className="v6ChapterTitle">
                Cut, tested, <em>crystallized.</em>
              </h2>
              <p className="v6Lead">
                Finally, all 24,000 grains compress into a razor-sharp,
                brilliant-cut champagne-gold diamond — usability tested (n=6),
                rubric-audited (IRR), A/B validated, and shipped. Select any
                build below to inspect its full architecture.
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
