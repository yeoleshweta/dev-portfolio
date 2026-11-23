"use client";
import { useEffect, useRef } from "react";

// A quiet continuation of the sculpture after the original project stage.
export function CarbonContinuation() {
  const host = useRef(null);
  useEffect(() => {
    let dispose, cancelled = false, frame = 0, visible = false;
    const root = document.querySelector(".carbonPreview main"), gallery = root?.querySelector("#gallery"), contact = root?.querySelector("#contact"), story = root?.querySelector(".continuousPortfolio");
    if (!root || !gallery || !contact || !story) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let progress = 1, last = -1;
    import("@/lib/visuals/createSculpture").then(({ createSculpture }) => {
      if (cancelled) return;
      try { dispose = createSculpture(host.current, () => progress, () => preference.matches); } catch { host.current.dataset.failed = "true"; }
    });
    function tick() {
      frame = 0;
      if (!visible || document.hidden) return;
      const g = gallery.getBoundingClientRect(), c = contact.getBoundingClientRect(), s = story.getBoundingClientRect();
      const onGallery = Math.max(0, Math.min(1, (innerHeight * .8 - g.top) / Math.max(1, innerHeight * .9)));
      const onContact = Math.max(0, Math.min(1, (innerHeight * .85 - c.top) / Math.max(1, innerHeight)));
      const target = .98 - onGallery * .33 - onContact * .65;
      progress = preference.matches ? (onContact > .5 ? 0 : onGallery > .5 ? .65 : 1) : progress + (target - progress) * .1;
      const show = s.bottom < innerHeight * .85 && c.bottom > 0;
      host.current.dataset.visible = show;
      host.current.dataset.contact = onContact > .2;
      if (Math.abs(progress - last) > .002) { host.current.style.setProperty("--continuation-progress", progress.toFixed(3)); last = progress; }
      frame = requestAnimationFrame(tick);
    }
    const start = () => { if (visible && !frame && !document.hidden) frame = requestAnimationFrame(tick); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; } });
    observer.observe(root);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { cancelled = true; cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); dispose?.(); };
  }, []);
  return <div ref={host} className="carbonContinuation" aria-hidden="true" />;
}
