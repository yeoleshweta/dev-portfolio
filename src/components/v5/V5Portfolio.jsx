"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AetherglintCanvas } from "@/components/v4/AetherglintCanvas";
import { V5Header } from "@/components/v5/V5Header";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import "@/styles/gallery.css";

const fieldNotes = [
  {
    num: "I",
    tag: "Human Observation",
    title: "Listen before architecting.",
    body: "Six years leading mixed-methods UX research across global enterprise and retail teams taught me to uncover what people actually struggle with before writing production code.",
    stat: "−60%",
    note: "Survey setup time across 250+ John Deere products",
  },
  {
    num: "II",
    tag: "Calm Systems",
    title: "One clear grammar for complexity.",
    body: "Whether designing a 30-screen multi-role operations workspace or a real-time webcam sign editor, I shape interfaces that leave the person firmly in control.",
    stat: "484",
    note: "Connected prototype interactions in Urbanfit Control Panel",
  },
  {
    num: "III",
    tag: "Inspectable AI",
    title: "Models people can question.",
    body: "Pairing an MS in AI & Machine Learning with clinical NLP work at ABIM, I connect fine-tuned classifiers to human-legible explanation layers and resilient APIs.",
    stat: "3.97",
    note: "MS Computer Science (AI & ML) GPA · Drexel University",
  },
];

const herbariumBuilds = [
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
      "Browser prototype reading 21 MediaPipe hand landmarks per frame into editable text, keeping human correction central and validated across six usability participants.",
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
      "Finance platform orchestrating a Next.js frontend, Node.js API proxy, PostgreSQL database, and an isolated Python forecasting service in Docker Compose.",
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
      "Annotated doctor-patient dialogue workflow mapping supervised NLP predictions to established Calgary-Cambridge and NURSE communication frameworks.",
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

const pathHighlights = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

export function V5Portfolio() {
  const [activeBuildIdx, setActiveBuildIdx] = useState(0);
  const [modalBuild, setModalBuild] = useState(null);
  const [craftCat, setCraftCat] = useState("all");
  const [hoveredToken, setHoveredToken] = useState(null);
  const [copied, setCopied] = useState(false);

  const sheetRef = useRef(null);

  useEffect(() => {
    const els = [...document.querySelectorAll("[data-v5-reveal]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      els.forEach((el) => (el.dataset.visible = "true"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.dataset.visible = "true";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (modalBuild && !d.open) {
      document.body.style.overflow = "hidden";
      d.showModal();
    } else if (!modalBuild && d.open) {
      document.body.style.overflow = "";
      d.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalBuild]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  const currentBuild = herbariumBuilds[activeBuildIdx];
  const focusedToken =
    hoveredToken ??
    craftTokens.find((t) => craftCat === "all" || t.cat === craftCat) ??
    craftTokens[0];

  return (
    <>
      <V5Header />

      <main id="main" className="v5Main">
        {/* ACT I — AETHERGLINT VIOLET DUSK MEADOW HERO */}
        <section id="hero" className="v5Hero">
          <AetherglintCanvas />
          <div className="v5HeroVeil" aria-hidden="true" />

          <div className="v5Wrap v5HeroInner">
            <div className="v5HeroCopy">
              <p className="v5HeroKicker">
                <i aria-hidden="true" />
                PHILADELPHIA, PA · FULLSTACK ENGINEERING &amp; APPLIED ML
              </p>

              <h1 className="v5HeroTitle">
                Designing interfaces <em>that breathe,</em>
                <br />
                engineering models <em>you can question.</em>
              </h1>

              <p className="v5HeroLead">
                I’m Shweta Sharma — six years leading UX research and product
                design across 250+ products, paired with an MS in AI &amp;
                Machine Learning (3.97 GPA). Move across the dusk hillside to
                part the meadow.
              </p>

              <div className="v5HeroActions">
                <HiringBrief triggerClassName="v5BtnPetal" biasHref="#works" />
                <a
                  className="v5BtnMist"
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  Résumé (PDF) ↗
                </a>
                <a
                  className="v5BtnMist"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
            </div>

            <div className="v5HorizonStrip">
              <div>
                <small>RECENT</small>
                <strong>American Board of Internal Medicine</strong>
                <span>Clinical NLP &amp; solo-built Bias Checker AI</span>
              </div>
              <div>
                <small>SHIPPED IMPACT</small>
                <strong>John Deere · Urbanfit · Capita</strong>
                <span>−60% setup · +35% engagement · +11% conversion</span>
              </div>
              <div>
                <small>EDUCATION</small>
                <strong>Drexel University (2024–2026)</strong>
                <span>MS Computer Science, AI &amp; ML · 3.97 / 4.0 GPA</span>
              </div>
            </div>
          </div>
        </section>

        {/* ACT II — FIELD NOTES (ATMOSPHERIC DUSK GLASS MONOGRAPH CARDS) */}
        <section id="notes" className="v5Section v5Wrap">
          <div className="v5SectionIntro" data-v5-reveal>
            <span className="v5Eyebrow">01 / FIELD NOTES</span>
            <h2 className="v5SerifHeading">
              Research, interface craft, and machine learning —{" "}
              <em>grown as one system.</em>
            </h2>
          </div>

          <div className="v5NotesGrid" data-v5-reveal>
            {fieldNotes.map((item) => (
              <article className="v5NoteCard" key={item.num}>
                <div className="v5NoteTop">
                  <span>{item.num}</span>
                  <small>{item.tag.toUpperCase()}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <div className="v5NoteFoot">
                  <strong>{item.stat}</strong>
                  <span>{item.note}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ACT III — FEATURED BUILD SPOTLIGHT + 6-PLATE FILMSTRIP */}
        <section id="works" className="v5Section v5Wrap v5MistDivider">
          <div className="v5SectionSplitHead" data-v5-reveal>
            <div>
              <span className="v5Eyebrow">02 / SELECTED BUILDS</span>
              <h2 className="v5SerifHeading">
                Work carried <em>from question to code.</em>
              </h2>
            </div>
            <p className="v5MutedCopy">
              Select any plate along the strip below to inspect the system, or
              open its full architecture pipeline.
            </p>
          </div>

          <div className="v5Spotlight" data-v5-reveal>
            <div className="v5SpotlightCard" key={currentBuild.id}>
              <div
                className="v5SpotlightMedia"
                onClick={() => setModalBuild(currentBuild)}
              >
                {currentBuild.image ? (
                  <Image
                    src={currentBuild.image}
                    alt={currentBuild.alt}
                    width={1100}
                    height={680}
                    sizes="(max-width: 960px) 92vw, 56vw"
                  />
                ) : (
                  <div className="v5DuskBlueprint">
                    <small>{currentBuild.blueprint.kicker}</small>
                    <p>{currentBuild.blueprint.diagram}</p>
                    <span>{currentBuild.blueprint.foot}</span>
                  </div>
                )}
              </div>

              <div className="v5SpotlightBody">
                <div className="v5SpotlightMeta">
                  <span>
                    PLATE {currentBuild.num} · {currentBuild.field.toUpperCase()}
                  </span>
                  <small>{currentBuild.year}</small>
                </div>

                <h3>{currentBuild.title}</h3>
                <p className="v5SpotlightQuote">{currentBuild.headline}</p>
                <p className="v5SpotlightDesc">{currentBuild.summary}</p>

                <div className="v5PillStack">
                  {currentBuild.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="v5SpotlightActions">
                  <button
                    type="button"
                    className="v5BtnPetal"
                    onClick={() => setModalBuild(currentBuild)}
                  >
                    Inspect Architecture ↗
                  </button>
                  {currentBuild.caseHref && (
                    <Link className="v5BtnMist" href={currentBuild.caseHref}>
                      Case Study ↗
                    </Link>
                  )}
                  {currentBuild.repo && (
                    <a
                      className="v5BtnMist"
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

            <div className="v5Filmstrip" role="tablist" aria-label="Choose a build">
              {herbariumBuilds.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={activeBuildIdx === idx}
                  className="v5FilmTab"
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

        {/* ARCHITECTURE SHEET DIALOG */}
        <dialog
          ref={sheetRef}
          className="v5Sheet"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalBuild(null);
          }}
          onCancel={() => setModalBuild(null)}
        >
          {modalBuild && (
            <div className="v5SheetInner">
              <div className="v5SheetTop">
                <span>
                  PLATE {modalBuild.num} · {modalBuild.field.toUpperCase()}
                </span>
                <button type="button" onClick={() => setModalBuild(null)}>
                  Close ×
                </button>
              </div>
              <div className="v5SheetBody">
                <h2>{modalBuild.title}</h2>
                <p className="v5SheetDeck">{modalBuild.headline}</p>
                <p className="v5SheetSummary">{modalBuild.summary}</p>
                <div className="v5PillStack" style={{ margin: "22px 0" }}>
                  {modalBuild.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <blockquote className="v5SheetQuote">
                  <small>ARCHITECTURAL DECISION</small>
                  <p>“{modalBuild.decision}”</p>
                </blockquote>
                {modalBuild.nodes && (
                  <div className="v5SheetNodes">
                    <small className="v5SheetSub">SYSTEM PIPELINE</small>
                    {modalBuild.nodes.map((node) => (
                      <div className="v5NodeRow" key={node.layer}>
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
                <div className="v5SpotlightActions" style={{ marginTop: "30px" }}>
                  {modalBuild.caseHref && (
                    <Link
                      className="v5BtnPetal"
                      href={modalBuild.caseHref}
                      onClick={() => setModalBuild(null)}
                    >
                      Read Full Case Study ↗
                    </Link>
                  )}
                  {modalBuild.repo && (
                    <a
                      className="v5BtnMist"
                      href={modalBuild.repo}
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

        {/* ACT IV — LIVING CRAFT CONSTELLATION */}
        <section id="craft" className="v5Section v5Wrap v5MistDivider">
          <div className="v5SectionSplitHead" data-v5-reveal>
            <div>
              <span className="v5Eyebrow">03 / CRAFT &amp; TOOLKIT</span>
              <h2 className="v5SerifHeading">
                The tools behind <em>the work.</em>
              </h2>
            </div>

            <div className="v5CraftPills" role="tablist" aria-label="Filter craft">
              {craftFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={craftCat === f.id}
                  className="v5CraftPill"
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
            className="v5CraftWall"
            data-has-hover={hoveredToken !== null}
            onMouseLeave={() => setHoveredToken(null)}
            data-v5-reveal
          >
            {craftTokens.map((tok, i) => {
              const matches = craftCat === "all" || tok.cat === craftCat;
              const isActive = hoveredToken?.name === tok.name;
              return (
                <span className="v5TokenWrap" key={tok.name}>
                  <button
                    type="button"
                    className={`v5Token${tok.italic ? " isItalic" : ""}`}
                    data-match={matches}
                    data-active={isActive}
                    onMouseEnter={() => setHoveredToken(tok)}
                    onFocus={() => setHoveredToken(tok)}
                    onClick={() => setHoveredToken(tok)}
                  >
                    {tok.name}
                  </button>
                  {i < craftTokens.length - 1 && (
                    <span className="v5TokenDot" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          <div className="v5CraftReadout" aria-live="polite" data-v5-reveal>
            <strong>{focusedToken.name}</strong>
            <p>{focusedToken.proof}</p>
          </div>
        </section>

        {/* ACT V — THE WINDING PATH (ORGANIC VERTICAL JOURNEY) */}
        <section id="path" className="v5Section v5Wrap v5MistDivider">
          <div className="v5PathLayout">
            <div className="v5PathSticky" data-v5-reveal>
              <span className="v5Eyebrow">04 / THE WINDING PATH</span>
              <h2 className="v5SerifHeading">
                Different roles.
                <br />
                <em>One curiosity.</em>
              </h2>
              <p className="v5MutedCopy" style={{ marginTop: "18px" }}>
                From establishing enterprise UX research practices from scratch
                to building clinical NLP and full-stack AI evaluation tools.
              </p>

              <div className="v5DrexelGlass">
                <div className="v5DrexelTop">
                  <span>DREXEL UNIVERSITY</span>
                  <span>2024 — 2026</span>
                </div>
                <h3>
                  MS Computer Science
                  <br />
                  <em>AI &amp; Machine Learning</em>
                </h3>
                <div className="v5DrexelFoot">
                  <span>CUMULATIVE GPA</span>
                  <strong>3.97 / 4.0</strong>
                </div>
              </div>
            </div>

            <div className="v5PathList" data-v5-reveal>
              {experience.map(([dates, company, role, detail]) => (
                <article className="v5PathNode" key={company}>
                  <span className="v5PathDot" aria-hidden="true" />
                  <div className="v5PathHead">
                    <small>{dates}</small>
                    <span className="v5PathPill">
                      {pathHighlights[company] || role}
                    </span>
                  </div>
                  <h3>{company}</h3>
                  <strong>{role}</strong>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACT VI — BEYOND THE SCREEN + TWILIGHT SCATTERED PHOTO DESK */}
        <section id="offscreen" className="v5Section v5Wrap v5MistDivider" style={{ paddingBottom: "28px" }}>
          <div className="v5Offscreen" data-v5-reveal>
            <figure className="v5PortraitCard">
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

            <div className="v5OffscreenCopy">
              <span className="v5Eyebrow">05 / BEYOND THE SCREEN</span>
              <h2 className="v5SerifHeading">
                A little more <em>human context.</em>
              </h2>
              <p>
                My path runs through qualitative research, product design, and a
                master’s in AI and machine learning. I’m drawn to the space
                where a thoughtful interaction meets a hard technical problem.
              </p>
              <p>
                Away from the screen, that curiosity looks like mountain
                motorcycle trips, scuba dives, and running through Philadelphia.
                There is usually something worth seeing beyond the familiar.
              </p>
              <div className="v5OffscreenPills">
                <span>Mountain roads</span>
                <span>Scuba diving</span>
                <span>Philadelphia runs</span>
              </div>
            </div>
          </div>
        </section>

        <div className="v5TwilightGallery">
          <PersonalGallery />
        </div>

        {/* ACT VII — HORIZON COLOPHON */}
        <section id="contact" className="v5Colophon v5MistDivider">
          <div className="v5HorizonGlow" aria-hidden="true" />
          <div className="v5Wrap v5ColophonInner">
            <div data-v5-reveal>
              <span className="v5Eyebrow">06 / THE NEXT CHAPTER</span>
              <h2 className="v5ColophonTitle">
                Thoughtful people.
                <br />
                <em>Ambitious work.</em>
              </h2>
              <p className="v5MutedCopy" style={{ marginTop: "20px" }}>
                Open to fullstack and applied AI engineering roles where craft,
                interaction design, and technical rigor live together.
              </p>
            </div>

            <div className="v5ContactBar" data-v5-reveal>
              <a className="v5EmailSerif" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                type="button"
                className="v5BtnPetal"
                onClick={copyEmail}
              >
                {copied ? "Copied to clipboard ✓" : "Copy address"}
              </button>
            </div>

            <footer className="v5Footer">
              <span>© 2026 SHWETA SHARMA</span>
              <div className="v5FooterLinks">
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
              </div>
              <a href="#main">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
