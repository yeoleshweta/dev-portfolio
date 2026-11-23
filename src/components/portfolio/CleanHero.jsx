"use client";
import { Cinematic3DHero } from "@/components/motion/Cinematic3DHero";
import { profile } from "@/content/profile";

/**
 * Text-first Cinematic Hero.
 * Commands attention immediately with sharp editorial typography and concrete
 * career proof, while the Three.js 3D scene provides subtle atmospheric depth
 * in the background.
 */
export function CleanHero() {
  return (
    <section id="hero" className="cinemaHero">
      <Cinematic3DHero />
      <div className="cinemaVignette" aria-hidden="true" />

      <div className="atelierWrap cinemaHeroHud">
        <div className="cinemaMainBlock">
          <p className="cinemaEyebrow">
            SHWETA SHARMA — FULLSTACK ENGINEER &amp; APPLIED ML · PHILADELPHIA, PA
          </p>

          <h1 className="cinemaTitle">
            <span className="cinemaLine" style={{ "--i": 0 }}>
              <span>I design the interface,</span>
            </span>
            <span className="cinemaLine" style={{ "--i": 1 }}>
              <span>architect the API,</span>
            </span>
            <span className="cinemaLine" style={{ "--i": 2 }}>
              <span>
                <em>and evaluate the model.</em>
              </span>
            </span>
          </h1>

          <p className="cinemaLead">
            Six years leading UX research and product design across 250+
            products, paired with an MS in AI &amp; Machine Learning (3.97 GPA).
            I own fullstack products where complex data feels effortless to use.
          </p>

          <div className="cinemaActions">
            <a className="cinemaBtnPrimary" href="#works" data-cursor="WORKS">
              Selected works <span aria-hidden="true">↓</span>
            </a>
            <a
              className="cinemaBtnLink"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé (PDF) ↗
            </a>
            <a
              className="cinemaBtnLink"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="cinemaProofStrip">
          <div>
            <small>RECENT</small>
            <strong>American Board of Internal Medicine</strong>
            <span>Clinical NLP &amp; solo-built Bias Checker AI</span>
          </div>
          <div>
            <small>SHIPPED IMPACT</small>
            <strong>John Deere · Urbanfit · Capita</strong>
            <span>−60% setup · +35% engagement · +11% conversion</span>
          </div>
          <div>
            <small>EDUCATION</small>
            <strong>Drexel University (2024–2026)</strong>
            <span>MS Computer Science, AI &amp; ML · 3.97 / 4.0 GPA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
