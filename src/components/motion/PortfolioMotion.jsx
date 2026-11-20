"use client";

import { useLayoutEffect } from "react";

/** Progressive enhancement: no scroll hijacking and no animation render loop. */
export function PortfolioMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector("main#main");
    if (!root) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reveals = [...root.querySelectorAll("[data-reveal]")];
    const entries = new IntersectionObserver((changes) => {
      changes.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.visible = "true";
        entries.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    for (const element of reveals) {
      const rect = element.getBoundingClientRect();
      element.dataset.visible = preference.matches || rect.top < innerHeight * .9 ? "true" : "false";
      if (element.dataset.visible === "false") entries.observe(element);
    }
    root.dataset.motionReady = "true";

    let active = null, bounds = null, frame = 0, x = 0, y = 0;
    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      active?.style.removeProperty("--pointer-x");
      active?.style.removeProperty("--pointer-y");
      active = null;
    }
    function move(event) {
      if (preference.matches || !fine.matches || event.pointerType === "touch") return;
      const target = event.target.closest?.("[data-magnetic], [data-depth]");
      if (!target || !root.contains(target)) return clear();
      if (active !== target) {
        clear();
        active = target;
        bounds = active.getBoundingClientRect();
      }
      x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
      y = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        active?.style.setProperty("--pointer-x", x.toFixed(3));
        active?.style.setProperty("--pointer-y", y.toFixed(3));
      });
    }
    function exit(event) {
      if (!active?.contains(event.relatedTarget)) clear();
    }
    function reduce() {
      clear();
      if (preference.matches) reveals.forEach((element) => { element.dataset.visible = "true"; });
    }
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerout", exit);
    preference.addEventListener("change", reduce);
    return () => {
      clear();
      entries.disconnect();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerout", exit);
      preference.removeEventListener("change", reduce);
      delete root.dataset.motionReady;
    };
  }, []);
  return null;
}
