"use client";
import { useState } from "react";
import { Cinematic3DHero } from "@/components/motion/Cinematic3DHero";
import { profile } from "@/content/profile";

const cameraModes = [
  { id: 0, num: "01", label: "Core", note: "Human × Interface × Applied ML" },
  { id: 1, num: "02", label: "Orbit", note: "End-to-End Fullstack Architecture" },
  { id: 2, num: "03", label: "Topology", note: "RoBERTa + LoRA · FastAPI · Next.js" },
];

/**
 * Full-bleed Cinematic 3D Hero.
 * Minimal HUD overlays frame the interactive Three.js glass-prism sanctuary
 * with 3 live camera-angle presets, click-and-drag orbit, and scroll fly-through.
 */
export function CleanHero() {
  const [cameraPreset, setCameraPreset] = useState(0);
  const activeMode = cameraModes[cameraPreset];

  return (
    <section id="hero" className="cinemaHero">
      <Cinematic3DHero cameraPreset={cameraPreset} />
      <div className="cinemaVignette" aria-hidden="true" />

      <div className="atelierWrap cinemaHeroHud">
        <div className="cinemaTopRow">
          <span>SHWETA SHARMA // FOLIO ’26</span>
          <span className="cinemaTelemetry">{activeMode.note.toUpperCase()}</span>
          <span>PHILADELPHIA, PA · 3.97 GPA</span>
        </div>

        <div className="cinemaBottomRow">
          <div className="cinemaIdentity">
            <p className="cinemaEyebrow">FULLSTACK ENGINEER · UX RESEARCHER · APPLIED ML</p>
            <h1 className="cinemaTitle">
              Shweta <em>Sharma</em>
            </h1>
            <p className="cinemaLead">
              Turning complex data and machine learning into calm, human-centered
              software — from interface to API.
            </p>
            <div className="cinemaActions">
              <a className="cinemaBtnPrimary" href="#works" data-cursor="WORKS">
                Explore selected works <span aria-hidden="true">↓</span>
              </a>
              <a
                className="cinemaBtnLink"
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Résumé (PDF) ↗
              </a>
            </div>
          </div>

          <div className="cinemaCameraDock">
            <span className="cinemaDockLabel">CAMERA ANGLE · DRAG SCENE TO ORBIT</span>
            <div className="cinemaCameraTabs" role="tablist" aria-label="3D camera angle">
              {cameraModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={cameraPreset === m.id}
                  onClick={() => setCameraPreset(m.id)}
                >
                  <span>{m.num}</span>
                  <strong>{m.label}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
