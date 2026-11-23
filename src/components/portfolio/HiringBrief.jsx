"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

export function HiringBrief({ triggerClassName = "briefTrigger" }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previous;
      trigger.current?.focus();
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        className={triggerClassName}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-cursor="BRIEF"
      >
        The 30-second brief <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialog}
        className="briefDialog"
        aria-labelledby="brief-title"
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="briefInner">
          <div className="briefTop">
            <span className="eyebrow">For your next great team member</span>
            <button
              className="briefClose"
              aria-label="Close hiring brief"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <h2 id="brief-title">
            Shweta Sharma.
            <br />
            <em>From people to systems.</em>
          </h2>
          <p className="briefIntro">
            Full-stack development, applied AI, and a career grounded in
            understanding how people use technology.
          </p>
          <dl className="briefFacts">
            <div>
              <dt>Based in</dt>
              <dd>Philadelphia, PA · Open to relocate</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>
                MS Computer Science, AI & ML
                <br />
                Drexel University · 3.97 / 4.0 GPA
              </dd>
            </div>
            <div>
              <dt>Looking for</dt>
              <dd>
                Full-stack roles with thoughtful interfaces and real product
                ownership
              </dd>
            </div>
          </dl>
          <div className="briefProof">
            <span className="tinyLabel">Three places to start</span>
            <a href="#works" onClick={() => setOpen(false)}>
              <span>
                <strong>Bias Checker</strong>Model → Flask API → Next.js
                interface
              </span>
              <i aria-hidden="true">↗</i>
            </a>
            <a href="/work/gesturepro/">
              <span>
                <strong>GesturePro</strong>Web input, ML inference, human
                correction
              </span>
              <i aria-hidden="true">↗</i>
            </a>
            <a href="/work/urbanfit/">
              <span>
                <strong>Urbanfit</strong>30 screens. A shared interaction
                system.
              </span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
          <div className="briefActions">
            <a
              className="primary"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              View résumé PDF <i aria-hidden="true">↗</i>
            </a>
            <a
              className="textLink"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a className="textLink" href={`mailto:${profile.email}`}>
              Email ↗
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
