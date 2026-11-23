"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const navLinks = [
  ["Work", "work"],
  ["Skills", "skills"],
  ["Experience", "experience"],
  ["About", "about"],
];

export function SiteHeader({ base = "/" }) {
  const drawerId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [percent, setPercent] = useState(0);
  const [clock, setClock] = useState("");
  const drawerRef = useRef(null);

  useEffect(() => {
    const tickClock = () => {
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
    tickClock();
    const id = setInterval(tickClock, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
        setPercent(Math.min(100, Math.max(0, pct)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = ["work", "skills", "experience", "about", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[visible.length - 1].target.id);
      },
      { rootMargin: "-25% 0px -45% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open || !drawerRef.current) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current.showModal();
    return () => {
      document.body.style.overflow = prev;
      drawerRef.current?.close();
    };
  }, [open]);

  return (
    <>
      <header className="siteNav">
        <Link className="navBrand" href={`${base}#main`} aria-label="Shweta Sharma, home">
          <span className="navSeal" aria-hidden="true">s.</span>
          <span className="navBrandText">
            <strong>Shweta Sharma</strong>
            <span>PHL {clock || "EST"} · Fullstack &amp; ML</span>
          </span>
        </Link>

        <nav className="navLinks" aria-label="Main navigation">
          {navLinks.map(([label, id]) => (
            <Link
              key={id}
              href={`${base}#${id}`}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="navRight">
          <span className="navPercent" aria-hidden="true">
            {String(percent).padStart(2, "0")}%
          </span>
          <Link className="navCta" href={`${base}#contact`} data-cursor="TALK">
            Let’s talk ↗
          </Link>
          <button
            className="navMenuBtn"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={() => setOpen(true)}
          >
            MENU
          </button>
        </div>
      </header>

      <dialog
        ref={drawerRef}
        id={drawerId}
        className="mobileDrawer"
        onCancel={() => setOpen(false)}
      >
        <div className="drawerTop">
          <span className="navSeal" aria-hidden="true">s.</span>
          <button className="navMenuBtn" style={{ display: "inline-flex" }} onClick={() => setOpen(false)}>
            CLOSE ×
          </button>
        </div>
        <nav className="drawerNav" aria-label="Mobile navigation">
          {[...navLinks, ["Contact", "contact"]].map(([label, id], idx) => (
            <Link
              key={id}
              href={`${base}#${id}`}
              onClick={() => setOpen(false)}
            >
              <small>0{idx + 1}</small>
              {label}
            </Link>
          ))}
        </nav>
        <div className="siteFooter" style={{ padding: 0 }}>
          <span>Philadelphia, PA</span>
          <span>shwetayeolesharma@gmail.com</span>
        </div>
      </dialog>
    </>
  );
}
