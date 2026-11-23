"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const biasNodes = [
  {
    code: "01",
    label: "Vignette",
    tech: "Next.js",
    text: "Doctor-patient dialogue enters the evaluation interface cleanly.",
  },
  {
    code: "02",
    label: "Classify",
    tech: "RoBERTa + LoRA",
    text: "Fine-tuned classifier detects medical bias categories against taxonomy.",
  },
  {
    code: "03",
    label: "Explain",
    tech: "GPT-4o",
    text: "Dedicated explanation layer surfaces inspectable clinical reasoning.",
  },
  {
    code: "04",
    label: "Deliver",
    tech: "Flask · Docker",
    text: "Containerized API on Hugging Face Spaces returns label + rationale.",
  },
];

/**
 * Sticky 3D Stacking Folio Deck.
 * As the user scrolls, 3 full-viewport art-directed chapters physically stack
 * in 3D perspective (Bone → Deep Cobalt → Obsidian), each scaling and receding
 * smoothly behind the incoming folio.
 */
export function DepthDeck() {
  const card0Ref = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const [activeNode, setActiveNode] = useState(1);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const refs = [card0Ref, card1Ref, card2Ref];

    const update = () => {
      if (window.innerWidth >= 960) {
        refs.forEach((ref, i) => {
          const el = ref.current;
          const nextEl = refs[i + 1]?.current;
          if (!el) return;
          if (!nextEl) {
            el.style.transform = "scale(1) translateY(0px)";
            el.style.filter = "brightness(1)";
            return;
          }
          const nextRect = nextEl.getBoundingClientRect();
          const vh = window.innerHeight;
          // Progress 0 -> 1 as next card rises from bottom of screen to top
          const p = Math.min(1, Math.max(0, 1 - nextRect.top / vh));
          const scale = 1 - p * 0.065;
          const y = -p * 28;
          const dim = 1 - p * 0.22;
          el.style.transform = `scale(${scale.toFixed(4)}) translate3d(0, ${y.toFixed(1)}px, 0)`;
          el.style.filter = `brightness(${dim.toFixed(3)})`;
        });
      } else {
        refs.forEach((ref) => {
          if (ref.current) {
            ref.current.style.transform = "none";
            ref.current.style.filter = "none";
          }
        });
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="story" className="deckSection" aria-label="The practice in three chapters">
      {/* FOLIO 01 — ARCHIVAL BONE: PEOPLE & RESEARCH */}
      <div className="deckSlot">
        <article ref={card0Ref} className="deckCard deckBone">
          <div className="deckTopMeta">
            <span>FOLIO 01 / 03 — HUMAN ORIGIN</span>
            <span>JOHN DEERE · URBANFIT · CAPITA</span>
          </div>

          <div className="deckSplit">
            <div className="deckCopy">
              <h2>
                I came to code
                <br />
                <em>through people.</em>
              </h2>
              <p>
                Before writing full-stack AI pipelines, I spent six years
                leading UX research and behavioral personalization across
                enterprise platforms and seven UK retail brands. Good
                engineering begins by listening closely.
              </p>
              <div className="deckMetricRow">
                <div>
                  <strong>−60%</strong>
                  <span>Survey setup across 250+ John Deere products</span>
                </div>
                <div>
                  <strong>+35%</strong>
                  <span>Engagement lift from research-led redesign</span>
                </div>
              </div>
            </div>

            <figure className="deckVisual">
              <Image
                src="/mountains.jpg"
                alt="Shweta at Grace Hopper Celebration 2025"
                width={900}
                height={680}
                sizes="(max-width: 960px) 90vw, 44vw"
              />
              <figcaption>GRACE HOPPER CELEBRATION · 2025</figcaption>
            </figure>
          </div>
        </article>
      </div>

      {/* FOLIO 02 — DEEP ARCHIVAL COBALT: INTERACTION & SYSTEMS */}
      <div className="deckSlot">
        <article ref={card1Ref} className="deckCard deckCobalt">
          <div className="deckTopMeta">
            <span>FOLIO 02 / 03 — INTERACTION &amp; ARCHITECTURE</span>
            <span>URBANFIT · GESTUREPRO</span>
          </div>

          <div className="deckSplit">
            <div className="deckCopy">
              <h2>
                Complexity given
                <br />
                <em>one clear grammar.</em>
              </h2>
              <p>
                Whether unifying admin, warehouse, and franchise inventory
                across 30 screens or turning 21 live webcam hand landmarks into
                editable text, the person always remains in command of the
                system.
              </p>
              <div className="deckMetricRow">
                <div>
                  <strong>484</strong>
                  <span>Connected interactions in Urbanfit Control Panel</span>
                </div>
                <div>
                  <strong>21</strong>
                  <span>Real-time MediaPipe landmarks per frame</span>
                </div>
              </div>
            </div>

            <div className="deckDualVisual">
              <figure className="deckVisualMain">
                <Image
                  src="/urbanfit.jpg"
                  alt="Urbanfit Control Panel interface"
                  width={900}
                  height={600}
                  sizes="(max-width: 960px) 90vw, 44vw"
                />
                <figcaption>URBANFIT · 3 ROLES, 1 SHARED SYSTEM</figcaption>
              </figure>
              <figure className="deckVisualInset">
                <Image
                  src="/gesturepro.jpg"
                  alt="GesturePro webcam hand recognition prototype"
                  width={480}
                  height={320}
                  sizes="(max-width: 960px) 60vw, 22vw"
                />
              </figure>
            </div>
          </div>
        </article>
      </div>

      {/* FOLIO 03 — OBSIDIAN INK: APPLIED ML & EVALUATION */}
      <div className="deckSlot">
        <article ref={card2Ref} className="deckCard deckObsidian">
          <div className="deckTopMeta">
            <span>FOLIO 03 / 03 — INTERPRETABLE AI</span>
            <span>ABIM · DREXEL MS AI &amp; ML (3.97 GPA)</span>
          </div>

          <div className="deckSplit">
            <div className="deckCopy">
              <h2>
                Predictions you
                <br />
                <em>can question.</em>
              </h2>
              <p>
                At the American Board of Internal Medicine, I solo-built Bias
                Checker and supervised clinical NLP workflows anchored to
                Calgary-Cambridge and NURSE frameworks — separating detection
                from explanation so reviewers can audit every output.
              </p>
              <div className="deckMetricRow">
                <div>
                  <strong>3.97</strong>
                  <span>MS Computer Science (AI &amp; ML) · Drexel ’26</span>
                </div>
                <div>
                  <strong>01→04</strong>
                  <span>Solo model, API, interface &amp; Docker deploy</span>
                </div>
              </div>
            </div>

            <div className="deckPipelinePanel">
              <div className="deckPipeHeader">
                <span>INTERACTIVE SPECIMEN · BIAS CHECKER</span>
                <span>SELECT A STAGE</span>
              </div>
              <div className="deckPipeGrid">
                {biasNodes.map((node, i) => (
                  <button
                    key={node.code}
                    type="button"
                    className="deckPipeBtn"
                    data-active={activeNode === i}
                    onClick={() => setActiveNode(i)}
                  >
                    <small>{node.code}</small>
                    <strong>{node.label}</strong>
                    <span>{node.tech}</span>
                  </button>
                ))}
              </div>
              <div className="deckPipeReadout" key={activeNode}>
                <small>
                  STAGE {biasNodes[activeNode].code} · {biasNodes[activeNode].tech}
                </small>
                <p>{biasNodes[activeNode].text}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
