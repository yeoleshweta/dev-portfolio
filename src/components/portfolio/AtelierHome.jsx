"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SpatialHeroCanvas } from "@/components/motion/SpatialHeroCanvas";
import { StoryAperture } from "@/components/portfolio/StoryAperture";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import { gallery } from "@/content/gallery";

const exhibitionPlates = [
  {
    id: "bias-checker",
    num: "01",
    year: "2025–2026",
    title: "Bias Checker",
    discipline: "Healthcare · Applied AI",
    headline: "A prediction needs an explanation.",
    summary:
      "Solo-built healthcare bias-detection system connecting a fine-tuned RoBERTa + LoRA classifier, GPT-4o explanation layer, Flask API, and Next.js interface.",
    stack: ["Next.js", "Flask", "RoBERTa + LoRA", "GPT-4o", "Hugging Face"],
    repo: systems[0].repository,
    nodes: systems[0].nodes,
    decision: systems[0].decision,
    blueprint: {
      code: "PIPELINE / 01 → 04",
      formula: "Vignette → RoBERTa+LoRA → GPT-4o → Review",
      metrics: ["Solo full-stack build", "Docker on HF Spaces"],
    },
  },
  {
    id: "gesturepro",
    num: "02",
    year: "2025",
    title: "GesturePro",
    discipline: "Computer Vision · Interaction",
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
    discipline: "Product Design · Systems",
    headline: "One inventory, three perspectives.",
    summary:
      "Multi-role desktop workspace spanning 30 screens and 484 interactions for administrators, warehouse teams, and franchise shops.",
    stack: ["Figma", "Interaction Design", "Design Systems"],
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
    discipline: "Fullstack · Forecasting",
    headline: "Follow the request end to end.",
    summary:
      "Finance application orchestrating a Next.js frontend, Node.js API proxy, PostgreSQL database, and an isolated Python forecasting service.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python", "Docker"],
    repo: systems[2].repository,
    nodes: systems[2].nodes,
    decision: systems[2].decision,
    blueprint: {
      code: "TOPOLOGY / SERVICE BOUNDARIES",
      formula: "Next.js → POST /api/forecast → Python /predict",
      metrics: ["Docker Compose stack", "PostgreSQL persistence"],
    },
  },
  {
    id: "clinical-communication",
    num: "05",
    year: "2025",
    title: "Clinical Communication",
    discipline: "ABIM · Supervised NLP",
    headline: "Making clinical dialogue legible.",
    summary:
      "Annotated doctor-patient dialogue workflow mapping supervised NLP predictions to established Calgary-Cambridge and NURSE frameworks.",
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
    discipline: "Multi-Agent Systems",
    headline: "Transparent agent handoffs.",
    summary: archive[0].description,
    stack: ["LangGraph", "FastAPI", "React"],
    decision:
      "Surface completed versus deferred agent work explicitly at the interface layer.",
    blueprint: {
      code: "ACTIVE RESEARCH / MULTI-AGENT",
      formula: "State Graph → Handoff → Visible Ledger",
      metrics: ["LangGraph orchestration", "Human-visible state"],
    },
  },
];

const craftDisciplines = [
  {
    num: "01",
    name: "Frontend & Interaction",
    headline: "Interfaces with tactile clarity.",
    description:
      "Responsive web applications engineered for real-time inputs, editable model outputs, and multi-role operational clarity.",
    layers: ["State & Interaction", "Motion Choreography", "Accessible Systems"],
    tools: ["React", "Next.js", "JavaScript", "Three.js", "CSS Motion", "WCAG"],
    proof: "Urbanfit (30 screens, 484 interactions) · GesturePro live editor",
  },
  {
    num: "02",
    name: "APIs, Data & Persistence",
    headline: "Explicit boundaries across the stack.",
    description:
      "End-to-end service design connecting web clients to REST APIs, PostgreSQL schemas, Dockerized services, and isolated inference endpoints.",
    layers: ["Client Contract", "API Proxy & Routing", "PostgreSQL + Workers"],
    tools: ["Python", "FastAPI", "Flask", "Node.js", "PostgreSQL", "Docker"],
    proof: "PocketSaver multi-service stack · Bias Checker Flask + HF Spaces",
  },
  {
    num: "03",
    name: "Applied ML & Evaluation",
    headline: "Models people can question and trust.",
    description:
      "Fine-tuned classifiers, computer vision landmark pipelines, and annotated clinical NLP grounded in human-in-the-loop review.",
    layers: ["Annotated Reference", "Fine-tuned Model", "Explanation Layer"],
    tools: ["TensorFlow", "RoBERTa + LoRA", "MediaPipe", "GPT-4o", "Label Studio"],
    proof: "Bias Checker · Clinical Communication (Calgary-Cambridge & NURSE)",
  },
  {
    num: "04",
    name: "UX Research & Product Design",
    headline: "Validated before a line ships.",
    description:
      "Six years leading UX research, behavioral segmentation, and design systems across global enterprise and retail product teams.",
    layers: ["Qualitative Discovery", "System Architecture", "Experimentation"],
    tools: ["Figma", "Design Systems", "Usability Testing", "A/B Testing"],
    proof: "John Deere (−60% setup across 250+ products) · Capita (+11% conversion)",
  },
];

const roleMetrics = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

export function AtelierHome() {
  const heroRef = useRef(null);
  const worksWrapRef = useRef(null);
  const worksRailRef = useRef(null);
  const [workProgress, setWorkProgress] = useState(0);
  const [activePlate, setActivePlate] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeCraft, setActiveCraft] = useState(0);
  const [activeExp, setActiveExp] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [copied, setCopied] = useState(false);

  const workDialogRef = useRef(null);
  const lightboxRef = useRef(null);

  // Scroll-driven Nocturnal theme shift (Hero + Exhibition) & horizontal exhibition rail
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = () => window.innerWidth >= 960;

    let targetWork = 0;
    let currentWork = 0;
    let raf = 0;

    const tick = () => {
      let nocturnal = false;
      if (heroRef.current) {
        const hRect = heroRef.current.getBoundingClientRect();
        if (hRect.bottom > window.innerHeight * 0.45) nocturnal = true;
      }
      if (worksWrapRef.current) {
        const rect = worksWrapRef.current.getBoundingClientRect();
        if (
          rect.top < window.innerHeight * 0.42 &&
          rect.bottom > window.innerHeight * 0.35
        ) {
          nocturnal = true;
        }

        if (isDesktop() && !reduced) {
          const scrollable = Math.max(1, rect.height - window.innerHeight);
          targetWork = Math.min(1, Math.max(0, -rect.top / scrollable));
        } else {
          targetWork = 0;
        }
      }

      document.documentElement.dataset.theme = nocturnal
        ? "nocturnal"
        : "daylight";

      currentWork += (targetWork - currentWork) * 0.1;

      if (worksRailRef.current && isDesktop() && !reduced) {
        const maxShift = Math.max(
          0,
          worksRailRef.current.scrollWidth - window.innerWidth + 120
        );
        worksRailRef.current.style.transform = `translate3d(${(-currentWork * maxShift).toFixed(2)}px, 0, 0)`;
        setWorkProgress(currentWork);
        setActivePlate(
          Math.min(
            exhibitionPlates.length - 1,
            Math.round(currentWork * (exhibitionPlates.length - 1))
          )
        );
      } else if (worksRailRef.current) {
        worksRailRef.current.style.transform = "none";
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      delete document.documentElement.dataset.theme;
    };
  }, []);

  // Scroll reveal for editorial sections
  useEffect(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
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
    const d = workDialogRef.current;
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

  useEffect(() => {
    const d = lightboxRef.current;
    if (!d) return;
    if (lightboxIdx !== null && !d.open) d.showModal();
    if (lightboxIdx === null && d.open) d.close();
  }, [lightboxIdx]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  const currentCraft = craftDisciplines[activeCraft];

  return (
    <main id="main">
      {/* ACT I — FULL-BLEED 3D SPATIAL EXHIBITION HERO */}
      <section ref={heroRef} className="spatialHero">
        <SpatialHeroCanvas />
        <div className="spatialHeroVignette" aria-hidden="true" />

        <div className="atelierWrap spatialHeroInner">
          <div className="spatialTopStrip">
            <span>ARCHIVE / 2026</span>
            <span>FULLSTACK ENGINEERING × APPLIED ML</span>
            <span>PHILADELPHIA, PA</span>
          </div>

          <div className="spatialCenterpiece">
            <p className="spatialEyebrow">DESIGNER’S EYE · ENGINEER’S ARCHITECTURE</p>
            <h1 className="spatialTitle">
              <span className="spatialLine" style={{ "--i": 0 }}>
                <span>SHWETA</span>
              </span>
              <span className="spatialLine spatialSerif" style={{ "--i": 1 }}>
                <span>
                  <em>Sharma</em>
                </span>
              </span>
            </h1>
            <p className="spatialSub">
              Owning software from human research and interface craft to APIs,
              data pipelines, and interpretable machine learning.
            </p>
          </div>

          <div className="spatialBottomBar">
            <div className="spatialMetaCol">
              <small>EDUCATION</small>
              <span>MS Computer Science (AI &amp; ML) · Drexel · 3.97 GPA</span>
            </div>
            <div className="spatialMetaCol">
              <small>FEATURED IN ORBIT</small>
              <span>Bias Checker · GesturePro · Urbanfit · PocketSaver · ABIM</span>
            </div>
            <a className="spatialScrollLink" href="#story" data-cursor="ENTER">
              <span>SCROLL TO ENTER</span>
              <i aria-hidden="true">↓</i>
            </a>
          </div>
        </div>
      </section>

      {/* ACT II — SPLIT-SHUTTER VISUAL DOSSIER (REPLACES FADE TEXT) */}
      <StoryAperture />

      {/* ACT III — NOCTURNAL HORIZONTAL EXHIBITION */}
      <section id="works" ref={worksWrapRef} className="exhibitionWrap">
        <div className="exhibitionSticky">
          <div className="atelierWrap exhibitionTopBar">
            <div>
              <span className="chapterMarker">02 / SELECTED WORKS</span>
              <h2 className="exhibitionTitle">
                Systems built <em>end to end.</em>
              </h2>
            </div>
            <div className="exhibitionCounter">
              <span>{String(activePlate + 1).padStart(2, "0")}</span>
              <i aria-hidden="true">/</i>
              <small>{String(exhibitionPlates.length).padStart(2, "0")}</small>
            </div>
          </div>

          <div className="exhibitionViewport">
            <div ref={worksRailRef} className="exhibitionRail">
              {exhibitionPlates.map((plate) => (
                <article
                  key={plate.id}
                  className="exhibitionPlate"
                  onClick={() => setSelectedWork(plate)}
                  data-cursor="INSPECT"
                >
                  <div className="plateMeta">
                    <span>{plate.num}</span>
                    <span>{plate.discipline}</span>
                    <span>{plate.year}</span>
                  </div>

                  <div className="plateVisual">
                    {plate.image ? (
                      <Image
                        src={plate.image}
                        alt={plate.alt}
                        width={960}
                        height={600}
                        sizes="(max-width: 960px) 88vw, 44vw"
                      />
                    ) : (
                      <div className="plateBlueprint">
                        <small>{plate.blueprint.code}</small>
                        <div className="blueprintDiagram">
                          <span>{plate.blueprint.formula}</span>
                        </div>
                        <div className="blueprintFoot">
                          {plate.blueprint.metrics.map((m) => (
                            <span key={m}>{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="plateCaption">
                    <div>
                      <h3>{plate.title}</h3>
                      <p>{plate.headline}</p>
                    </div>
                    <button
                      type="button"
                      className="plateOpenBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWork(plate);
                      }}
                    >
                      Inspect ↗
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="atelierWrap exhibitionScrubBar">
            <span>SCROLL TO TRAVERSE EXHIBITION · CLICK ANY PLATE FOR ARCHITECTURE</span>
            <div className="scrubTrack">
              <i style={{ transform: `scaleX(${Math.max(0.06, workProgress)})` }} />
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE-OVER MONOGRAPH SHEET */}
      <dialog
        ref={workDialogRef}
        className="monographSheet"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedWork(null);
        }}
        onCancel={() => setSelectedWork(null)}
      >
        {selectedWork && (
          <div className="sheetInner">
            <div className="sheetHeader">
              <span>
                PLATE {selectedWork.num} / {selectedWork.discipline.toUpperCase()}
              </span>
              <button onClick={() => setSelectedWork(null)}>Close ×</button>
            </div>

            <div className="sheetBody">
              <h2>{selectedWork.title}</h2>
              <p className="sheetHeadline">{selectedWork.headline}</p>
              <p className="sheetSummary">{selectedWork.summary}</p>

              <div className="sheetStack">
                {selectedWork.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <blockquote className="sheetQuote">
                <small>ARCHITECTURAL DECISION</small>
                <p>“{selectedWork.decision}”</p>
              </blockquote>

              {selectedWork.nodes && (
                <div className="sheetNodes">
                  <small className="sheetSublabel">SYSTEM PIPELINE</small>
                  {selectedWork.nodes.map((node) => (
                    <div className="sheetNodeRow" key={node.layer}>
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

              <div className="sheetActions">
                {selectedWork.caseHref && (
                  <Link
                    className="atelierBtnPrimary"
                    href={selectedWork.caseHref}
                    onClick={() => setSelectedWork(null)}
                  >
                    Read Full Case Study ↗
                  </Link>
                )}
                {selectedWork.repo && (
                  <a
                    className="atelierBtnOutline"
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

      {/* ACT IV — CRAFT & DISCIPLINES */}
      <section id="craft" className="craftSection atelierWrap">
        <div className="sectionIntroRow" data-reveal>
          <div>
            <span className="chapterMarker">03 / CRAFT &amp; SKILLSETS</span>
            <h2 className="atelierHeading">
              Four disciplines.
              <br />
              <em>One continuous thread.</em>
            </h2>
          </div>
          <p className="sectionSideCopy">
            Trained in human research, sharpened in product design, and
            engineered end-to-end across modern web stacks and applied machine
            learning.
          </p>
        </div>

        <div className="craftGrid" data-reveal>
          <div className="craftIndex" role="tablist" aria-label="Technical disciplines">
            {craftDisciplines.map((item, idx) => (
              <button
                key={item.num}
                role="tab"
                aria-selected={activeCraft === idx}
                className="craftRowBtn"
                onClick={() => setActiveCraft(idx)}
                onMouseEnter={() => setActiveCraft(idx)}
              >
                <span className="craftNum">{item.num}</span>
                <span className="craftName">{item.name}</span>
                <span className="craftArrow" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>

          <div className="craftSpecimen" role="tabpanel">
            <div className="craftSpecimenInner" key={currentCraft.num}>
              <div className="specimenTop">
                <span>DISCIPLINE {currentCraft.num}</span>
                <span>{currentCraft.name.toUpperCase()}</span>
              </div>
              <h3>{currentCraft.headline}</h3>
              <p className="specimenDesc">{currentCraft.description}</p>

              <div className="specimenLayers">
                {currentCraft.layers.map((layer, i) => (
                  <div key={layer}>
                    <small>0{i + 1}</small>
                    <strong>{layer}</strong>
                  </div>
                ))}
              </div>

              <div className="specimenTools">
                {currentCraft.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>

              <div className="specimenProof">
                <small>SHIPPED EVIDENCE</small>
                <p>{currentCraft.proof}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACT V — CAREER LEDGER */}
      <section id="experience" className="experienceSection atelierWrap">
        <div className="experienceGrid">
          <div className="experienceLeft" data-reveal>
            <span className="chapterMarker">04 / THE TRAJECTORY</span>
            <h2 className="atelierHeading">
              Different roles.
              <br />
              <em>One curiosity.</em>
            </h2>
            <p className="sectionSideCopy" style={{ marginTop: "20px" }}>
              From establishing enterprise UX research practices to building
              clinical NLP and full-stack AI evaluation systems.
            </p>
            <a
              className="atelierLink"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Download full résumé (PDF) ↗
            </a>

            <div className="academicPlate">
              <div className="academicTop">
                <span>DREXEL UNIVERSITY</span>
                <span>2024 — 2026</span>
              </div>
              <h3>
                Master of Science, Computer Science
                <br />
                <em>AI &amp; Machine Learning</em>
              </h3>
              <div className="academicFoot">
                <span>CUMULATIVE GPA</span>
                <strong>3.97 / 4.0</strong>
              </div>
            </div>
          </div>

          <div className="careerLedger" data-reveal>
            {experience.map(([dates, company, role, detail], idx) => {
              const expanded = activeExp === idx;
              return (
                <article
                  key={company}
                  className="ledgerRow"
                  data-open={expanded}
                  onMouseEnter={() => setActiveExp(idx)}
                  onClick={() => setActiveExp(idx)}
                >
                  <div className="ledgerHead">
                    <span className="ledgerDate">{dates}</span>
                    <h3>{company}</h3>
                    <span className="ledgerMetric">
                      {roleMetrics[company] || role}
                    </span>
                  </div>
                  <div className="ledgerSub">
                    <strong>{role}</strong>
                    <p>{detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACT VI — BEYOND THE SCREEN (CONTACT SHEET) */}
      <section id="offscreen" className="offscreenSection atelierWrap">
        <div className="offscreenIntro" data-reveal>
          <figure className="offscreenPortrait">
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

          <div className="offscreenCopy">
            <span className="chapterMarker">05 / BEYOND THE SCREEN</span>
            <h2 className="atelierHeading">
              A little more
              <br />
              <em>human context.</em>
            </h2>
            <p>
              My path runs through qualitative research, product design, and a
              master’s in AI and machine learning. I’m drawn to the space where
              a thoughtful interaction meets a hard technical problem.
            </p>
            <p>
              Away from the screen, that curiosity looks like mountain
              motorcycle trips, scuba dives, and running through Philadelphia.
              There is usually something worth seeing beyond the familiar.
            </p>
            <div className="offscreenList">
              <span>01 / Mountain roads</span>
              <span>02 / Scuba diving</span>
              <span>03 / New perspectives</span>
            </div>
          </div>
        </div>

        <div className="contactSheet" data-reveal>
          <div className="contactSheetHead">
            <span>CONTACT SHEET / 05 FRAMES</span>
            <span>CLICK ANY FRAME TO EXPAND</span>
          </div>
          <div className="contactSheetGrid">
            {gallery.map((item, idx) => (
              <button
                key={item.src}
                className="sheetFrame"
                style={{ "--stagger": idx % 2 === 1 ? "26px" : "0px" }}
                onClick={() => setLightboxIdx(idx)}
                data-cursor="VIEW"
              >
                <div className="sheetFrameImg">
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{ objectPosition: item.position }}
                  />
                </div>
                <div className="sheetFrameMeta">
                  <small>0{idx + 1}</small>
                  <strong>{item.title}</strong>
                  <span>{item.caption}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <dialog
        ref={lightboxRef}
        className="atelierLightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) setLightboxIdx(null);
        }}
        onCancel={() => setLightboxIdx(null)}
      >
        {lightboxIdx !== null && (
          <div className="lightboxContent">
            <img
              src={gallery[lightboxIdx].src}
              alt={gallery[lightboxIdx].alt}
            />
            <div className="lightboxCaption">
              <div>
                <strong>{gallery[lightboxIdx].title}</strong>
                <span>{gallery[lightboxIdx].caption}</span>
              </div>
              <button onClick={() => setLightboxIdx(null)}>Close ×</button>
            </div>
          </div>
        )}
      </dialog>

      {/* ACT VII — COLOPHON & CONTACT */}
      <section id="contact" className="colophonSection">
        <div className="atelierWrap">
          <div className="colophonTop" data-reveal>
            <span className="chapterMarker">06 / THE NEXT CHAPTER</span>
            <h2 className="colophonHeadline">
              Thoughtful people.
              <br />
              <em>Ambitious work.</em>
            </h2>
            <p className="colophonNote">
              Open to fullstack and applied AI engineering roles where craft,
              interaction design, and technical rigor live together.
            </p>
          </div>

          <div className="colophonEmailRow" data-reveal>
            <a
              className="colophonEmail"
              href={`mailto:${profile.email}`}
              data-cursor="EMAIL"
            >
              {profile.email}
            </a>
            <button className="atelierBtnOutline" onClick={copyEmail}>
              {copied ? "Copied to clipboard ✓" : "Copy address"}
            </button>
          </div>

          <footer className="colophonFooter">
            <span>© 2026 SHWETA SHARMA</span>
            <div className="colophonLinks">
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
  );
}
