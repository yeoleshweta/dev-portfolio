"use client";
import { useScrollScene } from "@/hooks/useScrollScene";
import { SignalSculpture } from "./SignalSculpture";

const chapters = [
  {
    label: "Observe",
    title: "Find the human thread.",
    text: "Start with the people inside the problem. Research reveals what matters.",
    form: "01 / The knot — many possibilities",
  },
  {
    label: "Design",
    title: "Give complexity a shape.",
    text: "Turn understanding into a clear structure, an interface, a way forward.",
    form: "02 / The halo — a clear perspective",
  },
  {
    label: "Build",
    title: "Connect it into a system.",
    text: "Bring interfaces, APIs, and models together. Keep the person in control.",
    form: "03 / The coil — ideas in motion",
  },
];

export function StoryCenterpiece() {
  const { root, progress, phase, reduced } = useScrollScene();
  const chapter = chapters[phase];
  return (
    <div
      ref={root}
      className="sculptureStory"
      data-phase={phase}
      data-reduced={reduced}
    >
      <div className="sculptureScene">
        <div className="sculptureTitle">
          <p className="eyebrow">A designer’s eye. A developer’s mind.</p>
          <h1>
            Human ideas.
            <br />
            <em>Beautifully</em>
            <br />
            engineered.
          </h1>
          <p className="sculptureIntro">
            I’m Shweta. I connect human understanding
            <br className="desktopBreak" /> with the systems that bring it to
            life.
          </p>
          <a className="textLink" href="#work">
            Explore selected work ↗
          </a>
        </div>
        <div className="sculptureObject">
          <div className="objectHalo" aria-hidden="true" />
          <SignalSculpture progress={progress} reduced={reduced} />
          <div className="objectCoordinates" aria-hidden="true">
            <span>HUMAN × MACHINE</span>
            <span>FORM / FUNCTION / FEELING</span>
          </div>
        </div>
        <div className="sculptureCaption">
          <span className="tinyLabel">{chapter.form}</span>
          <h2>{chapter.title}</h2>
          <p>{chapter.text}</p>
        </div>
        <div className="sculptureLegend">
          <span className="tinyLabel">Scroll to transform ↓</span>
          <ol aria-label="Story stages">
            {chapters.map((item, index) => (
              <li
                key={item.label}
                aria-current={phase === index ? "step" : undefined}
              >
                <span>0{index + 1}</span>
                {item.label}
              </li>
            ))}
          </ol>
          <div className="sceneMeter" aria-hidden="true">
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
