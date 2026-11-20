'use client';
import { useEffect, useRef } from 'react';

export function Reveal({ children }) {
  const root = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    root.current.querySelectorAll('main > section').forEach(section => {
      if (section.getBoundingClientRect().top > innerHeight) {
        section.classList.add('reveal');
        observer.observe(section);
      }
    });
    return () => observer.disconnect();
  }, []);
  return <div ref={root}>{children}</div>;
}
