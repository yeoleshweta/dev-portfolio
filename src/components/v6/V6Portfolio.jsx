"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { V6Header } from "@/components/v6/V6Header";
import { ProductMorphStage } from "@/components/v6/ProductMorphStage";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import "@/styles/gallery.css";

const builds = [
  {
    id: "bias-checker",
    num: "01",
    year: "2025–2026",
    title: "Bias Checker",
    field: "Healthcare · Applied AI",
    headline: "A prediction needs an explanation.",
    summary:
      "Solo-built healthcare bias-detection system connecting a fine-tuned RoBERTa + LoRA classifier, GPT-4o explanation layer, Flask API, and Next.js interface.",
    stack: ["Next.js", "Flask", "RoBERTa + LoRA", "GPT-4o", "Docker"],
    repo: systems[0].repository,
    nodes: systems[0].nodes,
    decision: systems[0].decision,
    blueprint: "Vignette → RoBERTa+LoRA → GPT-4o → Clinician Review",
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
      "Multi-role desktop workspace spanning 30 screens and 484 interactions for administrators, warehouse teams, and franchise shops.",
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
      "Finance application orchestrating Next.js, a Node.js API proxy, PostgreSQL persistence, and an isolated Python forecasting service.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python", "Docker"],
    repo: systems[2].repository,
    nodes: systems[2].nodes,
    decision: systems[2].decision,
    blueprint: "Next.js → Node /api/forecast → PostgreSQL + Python /predict",
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
    blueprint: "LangGraph State → Agent Handoff → Visible Human Ledger",
  },
];

const skillFilters = [
  { id: "all", label: "All" },
  { id: "research", label: "01 Research" },
  { id: "frontend", label: "02 Frontend" },
  { id: "backend", label: "03 Backend" },
  { id: "ai", label: "04 AI & Eval" },
];

const skillList = [
  { name: "Contextual Inquiry", cat: "research", italic: true, proof: "Established John Deere's India UX research practice across 6+ product teams." },
  { name: "Usability Testing", cat: "research", italic: false, proof: "Moderated studies driving +35% engagement at Urbanfit and GesturePro (n=6)." },
  { name: "A/B Testing", cat: "research", italic: false, proof: "Behavioral segmentation on Qubit's ML platform delivering +11% conversion at Capita." },
  { name: "Figma", cat: "frontend", italic: true, proof: "Urbanfit atomic design system (30 screens, 484 interactions) & John Deere survey tool." },
  { name: "React", cat: "frontend", italic: false, proof: "Production frontends across CentralPerk and responsive design-system handoffs." },
  { name: "Next.js", cat: "frontend", italic: true, proof: "App Router interfaces for Bias Checker (ABIM), GesturePro, and PocketSaver." },
  { name: "Design Systems", cat: "frontend", italic: false, proof: "Atomic component libraries built from scratch at Urbanfit and multi-brand kits at Capita." },
  { name: "WCAG 2.1", cat: "frontend", italic: false, proof: "Accessible contrast, keyboard flows, and inclusive interactions." },
  { name: "FastAPI", cat: "backend", italic: true, proof: "Real-time hand-landmark inference API in GesturePro and CentralPerk backend." },
  { name: "Flask", cat: "backend", italic: false, proof: "Served RoBERTa classification and GPT-4o explainability endpoints for Bias Checker." },
  { name: "Node.js", cat: "backend", italic: false, proof: "API proxy and service routing layer in PocketSaver." },
  { name: "PostgreSQL", cat: "backend", italic: true, proof: "Containerized relational database orchestrated via Docker Compose in PocketSaver." },
  { name: "Docker", cat: "backend", italic: false, proof: "Multi-service local orchestration and live Hugging Face Spaces deployments." },
  { name: "Python", cat: "ai", italic: false, proof: "Clinical NLP pipelines, ML training, and backend forecasting services." },
  { name: "RoBERTa + LoRA", cat: "ai", italic: true, proof: "Fine-tuned healthcare bias classifier powering ABIM's Bias Checker." },
  { name: "GPT-4o", cat: "ai", italic: false, proof: "Few-shot explainability layer paired beside fine-tuned labels for clinical auditability." },
  { name: "TensorFlow", cat: "ai", italic: false, proof: "Trained the gesture sign classifier powering GesturePro." },
  { name: "MediaPipe", cat: "ai", italic: true, proof: "21 real-time hand landmarks per frame from a standard webcam." },
  { name: "Label Studio", cat: "ai", italic: false, proof: "Annotated clinical dialogue datasets mapped to Calgary-Cambridge & NURSE rubrics." },
  { name: "LangGraph", cat: "ai", italic: true, proof: "Multi-agent orchestration with transparent human-visible handoffs in CentralPerk." },
  { name: "SQL & Tableau", cat: "research", italic: false, proof: "Synthesized 120+ feedback channels into core KPIs alongside Power BI and Dovetail." },
];

const roleImpact = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

export function V6Portfolio() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [skillCat, setSkillCat] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [copied, setCopied] = useState(false);

  const sheetRef = useRef(null);

  useEffect(() => {
    const els = [...document.querySelectorAll("[data-v6-reveal]")];
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

  const activeSkill =
    hoveredSkill ??
    skillList.find((s) => skillCat === "all" || s.cat === skillCat) ??
    skillList[0];

  return (
    <>
      <V6Header />

      <main id="main" className="v6Main">
        {/* ACT I — 5-PHASE SCROLL-DRIVEN PRODUCT MORPHING STAGE */}
        <ProductMorphStage />

        {/* ACT II — SELECTED WORKS (SYMMETRIC 2-COLUMN EXHIBITION) */}
        <section id="works" className="v6Section v6Wrap v6RuleTop">
          <div className="v6SectionHead" data-v6-reveal>
            <div>
              <span className="v6Kicker">02 / SELECTED WORKS</span>
              <h2 className="v6Heading">
                Six shipped <em>systems.</em>
              </h2>
            </div>
            <p className="v6Muted">
              Click any build to open its full architectural breakdown, stack,
              and key engineering decision.
            </p>
          </div>

          <div className="v6WorksGrid" data-v6-reveal>
            {builds.map((b) => (
              <article
                key={b.id}
                className="v6WorkCard"
                onClick={() => setSelectedWork(b)}
              >
                <div className="v6WorkTop">
                  <span>
                    {b.num} / {b.field.toUpperCase()}
                  </span>
                  <small>{b.year}</small>
                </div>

                <div className="v6WorkMedia">
                  {b.image ? (
                    <Image
                      src={b.image}
                      alt={b.alt}
                      width={960}
                      height={600}
                      sizes="(max-width: 960px) 92vw, 46vw"
                    />
                  ) : (
                    <div className="v6WorkBlueprint">
                      <small>ARCHITECTURE PIPELINE</small>
                      <p>{b.blueprint}</p>
                    </div>
                  )}
                </div>

                <div className="v6WorkFoot">
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.headline}</p>
                  </div>
                  <span className="v6InspectPill">Inspect ↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>

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
                      className="v6BtnSolid"
                      href={selectedWork.caseHref}
                      onClick={() => setSelectedWork(null)}
                    >
                      Read Full Case Study ↗
                    </Link>
                  )}
                  {selectedWork.repo && (
                    <a
                      className="v6BtnLink"
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

        {/* ACT III — LIVING TYPOGRAPHIC SKILLS INDEX */}
        <section id="skills" className="v6Section v6Wrap v6RuleTop">
          <div className="v6SectionHead" data-v6-reveal>
            <div>
              <span className="v6Kicker">03 / WORKING STACK</span>
              <h2 className="v6Heading">
                The living <em>index.</em>
              </h2>
            </div>

            <div className="v6FilterRail" role="tablist" aria-label="Filter skills">
              {skillFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={skillCat === f.id}
                  className="v6FilterBtn"
                  onClick={() => {
                    setSkillCat(f.id);
                    setHoveredSkill(null);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="v6SkillWall"
            data-has-hover={hoveredSkill !== null}
            onMouseLeave={() => setHoveredSkill(null)}
            data-v6-reveal
          >
            {skillList.map((s, idx) => {
              const matches = skillCat === "all" || s.cat === skillCat;
              const active = hoveredSkill?.name === s.name;
              return (
                <span className="v6TokenWrap" key={s.name}>
                  <button
                    type="button"
                    className={`v6Token${s.italic ? " isItalic" : ""}`}
                    data-match={matches}
                    data-active={active}
                    onMouseEnter={() => setHoveredSkill(s)}
                    onFocus={() => setHoveredSkill(s)}
                    onClick={() => setHoveredSkill(s)}
                  >
                    {s.name}
                  </button>
                  {idx < skillList.length - 1 && (
                    <span className="v6Slash" aria-hidden="true">
                      /
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          <div className="v6SkillReadout" aria-live="polite" data-v6-reveal>
            <strong>{activeSkill.name}</strong>
            <p>{activeSkill.proof}</p>
          </div>
        </section>

        {/* ACT IV — TRAJECTORY */}
        <section id="trajectory" className="v6Section v6Wrap v6RuleTop">
          <div className="v6ExpGrid">
            <div className="v6ExpSticky" data-v6-reveal>
              <span className="v6Kicker">04 / THE TRAJECTORY</span>
              <h2 className="v6Heading">
                Different roles.
                <br />
                <em>One curiosity.</em>
              </h2>
              <p className="v6Muted" style={{ marginTop: "18px" }}>
                From building enterprise UX research practices from zero to
                deploying clinical NLP and full-stack AI evaluation systems.
              </p>

              <div className="v6DrexelCard">
                <div className="v6DrexelTop">
                  <span>DREXEL UNIVERSITY</span>
                  <span>2024 — 2026</span>
                </div>
                <h3>
                  MS Computer Science
                  <br />
                  <em>AI &amp; Machine Learning</em>
                </h3>
                <div className="v6DrexelFoot">
                  <span>CUMULATIVE GPA</span>
                  <strong>3.97 / 4.0</strong>
                </div>
              </div>
            </div>

            <div className="v6Ledger" data-v6-reveal>
              {experience.map(([dates, company, role, detail]) => (
                <article className="v6LedgerRow" key={company}>
                  <div className="v6LedgerTop">
                    <span className="v6LedgerDate">{dates}</span>
                    <h3>{company}</h3>
                    <span className="v6LedgerImpact">
                      {roleImpact[company] || role}
                    </span>
                  </div>
                  <div className="v6LedgerBody">
                    <strong>{role}</strong>
                    <p>{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACT V — BEYOND THE SCREEN + DARKROOM SCATTERED PHOTO DESK */}
        <section id="offscreen" className="v6Section v6Wrap v6RuleTop" style={{ paddingBottom: "32px" }}>
          <div className="v6OffscreenGrid" data-v6-reveal>
            <figure className="v6Portrait">
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

            <div className="v6OffscreenCopy">
              <span className="v6Kicker">05 / BEYOND THE SCREEN</span>
              <h2 className="v6Heading">
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
              <div className="v6OffscreenTags">
                <span>01 / Mountain roads</span>
                <span>02 / Scuba diving</span>
                <span>03 / New perspectives</span>
              </div>
            </div>
          </div>
        </section>

        <div className="v6Darkroom">
          <PersonalGallery />
        </div>

        {/* ACT VI — COLOPHON */}
        <section id="contact" className="v6Colophon v6RuleTop">
          <div className="v6Wrap">
            <div data-v6-reveal>
              <span className="v6Kicker">06 / THE NEXT CHAPTER</span>
              <h2 className="v6ColophonTitle">
                Thoughtful people.
                <br />
                <em>Ambitious work.</em>
              </h2>
              <p className="v6Muted" style={{ marginTop: "20px" }}>
                Open to fullstack and applied AI engineering roles where craft,
                interaction design, and technical rigor live together.
              </p>
            </div>

            <div className="v6ContactBar" data-v6-reveal>
              <a className="v6EmailBig" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                type="button"
                className="v6BtnSolid"
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
    </>
  );
}
