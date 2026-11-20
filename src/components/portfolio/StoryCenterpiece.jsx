'use client';
import Image from 'next/image';
import { useState } from 'react';

const chapters = [
  { label: 'Observe', title: 'Every build starts with a person.', text: 'A background in UX research taught me to look closely at how people use software.', detail: 'Research → understanding', mark: '01' },
  { label: 'Design', title: 'Give complexity a clear shape.', text: 'I turn that understanding into interfaces, workflows, and choices that make sense.', detail: 'Understanding → interaction', mark: '02' },
  { label: 'Build', title: 'Make the whole experience work.', text: 'Today, I connect those interfaces to APIs and machine learning models.', detail: 'Interaction → working software', mark: '03' },
];

export function StoryCenterpiece() {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];
  return <div className="centerpiece">
    <div className="orbitArt" aria-hidden="true"><svg viewBox="0 0 1000 570" fill="none"><ellipse cx="500" cy="285" rx="433" ry="179" transform="rotate(-17 500 285)"/><ellipse cx="500" cy="285" rx="355" ry="245" transform="rotate(23 500 285)"/><path d="M70 450C230 30 720 540 940 110"/><circle cx="138" cy="385" r="5"/><circle cx="859" cy="178" r="5"/></svg></div>
    <div className="portraitShell"><div className="portraitCore"><Image src="/shweta.jpg" alt="Shweta Sharma" width={943} height={1024} priority sizes="(max-width: 767px) 70vw, 340px"/></div><span className="portraitSignature">Shweta Sharma</span></div>
    <div className="orbitNote noteLeft"><span className="tinyLabel">The starting point</span><p>People.<br/>Always.</p><span className="noteLine"/></div>
    <div className="storyNote" aria-live="polite" aria-atomic="true"><div key={active} className="storyNoteCore"><span className="tinyLabel">{chapter.mark} / {chapter.detail}</span><h2>{chapter.title}</h2><p>{chapter.text}</p></div></div>
    <div className="chapterControls" role="group" aria-label="Explore my approach">{chapters.map((item, index) => <button key={item.label} aria-pressed={active === index} onClick={() => setActive(index)}><span>0{index + 1}</span>{item.label}<i aria-hidden="true">↗</i></button>)}</div>
  </div>;
}
