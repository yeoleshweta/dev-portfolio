"use client";
import { useEffect, useRef, useState } from "react";

export function SignalSculpture({ progress, reduced, active }) {
  const host = useRef(null);
  const preference = useRef(reduced);
  const interaction = useRef({ x: 0, y: 0, wire: false });
  const drag = useRef(null);
  const [ready, setReady] = useState(false);
  const [wire, setWire] = useState(false);
  useEffect(() => { preference.current = reduced; }, [reduced]);
  useEffect(() => {
    let cancelled = false, dispose;
    import("@/lib/visuals/createSculpture").then(({ createSculpture }) => {
      if (cancelled) return;
      try {
        dispose = createSculpture(host.current, () => progress.current, () => preference.current, () => interaction.current);
        setReady(true);
      } catch { setReady(false); }
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => { cancelled = true; dispose?.(); };
  }, [progress]);
  function start(event) {
    if (!active || !ready || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  }
  function move(event) {
    if (!active || !drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.pointerType === "touch" ? 0 : event.clientY - drag.current.y;
    interaction.current.x = Math.max(-.9, Math.min(.9, interaction.current.x + dy * .007));
    interaction.current.y = Math.max(-1.8, Math.min(1.8, interaction.current.y + dx * .007));
    drag.current = { x: event.clientX, y: event.clientY };
  }
  function end(event) {
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function toggleWire() { interaction.current.wire = !wire; setWire(!wire); }
  function reset() { interaction.current = { x: 0, y: 0, wire: false }; setWire(false); }
  return (
    <>
      <div ref={host} className="signalSculpture" data-ready={ready} data-interactive={active && ready}
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
        role="img" aria-label="Interactive 3D ribbon. Drag to rotate, or use the view controls. The same ribbon transforms into each project visual as you scroll.">
        <div className="sculptureFallback" aria-hidden="true"><i/><i/><i/><b/></div>
      </div>
      {active && ready && <div className="sculptureTools">
        <span>DRAG TO EXPLORE</span>
        <div role="group" aria-label="3D form controls">
          <button aria-pressed={wire} onClick={toggleWire}><i aria-hidden="true">◇</i>Wireframe</button>
          <button aria-label="Rotate the 3D form" onClick={() => { interaction.current.y = interaction.current.y >= 1.5 ? -1.5 : interaction.current.y + .5; }}>↶</button>
          <button aria-label="Reset the 3D form" onClick={reset}>↺</button>
        </div>
      </div>}
    </>
  );
}
