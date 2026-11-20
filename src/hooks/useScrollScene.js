"use client";
import { useEffect, useRef, useState } from "react";

// Only the scene intersecting the viewport samples geometry. No scroll handlers,
// layout writes, or React renders per frame; transforms consume --scene-progress.
export function useScrollScene() {
  const root = useRef(null);
  const progress = useRef(0);
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const element = root.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      visible = false,
      last = -1,
      lastPhase = -1;
    let pinned = false;
    const resize = new ResizeObserver(() => {
      pinned =
        getComputedStyle(element).getPropertyValue("--scene-pinned").trim() ===
        "1";
    });
    resize.observe(element);
    const tick = () => {
      frame = 0;
      if (!visible || document.hidden || preference.matches) return;
      const bounds = element.getBoundingClientRect();
      const travel = pinned
        ? Math.max(1, bounds.height - innerHeight + 110)
        : Math.max(200, bounds.height - innerHeight * 0.35);
      const value = Math.max(
        0,
        Math.min(
          1,
          (pinned ? 90 - bounds.top : innerHeight * 0.15 - bounds.top) / travel,
        ),
      );
      progress.current = value;
      if (Math.abs(value - last) > 0.0001) {
        element.style.setProperty("--scene-progress", value.toFixed(5));
        const nextPhase = Math.min(2, Math.floor(value * 3));
        if (nextPhase !== lastPhase) {
          setPhase(nextPhase);
          lastPhase = nextPhase;
        }
        last = value;
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && visible && !document.hidden && !preference.matches)
        frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        stop();
        setPhase(1);
        progress.current = 0.5;
        element.style.setProperty("--scene-progress", ".5");
      } else {
        last = -1;
        lastPhase = -1;
        start();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    const visibility = () => {
      if (document.hidden) stop();
      else start();
    };
    observer.observe(element);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    update();
    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return { root, progress, phase, reduced };
}
