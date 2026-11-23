"use client";
import { useEffect, useRef, useState } from "react";

export function ProjectArchive({ projects }) {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null), trigger = useRef(null), closeButton = useRef(null);
  const project = selected === null ? null : projects[selected];
  useEffect(() => {
    if (selected === null) return;
    const element = dialog.current;
    if (!element.open) {
      const previous = document.body.style.overflow;
      element.dataset.previousOverflow = previous;
      document.body.style.overflow = "hidden";
      element.showModal();
      closeButton.current?.focus();
    }
  }, [selected]);
  useEffect(() => {
    const element = dialog.current;
    return () => {
      if (element?.open) {
        document.body.style.overflow = element.dataset.previousOverflow || "";
        element.close();
      }
    };
  }, []);
  function close() {
    const element = dialog.current;
    document.body.style.overflow = element.dataset.previousOverflow || "";
    if (element.open) element.close();
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  }
  function open(index, element) { trigger.current = element; setSelected(index); }
  function change(index) { setSelected(index); dialog.current.querySelector(".archiveModalScroll")?.scrollTo({ top: 0, behavior: "instant" }); }
  return <>
    <div className="projectArchive" aria-label="More projects">
      {projects.map((item, index) => <button key={item.title} className="archiveRow" onClick={event => open(index, event.currentTarget)} aria-haspopup="dialog">
        <span className="archiveRowNumber">{String(index + 1).padStart(2, "0")}</span><span className="archiveRowName">{item.title}</span><span className="archiveRowType">{item.type}</span><span className="archiveRowArrow" aria-hidden="true">↗</span>
      </button>)}
    </div>
    <dialog ref={dialog} className="archiveModal" aria-labelledby="archive-modal-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {project && <div className="archiveModalScroll">
        <div className="archiveModalTop"><span>PROJECT INDEX / {String(selected + 1).padStart(2, "0")}</span><button ref={closeButton} onClick={close} aria-label="Close project details">CLOSE <i aria-hidden="true">×</i></button></div>
        <div className="archiveModalHero"><div><span className="archiveModalCategory">{project.type}</span><h2 id="archive-modal-title">{project.title}</h2><p>{project.description}</p></div><div className="archiveModalMark" aria-hidden="true"><span>SS / PROJECT INDEX</span><strong>{String(selected + 1).padStart(2, "0")}</strong><i>↗</i></div></div>
        <div className="archiveModalBody"><div className="archiveModalFacts"><span>PROJECT NOTES</span><dl><div><dt>Context</dt><dd>{project.type}</dd></div><div><dt>Tools &amp; practice</dt><dd>{project.stack}</dd></div></dl>{project.href && <a href={project.href} className="archiveCaseLink">VIEW CASE STUDY <i aria-hidden="true">↗</i></a>}</div><div className="archiveModalImages" aria-label="Project images">{[0, 1].map(index => project.images?.[index] ? <figure className="archiveProjectImage" key={index}><img src={project.images[index].src} alt={project.images[index].alt} /><figcaption>{project.images[index].caption}</figcaption></figure> : <div className={`archivePlaceholder ${index === 0 ? "archivePlaceholderMain" : "archivePlaceholderDetail"}`} key={index}><span>{index === 0 ? "01 / PROJECT IMAGE" : "02 / DETAIL"}</span>{index === 0 ? <div className="placeholderArtwork" aria-hidden="true"><i/><i/><i/></div> : <div className="placeholderLines" aria-hidden="true"><i/><i/><i/></div>}<small>IMAGE PLACEHOLDER</small></div>)}</div></div>
        <div className="archiveModalBottom"><span>{String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><div><button disabled={selected === 0} onClick={() => change(selected - 1)}>← PREVIOUS</button><button disabled={selected === projects.length - 1} onClick={() => change(selected + 1)}>NEXT →</button></div></div>
      </div>}
    </dialog>
  </>;
}
