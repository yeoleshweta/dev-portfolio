"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  ["Work", "work"],
  ["Skills", "skills"],
  ["Experience", "experience"],
  ["About", "about"],
  ["Gallery", "gallery"],
  ["Contact", "contact"],
];

export function Header({ base = "/" }) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [time, setTime] = useState("");
  const progressRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setTime(formatted);
      } catch {
        setTime("");
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${pct.toFixed(4)})`;
        }
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
    const map = {
      intro: null,
      work: "work",
      gesturepro: "work",
      clinical: "work",
      "bias-checker": "work",
      pocketsaver: "work",
      skills: "skills",
      experience: "experience",
      about: "about",
      gallery: "gallery",
      contact: "contact",
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(map[visible[visible.length - 1].target.id]);
      },
      { rootMargin: "-20% 0px -45% 0px" }
    );
    Object.keys(map).forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

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
      <div className="scrollHairline" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <header className="siteHeader wrap">
        <Link className="siteBrand" href={`${base}#main`} aria-label="Shweta Sharma, home">
          <span className="brandSeal" aria-hidden="true">
            <i>s.</i>
          </span>
          <span className="brandIdentity">
            <strong>Shweta Sharma</strong>
            <span>
              Full-stack developer
              {time && <em className="brandClock"> · PHL {time}</em>}
            </span>
          </span>
        </Link>
        <nav className="desktopNav" aria-label="Main navigation">
          {links.map(([label, id]) => (
            <Link
              key={id}
              href={`${base}#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={id === "contact" ? "navContact" : undefined}
            >
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
          aria-controls={menuId}
          onClick={() => setOpen(true)}
        >
          <span className="menuLabel">Menu</span>
          <span className="menuGlyph" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id={menuId}
        className="menuOverlay"
        aria-labelledby="mobile-menu-title"
        onCancel={() => setOpen(false)}
      >
        <div className="menuOverlayTop">
          <span className="menuSignature" aria-hidden="true">
            s.
          </span>
          <button
            className="menuToggle isOpen"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <span className="menuLabel">Close</span>
            <span className="menuGlyph" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
        <p className="eyebrow" id="mobile-menu-title">
          Explore the portfolio
        </p>
        <nav aria-label="Mobile navigation">
          {links.map(([label, id], index) => (
            <Link
              style={{ "--index": index }}
              key={id}
              href={`${base}#${id}`}
              aria-current={active === id ? "location" : undefined}
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
