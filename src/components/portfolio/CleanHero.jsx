"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";

const slides = [
  {
    src: "/urbanfit.jpg",
    alt: "Urbanfit Control Panel multi-role inventory workspace",
    num: "01",
    title: "Urbanfit Control Panel",
    meta: "30 screens · 484 interactions · Design Systems",
    href: "/work/urbanfit/",
  },
  {
    src: "/gesturepro.jpg",
    alt: "GesturePro webcam hand-landmark recognition prototype",
    num: "02",
    title: "GesturePro",
    meta: "21 hand landmarks · MediaPipe · TensorFlow · Next.js",
    href: "/work/gesturepro/",
  },
  {
    src: "/abim.jpg",
    alt: "Clinical Communication supervised NLP workflow at ABIM",
    num: "03",
    title: "Clinical Communication",
    meta: "Supervised NLP · Calgary-Cambridge & NURSE · ABIM",
    href: "/work/clinical-communication/",
  },
];

/**
 * Serene, ultra-clean editorial hero with a scroll-expanding architectural frame.
 * As the user scrolls, the showcase frame smoothly widens and reveals subtle inner parallax.
 */
export function CleanHero() {
  const frameRef = useRef(null);
  const imgWrapRef = useRef(null);
  const [active, setActive] = useState(0);

  // Auto-advance gentle crossfade every 5.5s (pauses on reduced motion)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  // Smooth scroll-linked width expansion + inner image parallax
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let current = 0;
    let raf = 0;

    const tick = () => {
      const target = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.65)));
      current += (target - current) * 0.1;

      if (frameRef.current) {
        const scale = 0.94 + current * 0.06;
        const radius = Math.max(0, 14 - current * 14);
        frameRef.current.style.transform = `scale(${scale.toFixed(4)})`;
        frameRef.current.style.borderRadius = `${radius.toFixed(1)}px`;
      }
      if (imgWrapRef.current) {
        const y = -current * 24;
        const imgScale = 1.06 - current * 0.04;
        imgWrapRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${imgScale.toFixed(4)})`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentSlide = slides[active];

  return (
    <section className="cleanHero">
      <div className="atelierWrap">
        <div className="cleanHeroTop">
          <div className="cleanHeroTitleCol">
            <p className="cleanEyebrow">
              SHWETA SHARMA — FULLSTACK ENGINEER &amp; APPLIED ML
            </p>
            <h1 className="cleanHeroHeadline">
              <span className="cleanLine" style={{ "--i": 0 }}>
                <span>Software shaped by</span>
              </span>
              <span className="cleanLine" style={{ "--i": 1 }}>
                <span>
                  human <em>research, craft,</em> and AI.
                </span>
              </span>
            </h1>
          </div>

          <div className="cleanHeroSide">
            <p>
              Philadelphia-based fullstack developer with six years in UX
              research &amp; product design and an MS in AI &amp; Machine
              Learning (3.97 GPA). I own products from interface to API and
              model evaluation.
            </p>
            <div className="cleanHeroActions">
              <a className="cleanActionPrimary" href="#works">
                Selected works <span aria-hidden="true">↓</span>
              </a>
              <a
                className="cleanActionLink"
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Résumé (PDF) ↗
              </a>
            </div>
          </div>
        </div>

        {/* Scroll-expanding architectural showcase frame */}
        <div ref={frameRef} className="cleanStageFrame">
          <div ref={imgWrapRef} className="cleanStageMedia">
            {slides.map((slide, idx) => (
              <div
                key={slide.src}
                className="cleanSlide"
                data-active={idx === active}
                aria-hidden={idx !== active}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 960px) 94vw, 90vw"
                />
              </div>
            ))}
          </div>

          <div className="cleanStageBar">
            <Link href={currentSlide.href} className="cleanStageCaption">
              <span className="cleanStageNum">{currentSlide.num}</span>
              <div>
                <strong>{currentSlide.title}</strong>
                <span>{currentSlide.meta}</span>
              </div>
            </Link>

            <div className="cleanStageDots" role="tablist" aria-label="Featured work preview">
              {slides.map((s, i) => (
                <button
                  key={s.num}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show ${s.title}`}
                  onClick={() => setActive(i)}
                >
                  {s.num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
