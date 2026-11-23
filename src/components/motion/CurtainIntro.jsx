"use client";
import { useEffect, useState } from "react";

export function CurtainIntro() {
  const [phase, setPhase] = useState("idle"); // idle -> counting -> exit -> done
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("ss-curtain-seen")) {
      setPhase("done");
      return;
    }

    setPhase("counting");
    const start = performance.now();
    const duration = 680;
    let raf = 0;

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setPhase("exit");
        sessionStorage.setItem("ss-curtain-seen", "1");
        setTimeout(() => setPhase("done"), 650);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "done" || phase === "idle") return null;

  return (
    <div
      className="curtainOverlay"
      data-phase={phase}
      aria-hidden="true"
    >
      <div className="curtainTop" />
      <div className="curtainBottom" />
      <div className="curtainContent">
        <div className="curtainBrand">
          <span className="curtainSeal">s.</span>
          <div>
            <strong>SHWETA SHARMA</strong>
            <span>FULLSTACK × APPLIED ML</span>
          </div>
        </div>
        <div className="curtainCounter">
          <span>{String(count).padStart(2, "0")}</span>
          <small>/ 100</small>
        </div>
      </div>
    </div>
  );
}
