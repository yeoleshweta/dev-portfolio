"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gallery } from "@/content/gallery";

const STUDIES = [
  { id: "orbital", num: "01", label: "3D Orbital Arc", hint: "Click any plate or use arrows to orbit" },
  { id: "accordion", num: "02", label: "Elastic Glass Blades", hint: "Hover or click any blade to expand" },
  { id: "stack", num: "03", label: "Tactile Fanned Deck", hint: "Click or flick the top card to cycle the deck" },
  { id: "marquee", num: "04", label: "Kinetic Filmstrip", hint: "Hover to pause & tilt · Click to inspect" },
  { id: "trail", num: "05", label: "Magnetic Index Hover", hint: "Glide across titles to float the print" },
];

export function ExperimentalGalleryLab() {
  const [study, setStudy] = useState("orbital");
  const [active, setActive] = useState(2); // Center plate initially
  const [flinging, setFlinging] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  // Study 05 (Magnetic Index) pointer coordinates relative to stage
  const trailStageRef = useRef(null);
  const [trailIdx, setTrailIdx] = useState(0);
  const [trailHovering, setTrailHovering] = useState(false);
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0, rot: 0 });
  const prevXRef = useRef(0);

  const count = gallery.length;
  const step = (delta) => setActive((i) => (i + delta + count) % count);

  const cycleStack = () => {
    if (flinging) return;
    setFlinging(true);
    setTimeout(() => {
      setActive((i) => (i + 1) % count);
      setFlinging(false);
    }, 340);
  };

  const handleTrailMove = (e) => {
    const stage = trailStageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const vx = Math.max(-18, Math.min(18, (x - prevXRef.current) * 0.45));
    prevXRef.current = x;
    setTrailPos({ x, y, rot: vx });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox !== null) {
        if (e.key === "Escape") setLightbox(null);
        if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % count);
        if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + count) % count);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, count]);

  const currentStudy = STUDIES.find((s) => s.id === study) || STUDIES[0];

  return (
    <section className="v6ExpLab" aria-label="Experimental animated gallery studies">
      <div className="v6Wrap">
        <div className="v6ExpLabHead">
          <div>
            <span className="v6Kicker">EXPERIMENTAL GALLERY LAB · 05 ANIMATED STUDIES</span>
            <h2 className="v6ChapterTitle">
              Same five moments, <em>five ways to move.</em>
            </h2>
          </div>

          <div className="v6ExpTabs" role="tablist" aria-label="Gallery design studies">
            {STUDIES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={study === s.id}
                className="v6ExpTab"
                onClick={() => setStudy(s.id)}
              >
                <small>{s.num}</small>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="v6ExpStageShell">
          <div className="v6ExpStageMeta">
            <span className="v6ExpStageTag">
              <i aria-hidden="true" />
              STUDY {currentStudy.num} / {currentStudy.label.toUpperCase()}
            </span>
            <span className="v6ExpStageHint">{currentStudy.hint}</span>
          </div>

          {/* ===============================================================
              STUDY 01 — 3D ORBITAL COVERFLOW ARC
              =============================================================== */}
          {study === "orbital" && (
            <div className="v6OrbitalWrap">
              <div className="v6OrbitalStage">
                {gallery.map((item, idx) => {
                  let offset = idx - active;
                  if (offset > count / 2) offset -= count;
                  if (offset < -count / 2) offset += count;
                  const abs = Math.abs(offset);
                  const isCenter = offset === 0;

                  return (
                    <button
                      key={item.src}
                      type="button"
                      className="v6OrbitalCard"
                      data-center={isCenter ? "true" : "false"}
                      style={{
                        "--off": offset,
                        "--abs": abs,
                        zIndex: 10 - abs,
                      }}
                      onClick={() => (isCenter ? setLightbox(idx) : setActive(idx))}
                    >
                      <div className="v6OrbitalMedia">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 768px) 74vw, 340px"
                          style={{ objectFit: "cover", objectPosition: item.position }}
                        />
                      </div>
                      <div className="v6OrbitalCap">
                        <small>{String(idx + 1).padStart(2, "0")}</small>
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.caption}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="v6OrbitalControls">
                <button type="button" className="v6GlassBtn" onClick={() => step(-1)} aria-label="Previous photo">
                  ← Prev
                </button>
                <div className="v6OrbitalDots">
                  {gallery.map((item, idx) => (
                    <button
                      key={item.src}
                      type="button"
                      aria-label={`View ${item.title}`}
                      aria-current={idx === active ? "true" : undefined}
                      onClick={() => setActive(idx)}
                    />
                  ))}
                </div>
                <button type="button" className="v6GlassBtn" onClick={() => step(1)} aria-label="Next photo">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ===============================================================
              STUDY 02 — ELASTIC FROSTED GLASS BLADES (ACCORDION)
              =============================================================== */}
          {study === "accordion" && (
            <div className="v6AccordionStage">
              {gallery.map((item, idx) => {
                const isOpen = idx === active;
                return (
                  <button
                    key={item.src}
                    type="button"
                    className="v6Blade"
                    data-open={isOpen ? "true" : "false"}
                    onMouseEnter={() => setActive(idx)}
                    onFocus={() => setActive(idx)}
                    onClick={() => (isOpen ? setLightbox(idx) : setActive(idx))}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 560px"
                      style={{ objectFit: "cover", objectPosition: item.position }}
                    />
                    <div className="v6BladeShade" />
                    <span className="v6BladeRail">
                      <em>{String(idx + 1).padStart(2, "0")}</em>
                      <span>{item.title}</span>
                    </span>
                    <div className="v6BladeInfo">
                      <small>PLATE {String(idx + 1).padStart(2, "0")}</small>
                      <strong>{item.title}</strong>
                      <p>{item.caption}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ===============================================================
              STUDY 03 — TACTILE 3D FANNED CARD STACK
              =============================================================== */}
          {study === "stack" && (
            <div className="v6StackLayout">
              <div className="v6StackArena">
                {gallery.map((item, idx) => {
                  const pos = (idx - active + count) % count;
                  const isTop = pos === 0;
                  return (
                    <button
                      key={item.src}
                      type="button"
                      className="v6StackCard"
                      data-top={isTop ? "true" : "false"}
                      data-fling={isTop && flinging ? "true" : "false"}
                      style={{
                        "--pos": pos,
                        zIndex: count - pos,
                      }}
                      onClick={() => (isTop ? cycleStack() : setActive(idx))}
                    >
                      <div className="v6StackMedia">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 768px) 82vw, 380px"
                          style={{ objectFit: "cover", objectPosition: item.position }}
                        />
                      </div>
                      <div className="v6StackBar">
                        <small>{String(idx + 1).padStart(2, "0")} / 05</small>
                        <strong>{item.title}</strong>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="v6StackReadout">
                <span className="v6Kicker">
                  CARD {String(active + 1).padStart(2, "0")} OF 05
                </span>
                <h3>{gallery[active].title}</h3>
                <p>{gallery[active].caption}</p>
                <div className="v6StackActions">
                  <button type="button" className="v6GlassBtn isPrimary" onClick={cycleStack}>
                    Deal next print ↻
                  </button>
                  <button type="button" className="v6GlassBtn" onClick={() => setLightbox(active)}>
                    Inspect full frame ↗
                  </button>
                </div>
                <div className="v6StackThumbs">
                  {gallery.map((item, idx) => (
                    <button
                      key={item.src}
                      type="button"
                      className="v6StackThumb"
                      aria-current={idx === active ? "true" : undefined}
                      onClick={() => setActive(idx)}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="64px"
                        style={{ objectFit: "cover", objectPosition: item.position }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              STUDY 04 — KINETIC INFINITE GLASS FILMSTRIP
              =============================================================== */}
          {study === "marquee" && (
            <div className="v6MarqueeWrap">
              <div className="v6MarqueeTrack">
                {[...gallery, ...gallery].map((item, i) => {
                  const realIdx = i % count;
                  return (
                    <button
                      key={`${item.src}-${i}`}
                      type="button"
                      className="v6MarqueeCard"
                      onClick={() => setLightbox(realIdx)}
                    >
                      <div className="v6MarqueeMedia">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="300px"
                          style={{ objectFit: "cover", objectPosition: item.position }}
                        />
                      </div>
                      <div className="v6MarqueeCap">
                        <small>{String(realIdx + 1).padStart(2, "0")}</small>
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.caption}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===============================================================
              STUDY 05 — MAGNETIC CURSOR-TRAIL EDITORIAL INDEX
              =============================================================== */}
          {study === "trail" && (
            <div
              ref={trailStageRef}
              className="v6TrailStage"
              onPointerMove={handleTrailMove}
              onPointerEnter={() => setTrailHovering(true)}
              onPointerLeave={() => setTrailHovering(false)}
            >
              <div className="v6TrailList">
                {gallery.map((item, idx) => (
                  <button
                    key={item.src}
                    type="button"
                    className="v6TrailRow"
                    data-active={trailIdx === idx ? "true" : "false"}
                    onPointerEnter={() => setTrailIdx(idx)}
                    onFocus={() => setTrailIdx(idx)}
                    onClick={() => setLightbox(idx)}
                  >
                    <small>{String(idx + 1).padStart(2, "0")}</small>
                    <strong>{item.title}</strong>
                    <span>{item.caption}</span>
                    <i>Inspect ↗</i>
                  </button>
                ))}
              </div>

              {/* Floating velocity-tilted frosted glass print */}
              <div
                className="v6TrailFloat"
                data-show={trailHovering ? "true" : "false"}
                style={{
                  transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) translate(-50%, -55%) rotate(${trailPos.rot}deg)`,
                }}
                aria-hidden="true"
              >
                <div className="v6TrailFloatInner">
                  <Image
                    src={gallery[trailIdx].src}
                    alt=""
                    fill
                    sizes="280px"
                    style={{
                      objectFit: "cover",
                      objectPosition: gallery[trailIdx].position,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FROSTED GLASS FULL-FRAME LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="v6LabLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={gallery[lightbox].title}
          onClick={() => setLightbox(null)}
        >
          <div className="v6LabLightboxCard" onClick={(e) => e.stopPropagation()}>
            <div className="v6LabLightboxTop">
              <span>
                PLATE {String(lightbox + 1).padStart(2, "0")} / 05
              </span>
              <button type="button" onClick={() => setLightbox(null)}>
                Close ×
              </button>
            </div>
            <div className="v6LabLightboxImg">
              <Image
                src={gallery[lightbox].src}
                alt={gallery[lightbox].alt}
                fill
                sizes="90vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="v6LabLightboxFoot">
              <div>
                <strong>{gallery[lightbox].title}</strong>
                <span>{gallery[lightbox].caption}</span>
              </div>
              <div className="v6LabLightboxNav">
                <button type="button" className="v6GlassBtn" onClick={() => setLightbox((i) => (i - 1 + count) % count)}>
                  ←
                </button>
                <button type="button" className="v6GlassBtn" onClick={() => setLightbox((i) => (i + 1) % count)}>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
