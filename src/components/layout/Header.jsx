'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const links = [['Work', 'work'], ['Experience', 'experience'], ['About', 'about'], ['Contact', 'contact']];

export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => {
      document.body.style.overflow = previous;
      dialog.current?.close();
      toggle.current?.focus();
    };
  }, [open]);
  return <>
    <header className="top wrap">
      <Link className="brand" href="/" aria-label="Shweta Sharma, home"><i aria-hidden="true">s.</i><span>Shweta Sharma</span></Link>
      <nav className="desktopNav" aria-label="Main navigation">{links.map(([label, id]) => <Link key={id} href={`/#${id}`}>{label}</Link>)}</nav>
      <button ref={toggle} className="menuToggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}><span/><span/></button>
    </header>
    <dialog ref={dialog} id="mobile-menu" className="menuOverlay" onCancel={() => setOpen(false)}>
      <button className="menuToggle isOpen" aria-label="Close navigation" onClick={() => setOpen(false)}><span/><span/></button>
      <p className="eyebrow">Explore the portfolio</p>
      <nav aria-label="Mobile navigation">{links.map(([label, id], index) => <Link style={{ '--index': index }} key={id} href={`/#${id}`} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}</Link>)}</nav>
    </dialog>
  </>;
}
