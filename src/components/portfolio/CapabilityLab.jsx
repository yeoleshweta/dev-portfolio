"use client";

import { useRef, useState } from "react";
import { RevealHeading } from "@/components/motion/RevealHeading";

const names = ["Interface", "Intelligence", "Intent"];
const planeNames = ["THE EXPERIENCE", "THE ENGINE", "THE REASON"];

function LayerDrawing({ index }) {
  if (index === 0) return <svg viewBox="0 0 300 140"><rect x="20" y="15" width="260" height="110" rx="8"/><path d="M20 38h260M75 38v87M92 56h100M92 70h72M92 104h74"/><rect x="204" y="55" width="57" height="52" rx="4"/><circle cx="32" cy="27" r="2"/><circle cx="42" cy="27" r="2"/><circle cx="52" cy="27" r="2"/></svg>;
  if (index === 1) return <svg viewBox="0 0 300 140"><path d="M55 70h55m80 0h55M150 36v-9m0 86v-9"/><rect x="110" y="36" width="80" height="68" rx="12"/><path d="m136 58-12 12 12 12m28-24 12 12-12 12m-12-30-8 36"/><circle cx="43" cy="70" r="12"/><circle cx="257" cy="70" r="12"/><circle cx="150" cy="21" r="5"/><circle cx="150" cy="119" r="5"/></svg>;
  return <svg viewBox="0 0 300 140"><circle cx="150" cy="70" r="48"/><circle cx="150" cy="70" r="31"/><circle cx="150" cy="70" r="10"/><path d="M150 10v20m0 80v20M90 70h20m80 0h20M40 44h30M40 57h20m170 26h30m-20 13h20"/></svg>;
}

export function CapabilityLab({ disciplines }) {
  const [active, setActive] = useState(0);
  const buttons = useRef([]);
  const panel = useRef(null);

  function select(index, focus = false) {
    if (index === active) return;
    setActive(index);
    if (focus) buttons.current[index]?.focus();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panel.current?.animate([{ opacity: .15, transform: "translateY(15px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 430, easing: "cubic-bezier(.22,.75,.12,1)" });
    }
  }
  function keys(event, index) {
    const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }
  return (
    <section className="capabilitySection wrap" id="skills" aria-labelledby="skills-title">
      <div className="capabilityHeading">
        <div><p className="eyebrow">03 / Working range</p><RevealHeading id="skills-title" lines={["Across the stack.", "Close to the person."]} italic={1}/></div>
        <p>Design experience shapes how I build.<br/>Technical fluency changes the questions I can ask.</p>
      </div>
      <div className="capabilityLab" data-active={active} data-reveal="rise">
        <div className="stackVisual" aria-hidden="true">
          <div className="stackReadout"><span>ONE SYSTEM / THREE LAYERS</span><span>0{active + 1}</span></div>
          <div className="stackAssembly">
            {names.map((name, index) => <div key={name} className={`stackPlane stackPlane${index}`} data-active={index === active}>
              <div className="stackPlaneInner"><span>{planeNames[index]}<i>0{index + 1}</i></span><LayerDrawing index={index}/></div>
            </div>)}
            <div className="stackAxis"><i/><i/><i/></div>
          </div>
          <div className="stackLegend"><i/><span>{disciplines[active].note}</span><span>FORM ↔ FUNCTION</span></div>
        </div>
        <div className="capabilityExplorer">
          <div className="capabilityTabs" role="tablist" aria-label="Explore a layer of the practice">
            {names.map((name, index) => <button key={name} ref={element => { buttons.current[index] = element; }} id={`capability-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`capability-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => keys(event, index)}><small>0{index + 1}</small>{name}<i aria-hidden="true">↗</i></button>)}
          </div>
          <div ref={panel} className="capabilityPanels">
            {disciplines.map((discipline, index) => <div key={discipline.name} role="tabpanel" tabIndex={0} id={`capability-panel-${index}`} aria-labelledby={`capability-tab-${index}`} hidden={active !== index}>
              <span className="tinyLabel">{discipline.note}</span>
              <h3>{discipline.name}</h3><p>{discipline.detail}</p>
              <div className="skillTags">{discipline.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
              <a className="narrativeAction" href={discipline.href} data-magnetic>See it in {discipline.proof}<span aria-hidden="true">↗</span></a>
            </div>)}
          </div>
          <span className="capabilityFootnote">Choose a layer. See what connects.</span>
        </div>
      </div>
      <noscript><div className="capabilityFallback">{disciplines.slice(1).map(item=><article key={item.name}><h3>{item.name}</h3><p>{item.detail}</p><p>{item.tools.join(" · ")}</p><a href={item.href}>See it in {item.proof} ↗</a></article>)}</div></noscript>
    </section>
  );
}
