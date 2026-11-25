"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "@/styles/project-archive.css";

const pad = (value) => String(value).padStart(2, "0");

function Placeholder({ projectIndex, variant }) {
  const design = projectIndex % 3;
  return (
    <svg
      viewBox="0 0 600 360"
      className="archiveArtwork"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`archive-ink-${design}-${variant}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#d1e28a" stopOpacity=".19" />
          <stop offset="1" stopColor="#d1e28a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        width="600"
        height="360"
        fill={`url(#archive-ink-${design}-${variant})`}
      />
      {design === 0 ? (
        <g className="diagramFlow">
          <path d="M110 180H250 M350 180H490 M300 92V142 M300 218V270" />
          <rect x="250" y="142" width="100" height="76" rx="15" />
          <rect x="58" y="156" width="52" height="48" rx="12" />
          <rect x="490" y="156" width="52" height="48" rx="12" />
          <circle cx="300" cy="76" r="15" />
          <circle cx="300" cy="286" r="15" />
          <path d="M279 180h42m-21-21v42" />
        </g>
      ) : design === 1 ? (
        <g className="diagramSurvey">
          <rect x="130" y="47" width="340" height="266" rx="12" />
          <path d="M130 94h340 M166 134h90 M166 187h120 M166 240h100" />
          <rect x="310" y="116" width="120" height="32" rx="4" />
          <rect x="310" y="169" width="120" height="32" rx="4" />
          <rect x="310" y="222" width="120" height="32" rx="4" />
          <circle cx="152" cy="70" r="3" />
          <circle cx="166" cy="70" r="3" />
          <circle cx="180" cy="70" r="3" />
        </g>
      ) : (
        <g className="diagramLanguage">
          <rect x="108" y="64" width="384" height="232" rx="14" />
          <path d="M145 112h155 M145 145h238 M145 178h180 M145 211h225 M145 244h134" />
          <rect x="302" y="101" width="91" height="19" rx="3" />
          <rect x="328" y="167" width="105" height="19" rx="3" />
          <circle cx="458" cy="85" r="5" />
        </g>
      )}
      {variant === 1 && (
        <g className="diagramDetail">
          <circle cx="300" cy="180" r="120" />
          <circle cx="300" cy="180" r="145" />
          <path d="M300 20v30 M300 310v30 M140 180h30 M430 180h30" />
        </g>
      )}
    </svg>
  );
}

function normalizeProject(raw) {
  if (!raw) return null;
  const type = raw.type || raw.field || raw.discipline || "";
  const description = raw.description || raw.summary || "";
  const stackList = Array.isArray(raw.stack)
    ? raw.stack
    : typeof raw.stack === "string"
      ? raw.stack
          .split("/")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
  const stackText = stackList.join(" / ");
  const images = raw.images?.length
    ? raw.images
    : raw.image
      ? [{ src: raw.image, alt: raw.alt || raw.title, caption: raw.headline || raw.title }]
      : null;
  const steps = raw.steps?.length
    ? raw.steps
    : raw.nodes?.length
      ? raw.nodes.map((node) => ({
          title: `${node.title} · ${node.technology}`,
          description: node.detail,
        }))
      : null;
  const caseHref = raw.href || raw.caseHref || null;

  return {
    ...raw,
    type,
    description,
    stackList,
    stackText,
    images,
    steps,
    caseHref,
  };
}

export function ProjectViewModal({
  projects,
  selectedIndex,
  onSelectIndex,
  onClose,
  triggerRef,
}) {
  const [variant, setVariant] = useState(0);
  const [direction, setDirection] = useState(1);
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const body = useRef(null);
  const transition = useRef(null);
  const generation = useRef(0);
  const fallbackTrigger = useRef(null);

  const isOpen =
    selectedIndex !== null &&
    selectedIndex !== undefined &&
    selectedIndex >= 0 &&
    selectedIndex < projects.length;
  const project = isOpen ? normalizeProject(projects[selectedIndex]) : null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (isOpen) {
      if (!element.open) {
        if (!triggerRef?.current && document.activeElement instanceof HTMLElement) {
          fallbackTrigger.current = document.activeElement;
        }
        element.dataset.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        element.showModal();
        closeButton.current?.focus();
      }
      setVariant(0);
    } else if (element.open) {
      document.body.style.overflow = element.dataset.previousOverflow || "";
      element.close();
    }
  }, [isOpen, selectedIndex, triggerRef]);

  useEffect(() => {
    const element = dialog.current;
    return () => {
      generation.current++;
      transition.current?.cancel();
      if (element?.open) {
        document.body.style.overflow = element.dataset.previousOverflow || "";
        element.close();
      }
    };
  }, []);

  function close() {
    generation.current++;
    transition.current?.cancel();
    const element = dialog.current;
    if (element) {
      document.body.style.overflow = element.dataset.previousOverflow || "";
      if (element.open) element.close();
    }
    onClose?.();
    const focusTarget = triggerRef?.current || fallbackTrigger.current;
    focusTarget?.focus?.({ preventScroll: true });
  }

  async function change(index) {
    if (index < 0 || index >= projects.length || index === selectedIndex) return;
    const token = ++generation.current;
    transition.current?.cancel();
    const dir = index > selectedIndex ? 1 : -1;
    setDirection(dir);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && body.current) {
      const animation = body.current.animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: `translateX(${dir * -14}px)` },
        ],
        { duration: 140, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }
      );
      transition.current = animation;
      try {
        await animation.finished;
      } catch {
        return;
      }
    }
    if (token !== generation.current) return;
    transition.current?.cancel();
    transition.current = null;
    setVariant(0);
    onSelectIndex?.(index);
    dialog.current
      ?.querySelector(".archiveModalScroll")
      ?.scrollTo({ top: 0, behavior: "instant" });
  }

  function keys(event) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.closest("input, textarea, select")
    ) {
      return;
    }
    if (event.key === "ArrowRight" && selectedIndex < projects.length - 1) {
      event.preventDefault();
      change(selectedIndex + 1);
    }
    if (event.key === "ArrowLeft" && selectedIndex > 0) {
      event.preventDefault();
      change(selectedIndex - 1);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="archiveModal"
      aria-labelledby="archive-modal-title"
      onKeyDown={keys}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {project && (
        <div className="archiveModalScroll">
          <div className="archiveModalTop">
            <span>PROJECT INDEX / {pad(selectedIndex + 1)}</span>
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              aria-label="Close project details"
            >
              CLOSE <i aria-hidden="true">×</i>
            </button>
          </div>

          <div
            ref={body}
            key={selectedIndex}
            className="archiveModalContent"
            style={{ "--archive-direction": direction }}
          >
            <div className="archiveModalHero">
              <div>
                <span className="archiveModalCategory">{project.type}</span>
                <h2 id="archive-modal-title">{project.title}</h2>
                <p>{project.description}</p>
              </div>
              <div className="archiveModalMark" aria-hidden="true">
                <span>SS / PROJECT INDEX</span>
                <strong>{pad(selectedIndex + 1)}</strong>
                <i>↗</i>
              </div>
            </div>

            <div className="archiveModalBody">
              <div className="archiveModalFacts">
                <span>PROJECT NOTES</span>
                <dl>
                  <div>
                    <dt>Context</dt>
                    <dd>{project.type}</dd>
                  </div>
                  <div>
                    <dt>Tools &amp; practice</dt>
                    <dd>{project.stackText}</dd>
                  </div>
                  {project.decision && (
                    <div>
                      <dt>Key decision</dt>
                      <dd>{project.decision}</dd>
                    </div>
                  )}
                </dl>
                {(project.caseHref || project.liveHref || project.repo) && (
                  <div className="archiveCaseLinks">
                    {project.caseHref && (
                      <Link
                        href={project.caseHref}
                        className="archiveCaseLink"
                        onClick={close}
                      >
                        VIEW CASE STUDY <i aria-hidden="true">↗</i>
                      </Link>
                    )}
                    {project.liveHref && (
                      <a
                        href={project.liveHref}
                        className="archiveCaseLink"
                        target="_blank"
                        rel="noreferrer"
                      >
                        VISIT LIVE SITE <i aria-hidden="true">↗</i>
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        className="archiveCaseLink"
                        target="_blank"
                        rel="noreferrer"
                      >
                        EXPLORE GITHUB <i aria-hidden="true">↗</i>
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="archiveVisualExplorer">
                <div
                  className="archiveVisualFrame"
                  key={`${selectedIndex}-${variant}`}
                >
                  <div className="archiveVisualMeta">
                    <span>
                      {pad(variant + 1)} /{" "}
                      {variant === 0 ? "PROJECT VIEW" : "DETAIL VIEW"}
                    </span>
                    <span>
                      {project.images?.[variant]
                        ? "PROJECT IMAGE"
                        : "ILLUSTRATIVE PLACEHOLDER"}
                    </span>
                  </div>
                  {project.images?.[variant] ? (
                    <figure className="archiveProjectImage">
                      <img
                        src={project.images[variant].src}
                        alt={project.images[variant].alt}
                      />
                      <figcaption>{project.images[variant].caption}</figcaption>
                    </figure>
                  ) : (
                    <Placeholder projectIndex={selectedIndex} variant={variant} />
                  )}
                  {!project.images?.[variant] && (
                    <div className="archiveVisualFoot">
                      <span>PROJECT IMAGERY COMING SOON</span>
                      <span>✳</span>
                    </div>
                  )}
                </div>
                <div
                  className="archiveVisualSwitch"
                  role="group"
                  aria-label="Choose project image"
                >
                  <button
                    type="button"
                    aria-pressed={variant === 0}
                    onClick={() => setVariant(0)}
                  >
                    <span>01</span> OVERVIEW
                  </button>
                  <button
                    type="button"
                    aria-pressed={variant === 1}
                    onClick={() => setVariant(1)}
                  >
                    <span>02</span> DETAIL
                  </button>
                  <small>SELECT A VIEW ↗</small>
                </div>
              </div>
            </div>

            <section
              className="archiveHighlights"
              aria-labelledby="archive-highlights-title"
            >
              <div className="archiveSectionHead">
                <div>
                  <span>AT A GLANCE</span>
                  <h3 id="archive-highlights-title">
                    The details that matter.
                  </h3>
                </div>
                {!project.highlights?.length && <small>PLACEHOLDER CONTENT</small>}
              </div>
              <div className="archiveHighlightGrid">
                {(project.highlights?.length
                  ? project.highlights
                  : [
                      {
                        title: "The idea",
                        description:
                          "Introduce the central feature or experience here.",
                      },
                      {
                        title: "The craft",
                        description:
                          "Describe a technical or design decision worth noticing.",
                      },
                      {
                        title: "The impact",
                        description:
                          "Add a meaningful result or lesson when it is available.",
                      },
                    ]
                ).map((item, index) => (
                  <article
                    className="archiveHighlight"
                    key={`${index}-${item.title}`}
                  >
                    <span className="archiveHighlightNumber">
                      {pad(index + 1)} / HIGHLIGHT
                    </span>
                    <div
                      className={`archiveHighlightGlyph glyph${index % 3}`}
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="archiveStory"
              aria-labelledby="archive-story-title"
            >
              <div className="archiveStoryHeading">
                <span>THE PROJECT / IN DEPTH</span>
                <h3 id="archive-story-title">The story behind the work.</h3>
                {(!project.story?.challenge ||
                  !project.story?.approach ||
                  !project.story?.outcome) && <small>PLACEHOLDER COPY</small>}
              </div>
              <div className="archiveStoryText">
                <div>
                  <span>01 / THE CHALLENGE</span>
                  <p>
                    {project.story?.challenge ||
                      `This space will introduce the problem ${project.title} set out to address, the people involved, and the context behind the work.`}
                  </p>
                </div>
                <div>
                  <span>02 / THE APPROACH</span>
                  <p>
                    {project.story?.approach ||
                      "This section will explain the process, key decisions, and Shweta’s contribution—from the first questions through the solution."}
                  </p>
                </div>
                <div>
                  <span>03 / THE OUTCOME</span>
                  <p>
                    {project.story?.outcome ||
                      "This is where the results, lessons learned, and next steps will be added once the project details are ready."}
                  </p>
                </div>
              </div>
            </section>

            <section
              className="archiveProcess"
              aria-labelledby="archive-process-title"
            >
              <div className="archiveSectionHead">
                <div>
                  <span>FROM INPUT TO OUTCOME</span>
                  <h3 id="archive-process-title">How it comes together.</h3>
                </div>
                {!project.steps?.length && <small>PLACEHOLDER CONTENT</small>}
              </div>
              <ol>
                {(project.steps?.length
                  ? project.steps
                  : [
                      {
                        title: "Start with the need",
                        description:
                          "Add the user need or input that starts the flow.",
                      },
                      {
                        title: "Work through the system",
                        description:
                          "Describe the important interaction or technical process.",
                      },
                      {
                        title: "Deliver the outcome",
                        description:
                          "Show what the person sees or receives at the end.",
                      },
                    ]
                ).map((step, index) => (
                  <li key={`${index}-${step.title}`}>
                    <span>{pad(index + 1)}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section
              className="archiveStack"
              aria-label="Project technology and tools"
            >
              <span>TOOLS &amp; PRACTICE</span>
              <div>
                {project.stackList.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="archiveModalBottom">
            <span aria-live="polite">
              {pad(selectedIndex + 1)} / {pad(projects.length)}
              <span className="archiveCurrentName"> · {project.title}</span>
            </span>
            <div>
              <button
                type="button"
                disabled={selectedIndex === 0}
                onClick={() => change(selectedIndex - 1)}
              >
                ← PREVIOUS
              </button>
              <button
                type="button"
                disabled={selectedIndex === projects.length - 1}
                onClick={() => change(selectedIndex + 1)}
              >
                NEXT →
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
