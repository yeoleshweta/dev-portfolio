"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GauzeBlazeCanvas } from "@/components/v4/GauzeBlazeCanvas";
import { AsciiRadarCanvas } from "@/components/v4/AsciiRadarCanvas";
import { V4Header } from "@/components/v4/V4Header";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { ProjectViewModal } from "@/components/portfolio/ProjectViewModal";
import { profile, experience } from "@/content/profile";
import "@/styles/gallery.css";
import { selectedProjects } from "@/content/selected-projects";

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

const bentoWorks = selectedProjects;

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
  const [selectedWorkIdx, setSelectedWorkIdx] = useState(null);
  const [activeQuad, setActiveQuad] = useState(0);
  const [copied, setCopied] = useState(false);

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
        {/* ACT I — GAUZE BLAZE HERO + 3D TEXT UNFOLD */}
        <section id="hero" className="v4Hero v4HeroGauze">
          <GauzeBlazeCanvas />
          <div className="v4HeroMask v4MaskGauze" aria-hidden="true" />

          <div className="v4Wrap v4HeroContent">
            <div className="v4HeroCenter">
              <p className="v4HeroKicker v4KickerPink">
                <i aria-hidden="true" />
                PHILADELPHIA, PA · FULLSTACK ENGINEERING &amp; APPLIED ML
              </p>

              <h1 className="v4HeroTitle">
                <span className="v4UnfoldLine" style={{ "--d": "0ms" }}>
                  <span>Where human nuance</span>
                </span>
                <span className="v4UnfoldLine" style={{ "--d": "110ms" }}>
                  <span>
                    meets <em className="v4EmPink">production code.</em>
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
                <HiringBrief triggerClassName="v4ArrowBtn v4ArrowPink" biasHref="#works" />
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

        {/* ACT II — ARCHITECTURAL EXPANDING OUTCOME PANELS */}
        <section id="impact" className="v4Section v4Wrap">
          <div className="v4SectionRow" data-v4-unfold>
            <div>
              <span className="v4Kicker">01 / MEASURED SIGNAL</span>
              <h2 className="v4Display">
                Outcomes in <em>practice.</em>
              </h2>
            </div>
            <p className="v4CopyMuted">
              Six years of research-led product design and applied ML — each
              number anchored to a real shipped system.
            </p>
          </div>

          <div className="v4PillarDeck" data-v4-unfold>
            {abacusMetrics.map((m, i) => {
              const active = activeMetric === i;
              return (
                <button
                  key={m.id}
                  type="button"
                  className="v4PillarPanel"
                  data-active={active}
                  onMouseEnter={() => setActiveMetric(i)}
                  onFocus={() => setActiveMetric(i)}
                  onClick={() => setActiveMetric(i)}
                >
                  <div className="v4PillarGlow" aria-hidden="true" />
                  <div className="v4PillarTop">
                    <span>0{i + 1}</span>
                    <small>{m.org.toUpperCase()}</small>
                  </div>

                  <div className="v4PillarCenter">
                    <strong className="v4PillarNum">{m.value}</strong>
                    <span className="v4PillarLabel">{m.label}</span>
                  </div>

                  <p className="v4PillarNote">{m.detail}</p>
                </button>
              );
            })}
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
            {bentoWorks.map((item, idx) => (
              <TiltBentoCard
                key={item.id}
                item={item}
                onSelect={() => setSelectedWorkIdx(idx)}
              />
            ))}
          </div>
        </section>

        {/* V1 PROJECT VIEW MODAL */}
        <ProjectViewModal
          projects={bentoWorks}
          selectedIndex={selectedWorkIdx}
          onSelectIndex={setSelectedWorkIdx}
          onClose={() => setSelectedWorkIdx(null)}
        />

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
