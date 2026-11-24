"use client";
import { useEffect, useRef } from "react";

const CHARS = " .:-=+*#%@";

const BLIPS = [
  { quad: 0, angle: 0.65, radius: 0.68, label: "UX" },
  { quad: 0, angle: 1.18, radius: 0.42, label: "IRR" },
  { quad: 1, angle: 2.15, radius: 0.72, label: "UI" },
  { quad: 1, angle: 2.68, radius: 0.48, label: "DS" },
  { quad: 2, angle: 3.72, radius: 0.66, label: "API" },
  { quad: 2, angle: 4.25, radius: 0.44, label: "SQL" },
  { quad: 3, angle: 5.22, radius: 0.74, label: "ML" },
  { quad: 3, angle: 5.85, radius: 0.50, label: "NLP" },
];

/**
 * AsciiRadarCanvas — OriginKit-inspired live sweeping ASCII radar display.
 * Highlights the active discipline quadrant (0..3) while continuously sweeping
 * a monospace character field with pulsing signal blips.
 */
export function AsciiRadarCanvas({ activeQuad = 0 }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(activeQuad);

  useEffect(() => {
    activeRef.current = activeQuad;
  }, [activeQuad]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let raf = 0;
    let sweep = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(240, Math.floor(rect.width * dpr));
      canvas.height = Math.max(240, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const obs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    obs.observe(canvas);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;

      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const maxR = Math.min(w, h) * 0.44;

      if (!reduced) {
        sweep = (sweep + 0.022) % (Math.PI * 2);
      }

      ctx.clearRect(0, 0, w, h);

      const cell = w < 380 ? 11 : 12;
      ctx.font = `500 ${cell - 1}px "SF Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.floor(w / cell);
      const rows = Math.floor(h / cell);
      const qActive = activeRef.current;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * cell;
          const y = (r + 0.5) * cell;
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > maxR) continue;

          const normR = dist / maxR;
          let ang = Math.atan2(dy, dx);
          if (ang < 0) ang += Math.PI * 2;

          const quad = Math.floor(ang / (Math.PI * 0.5)) % 4;
          const inActiveQuad = quad === qActive;

          // Angular distance behind the radar sweep beam
          let diff = sweep - ang;
          if (diff < 0) diff += Math.PI * 2;
          const trail = diff < 1.15 ? Math.pow(1 - diff / 1.15, 2.2) : 0;

          // Concentric range rings & crosshair axes
          const onRing =
            Math.abs(normR - 0.33) < 0.028 ||
            Math.abs(normR - 0.66) < 0.028 ||
            Math.abs(normR - 0.98) < 0.032;
          const onAxis = Math.abs(dx) < cell * 0.48 || Math.abs(dy) < cell * 0.48;

          let intensity = 0.09;
          if (onRing) intensity += 0.24;
          if (onAxis) intensity += 0.16;
          if (inActiveQuad) intensity += 0.14;
          intensity += trail * (inActiveQuad ? 0.72 : 0.42);

          // Signal blips
          for (let b = 0; b < BLIPS.length; b++) {
            const blip = BLIPS[b];
            const bx = cx + Math.cos(blip.angle) * blip.radius * maxR;
            const by = cy + Math.sin(blip.angle) * blip.radius * maxR;
            const bd = Math.hypot(x - bx, y - by);
            if (bd < cell * 1.55) {
              const boost = (1 - bd / (cell * 1.55)) * (blip.quad === qActive ? 0.95 : 0.55);
              intensity += boost;
            }
          }

          intensity = Math.min(1, intensity);
          const charIdx = Math.min(
            CHARS.length - 1,
            Math.floor(intensity * (CHARS.length - 1))
          );
          if (charIdx === 0) continue;

          if (inActiveQuad && intensity > 0.46) {
            ctx.fillStyle = `rgba(242, 159, 61, ${Math.min(0.98, intensity)})`;
          } else if (intensity > 0.58) {
            ctx.fillStyle = `rgba(244, 243, 239, ${Math.min(0.9, intensity)})`;
          } else {
            ctx.fillStyle = `rgba(199, 216, 232, ${Math.max(0.14, intensity * 0.65)})`;
          }

          ctx.fillText(CHARS[charIdx], x, y);
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="v4RadarFrame">
      <canvas ref={canvasRef} className="v4RadarCanvas" aria-label="Interactive ASCII capability radar" />
      <div className="v4RadarHud">
        <span>SIGNAL LOCK / 0{activeQuad + 1}</span>
        <span>LIVE TELEMETRY</span>
      </div>
    </div>
  );
}
