"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";

const navLinks = [
  ["Impact", "impact"],
  ["Works", "works"],
  ["Radar", "radar"],
  ["Trajectory", "trajectory"],
  ["Off Screen", "offscreen"],
  ["Contact", "contact"],
];

export function V4Header() {
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
      <header className="v4DockWrap">
        <div className="v4Dock">
          <a className="v4Monogram" href="#main" aria-label="Shweta Sharma, top">
            <i>S.</i>
            <span>SHWETA SHARMA</span>
          </a>

          <nav className="v4DockNav" aria-label="Primary navigation">
            {navLinks.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="v4DockRight">
            <div className="v4Versions" aria-label="Portfolio versions">
              <Link href="/v1">v1</Link>
              <Link href="/v2">v2</Link>
              <Link href="/v3">v3</Link>
              <span aria-current="page">v4</span>
            </div>
            <a
              className="v4DockResume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé ↗
            </a>
            <button
              type="button"
              className="v4DockMenu"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={drawerRef}
        id={drawerId}
        className="v4Drawer"
        onCancel={() => setOpen(false)}
      >
        <div className="v4DrawerTop">
          <span>SHWETA SHARMA / V4</span>
          <button type="button" onClick={() => setOpen(false)}>
            Close ×
          </button>
        </div>
        <nav className="v4DrawerNav" aria-label="Mobile navigation">
          {navLinks.map(([label, id], i) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="v4DrawerFoot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="v4DrawerVers">
            <Link href="/v1">v1</Link>
            <Link href="/v2">v2</Link>
            <Link href="/v3">v3</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
