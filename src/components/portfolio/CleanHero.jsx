"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";

const lenses = [
  {
    id: "interfaces",
    num: "01",
    label: "Interfaces",
    src: "/urbanfit.jpg",
    alt: "Urbanfit Control Panel multi-role workspace",
    caption: "Urbanfit Control Panel — 30 screens, 484 interactions across 3 roles",
    href: "/work/urbanfit/",
  },
  {
    id: "ml",
    num: "02",
    label: "Applied ML",
    src: "/abim.jpg",
    alt: "ABIM Clinical Communication NLP evaluation",
    caption: "ABIM & Bias Checker — RoBERTa + LoRA, GPT-4o & clinical NLP frameworks",
    href: "/work/clinical-communication/",
  },
  {
    id: "fullstack",
    num: "03",
    label: "Fullstack",
    src: "/gesturepro.jpg",
    alt: "GesturePro webcam hand-landmark system",
    caption: "GesturePro & PocketSaver — Next.js, FastAPI, Node.js, PostgreSQL & Docker",
    href: "/work/gesturepro/",
  },
  {
    id: "research",
    num: "04",
    label: "Research",
    src: "/mountains.jpg",
    alt: "Shweta Sharma at Grace Hopper Celebration 2025",
    caption: "John Deere & Capita — −60% survey setup across 250+ products, +11% conversion",
    href: "#experience",
  },
];

/**
 * Serene, high-agency daylight hero with ONE singular living aperture.
 * Zero distracting background trails or looping animations — motion happens
 * only with intentional interaction via the 4 discipline lenses.
 */
export function CleanHero() {
  const [active, setActive] = useState(0);
  const current = lenses[active];

  return (
    <section className="hookHero">
      <div className="atelierWrap hookHeroInner">
        <div className="hookTopMeta">
          <span>FOLIO ’26 — FULLSTACK &amp; APPLIED ML</span>
          <span>PHILADELPHIA, PA · MS AI &amp; ML (3.97 GPA)</span>
        </div>

        {/* Monumental 3-line editorial composition with ONE singular focal aperture */}
        <div className="hookTypeStage">
          <h1
            className="hookHeadline"
            aria-label="Shweta Sharma builds systems where craft meets AI."
          >
            <span className="hookRow" style={{ "--i": 0 }}>
              <span className="hookWord">SHWETA</span>
              <span className="hookWord hookSerif">
                <em>Sharma</em>
              </span>
            </span>

            <span className="hookRow" style={{ "--i": 1 }}>
              <span className="hookWord">BUILDS</span>
              <Link
                href={current.href}
                className="singularAperture"
                data-cursor="OPEN"
                aria-label={`Inspect ${current.label}: ${current.caption}`}
              >
                {lenses.map((lens, idx) => (
                  <span
                    key={lens.id}
                    className="apertureLayer"
                    data-active={idx === active}
                    aria-hidden={idx !== active}
                  >
                    <Image
                      src={lens.src}
                      alt={lens.alt}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 960px) 180px, 340px"
                    />
                  </span>
                ))}
              </Link>
              <span className="hookWord">SYSTEMS</span>
            </span>

            <span className="hookRow" style={{ "--i": 2 }}>
              <span className="hookWord hookSerif">
                <em>where</em>
              </span>
              <span className="hookWord">CRAFT</span>
              <span className="hookWord hookAccent">
                <em>meets AI.</em>
              </span>
            </span>
          </h1>

          {/* Quiet interactive lens selector that drives the singular aperture */}
          <div className="heroLensDock">
            <div className="heroLensTabs" role="tablist" aria-label="Preview discipline in aperture">
              {lenses.map((lens, idx) => (
                <button
                  key={lens.id}
                  type="button"
                  role="tab"
                  aria-selected={active === idx}
                  className="heroLensTab"
                  onMouseEnter={() => setActive(idx)}
                  onFocus={() => setActive(idx)}
                  onClick={() => setActive(idx)}
                >
                  <span>{lens.num}</span>
                  <strong>{lens.label}</strong>
                </button>
              ))}
            </div>
            <p className="heroLensCaption" key={current.id}>
              {current.caption}
            </p>
          </div>
        </div>

        {/* Clean architectural bottom strip */}
        <div className="hookBottomBar">
          <div className="hookStats">
            <div>
              <small>EXPERIENCE</small>
              <strong>6+ yrs across ABIM, John Deere, Urbanfit &amp; Capita</strong>
            </div>
            <div>
              <small>STACK</small>
              <strong>React · Next.js · Python · FastAPI · PyTorch / TensorFlow</strong>
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
