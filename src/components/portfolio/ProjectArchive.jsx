"use client";
import { useRef, useState } from "react";
import { ProjectViewModal } from "@/components/portfolio/ProjectViewModal";

const pad = (value) => String(value).padStart(2, "0");

export function ProjectArchive({ projects }) {
  const [selected, setSelected] = useState(null);
  const trigger = useRef(null);

  function open(index, element) {
    trigger.current = element;
    setSelected(index);
  }

  return (
    <>
      <div className="projectArchive" aria-label="More projects">
        {projects.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className="archiveRow"
            onClick={(event) => open(index, event.currentTarget)}
            aria-haspopup="dialog"
          >
            <span className="archiveRowNumber">{pad(index + 1)}</span>
            <span className="archiveRowName">{item.title}</span>
            <span className="archiveRowType">{item.type}</span>
            <span className="archiveRowArrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <ProjectViewModal
        projects={projects}
        selectedIndex={selected}
        onSelectIndex={setSelected}
        onClose={() => setSelected(null)}
        triggerRef={trigger}
      />
    </>
  );
}
