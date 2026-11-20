"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Work", "work"],
  ["Skills", "skills"],
  ["Experience", "experience"],
  ["About", "about"],
  ["Gallery", "gallery"],
  ["Contact", "contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    return () => {
      document.body.style.overflow = previous;
      dialog.current?.close();
      toggle.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <header className="siteHeader wrap">
        <Link className="siteBrand" href="/#main" aria-label="Shweta Sharma, home">
          <span className="brandSeal" aria-hidden="true"><i>s.</i></span>
          <span className="brandIdentity">
            <strong>Shweta Sharma</strong>
            <span>Full-stack developer</span>
          </span>
        </Link>
        <nav className="desktopNav" aria-label="Main navigation">
          {links.map(([label, id]) => (
            <Link key={id} href={`/#${id}`} className={id === "contact" ? "navContact" : undefined}>
              <span>{label}</span>
              {id === "contact" && <i aria-hidden="true">↗</i>}
            </Link>
          ))}
        </nav>
        <button
          ref={toggle}
          className="menuToggle"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span className="menuLabel">Menu</span>
          <span className="menuGlyph" aria-hidden="true"><span /><span /></span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="menuOverlay"
        aria-labelledby="mobile-menu-title"
        onCancel={() => setOpen(false)}
      >
        <div className="menuOverlayTop">
          <span className="menuSignature" aria-hidden="true">s.</span>
          <button
            className="menuToggle isOpen"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <span className="menuLabel">Close</span>
            <span className="menuGlyph" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
        <p className="eyebrow" id="mobile-menu-title">Explore the portfolio</p>
        <nav aria-label="Mobile navigation">
          {links.map(([label, id], index) => (
            <Link
              style={{ "--index": index }}
              key={id}
              href={`/#${id}`}
              onClick={() => setOpen(false)}
            >
              <small>0{index + 1}</small>
              {label}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}
