"use client";

import { useId, useState } from "react";
import { RevealHeading } from "@/components/motion/RevealHeading";

export function ContactInvitation({ profile }) {
  const pathId = useId();
  const [copy, setCopy] = useState("Copy email");
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopy("Email copied"); }
    catch { setCopy("Select and copy the email"); }
  }
  return (
    <section id="contact" className="contactInvitation">
      <div className="wrap">
        <div className="invitationStatus"><span><i/>Open to full-stack opportunities</span><span>Philadelphia · Open to relocate</span></div>
        <div className="invitationComposition">
          <div><p className="eyebrow">07 / The next chapter</p><RevealHeading lines={["Thoughtful people.", "Ambitious things."]} italic={1}/><p className="invitationNote">I’m looking for a team that cares how it works<br className="desktopBreak"/> and how it feels to use.</p></div>
          <a className="contactOrbit" href={`mailto:${profile.email}`} aria-label="Let’s talk — email Shweta" data-magnetic data-reveal="turn">
            <svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id={pathId} d="M100,100m-80,0a80,80 0 1,1 160,0a80,80 0 1,1-160,0"/></defs><circle cx="100" cy="100" r="97"/><text><textPath href={`#${pathId}`} textLength="500">LET’S MAKE SOMETHING MEANINGFUL · </textPath></text></svg>
            <span aria-hidden="true">↗</span><small>Let’s talk</small>
          </a>
        </div>
        <div className="invitationActions"><a href={`mailto:${profile.email}`}>{profile.email}<span aria-hidden="true">↗</span></a><button onClick={copyEmail} data-magnetic><span aria-live="polite">{copy}</span><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="2"/><path d="M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg></button></div>
        <div className="invitationFoot"><span>GOOD WORK STARTS WITH A CONVERSATION.</span><div><a href={profile.resume} target="_blank" rel="noreferrer">Résumé ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a></div></div>
      </div>
    </section>
  );
}
