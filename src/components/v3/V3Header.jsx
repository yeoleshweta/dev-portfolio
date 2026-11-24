"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";

const navItems = [
  ["01", "Works", "works"],
  ["02", "Skills", "skills"],
  ["03", "Trajectory", "experience"],
  ["04", "Off Screen", "offscreen"],
  ["05", "Contact", "contact"],
];

export function V3Header() {
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
      <header className="v3Header">
        <div className="v3Wrap v3HeaderInner">
          <a className="v3Wordmark" href="#main">
            <span className="v3PigmentDot" aria-hidden="true" />
            <strong>SHWETA SHARMA</strong>
            <span>PHL · {clock || "EST"}</span>
          </a>

          <nav className="v3Nav" aria-label="Primary navigation">
            {navItems.map(([num, label, id]) => (
              <a key={id} href={`#${id}`}>
                <small>{num}</small>
                <span>{label}</span>
              </a>
            ))}
          </nav>

          <div className="v3HeaderRight">
            <div className="v3VersionSwitch" aria-label="Portfolio versions">
              <Link href="/v1">v1</Link>
              <Link href="/v2">v2</Link>
              <span aria-current="page">v3</span>
            </div>
            <a
              className="v3HeaderResume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé ↗
            </a>
            <button
              type="button"
              className="v3MenuBtn"
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
        className="v3Drawer"
        onCancel={() => setOpen(false)}
      >
        <div className="v3DrawerTop">
          <span>SHWETA SHARMA / V3</span>
          <button type="button" onClick={() => setOpen(false)}>
            Close ×
          </button>
        </div>
        <nav className="v3DrawerNav" aria-label="Mobile navigation">
          {navItems.map(([num, label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              <small>{num}</small>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="v3DrawerFoot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="v3DrawerVersions">
            <Link href="/v1">v1</Link>
            <Link href="/v2">v2</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
