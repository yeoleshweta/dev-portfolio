"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";

const links = [
  ["Works", "works"],
  ["Craft", "craft"],
  ["Experience", "experience"],
  ["Off Screen", "offscreen"],
  ["Contact", "contact"],
];

export function AtelierHeader({ base = "/" }) {
  const drawerId = useId();
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState("");
  const drawerRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date())
        );
      } catch {
        setClock("");
      }
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      document.body.style.overflow = "hidden";
      dialog.showModal();
    } else if (!open && dialog.open) {
      document.body.style.overflow = "";
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="atelierHeader">
        <div className="atelierHeaderInner">
          <Link className="atelierWordmark" href={`${base}#main`}>
            <strong>SHWETA SHARMA</strong>
            <span>FOLIO ’26</span>
          </Link>

          <nav className="atelierNav" aria-label="Primary navigation">
            {links.map(([label, id], i) => (
              <Link key={id} href={`${base}#${id}`}>
                <small>0{i + 1}</small>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="atelierRight">
            <span className="atelierClock">PHL {clock || "EST"}</span>
            <a
              className="atelierResume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé ↗
            </a>
            <button
              className="atelierMenuBtn"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen(true)}
            >
              Index
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={drawerRef}
        id={drawerId}
        className="atelierDrawer"
        onCancel={() => setOpen(false)}
      >
        <div className="atelierDrawerTop">
          <span>INDEX / 2026</span>
          <button onClick={() => setOpen(false)}>Close ×</button>
        </div>
        <nav className="atelierDrawerNav" aria-label="Mobile navigation">
          {links.map(([label, id], i) => (
            <Link key={id} href={`${base}#${id}`} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="atelierDrawerFoot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Résumé (PDF) ↗
          </a>
        </div>
      </dialog>
    </>
  );
}
