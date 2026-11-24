"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";

const navItems = [
  ["Field Notes", "notes"],
  ["Builds", "works"],
  ["Craft", "craft"],
  ["Path", "path"],
  ["Off Screen", "offscreen"],
  ["Contact", "contact"],
];

export function V5Header() {
  const drawerId = useId();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const d = drawerRef.current;
    if (!d) return;
    if (open && !d.open) {
      document.body.style.overflow = "hidden";
      d.showModal();
    } else if (!open && d.open) {
      document.body.style.overflow = "";
      d.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="v5Header">
        <div className="v5Wrap v5HeaderInner">
          <a className="v5Brand" href="#main">
            <span className="v5PetalDot" aria-hidden="true" />
            <strong>Shweta Sharma</strong>
            <em>Folio ’26</em>
          </a>

          <nav className="v5Nav" aria-label="Primary navigation">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="v5HeaderRight">
            <div className="v5VersionPill" aria-label="Portfolio versions">
              <Link href="/v1">v1</Link>
              <Link href="/v2">v2</Link>
              <Link href="/v3">v3</Link>
              <Link href="/v4">v4</Link>
              <span aria-current="page">v5</span>
            </div>
            <a
              className="v5HeaderResume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé ↗
            </a>
            <button
              type="button"
              className="v5MenuBtn"
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
        className="v5Drawer"
        onCancel={() => setOpen(false)}
      >
        <div className="v5DrawerTop">
          <span>SHWETA SHARMA · V5</span>
          <button type="button" onClick={() => setOpen(false)}>
            Close ×
          </button>
        </div>
        <nav className="v5DrawerNav" aria-label="Mobile navigation">
          {navItems.map(([label, id], i) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="v5DrawerFoot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="v5DrawerVersions">
            <Link href="/v1">v1</Link>
            <Link href="/v2">v2</Link>
            <Link href="/v3">v3</Link>
            <Link href="/v4">v4</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
