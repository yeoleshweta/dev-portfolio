"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GrainMassCanvas } from "@/components/v3/GrainMassCanvas";
import { V3Header } from "@/components/v3/V3Header";
import { HiringBrief } from "@/components/portfolio/HiringBrief";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { ProjectViewModal } from "@/components/portfolio/ProjectViewModal";
import { profile, experience } from "@/content/profile";
import "@/styles/gallery.css";
import { selectedProjects } from "@/content/selected-projects";

const pillars = [
  {
    num: "01",
    pigment: "gold",
    label: "People & Research",
    title: "Diagnose before building.",
    body: "Six years leading UX research and behavioral personalization across enterprise and retail teams taught me to solve the human problem before writing production code.",
    metric: "−60%",
    caption: "Survey setup time across 250+ John Deere products",
  },
  {
    num: "02",
    pigment: "blue",
    label: "Interaction & Systems",
    title: "Give complexity one grammar.",
    body: "From multi-role inventory control panels to real-time webcam sign recognition, I build responsive interfaces where the person always remains in command.",
    metric: "484",
    caption: "Connected prototype interactions in Urbanfit Control Panel",
  },
  {
    num: "03",
    pigment: "violet",
    label: "Applied ML & Evaluation",
    title: "Models you can question.",
    body: "Combining an MS in AI & Machine Learning with clinical NLP work at ABIM, I pair fine-tuned classifiers with inspectable explanation layers and clean APIs.",
    metric: "3.97",
    caption: "MS Computer Science (AI & ML) GPA · Drexel University",
  },
];

const workPlates = selectedProjects;

const skillCategories = [
  { id: "all", label: "All", num: "00", pigment: "gold" },
  { id: "engineering", label: "Frontend & Fullstack", num: "01", pigment: "blue" },
  { id: "ai", label: "Applied AI & ML", num: "02", pigment: "violet" },
  { id: "design", label: "Product & Systems", num: "03", pigment: "gold" },
  { id: "research", label: "Research & Analytics", num: "04", pigment: "ivory" },
];

const skillItems = [
  { name: "React", cat: "engineering", italic: false, context: "Production web interfaces across CentralPerk, interactive dashboards, and design-system handoffs." },
  { name: "Next.js", cat: "engineering", italic: true, context: "App Router frontends for Bias Checker (ABIM), GesturePro live sign editor, and PocketSaver." },
  { name: "Python", cat: "ai", italic: false, context: "Core language across clinical NLP pipelines at ABIM, ML inference APIs, and forecasting services." },
  { name: "Figma", cat: "design", italic: true, context: "Atomic design system for Urbanfit (30 screens, 484 interactions) and John Deere's 250+ product survey tool." },
  { name: "RoBERTa + LoRA", cat: "ai", italic: false, context: "Fine-tuned healthcare bias classifier deployed end-to-end in Bias Checker via Flask & Hugging Face Spaces." },
  { name: "FastAPI", cat: "engineering", italic: false, context: "Real-time hand-landmark inference backend in GesturePro and multi-agent API layer in CentralPerk." },
  { name: "Design Systems", cat: "design", italic: true, context: "Built Urbanfit's atomic component library from scratch and maintained multi-brand retail libraries at Capita." },
  { name: "LLM Evaluation", cat: "ai", italic: false, context: "Rubric-based evaluation frameworks at ABIM measuring clinical accuracy, label consistency, and edge cases." },
  { name: "Usability Testing", cat: "research", italic: true, context: "Moderated studies across 6+ John Deere teams, Urbanfit (+35% engagement), and GesturePro's 6-participant validation." },
  { name: "Flask", cat: "engineering", italic: false, context: "Served RoBERTa classification and GPT-4o explainability endpoints in the solo-built Bias Checker tool." },
  { name: "GPT-4o", cat: "ai", italic: false, context: "Few-shot explainability layer paired with fine-tuned classification in Bias Checker so clinicians can audit outputs." },
  { name: "Node.js", cat: "engineering", italic: false, context: "API proxy and service routing layer connecting Next.js, PostgreSQL, and Python forecasting in PocketSaver." },
  { name: "PostgreSQL", cat: "engineering", italic: true, context: "Containerized relational persistence layer orchestrated with Docker Compose in PocketSaver." },
  { name: "Label Studio", cat: "ai", italic: false, context: "Built annotated doctor-patient dialogue reference sets at ABIM mapped to Calgary-Cambridge & NURSE rubrics." },
  { name: "Interaction Design", cat: "design", italic: false, context: "Multi-role operational grammars and human-in-the-loop correction patterns across web and AI workflows." },
  { name: "TensorFlow", cat: "ai", italic: false, context: "Trained the hand-sign gesture classification model powering GesturePro's browser-to-text experience." },
  { name: "MediaPipe", cat: "ai", italic: true, context: "Extracted 21 real-time hand landmarks per webcam frame for GesturePro's computer vision pipeline." },
  { name: "Docker", cat: "engineering", italic: false, context: "Multi-service local orchestration in PocketSaver and containerized deployment on Hugging Face Spaces." },
  { name: "A/B Testing", cat: "research", italic: false, context: "Combined behavioral segmentation and experimentation on Qubit's ML platform for an 11% conversion lift at Capita." },
  { name: "LangGraph", cat: "ai", italic: true, context: "Stateful multi-agent orchestration powering CentralPerk's transparent agent-handoff interface." },
  { name: "JavaScript", cat: "engineering", italic: false, context: "Interactive client state, custom motion choreography, and production web engineering across shipped builds." },
  { name: "Tailwind CSS", cat: "engineering", italic: false, context: "Rapid, token-consistent UI implementation across React + Vite and Next.js frontends." },
  { name: "Information Architecture", cat: "design", italic: true, context: "Eliminated developer dependency for 250+ John Deere products with a self-serve survey platform (−60% setup time)." },
  { name: "Annotation Taxonomy", cat: "ai", italic: false, context: "Translated clinical scoring rubrics (Calgary-Cambridge, NURSE, SHARE) into IRR-validated NLP categories at ABIM." },
  { name: "WCAG 2.1", cat: "design", italic: false, context: "Accessible contrast, keyboard navigation, and inclusive interaction standards across enterprise and consumer products." },
  { name: "Contextual Inquiry", cat: "research", italic: true, context: "Field and stakeholder research establishing John Deere's UX practice in India across 6+ product teams." },
  { name: "Behavioral Analytics", cat: "research", italic: false, context: "Hotjar, FullStory, Google Analytics, and Amplitude funnels driving Urbanfit's 28% bounce-rate drop." },
  { name: "SQL & Tableau", cat: "research", italic: false, context: "Synthesized 120+ feedback channels into core product KPIs alongside Power BI (DAX) and Dovetail." },
];

const catMeta = Object.fromEntries(
  skillCategories.map((c) => [c.id, { label: c.label.toUpperCase(), pigment: c.pigment }])
);

const roleMetrics = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion · 7 UK brands",
};

export function V3Portfolio() {
  const [selectedWorkIdx, setSelectedWorkIdx] = useState(null);
  const [activeWorkIdx, setActiveWorkIdx] = useState(0);
  const [activeCat, setActiveCat] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const els = [...document.querySelectorAll("[data-v3-reveal]")];
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



  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  const focusedSkill =
    hoveredSkill ??
    skillItems.find((s) => activeCat === "all" || s.cat === activeCat) ??
    skillItems[0];
  const focusedMeta = catMeta[focusedSkill.cat];
  const activeWork = workPlates[activeWorkIdx];

  return (
    <>
      <V3Header />

      <main id="main" className="v3Main">
        {/* ACT I — GRAIN MASS WEBGL HERO */}
        <section id="hero" className="v3Hero">
          <GrainMassCanvas />
          <div className="v3HeroVignette" aria-hidden="true" />

          <div className="v3Wrap v3HeroHud">
            <div className="v3HeroMain">
              <p className="v3HeroEyebrow">
                <span className="v3SignalDot" aria-hidden="true" />
                SHWETA SHARMA — FULLSTACK ENGINEER &amp; APPLIED ML
              </p>

              <h1 className="v3HeroTitle">
                <span className="v3RevealLine" style={{ "--i": 0 }}>
                  <span>I design the interface,</span>
                </span>
                <span className="v3RevealLine" style={{ "--i": 1 }}>
                  <span>architect the API,</span>
                </span>
                <span className="v3RevealLine" style={{ "--i": 2 }}>
                  <span>
                    <em>and evaluate the model.</em>
                  </span>
                </span>
              </h1>

              <p className="v3HeroLead">
                Six years leading UX research and product design across 250+
                products, paired with an MS in AI &amp; Machine Learning (3.97
                GPA). I own fullstack products where complex data feels
                effortless to use.
              </p>

              <div className="v3HeroActions">
                <HiringBrief triggerClassName="v3BtnPrimary" biasHref="#works" />
                <a
                  className="v3BtnGhost"
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  Résumé (PDF) ↗
                </a>
                <a
                  className="v3BtnGhost"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
            </div>

            <div className="v3HeroProof">
              <div>
                <small data-pigment="violet">RECENT</small>
                <strong>American Board of Internal Medicine</strong>
                <span>Clinical NLP &amp; solo-built Bias Checker AI</span>
              </div>
              <div>
                <small data-pigment="gold">SHIPPED IMPACT</small>
                <strong>John Deere · Urbanfit · Capita</strong>
                <span>−60% setup · +35% engagement · +11% conversion</span>
              </div>
              <div>
                <small data-pigment="blue">EDUCATION</small>
                <strong>Drexel University (2024–2026)</strong>
                <span>MS Computer Science, AI &amp; ML · 3.97 / 4.0 GPA</span>
              </div>
            </div>
          </div>
        </section>

        {/* ACT II — PRACTICE PRINCIPLES */}
        <section id="practice" className="v3Section v3Wrap">
          <div className="v3PracticeHeader" data-v3-reveal>
            <span className="v3Marker">01 / PRACTICE</span>
            <p className="v3PracticeLead">
              Most teams split research, interface craft, and machine learning
              across three handoffs. I work across the full boundary so nothing
              gets lost between them.
            </p>
          </div>

          <div className="v3PracticeGrid" data-v3-reveal>
            {pillars.map((item) => (
              <article
                className="v3PracticeCol"
                key={item.num}
                data-pigment={item.pigment}
              >
                <div className="v3PracticeRule" aria-hidden="true" />
                <div className="v3PracticeMeta">
                  <span>{item.num}</span>
                  <small>{item.label.toUpperCase()}</small>
                </div>
                <h2>{item.title}</h2>
                <p className="v3PracticeBody">{item.body}</p>
                <div className="v3PracticeMetric">
                  <strong>{item.metric}</strong>
                  <span>{item.caption}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ACT III — SELECTED WORKS (CURATED SPLIT SHOWCASE) */}
        <section id="works" className="v3Section v3Wrap v3BorderTop">
          <div className="v3SectionHead" data-v3-reveal>
            <div>
              <span className="v3Marker">02 / SELECTED WORKS</span>
              <h2 className="v3Heading">
                Systems built <em>end to end.</em>
              </h2>
            </div>
            <p className="v3SideCopy">
              Six projects spanning healthcare AI, computer vision, a website
              copilot, and apps for renters, skincare, and appointment access.
            </p>
          </div>

          <div className="v3WorksSplit" data-v3-reveal>
            <div className="v3WorksIndex" role="tablist" aria-label="Selected projects">
              {workPlates.map((plate, idx) => (
                <button
                  key={plate.id}
                  type="button"
                  role="tab"
                  aria-selected={activeWorkIdx === idx}
                  className="v3WorkRow"
                  data-pigment={plate.pigment}
                  onMouseEnter={() => setActiveWorkIdx(idx)}
                  onFocus={() => setActiveWorkIdx(idx)}
                  onClick={() => setSelectedWorkIdx(idx)}
                >
                  <span className="v3WorkRowNum">{plate.num}</span>
                  <span className="v3WorkRowMain">
                    <strong>{plate.title}</strong>
                    <small>{plate.discipline}</small>
                  </span>
                  <span className="v3WorkRowYear">{plate.year}</span>
                  <span className="v3WorkRowArrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>

            <div className="v3WorkStage" data-pigment={activeWork.pigment}>
              <div className="v3WorkStageCard" key={activeWork.id}>
                <div className="v3WorkStageTop">
                  <span>
                    PLATE {activeWork.num} / {activeWork.discipline.toUpperCase()}
                  </span>
                  <span>{activeWork.year}</span>
                </div>

                <div
                  className="v3WorkVisual"
                  onClick={() => setSelectedWorkIdx(activeWorkIdx)}
                >
                  {activeWork.image ? (
                    <Image
                      src={activeWork.image}
                      alt={activeWork.alt}
                      width={960}
                      height={600}
                      sizes="(max-width: 960px) 92vw, 48vw"
                    />
                  ) : (
                    <div className="v3Blueprint">
                      <small>{activeWork.blueprint.code}</small>
                      <div className="v3BlueprintFormula">
                        {activeWork.blueprint.formula}
                      </div>
                      <div className="v3BlueprintFoot">
                        {activeWork.blueprint.metrics.map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="v3WorkStageBody">
                  <h3>{activeWork.title}</h3>
                  <p className="v3WorkStageHeadline">{activeWork.headline}</p>
                  <p className="v3WorkStageSummary">{activeWork.summary}</p>

                  <div className="v3WorkStackRow">
                    {activeWork.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="v3WorkStageActions">
                    <button
                      type="button"
                      className="v3BtnPrimary"
                      onClick={() => setSelectedWorkIdx(activeWorkIdx)}
                    >
                      Inspect Architecture ↗
                    </button>
                    {activeWork.liveHref && (<a className="v3BtnPlain" href={activeWork.liveHref} target="_blank" rel="noreferrer">Visit live site ↗</a>)}
                    {activeWork.caseHref && (
                      <Link className="v3BtnGhost" href={activeWork.caseHref}>
                        Full Case Study ↗
                      </Link>
                    )}
                    {activeWork.repo && (
                      <a
                        className="v3BtnGhost"
                        href={activeWork.repo}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* V1 PROJECT VIEW MODAL */}
        <ProjectViewModal
          projects={workPlates}
          selectedIndex={selectedWorkIdx}
          onSelectIndex={setSelectedWorkIdx}
          onClose={() => setSelectedWorkIdx(null)}
        />

        {/* ACT IV — LIVING TYPOGRAPHIC SKILLS INDEX (TRI-PIGMENT) */}
        <section id="skills" className="v3Section v3Wrap v3BorderTop">
          <div className="v3SkillsTop" data-v3-reveal>
            <div>
              <span className="v3Marker">03 / SKILLS &amp; TOOLKIT</span>
              <h2 className="v3Heading">
                The working <em>index.</em>
              </h2>
            </div>

            <div
              className="v3FilterRail"
              role="tablist"
              aria-label="Filter skills by discipline"
            >
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCat === cat.id}
                  className="v3FilterBtn"
                  data-pigment={cat.pigment}
                  onClick={() => {
                    setActiveCat(cat.id);
                    setHoveredSkill(null);
                  }}
                >
                  <small>{cat.num}</small>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="v3SkillWall"
            data-has-hover={hoveredSkill !== null}
            onMouseLeave={() => setHoveredSkill(null)}
            data-v3-reveal
          >
            {skillItems.map((skill, idx) => {
              const matches = activeCat === "all" || skill.cat === activeCat;
              const isHovered = hoveredSkill?.name === skill.name;
              const pigment = catMeta[skill.cat].pigment;
              return (
                <span className="v3SkillTokenWrap" key={skill.name}>
                  <button
                    type="button"
                    className={`v3SkillToken${skill.italic ? " isItalic" : ""}`}
                    data-pigment={pigment}
                    data-match={matches}
                    data-active={isHovered}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onFocus={() => setHoveredSkill(skill)}
                    onClick={() => setHoveredSkill(skill)}
                  >
                    {skill.name}
                  </button>
                  {idx < skillItems.length - 1 && (
                    <span className="v3SkillSlash" aria-hidden="true">
                      /
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          <div
            className="v3SkillReadout"
            data-pigment={focusedMeta.pigment}
            aria-live="polite"
            data-v3-reveal
          >
            <div className="v3SkillReadoutMeta">
              <span>{focusedMeta.label}</span>
              <strong>{focusedSkill.name}</strong>
            </div>
            <p className="v3SkillReadoutText">{focusedSkill.context}</p>
          </div>
        </section>

        {/* ACT V — CAREER TRAJECTORY */}
        <section id="experience" className="v3Section v3Wrap v3BorderTop">
          <div className="v3ExpGrid">
            <div className="v3ExpLeft" data-v3-reveal>
              <span className="v3Marker">04 / THE TRAJECTORY</span>
              <h2 className="v3Heading">
                Different roles.
                <br />
                <em>One curiosity.</em>
              </h2>
              <p className="v3SideCopy" style={{ marginTop: "20px" }}>
                From establishing enterprise UX research practices to building
                clinical NLP and full-stack AI evaluation systems.
              </p>
              <a
                className="v3BtnGhost"
                style={{ display: "inline-block", marginTop: "24px" }}
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Download full résumé (PDF) ↗
              </a>

              <div className="v3AcademicPlate">
                <div className="v3AcademicTop">
                  <span>DREXEL UNIVERSITY</span>
                  <span>2024 — 2026</span>
                </div>
                <h3>
                  Master of Science, Computer Science
                  <br />
                  <em>AI &amp; Machine Learning</em>
                </h3>
                <div className="v3AcademicFoot">
                  <span>CUMULATIVE GPA</span>
                  <strong>3.97 / 4.0</strong>
                </div>
              </div>
            </div>

            <div className="v3Ledger" data-v3-reveal>
              {experience.map(([dates, company, role, detail]) => (
                <article key={company} className="v3LedgerRow">
                  <div className="v3LedgerHead">
                    <span className="v3LedgerDate">{dates}</span>
                    <h3>{company}</h3>
                    <span className="v3LedgerMetric">
                      {roleMetrics[company] || role}
                    </span>
                  </div>
                  <div className="v3LedgerSub">
                    <strong>{role}</strong>
                    <p>{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACT VI — BEYOND THE SCREEN + DARKROOM SCATTERED GALLERY */}
        <section id="offscreen" className="v3Section v3Wrap v3BorderTop" style={{ paddingBottom: "36px" }}>
          <div className="v3OffscreenIntro" data-v3-reveal>
            <figure className="v3PortraitFrame">
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

            <div className="v3OffscreenCopy">
              <span className="v3Marker">05 / BEYOND THE SCREEN</span>
              <h2 className="v3Heading">
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
              <div className="v3OffscreenList">
                <span>01 / Mountain roads</span>
                <span>02 / Scuba diving</span>
                <span>03 / New perspectives</span>
              </div>
            </div>
          </div>
        </section>

        <div className="v3DarkroomGallery">
          <PersonalGallery />
        </div>

        {/* ACT VII — COLOPHON */}
        <section id="contact" className="v3Colophon v3BorderTop">
          <div className="v3ColophonAura" aria-hidden="true" />
          <div className="v3Wrap v3ColophonInner">
            <div data-v3-reveal>
              <span className="v3Marker">06 / THE NEXT CHAPTER</span>
              <h2 className="v3ColophonHeadline">
                Thoughtful people.
                <br />
                <em>Ambitious work.</em>
              </h2>
              <p className="v3ColophonNote">
                Open to fullstack and applied AI engineering roles where craft,
                interaction design, and technical rigor live together.
              </p>
            </div>

            <div className="v3EmailRow" data-v3-reveal>
              <a className="v3EmailLink" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                type="button"
                className="v3BtnOutline"
                onClick={copyEmail}
              >
                {copied ? "Copied to clipboard ✓" : "Copy address"}
              </button>
            </div>

            <footer className="v3Footer">
              <span>© 2026 SHWETA SHARMA</span>
              <div className="v3FooterLinks">
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
              </div>
              <a href="#main">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
