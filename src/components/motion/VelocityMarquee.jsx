"use client";
import { useEffect, useRef } from "react";

const items = [
  "FULLSTACK ENGINEERING",
  "APPLIED MACHINE LEARNING",
  "HUMAN-CENTERED INTERACTION",
  "DESIGN SYSTEMS",
  "CLINICAL NLP",
  "WEBGL & MOTION",
];

export function VelocityMarquee() {
  const track = useRef(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !track.current) return;

    let offset = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let raf = 0;
    let visible = false;

    const tick = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      lastY = currentY;
      velocity += (delta * 0.18 - velocity) * 0.1;

      offset -= 0.55 + Math.min(6, Math.max(-6, velocity));
      const width = track.current.scrollWidth / 2;
      if (width > 0) {
        if (offset <= -width) offset += width;
        if (offset > 0) offset -= width;
        track.current.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      }
      if (visible) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        lastY = window.scrollY;
        raf = requestAnimationFrame(tick);
      } else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });

    observer.observe(track.current.parentElement);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="velocityMarquee" aria-hidden="true">
      <div ref={track} className="marqueeTrack">
        {[...items, ...items].map((label, i) => (
          <span key={`${label}-${i}`}>
            {label}
            <i>✳</i>
          </span>
        ))}
      </div>
    </div>
  );
}
