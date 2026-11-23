"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";

const trailFrames = [
  { src: "/urbanfit.jpg", label: "Urbanfit · 484 Interactions" },
  { src: "/gesturepro.jpg", label: "GesturePro · 21 Landmarks" },
  { src: "/abim.jpg", label: "ABIM · Clinical NLP" },
  { src: "/mountains.jpg", label: "Grace Hopper · 2025" },
  { src: "/gallery/color-in-the-city.webp", label: "Philadelphia" },
  { src: "/gallery/another-perspective.webp", label: "New Perspectives" },
];

/**
 * High-agency daylight hero built for a 2-second hook:
 * - Monumental 3-line display typography with live expandable inline media portals
 *   that physically part the headline on hover.
 * - Restrained cursor-spawned studio proof trail behind the type on desktop.
 * - Harmonious warm museum-paper transition directly into PracticePillars.
 */
export function CleanHero() {
  const heroRef = useRef(null);
  const trailLayerRef = useRef(null);
  const [hoveredPortal, setHoveredPortal] = useState(null);

  // Subtle cursor-spawned studio proof trail (desktop, fine pointer, reduced-motion safe)
  useEffect(() => {
    const hero = heroRef.current;
    const layer = trailLayerRef.current;
    if (!hero || !layer) return;

    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let lastX = -999;
    let lastY = -999;
    let idx = 0;

    const spawnProof = (x, y, vx) => {
      const item = trailFrames[idx % trailFrames.length];
      idx += 1;

      const card = document.createElement("div");
      card.className = "heroTrailProof";
      const tilt = Math.max(-9, Math.min(9, vx * 0.12 + (idx % 2 === 0 ? 3 : -3)));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.setProperty("--tilt", `${tilt.toFixed(1)}deg`);

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "";
      img.decoding = "async";

      const cap = document.createElement("span");
      cap.textContent = item.label;

      card.appendChild(img);
      card.appendChild(cap);
      layer.appendChild(card);

      // Keep DOM lean
      while (layer.children.length > 7) {
        layer.firstChild?.remove();
      }

      setTimeout(() => {
        card.dataset.fading = "true";
        setTimeout(() => card.remove(), 420);
      }, 620);
    };

    const onMove = (e) => {
      if (e.target.closest?.("a, button, .inlinePortal")) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 125) {
        const vx = x - lastX;
        lastX = x;
        lastY = y;
        spawnProof(x, y, vx);
      }
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", onMove);
      layer.innerHTML = "";
    };
  }, []);

  return (
    <section ref={heroRef} className="hookHero">
      {/* Studio proof trail layer behind typography */}
      <div ref={trailLayerRef} className="heroTrailLayer" aria-hidden="true" />

      <div className="atelierWrap hookHeroInner">
        <div className="hookTopMeta">
          <span>FOLIO ’26 — FULLSTACK &amp; APPLIED ML</span>
          <span className="hookHint">
            {hoveredPortal ? hoveredPortal : "HOVER PORTALS OR MOVE ACROSS DESK"}
          </span>
          <span>PHILADELPHIA, PA</span>
        </div>

        {/* Monumental 3-line kinetic headline with inline interactive portals */}
        <div className="hookTypeStage">
          <h1 className="hookHeadline" aria-label="Shweta Sharma builds systems where design meets AI.">
            <span className="hookRow" style={{ "--i": 0 }}>
              <span className="hookWord">SHWETA</span>
              <Link
                href="#offscreen"
                className="inlinePortal portalPortrait"
                data-cursor="STORY"
                onMouseEnter={() => setHoveredPortal("SHWETA SHARMA · 6+ YRS UX & FULLSTACK")}
                onMouseLeave={() => setHoveredPortal(null)}
                aria-label="About Shweta Sharma"
              >
                <Image
                  src="/mountains.jpg"
                  alt="Shweta Sharma"
                  fill
                  priority
                  sizes="240px"
                />
              </Link>
              <span className="hookWord hookSerif">
                <em>Sharma</em>
              </span>
            </span>

            <span className="hookRow" style={{ "--i": 1 }}>
              <span className="hookWord">BUILDS</span>
              <Link
                href="/work/urbanfit/"
                className="inlinePortal portalWork"
                data-cursor="OPEN"
                onMouseEnter={() => setHoveredPortal("URBANFIT · 30 SCREENS, 484 INTERACTIONS")}
                onMouseLeave={() => setHoveredPortal(null)}
                aria-label="Inspect Urbanfit Control Panel"
              >
                <Image
                  src="/urbanfit.jpg"
                  alt="Urbanfit Control Panel"
                  fill
                  priority
                  sizes="280px"
                />
              </Link>
              <span className="hookWord">SYSTEMS</span>
            </span>

            <span className="hookRow" style={{ "--i": 2 }}>
              <span className="hookWord hookSerif">
                <em>where</em>
              </span>
              <span className="hookWord">CRAFT</span>
              <Link
                href="#works"
                className="inlinePortal portalSignal"
                data-cursor="AI"
                onMouseEnter={() => setHoveredPortal("BIAS CHECKER · ROBERTA + LORA + GPT-4O")}
                onMouseLeave={() => setHoveredPortal(null)}
                aria-label="Inspect Applied ML Systems"
              >
                <span className="signalBars" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <small>AI / ML</small>
              </Link>
              <span className="hookWord hookAccent">
                <em>meets AI.</em>
              </span>
            </span>
          </h1>
        </div>

        {/* Clean architectural bottom strip */}
        <div className="hookBottomBar">
          <div className="hookStats">
            <div>
              <small>ACADEMIC</small>
              <strong>MS Computer Science (AI &amp; ML) · 3.97 GPA</strong>
            </div>
            <div>
              <small>FOCUS</small>
              <strong>React / Next.js · Python / FastAPI · Interpretable ML</strong>
            </div>
          </div>

          <div className="hookActions">
            <a className="hookBtnPrimary" href="#works" data-cursor="WORKS">
              Selected Works <span>06</span>
            </a>
            <a
              className="hookBtnGhost"
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
  );
}
