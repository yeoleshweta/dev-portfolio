"use client";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf = 0;
    let active = false;

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!active) {
        active = true;
        rx = mx;
        ry = my;
        setVisible(true);
      }
      if (!raf) raf = requestAnimationFrame(tick);

      const target = e.target.closest?.(
        "[data-cursor], a, button, .signalSculpture[data-interactive='true'], .galleryCard, .archiveRow"
      );
      if (!target) {
        setMode("default");
        setLabel("");
        return;
      }
      const custom = target.getAttribute("data-cursor");
      if (custom) {
        setMode("label");
        setLabel(custom);
      } else if (target.classList.contains("signalSculpture")) {
        setMode("label");
        setLabel("DRAG");
      } else if (target.classList.contains("galleryCard")) {
        setMode("label");
        setLabel("VIEW");
      } else if (target.classList.contains("archiveRow")) {
        setMode("label");
        setLabel("OPEN");
      } else {
        setMode("pointer");
        setLabel("");
      }
    };

    const onLeave = () => {
      active = false;
      setVisible(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dot}
        className="cursorDot"
        data-mode={mode}
        aria-hidden="true"
      />
      <div
        ref={ring}
        className="cursorRing"
        data-mode={mode}
        aria-hidden="true"
      >
        {label && <span>{label}</span>}
      </div>
    </>
  );
}
