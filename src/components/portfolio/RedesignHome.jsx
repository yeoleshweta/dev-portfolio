"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AmbientCanvas } from "@/components/motion/AmbientCanvas";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { profile, projects, experience } from "@/content/profile";
import { systems, archive } from "@/content/engineering";
import { gallery } from "@/content/gallery";

const featuredWorks = [
  {
    id: "bias-checker",
    num: "01",
    title: "Bias Checker",
    category: "Healthcare · Applied AI",
    summary:
      "Solo-built healthcare bias-detection system connecting a fine-tuned RoBERTa + LoRA classifier, GPT-4o explanation layer, Flask API, and Next.js interface.",
    stack: ["Next.js", "Flask", "RoBERTa + LoRA", "GPT-4o", "Docker"],
    repo: systems[0].repository,
    nodes: systems[0].nodes,
    decision: systems[0].decision,
  },
  {
    id: "gesturepro",
    num: "02",
    title: "GesturePro",
    category: "Computer Vision · Interaction",
    summary:
      "Browser prototype translating 21 MediaPipe hand landmarks per frame into editable text—keeping the signer in full control of predictions.",
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
    title: "Urbanfit Control Panel",
    category: "Product Design · Systems",
    summary:
      "Multi-role inventory workspace spanning 30 screens and 484 interactions for administrators, warehouse teams, and franchise shops.",
    stack: ["Figma", "Interaction Design", "Design Systems"],
    image: projects[1].image,
    alt: projects[1].alt,
    caseHref: `/work/${projects[1].slug}/`,
    decision:
      "Give three distinct operational roles one shared navigation grammar and consistent table actions.",
  },
  {
    id: "pocketsaver",
    num: "04",
    title: "PocketSaver",
    category: "Fullstack · Forecasting",
    summary:
      "Finance application orchestrating a Next.js client, Node.js API proxy, PostgreSQL database, and an isolated Python forecasting service.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python", "Docker"],
    repo: systems[2].repository,
    nodes: systems[2].nodes,
    decision: systems[2].decision,
  },
  {
    id: "clinical-communication",
    num: "05",
    title: "Clinical Communication",
    category: "ABIM · Supervised NLP",
    summary:
      "Annotated clinical dialogue workflow mapping model predictions to established Calgary-Cambridge and NURSE communication frameworks.",
    stack: ["Python", "NLP", "Label Studio"],
    image: projects[2].image,
    alt: projects[2].alt,
    caseHref: `/work/${projects[2].slug}/`,
    decision:
      "Anchor every model classification to named clinical frameworks so reviewers can audit predictions.",
  },
  {
    id: "centralperk",
    num: "06",
    title: "CentralPerk",
    category: "Multi-Agent Systems · Active",
    summary: archive[0].description,
    stack: ["LangGraph", "FastAPI", "React"],
    decision:
      "Make agent handoffs, completed work, and deferred tasks transparent at the interface layer.",
  },
];

const disciplines = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend & Interaction",
    headline: "Interfaces that feel inevitable.",
    summary:
      "I build responsive, accessible web applications where real-time inputs, editable predictions, and multi-role workflows feel effortless.",
    layers: ["State & Input", "Motion Choreography", "Design Tokens"],
    tools: ["React", "Next.js", "JavaScript", "Three.js", "CSS Motion", "Accessibility"],
    proofTitle: "Urbanfit Control Panel & GesturePro",
    proofMeta: "30 screens · 484 interactions · editable live predictions",
    href: "/work/urbanfit/",
  },
  {
    id: "backend",
    index: "02",
    label: "APIs, Data & Systems",
    headline: "Clean boundaries from client to database.",
    summary:
      "I architect full-stack services with explicit contracts—connecting frontend apps to REST APIs, PostgreSQL persistence, and isolated ML workers.",
    layers: ["Next.js Client", "API Gateway / Proxy", "Postgres + Python Worker"],
    tools: ["Python", "FastAPI", "Flask", "Node.js", "PostgreSQL", "Docker"],
    proofTitle: "PocketSaver & Bias Checker",
    proofMeta: "Node proxy → Python /predict · Flask + Docker on HF Spaces",
    href: "#work",
  },
  {
    id: "ml",
    index: "03",
    label: "Applied ML & Evaluation",
    headline: "Models people can question and trust.",
    summary:
      "From landmark extraction and fine-tuned classifiers to supervised clinical NLP, I pair model outputs with human-in-the-loop review.",
    layers: ["Annotated Reference", "Fine-tuned Classifier", "Explanation Layer"],
    tools: ["TensorFlow", "RoBERTa + LoRA", "MediaPipe", "GPT-4o", "Label Studio", "NLP"],
    proofTitle: "Bias Checker & Clinical Communication",
    proofMeta: "21 hand landmarks · Calgary-Cambridge & NURSE frameworks",
    href: "/work/clinical-communication/",
  },
  {
    id: "research",
    index: "04",
    label: "Product Design & Research",
    headline: "Rooted in how people actually work.",
    summary:
      "Years of leading UX research and personalization across enterprise and retail teams taught me to validate assumptions before shipping code.",
    layers: ["Behavioral Discovery", "System Architecture", "Measured Validation"],
    tools: ["Figma", "Design Systems", "Usability Testing", "A/B Testing", "Survey Ops"],
    proofTitle: "John Deere & Capita (Arcadia Group)",
    proofMeta: "−60% survey setup time · +35% engagement · +11% conversion",
    href: "#experience",
  },
];

const impactBadges = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 brands",
};

export function RedesignHome() {
  const [expandedWork, setExpandedWork] = useState(0);
  const [activeSkill, setActiveSkill] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [copied, setCopied] = useState(false);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      els.forEach((el) => (el.dataset.visible = "true"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = lightboxRef.current;
    if (!dialog) return;
    if (lightboxIdx !== null && !dialog.open) dialog.showModal();
    if (lightboxIdx === null && dialog.open) dialog.close();
  }, [lightboxIdx]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const currentSkill = disciplines[activeSkill];

  return (
    <main id="main">
      {/* 01 / HERO */}
      <section className="heroSection">
        <AmbientCanvas />
        <div className="wrap heroInner">
          <div className="heroTopMeta">
            <span className="statusPill">
              <i aria-hidden="true" /> Open to Fullstack &amp; Applied AI Roles
            </span>
            <span>PHILADELPHIA, PA · 39.9526° N, 75.1652° W</span>
          </div>

          <div className="heroHeadlineWrap">
            <p className="heroKicker">SHWETA SHARMA / DESIGN × ENGINEERING × ML</p>
            <h1 className="heroTitle">
              <span className="heroLine" style={{ "--i": 0 }}>
                <span>Interfaces that</span>
              </span>
              <span className="heroLine" style={{ "--i": 1 }}>
                <span>
                  <em>think.</em> Systems
                </span>
              </span>
              <span className="heroLine" style={{ "--i": 2 }}>
                <span>that hold.</span>
              </span>
            </h1>
          </div>

          <div className="heroBottomGrid">
            <p className="heroSummary">
              I’m a <strong>fullstack developer</strong> with a background in UX
              research and a master’s in <strong>AI &amp; machine learning</strong>.
              I own products from interaction design to APIs and model evaluation.
            </p>

            <div className="heroCreds">
              <div>
                <small>EDUCATION</small>
                <span>MS CS (AI &amp; ML) · Drexel ’26</span>
              </div>
              <div>
                <small>ACADEMIC</small>
                <span>3.97 / 4.0 GPA</span>
              </div>
            </div>

            <div className="heroActionsRow">
              <a className="btnPrimary" href="#work" data-cursor="EXPLORE">
                Selected Work ↓
              </a>
              <a
                className="btnGhost"
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Résumé ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <VelocityMarquee />

      {/* 02 / SELECTED WORKS */}
      <section id="work" className="worksSection wrap">
        <div className="worksHeader" data-reveal>
          <div>
            <p className="sectionEyebrow">01 / Selected Works &amp; Systems</p>
            <h2 className="sectionTitle">
              Built end-to-end,
              <br />
              <em>from pixel to pipeline.</em>
            </h2>
          </div>
          <p>
            Select any project below to inspect its system architecture, key
            engineering decisions, and case study details.
          </p>
        </div>

        <div className="worksList">
          {featuredWorks.map((item, idx) => {
            const isOpen = expandedWork === idx;
            return (
              <article className="workRow" key={item.id} data-reveal>
                <div className="workRowMain">
                  <span className="workNum">{item.num}</span>
                  <div className="workIdentity">
                    <h3>{item.title}</h3>
                    <span>{item.category}</span>
                  </div>
                  <div className="workPitch">
                    <p>{item.summary}</p>
                    <div className="workTags">
                      {item.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="workRowActions">
                    <button
                      className="workActionBtn"
                      aria-expanded={isOpen}
                      onClick={() => setExpandedWork(isOpen ? -1 : idx)}
                    >
                      {isOpen ? "Hide specs −" : "Inspect +"}
                    </button>
                    {item.caseHref && (
                      <Link className="workActionBtn" href={item.caseHref} data-cursor="OPEN">
                        Case study ↗
                      </Link>
                    )}
                    {!item.caseHref && item.repo && (
                      <a
                        className="workActionBtn"
                        href={item.repo}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="CODE"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="workDetailPanel">
                    <div className="workMediaBox">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.alt}
                          width={900}
                          height={540}
                          sizes="(max-width: 1024px) 90vw, 40vw"
                        />
                      ) : (
                        <div className="workBlueprintBox">
                          <small>ARCHITECTURAL PRINCIPLE</small>
                          <h4>“{item.decision}”</h4>
                          {item.repo && (
                            <a
                              className="btnGhost"
                              style={{ alignSelf: "flex-start" }}
                              href={item.repo}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Repository ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="workNodesGrid">
                      {item.nodes ? (
                        item.nodes.map((node) => (
                          <div className="workNodeCard" key={node.layer}>
                            <small>
                              {node.layer} · {node.technology}
                            </small>
                            <strong>{node.title}</strong>
                            <p>{node.detail}</p>
                          </div>
                        ))
                      ) : (
                        <div className="workNodeCard" style={{ gridColumn: "1 / -1" }}>
                          <small>KEY DESIGN DECISION</small>
                          <strong>{item.title}</strong>
                          <p>{item.decision}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 03 / ALABASTER CONTRAST BAND: SKILLSETS & EXPERIENCE */}
      <section className="alabasterBand">
        <div className="wrap">
          <div id="skills" data-reveal>
            <p className="sectionEyebrow">02 / Capabilities &amp; Skillsets</p>
            <h2 className="sectionTitle">
              Four disciplines.
              <br />
              <em>One continuous thread.</em>
            </h2>
          </div>

          <div className="skillsGrid" data-reveal>
            <div className="skillTabs" role="tablist" aria-label="Skillset disciplines">
              {disciplines.map((d, idx) => (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={activeSkill === idx}
                  className="skillTab"
                  onClick={() => setActiveSkill(idx)}
                  onMouseEnter={() => setActiveSkill(idx)}
                >
                  <span>{d.index}</span>
                  <strong>{d.label}</strong>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>

            <div className="skillPanel" role="tabpanel">
              <div className="skillPanelInner" key={currentSkill.id}>
                <span className="sectionEyebrow">
                  DISCIPLINE / {currentSkill.index}
                </span>
                <h3>{currentSkill.headline}</h3>
                <p>{currentSkill.summary}</p>

                <div className="skillLayers">
                  {currentSkill.layers.map((layer, i) => (
                    <div className="skillLayer" key={layer}>
                      <span>0{i + 1}</span>
                      <strong>{layer}</strong>
                    </div>
                  ))}
                </div>

                <div className="skillPills">
                  {currentSkill.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>

                <div className="skillProofBar">
                  <div>
                    <small>SHIPPED PROOF</small>
                    <strong>{currentSkill.proofTitle}</strong>
                    <span>{currentSkill.proofMeta}</span>
                  </div>
                  {currentSkill.href.startsWith("/") ? (
                    <Link className="btnPrimary" href={currentSkill.href}>
                      Inspect ↗
                    </Link>
                  ) : (
                    <a className="btnPrimary" href={currentSkill.href}>
                      Inspect ↑
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* WORK EXPERIENCE */}
          <div id="experience" className="experienceSplit">
            <div className="experienceSticky" data-reveal>
              <p className="sectionEyebrow">03 / Work Experience</p>
              <h2 className="sectionTitle">
                Different roles.
                <br />
                <em>One curiosity.</em>
              </h2>
              <p>
                From enterprise UX research across 250+ products to solo-built
                clinical AI pipelines—every role sharpened how I build software
                for real people.
              </p>
              <a
                className="btnPrimary"
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Download Résumé (PDF) ↗
              </a>

              <div className="eduCard">
                <small>DREXEL UNIVERSITY · 2024–2026</small>
                <h3>
                  Master of Science in Computer Science.{" "}
                  <em>AI &amp; Machine Learning.</em>
                </h3>
                <div className="eduCardFoot">
                  <span>CUMULATIVE GPA</span>
                  <strong>3.97 / 4.0</strong>
                </div>
              </div>
            </div>

            <div className="expTimeline">
              {experience.map(([dates, company, role, detail]) => (
                <article className="expItem" key={company} data-reveal>
                  <div className="expMeta">
                    <small>{dates}</small>
                    {impactBadges[company] && (
                      <span className="expImpact">{impactBadges[company]}</span>
                    )}
                  </div>
                  <h3>{company}</h3>
                  <strong>{role}</strong>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 / OFF SCREEN & GALLERY */}
      <section id="about" className="personalBand wrap">
        <div className="personalGrid">
          <figure className="portraitFrame" data-reveal>
            <Image
              src="/mountains.jpg"
              alt="Shweta at Grace Hopper Celebration 2025"
              width={900}
              height={700}
              sizes="(max-width: 1024px) 92vw, 45vw"
            />
            <figcaption className="portraitCaption">
              <small>FIELD NOTE / GRACE HOPPER CELEBRATION · 2025</small>
              <strong>In good company.</strong>
            </figcaption>
          </figure>

          <div className="personalCopy" data-reveal>
            <p className="sectionEyebrow">04 / Off Screen</p>
            <h2 className="sectionTitle">
              I came to code
              <br />
              <em>through people.</em>
            </h2>
            <p>
              My path runs through UX research, product design, and a master’s
              in AI and machine learning. I gravitate toward the intersection
              where thoughtful interaction meets a hard technical problem.
            </p>
            <p>
              Away from the keyboard, that curiosity looks like mountain
              motorcycle trips, scuba dives, and exploring Philadelphia.
            </p>
            <div className="interestRow">
              <span>01 / Mountain roads</span>
              <span>02 / Scuba diving</span>
              <span>03 / Philadelphia runs</span>
            </div>
          </div>
        </div>

        <div id="gallery" className="galleryStripWrap" data-reveal>
          <div className="galleryStripHead">
            <div>
              <p className="sectionEyebrow">05 / Contact Sheet</p>
              <h2 className="sectionTitle" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
                Moments outside <em>the terminal.</em>
              </h2>
            </div>
          </div>

          <div className="galleryStrip">
            {gallery.map((photo, idx) => (
              <button
                key={photo.src}
                className="galleryThumb"
                onClick={() => setLightboxIdx(idx)}
                data-cursor="VIEW"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  style={{ objectPosition: photo.position }}
                />
                <div className="galleryThumbMeta">
                  <strong>{photo.title}</strong>
                  <span>{photo.caption}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <dialog
        ref={lightboxRef}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) setLightboxIdx(null);
        }}
        onCancel={() => setLightboxIdx(null)}
      >
        {lightboxIdx !== null && (
          <div className="lightboxInner">
            <img
              src={gallery[lightboxIdx].src}
              alt={gallery[lightboxIdx].alt}
            />
            <div className="lightboxBar">
              <div>
                <strong>{gallery[lightboxIdx].title}</strong>
                <p style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                  {gallery[lightboxIdx].caption}
                </p>
              </div>
              <button className="btnGhost" onClick={() => setLightboxIdx(null)}>
                Close ×
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* 05 / CONTACT FINALE */}
      <section id="contact" className="contactBand">
        <div className="wrap">
          <div className="contactHero" data-reveal>
            <div>
              <p className="sectionEyebrow">06 / Next Chapter</p>
              <h2>
                Let’s build something <em>worth looking at.</em>
              </h2>
            </div>
            <a
              className="btnPrimary"
              href={`mailto:${profile.email}`}
              data-cursor="EMAIL"
            >
              Start a conversation ↗
            </a>
          </div>

          <div className="contactActions">
            <a className="emailDisplay" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="heroActionsRow">
              <button className="btnGhost" onClick={handleCopy}>
                {copied ? "Email copied ✓" : "Copy email"}
              </button>
              <a
                className="btnGhost"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
              <a
                className="btnGhost"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          <footer className="siteFooter">
            <span>© 2026 Shweta Sharma</span>
            <span>Philadelphia, PA · Open to relocate</span>
            <a href="#main">Back to top ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}
