"use client";

import { useEffect, useState } from "react";

export function SystemNotes({ system }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (active === system.nodes.length - 1) setRunning(false);
      else setActive(active + 1);
    }, 900);
    return () => clearTimeout(timer);
  }, [active, running, system.nodes.length]);
  function trace() {
    if (running) { setRunning(false); return; }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive((active + 1) % system.nodes.length);
      return;
    }
    setActive(0);
    setRunning(true);
  }
  return (
    <details className="chapterArchitecture" onToggle={event => { if (!event.currentTarget.open) setRunning(false); }}>
      <summary><span>Inside the architecture</span><span aria-hidden="true">+</span></summary>
      <div className="architectureWalkthrough">
        <div className="traceToolbar"><span>FOLLOW THE FLOW / 0{active + 1}</span><button onClick={trace}>{running ? "Pause" : "Trace the flow"}<i aria-hidden="true">{running ? "Ⅱ" : "→"}</i></button></div>
        <div className="chapterArchitectureBody" style={{ "--trace-progress": (active + 1) / system.nodes.length }}>
          {system.nodes.map((node, index) => (
            <div key={node.title} className="traceNode" data-active={active === index} style={{ "--node-index": index }}>
              <button className="traceNumber" aria-label={`Highlight step ${index + 1}: ${node.title}`} aria-pressed={active === index} onClick={() => { setRunning(false); setActive(index); }}>0{index + 1}</button>
              <div><strong>{node.title}</strong><code>{node.technology}</code><p>{node.detail}</p></div>
            </div>
          ))}
        </div>
        <span className="traceFootnote">Architecture walkthrough · select any step</span>
      </div>
    </details>
  );
}
