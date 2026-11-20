"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { fitGalleryPhoto, galleryFlightFrames } from "@/lib/visuals/galleryTransition.mjs";

const timing = { duration: 820, easing: "cubic-bezier(0.22, 0.75, 0.12, 1)", fill: "both" };
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function measurePrint(button) {
  const windowElement = button.querySelector(".galleryImage");
  const image = windowElement.querySelector("img");
  let matrix = new DOMMatrix();
  for (let node = windowElement; node && node !== document.body; node = node.parentElement) {
    const transform = getComputedStyle(node).transform;
    if (transform !== "none") matrix = new DOMMatrix(transform).multiply(matrix);
  }
  const scale = Math.hypot(matrix.a, matrix.b);
  const rect = windowElement.getBoundingClientRect();
  const position = getComputedStyle(image).objectPosition.split(" ").map(parseFloat);
  const dimensions = getComputedStyle(windowElement);
  return {
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
    width: parseFloat(dimensions.width) * scale,
    height: parseFloat(dimensions.height) * scale,
    angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
    position: { x: position[0] / 100, y: position[1] / 100 },
    naturalWidth: image.naturalWidth || 900,
    naturalHeight: image.naturalHeight || 1600,
  };
}

export function useGalleryViewer(desk, count) {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const stage = useRef(null);
  const hero = useRef(null);
  const image = useRef(null);
  const session = useRef({ phase: "idle", index: null, animations: [] });

  function setPhase(phase) {
    session.current.phase = phase;
    if (dialog.current) dialog.current.dataset.phase = phase;
  }

  function cancelAnimations() {
    session.current.animations.forEach((animation) => animation.cancel());
    session.current.animations = [];
  }

  function restorePrint() {
    const saved = session.current.print;
    if (!saved) return;
    saved.button.removeAttribute("data-viewing");
    saved.button.style.transform = saved.transform;
    saved.button.style.transition = saved.transition;
    session.current.print = null;
  }

  function liftPrint(button) {
    const transform = button.style.transform;
    const transition = button.style.transition;
    const current = getComputedStyle(button).transform;
    button.style.transition = "none";
    button.style.transform = current;
    session.current.print = { button, transform, transition };
  }

  function positionHero() {
    const button = desk.current.querySelectorAll(".galleryCard")[session.current.index];
    const source = measurePrint(button);
    const target = fitGalleryPhoto(stage.current.getBoundingClientRect(), source.naturalWidth, source.naturalHeight);
    Object.assign(hero.current.style, {
      left: `${target.cx - target.width / 2}px`, top: `${target.cy - target.height / 2}px`,
      width: `${target.width}px`, height: `${target.height}px`,
    });
    return target;
  }

  function unlockScroll() {
    const saved = session.current.body;
    if (!saved) return;
    document.body.style.overflow = saved.overflow;
    document.body.style.paddingRight = saved.paddingRight;
    session.current.body = null;
  }

  function finishClose() {
    const button = session.current.print?.button;
    cancelAnimations();
    restorePrint();
    dialog.current?.close();
    unlockScroll();
    setPhase("idle");
    session.current.index = null;
    setSelected(null);
    button?.focus({ preventScroll: true });
  }

  function open(index, button) {
    if (session.current.phase !== "idle") return;
    // Stop any unfinished anchor scroll before measuring the clicked print.
    window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
    liftPrint(button);
    session.current.source = measurePrint(button);
    session.current.index = index;
    setPhase("preparing");
    setSelected(index);
  }

  function close() {
    const current = session.current;
    if (current.phase === "idle" || current.phase === "closing") return;
    if (current.phase === "preparing" || reducedMotion()) return finishClose();
    const wasOpening = current.phase === "opening";
    setPhase("closing");
    if (wasOpening) {
      // Escape during expansion reverses the flight at its current position.
      current.animations.forEach((animation) => animation.reverse());
      Promise.all(current.animations.map((animation) => animation.finished))
        .then(() => { if (session.current.phase === "closing") finishClose(); }).catch(() => {});
      return;
    }
    cancelAnimations();
    const target = positionHero();
    const destination = current.print.button.getBoundingClientRect();
    // An orientation change can move the gallery entirely outside the viewport.
    if (destination.bottom < 0 || destination.top > window.innerHeight) {
      current.print.button.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    }
    const source = measurePrint(current.print.button);
    const frames = galleryFlightFrames(source, target, source.position);
    const returning = (keyframes) => [...keyframes].reverse().map((frame, index) => ({
      ...frame, offset: index / (keyframes.length - 1),
    }));
    const options = { ...timing, duration: 660 };
    current.animations = [
      hero.current.animate(returning(frames.mask), options),
      image.current.animate(returning(frames.image), options),
    ];
    Promise.all(current.animations.map((animation) => animation.finished))
      .then(() => { if (session.current.phase === "closing") finishClose(); }).catch(() => {});
  }

  function move(direction) {
    const current = session.current;
    if (current.phase !== "open") return;
    cancelAnimations();
    restorePrint();
    const index = (current.index + direction + count) % count;
    const button = desk.current.querySelectorAll(".galleryCard")[index];
    // Keep the return destination visible in the mobile strip without moving the page.
    if (window.matchMedia("(max-width: 767px)").matches) {
      desk.current.scrollTo({ left: button.closest(".galleryPrint").offsetLeft - 20, behavior: "instant" });
    }
    liftPrint(button);
    button.dataset.viewing = "true";
    current.index = index;
    setSelected(index);
  }

  useLayoutEffect(() => {
    if (selected === null) return;
    const current = session.current;
    if (current.phase === "preparing") {
      const gutter = window.innerWidth - document.documentElement.clientWidth;
      current.body = { overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
      if (gutter > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
      document.body.style.overflow = "hidden";
      dialog.current.showModal();
      const target = positionHero();
      current.print.button.dataset.viewing = "true";
      if (reducedMotion()) {
        setPhase("open");
      } else {
        const frames = galleryFlightFrames(current.source, target, current.source.position);
        setPhase("opening");
        current.animations = [hero.current.animate(frames.mask, timing), image.current.animate(frames.image, timing)];
        Promise.all(current.animations.map((animation) => animation.finished)).then(() => {
          if (session.current.phase !== "opening") return;
          cancelAnimations();
          setPhase("open");
        }).catch(() => {});
      }
    } else if (current.phase === "open") {
      positionHero();
      if (!reducedMotion()) current.animations = [hero.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: timing.easing })];
    }
  }, [selected]); // Selection is the only React update; the flight itself stays on the compositor.

  useLayoutEffect(() => {
    function resize() {
      const phase = session.current.phase;
      if (phase === "idle" || phase === "preparing") return;
      if (phase === "closing") return finishClose();
      cancelAnimations();
      positionHero();
      setPhase("open");
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimations();
      restorePrint();
      dialog.current?.close();
      unlockScroll();
    };
  }, []);

  return { selected, dialog, stage, hero, image, open, close, move };
}
