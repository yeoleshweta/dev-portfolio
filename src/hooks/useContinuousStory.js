"use client";
import { useEffect, useRef, useState } from "react";
import { lastStoryStage, storyStages } from "@/lib/visuals/storyStages.mjs";

const clamp = (n) => Math.max(0, Math.min(1, n));
const smooth = (n) => n * n * (3 - 2 * n);

/** One scroll coordinate drives both the persistent mesh and every UI overlay. */
export function useContinuousStory() {
  const root = useRef(null);
  const progress = useRef(0);
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const element = root.current;
    const chapters = [...element.querySelectorAll("[data-story-chapter]")];
    const visual = element.querySelector(".continuousStage");
    const compact = matchMedia("(max-width:767px)");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      visible = false,
      last = -1,
      lastPhase = -1,
      current = 0;
    function tick() {
      frame = 0;
      if (!visible || document.hidden) return;
      let stage = 0;
      const startLine = compact.matches
        ? innerHeight * 0.95
        : innerHeight * 0.65;
      const endLine = compact.matches
        ? visual.getBoundingClientRect().bottom + innerHeight * 0.15
        : Math.max(120, innerHeight * 0.14);
      const transitionDistance = Math.max(100, startLine - endLine);
      for (let i = 1; i < chapters.length; i++) {
        const t = clamp(
          (startLine - chapters[i].getBoundingClientRect().top) /
            transitionDistance,
        );
        if (t > 0) stage = i - 1 + smooth(t);
      }
      current = preference.matches
        ? Math.round(stage)
        : current + (stage - current) * 0.14;
      stage = current;
      progress.current = stage / lastStoryStage;
      if (Math.abs(stage - last) > 0.0001) {
        const currentPhase = Math.round(stage);
        if (currentPhase !== lastPhase) {
          setPhase(currentPhase);
          lastPhase = currentPhase;
        }
        element.style.setProperty("--story-stage", stage.toFixed(5));
        element.style.setProperty(
          "--story-progress",
          (stage / lastStoryStage).toFixed(5),
        );
        for (let i = 0; i < storyStages.length; i++) {
          const amount = clamp(1 - Math.abs(stage - i) * 2.5);
          element.style.setProperty(`--chapter-${i}`, amount.toFixed(5));
        }
        last = stage;
      }
      frame = requestAnimationFrame(tick);
    }
    const start = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    const visibility = () => (document.hidden ? stop() : start());
    const update = () => {
      setReduced(preference.matches);
      last = -1;
      start();
    };
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", update);
    update();
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", update);
    };
  }, []);
  return { root, progress, phase, reduced };
}
