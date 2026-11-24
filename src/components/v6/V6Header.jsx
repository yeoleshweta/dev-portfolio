"use client";
import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";

const links = [
  ["01", "Research", "research"],
  ["02", "Frontend", "frontend"],
  ["03", "Backend", "backend"],
  ["04", "AI & ML", "ai"],
  ["05", "Shipped", "works"],
  ["06", "Contact", "contact"],
];

export function V6Header({ theme = "dark", onToggleTheme }) {
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

  const isLight = theme === "light";

  return (
    <>
      <header className="v6Header">
        <div className="v6Wrap v6HeaderInner">
          <a className="v6Brand" href="#main">
            <span className="v6BrandDot" aria-hidden="true" />
            <strong>SHWETA SHARMA</strong>
            <span>PHL · FULLSTACK &amp; AI</span>
          </a>

          <nav className="v6Nav" aria-label="Primary navigation">
            {links.map(([num, label, id]) => (
              <a key={id} href={`#${id}`}>
                <small>{num}</small>
                <span>{label}</span>
              </a>
            ))}
          </nav>

          <div className="v6HeaderRight">
            <button
              type="button"
              className="v6ThemeToggle"
              onClick={onToggleTheme}
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              aria-pressed={isLight}
            >
              <span className="v6ThemeIcon" aria-hidden="true">
                {isLight ? "☾" : "☀"}
              </span>
              <span>{isLight ? "Dark" : "Light"}</span>
            </button>
            <a
              className="v6HeaderResume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Résumé ↗
            </a>
            <button
              type="button"
              className="v6MenuBtn"
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
        className="v6Drawer"
        onCancel={() => setOpen(false)}
      >
        <div className="v6DrawerTop">
          <span>SHWETA SHARMA</span>
          <button type="button" onClick={() => setOpen(false)}>
            Close ×
          </button>
        </div>
        <nav className="v6DrawerNav" aria-label="Mobile navigation">
          {links.map(([num, label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              <small>{num}</small>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="v6DrawerFoot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button
            type="button"
            className="v6ThemeToggle"
            onClick={onToggleTheme}
          >
            <span className="v6ThemeIcon" aria-hidden="true">
              {isLight ? "☾" : "☀"}
            </span>
            <span>{isLight ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </dialog>
    </>
  );
}
