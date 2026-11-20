"use client";
import { useEffect, useRef, useState } from "react";

export function SignalSculpture({ progress, reduced }) {
  const host = useRef(null);
  const preference = useRef(reduced);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    preference.current = reduced;
  }, [reduced]);
  useEffect(() => {
    let cancelled = false,
      dispose;
    import("@/lib/visuals/createSculpture")
      .then(({ createSculpture }) => {
        if (cancelled) return;
        try {
          dispose = createSculpture(
            host.current,
            () => progress.current,
            () => preference.current,
          );
          setReady(true);
        } catch {
          setReady(false);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [progress]);
  return (
    <div
      ref={host}
      className="signalSculpture"
      data-ready={ready}
      role="img"
      aria-label="One continuous metallic ribbon transforms into a dashboard frame, a hand-landmark network, a conversation waveform, a Bias Checker lens, and a PocketSaver forecast curve as the project story unfolds."
    >
      <div className="sculptureFallback" aria-hidden="true">
        <i />
        <i />
        <i />
        <b />
      </div>
    </div>
  );
}
