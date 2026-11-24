"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AccretionCanvas } from "@/components/v4/AccretionCanvas";
import { AsciiRadarCanvas } from "@/components/v4/AsciiRadarCanvas";
import { V4Header } from "@/components/v4/V4Header";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import "@/styles/gallery.css";

const abacusMetrics = [
  {
    id: "deere",
    value: "−60%",
    label: "Survey setup time",
    org: "John Deere",
    pos: 78,
    detail:
      "Self-serve research survey platform designed for 250+ internal products, removing developer dependency and raising completion rates by 25%.",
  },
  {
    id: "urbanfit",
    value: "+35%",
    label: "Platform engagement",
    org: "Urbanfit Wellness",
    pos: 66,
    detail:
      "Research-led redesign and atomic Figma design system (30 screens, 484 connected interactions) cutting bounce rate by 28%.",
  },
  {
    id: "capita",
    value: "+11%",
    label: "Retail conversion lift",
    org: "Capita · Arcadia Group",
    pos: 52,
    detail:
      "Behavioral segmentation, funnel analysis, and A/B testing on Qubit's ML platform across 7 flagship UK retail brands.",
  },
  {
    id: "drexel",
    value: "3.97",
    label: "MS Computer Science GPA",
    org: "Drexel University",
    pos: 92,
    detail:
      "Graduate specialization in AI & Machine Learning (2024–2026), pairing formal modeling rigor with six years of shipped product craft.",
  },
];

const bentoWorks = [
  {
    id: "bias-checker",
    num: "01",
    span: "wide",
    year: "2025–2026",
    title: "Bias Checker",
    discipline: "Healthcare · Applied AI",
    headline: "A prediction needs an explanation.",
    summary:
      "Solo-built healthcare bias-detection tool pairing a fine-tuned RoBERTa + LoRA classifier with a GPT-4o explainability layer, Flask API, and Next.js frontend.",
    stack: ["Next.js", "Flask", "RoBERTa + LoRA", "GPT-4o", "Docker"],
    repo: systems[0].repository,
    nodes: systems[0].nodes,
    decision: systems[0].decision,
    blueprint: {
      tag: "SOLO FULL-STACK AI BUILD",
      flow: "Clinical Vignette → RoBERTa+LoRA → GPT-4o → Clinician Review",
    },
  },
  {
    id: "gesturepro",
    num: "02",
    span: "tall",
    year: "2025",
    title: "GesturePro",
    discipline: "Computer Vision · Interaction",
    headline: "Keep the signer in control.",
    summary:
      "Real-time webcam sign recognition extracting 21 MediaPipe hand landmarks per frame into editable text, validated with six usability participants.",
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
    span: "normal",
    year: "2022",
    title: "Urbanfit Control Panel",
    discipline: "Product Design · Systems",
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
    span: "normal",
    year: "2025",
    title: "PocketSaver",
    discipline: "Fullstack · Forecasting",
    headline: "Follow the request end to end.",
    summary:
      "Finance platform orchestrating Next.js, a Node.js API proxy, PostgreSQL persistence, and an isolated Python forecasting service.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python", "Docker"],
    repo: systems[2].repository,
    nodes: systems[2].nodes,
    decision: systems[2].decision,
    blueprint: {
      tag: "MULTI-SERVICE TOPOLOGY",
      flow: "Next.js → Node /api/forecast → PostgreSQL + Python /predict",
    },
  },
  {
    id: "clinical-communication",
    num: "05",
    span: "normal",
    year: "2025",
    title: "Clinical Communication",
    discipline: "ABIM · Supervised NLP",
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
    span: "wide",
    year: "In Progress",
    title: "CentralPerk",
    discipline: "Multi-Agent Systems",
    headline: "Transparent agent handoffs.",
    summary: archive[0].description,
    stack: ["LangGraph", "FastAPI", "React", "Tailwind CSS"],
    decision:
      "Surface completed versus deferred agent work explicitly at the interface layer.",
    blueprint: {
      tag: "ACTIVE MULTI-AGENT RESEARCH",
      flow: "LangGraph State → Agent Handoff → Visible Human Ledger",
    },
  },
];

const radarQuadrants = [
  {
    idx: 0,
    code: "Q1 / HUMAN DISCOVERY",
    title: "UX Research & Analytics",
    summary:
      "Six years translating contextual inquiry, usability studies, and behavioral funnels into measurable product KPIs.",
    tools: [
      "Usability Testing",
      "Contextual Inquiry",
      "A/B Testing",
      "Hotjar & FullStory",
      "Google Analytics",
      "Amplitude",
      "Dovetail",
      "SQL · Tableau · Power BI",
    ],
    proof: "John Deere (−60% setup, 250+ products) · Capita (+11% conversion)",
  },
  {
    idx: 1,
    code: "Q2 / INTERFACE CRAFT",
    title: "Frontend & Design Systems",
    summary:
      "Component architectures and responsive web applications where complex workflows feel calm, legible, and human-controlled.",
    tools: [
      "React",
      "Next.js",
      "JavaScript",
      "Tailwind CSS",
      "Figma & Atomic Design",
      "Storybook",
      "Information Architecture",
      "WCAG 2.1 Accessibility",
    ],
    proof: "Urbanfit (30 screens, 484 interactions) · GesturePro live editor",
  },
  {
    idx: 2,
    code: "Q3 / BACKEND & INFRA",
    title: "APIs, Data & Deployment",
    summary:
      "Explicit service contracts connecting browser interfaces to REST APIs, relational persistence, and isolated ML inference containers.",
    tools: [
      "Python",
      "FastAPI",
      "Flask",
      "Node.js",
      "PostgreSQL",
      "Docker & Compose",
      "Hugging Face Spaces",
      "Git & CI/CD",
    ],
    proof: "PocketSaver multi-service stack · Bias Checker Flask + Docker",
  },
  {
    idx: 3,
    code: "Q4 / MODEL RIGOR",
    title: "Applied AI & LLM Evaluation",
    summary:
      "Fine-tuned classifiers, computer vision landmark pipelines, and rubric-grounded clinical NLP built for human auditability.",
    tools: [
      "RoBERTa + LoRA",
      "BERT & Supervised NLP",
      "GPT-4o Explainability",
      "TensorFlow",
      "MediaPipe (21 Landmarks)",
      "LangGraph Agents",
      "Label Studio & IRR",
      "AI Bias Detection",
    ],
    proof: "ABIM Bias Checker · Clinical Communication (Calgary-Cambridge & NURSE)",
  },
];

const roleBadges = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

function TiltBentoCard({ item, onSelect }) {
  const cardRef = useRef(null);

  function handleMove(e) {
    const el = cardRef.current;
    if (!el || window.innerWidth < 960) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 7;
    const ry = (x - 0.5) * 7;
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }

  function handleLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <article
      ref={cardRef}
      className={`v4BentoCard span-${item.span}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onSelect(item)}
    >
      <div className="v4CardGlint" aria-hidden="true" />
      <div className="v4CardTop">
        <span>
          {item.num} / {item.discipline.toUpperCase()}
        </span>
        <small>{item.year}</small>
      </div>

      <div className="v4CardMedia">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.alt}
            width={960}
            height={600}
            sizes="(max-width: 960px) 92vw, 45vw"
          />
        ) : (
          <div className="v4CardBlueprint">
            <small>{item.blueprint.tag}</small>
            <p>{item.blueprint.flow}</p>
          </div>
        )}
      </div>

      <div className="v4CardFoot">
        <div>
          <h3>{item.title}</h3>
          <p>{item.headline}</p>
        </div>
        <span className="v4CardPill" aria-hidden="true">
          Inspect ↗
        </span>
      </div>
    </article>
  );
}

export function V4Portfolio() {
  const [activeMetric, setActiveMetric] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeQuad, setActiveQuad] = useState(0);
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    const els = [...document.querySelectorAll("[data-v4-unfold]")];
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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
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

  const currentQuad = radarQuadrants[activeQuad];

  return (
    <>
      <V4Header />

      <main id="main" className="v4Main">
        {/* ACT I — ACCRETION DISC HERO + 3D TEXT UNFOLD */}
        <section id="hero" className="v4Hero">
          <AccretionCanvas />
          <div className="v4HeroMask" aria-hidden="true" />

          <div className="v4Wrap v4HeroContent">
            <div className="v4HeroCenter">
              <p className="v4HeroKicker">
                <i aria-hidden="true" />
                PHILADELPHIA, PA · FULLSTACK ENGINEERING &amp; APPLIED ML
              </p>

              <h1 className="v4HeroTitle">
                <span className="v4UnfoldLine" style={{ "--d": "0ms" }}>
                  <span>Where human nuance</span>
                </span>
                <span className="v4UnfoldLine" style={{ "--d": "110ms" }}>
                  <span>
                    meets <em>production code.</em>
                  </span>
                </span>
              </h1>

              <p className="v4HeroSub">
                I’m Shweta Sharma — six years leading UX research and product
                design across 250+ products, paired with an MS in AI &amp;
                Machine Learning (3.97 GPA). I design the interface, build the
                API, and evaluate the model end to end.
              </p>

              <div className="v4HeroCtas">
                <HiringBrief triggerClassName="v4ArrowBtn" biasHref="#works" />
                <a
                  className="v4LinkPlain"
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  Résumé (PDF) ↗
                </a>
                <a
                  className="v4LinkPlain"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
            </div>

            <div className="v4TelemetryBar">
              <span>RECENT · AMERICAN BOARD OF INTERNAL MEDICINE</span>
              <span>SOLO-BUILT BIAS CHECKER AI</span>
              <span>MS AI &amp; ML · DREXEL 3.97 GPA</span>
            </div>
          </div>
        </section>

        {/* ACT II — ABACUS DRIFT KINETIC IMPACT RAILS */}
        <section id="impact" className="v4Section v4Wrap">
          <div className="v4SectionIntro" data-v4-unfold>
            <span className="v4Kicker">01 / MEASURED SIGNAL</span>
            <h2 className="v4Display">
              Outcomes, <em>calibrated.</em>
            </h2>
          </div>

          <div className="v4AbacusList" data-v4-unfold>
            {abacusMetrics.map((m, i) => {
              const active = activeMetric === i;
              return (
                <button
                  key={m.id}
                  type="button"
                  className="v4AbacusRow"
                  data-active={active}
                  onMouseEnter={() => setActiveMetric(i)}
                  onFocus={() => setActiveMetric(i)}
                  onClick={() => setActiveMetric(i)}
                >
                  <div className="v4AbacusHead">
                    <span className="v4AbacusVal">{m.value}</span>
                    <div className="v4AbacusMeta">
                      <strong>{m.label}</strong>
                      <small>{m.org}</small>
                    </div>
                  </div>
                  <div className="v4AbacusTrack" aria-hidden="true">
                    <span
                      className="v4AbacusFill"
                      style={{ width: `${active ? m.pos : Math.max(18, m.pos - 26)}%` }}
                    />
                    <i
                      className="v4AbacusBead"
                      style={{ left: `${active ? m.pos : Math.max(18, m.pos - 26)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="v4AbacusDetail" aria-live="polite" data-v4-unfold>
            <span>{abacusMetrics[activeMetric].org.toUpperCase()}</span>
            <p>{abacusMetrics[activeMetric].detail}</p>
          </div>
        </section>

        {/* ACT III — 3D STAGGER FLIP BENTO SHOWCASE */}
        <section id="works" className="v4Section v4Wrap v4RuleTop">
          <div className="v4SectionRow" data-v4-unfold>
            <div>
              <span className="v4Kicker">02 / SELECTED BUILDS</span>
              <h2 className="v4Display">
                Interfaces &amp; <em>systems.</em>
              </h2>
            </div>
            <p className="v4CopyMuted">
              Hover to inspect depth; click any plate to open its full
              architecture pipeline, stack, and design decision.
            </p>
          </div>

          <div className="v4BentoGrid" data-v4-unfold>
            {bentoWorks.map((item) => (
              <TiltBentoCard
                key={item.id}
                item={item}
                onSelect={setSelectedWork}
              />
            ))}
          </div>
        </section>

        {/* ARCHITECTURE SHEET MODAL */}
        <dialog
          ref={dialogRef}
          className="v4Sheet"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedWork(null);
          }}
          onCancel={() => setSelectedWork(null)}
        >
          {selectedWork && (
            <div className="v4SheetInner">
              <div className="v4SheetTop">
                <span>
                  PLATE {selectedWork.num} / {selectedWork.discipline.toUpperCase()}
                </span>
                <button type="button" onClick={() => setSelectedWork(null)}>
                  Close ×
                </button>
              </div>
              <div className="v4SheetBody">
                <h2>{selectedWork.title}</h2>
                <p className="v4SheetHeadline">{selectedWork.headline}</p>
                <p className="v4SheetSummary">{selectedWork.summary}</p>
                <div className="v4TagStrip">
                  {selectedWork.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <blockquote className="v4SheetQuote">
                  <small>ARCHITECTURAL DECISION</small>
                  <p>“{selectedWork.decision}”</p>
                </blockquote>
                {selectedWork.nodes && (
                  <div className="v4SheetNodes">
                    <small className="v4SheetLabel">SYSTEM PIPELINE</small>
                    {selectedWork.nodes.map((node) => (
                      <div className="v4NodeRow" key={node.layer}>
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
                <div className="v4SheetActions">
                  {selectedWork.caseHref && (
                    <Link
                      className="v4ArrowBtn"
                      href={selectedWork.caseHref}
                      onClick={() => setSelectedWork(null)}
                    >
                      Read Full Case Study ↗
                    </Link>
                  )}
                  {selectedWork.repo && (
                    <a
                      className="v4LinkPlain"
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

        {/* ACT IV — ASCII SIGNAL RADAR & CAPABILITY LAB */}
        <section id="radar" className="v4Section v4Wrap v4RuleTop">
          <div className="v4SectionRow" data-v4-unfold>
            <div>
              <span className="v4Kicker">03 / CAPABILITY RADAR</span>
              <h2 className="v4Display">
                Four quadrants, <em>one operator.</em>
              </h2>
            </div>
            <p className="v4CopyMuted">
              Select a quadrant to lock the ASCII signal sweep onto the exact
              tools, frameworks, and shipped evidence in that discipline.
            </p>
          </div>

          <div className="v4RadarLab" data-v4-unfold>
            <AsciiRadarCanvas activeQuad={activeQuad} />

            <div className="v4RadarPanel">
              <div className="v4QuadTabs" role="tablist" aria-label="Skill quadrants">
                {radarQuadrants.map((q) => (
                  <button
                    key={q.code}
                    type="button"
                    role="tab"
                    aria-selected={activeQuad === q.idx}
                    className="v4QuadBtn"
                    onMouseEnter={() => setActiveQuad(q.idx)}
                    onClick={() => setActiveQuad(q.idx)}
                  >
                    <small>0{q.idx + 1}</small>
                    <span>{q.title}</span>
                  </button>
                ))}
              </div>

              <div className="v4QuadReadout" key={currentQuad.code}>
                <span className="v4QuadCode">{currentQuad.code}</span>
                <h3>{currentQuad.title}</h3>
                <p>{currentQuad.summary}</p>

                <div className="v4QuadTools">
                  {currentQuad.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>

                <div className="v4QuadProof">
                  <small>SHIPPED EVIDENCE</small>
                  <strong>{currentQuad.proof}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACT V — TRAJECTORY */}
        <section id="trajectory" className="v4Section v4Wrap v4RuleTop">
          <div className="v4ExpLayout">
            <div className="v4ExpSticky" data-v4-unfold>
              <span className="v4Kicker">04 / THE TRAJECTORY</span>
              <h2 className="v4Display">
                Different roles.
                <br />
                <em>One curiosity.</em>
              </h2>
              <p className="v4CopyMuted" style={{ marginTop: "18px" }}>
                From building enterprise UX research practices from zero to
                deploying clinical NLP and full-stack AI evaluation systems.
              </p>

              <div className="v4DegreeCard">
                <div className="v4DegreeTop">
                  <span>DREXEL UNIVERSITY</span>
                  <span>2024 — 2026</span>
                </div>
                <h3>
                  MS Computer Science
                  <br />
                  <em>AI &amp; Machine Learning</em>
                </h3>
                <div className="v4DegreeFoot">
                  <span>CUMULATIVE GPA</span>
                  <strong>3.97 / 4.0</strong>
                </div>
              </div>
            </div>

            <div className="v4Timeline" data-v4-unfold>
              {experience.map(([dates, company, role, detail]) => (
                <article key={company} className="v4TimelineItem">
                  <div className="v4TimelineTop">
                    <span className="v4TimelineDates">{dates}</span>
                    <h3>{company}</h3>
                    <span className="v4TimelineBadge">
                      {roleBadges[company] || role}
                    </span>
                  </div>
                  <div className="v4TimelineBody">
                    <strong>{role}</strong>
                    <p>{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACT VI — BEYOND THE SCREEN + DARKROOM SCATTERED PHOTO DESK */}
        <section id="offscreen" className="v4Section v4Wrap v4RuleTop" style={{ paddingBottom: "36px" }}>
          <div className="v4OffscreenGrid" data-v4-unfold>
            <figure className="v4PhotoSlab">
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

            <div className="v4OffscreenText">
              <span className="v4Kicker">05 / BEYOND THE SCREEN</span>
              <h2 className="v4Display">
                A little more
                <br />
                <em>human context.</em>
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
              <div className="v4OffscreenTags">
                <span>01 / Mountain roads</span>
                <span>02 / Scuba diving</span>
                <span>03 / New perspectives</span>
              </div>
            </div>
          </div>
        </section>

        <div className="v4Darkroom">
          <PersonalGallery />
        </div>

        {/* ACT VII — KINETIC COLOPHON */}
        <section id="contact" className="v4Colophon v4RuleTop">
          <div className="v4ColophonGlow" aria-hidden="true" />
          <div className="v4Wrap v4ColophonInner">
            <div data-v4-unfold>
              <span className="v4Kicker">06 / THE NEXT CHAPTER</span>
              <h2 className="v4ColophonTitle">
                Let’s build something
                <br />
                <em>people actually trust.</em>
              </h2>
              <p className="v4CopyMuted" style={{ marginTop: "22px" }}>
                Open to fullstack and applied AI engineering roles where craft,
                interaction design, and technical rigor live together.
              </p>
            </div>

            <div className="v4ContactRow" data-v4-unfold>
              <a className="v4EmailBig" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                type="button"
                className="v4ArrowBtn"
                onClick={copyEmail}
              >
                {copied ? "Copied to clipboard ✓" : "Copy address ↗"}
              </button>
            </div>

            <footer className="v4Footer">
              <span>© 2026 SHWETA SHARMA</span>
              <div className="v4FooterLinks">
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
              </div>
              <a href="#main">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
