"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";

const plates = [
  {
    id: "portrait",
    num: "00",
    title: "Shweta Sharma",
    subtitle: "Fullstack Engineer · Applied ML",
    src: "/shweta.jpg",
    alt: "Portrait of Shweta Sharma",
    position: "50% 22%",
    captionLeft: "PORTRAIT / SHWETA SHARMA",
    captionRight: "MS AI & ML · 3.97 GPA",
    href: "#story",
  },
  {
    id: "urbanfit",
    num: "01",
    title: "Urbanfit Control Panel",
    subtitle: "30 screens · 484 interactions",
    src: "/urbanfit.jpg",
    alt: "Urbanfit Control Panel multi-role inventory workspace",
    position: "50% 50%",
    captionLeft: "CASE STUDY / 01",
    captionRight: "PRODUCT DESIGN · SYSTEMS",
    href: "/work/urbanfit/",
  },
  {
    id: "gesturepro",
    num: "02",
    title: "GesturePro",
    subtitle: "21 hand landmarks · Next.js + FastAPI",
    src: "/gesturepro.jpg",
    alt: "GesturePro webcam hand-landmark recognition prototype",
    position: "50% 50%",
    captionLeft: "CASE STUDY / 02",
    captionRight: "COMPUTER VISION · INTERACTION",
    href: "/work/gesturepro/",
  },
  {
    id: "clinical",
    num: "03",
    title: "Clinical Communication",
    subtitle: "ABIM · Supervised NLP frameworks",
    src: "/abim.jpg",
    alt: "Clinical Communication supervised NLP workflow at ABIM",
    position: "50% 50%",
    captionLeft: "CASE STUDY / 03",
    captionRight: "HEALTHCARE · APPLIED ML",
    href: "/work/clinical-communication/",
  },
];

/**
 * Magazine-cover 54/46 editorial split hero.
 * Left: clean Swiss typography + interactive work index.
 * Right: full-bleed portrait that smoothly wipes into each project plate on hover,
 * with subtle scroll parallax. Zero distracting idle animations.
 */
export function CleanHero() {
  const [active, setActive] = useState(0);
  const mediaWrapRef = useRef(null);
  const current = plates[active];

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!mediaWrapRef.current) return;
        const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
        mediaWrapRef.current.style.transform = `translate3d(0, ${(p * 36).toFixed(1)}px, 0) scale(${(1 + p * 0.04).toFixed(4)})`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="splitCoverHero">
      {/* LEFT HALF — WARM MUSEUM PAPER EDITORIAL TYPOGRAPHY & INDEX */}
      <div className="splitCoverLeft">
        <div className="splitCoverLead">
          <p className="splitCoverEyebrow">
            SHWETA SHARMA — PHILADELPHIA, PA
          </p>

          <h1 className="splitCoverHeadline">
            <span className="splitCoverLine" style={{ "--i": 0 }}>
              <span>Fullstack engineer</span>
            </span>
            <span className="splitCoverLine" style={{ "--i": 1 }}>
              <span>with a researcher’s</span>
            </span>
            <span className="splitCoverLine" style={{ "--i": 2 }}>
              <span>
                <em>eye for craft.</em>
              </span>
            </span>
          </h1>

          <p className="splitCoverBio">
            Six years in UX research &amp; product design, an MS in AI &amp;
            Machine Learning (3.97 GPA), and end-to-end systems from React to
            RoBERTa.
          </p>

          <div className="splitCoverActions">
            <a className="splitBtnPrimary" href="#works" data-cursor="WORKS">
              Selected works <span aria-hidden="true">↓</span>
            </a>
            <a
              className="splitBtnLink"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé (PDF) ↗
            </a>
          </div>
        </div>

        {/* Quiet Interactive Plate Index */}
        <div
          className="splitCoverIndex"
          onMouseLeave={() => setActive(0)}
          aria-label="Preview featured work"
        >
          <span className="splitIndexLabel">HOVER TO PREVIEW · CLICK TO OPEN</span>
          {plates.slice(1).map((plate, i) => {
            const idx = i + 1;
            const isSelected = active === idx;
            return (
              <Link
                key={plate.id}
                href={plate.href}
                className="splitIndexRow"
                data-active={isSelected}
                onMouseEnter={() => setActive(idx)}
                onFocus={() => setActive(idx)}
                data-cursor="OPEN"
              >
                <span className="splitIndexNum">{plate.num}</span>
                <strong className="splitIndexTitle">{plate.title}</strong>
                <span className="splitIndexSub">{plate.subtitle}</span>
                <span className="splitIndexArrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RIGHT HALF — FULL-BLEED EDITORIAL PORTRAIT / PROJECT PLATE */}
      <div className="splitCoverRight">
        <div ref={mediaWrapRef} className="splitCoverMedia">
          {plates.map((plate, idx) => (
            <div
              key={plate.id}
              className="splitMediaLayer"
              data-active={idx === active}
              aria-hidden={idx !== active}
            >
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                priority={idx === 0}
                sizes="(max-width: 960px) 100vw, 48vw"
                style={{ objectPosition: plate.position }}
              />
            </div>
          ))}
        </div>

        <div className="splitCoverCaption">
          <span>{current.captionLeft}</span>
          <span>{current.captionRight}</span>
        </div>
      </div>
    </section>
  );
}
