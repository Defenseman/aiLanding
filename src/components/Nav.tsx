'use client';

import { useEffect, useState } from 'react';
import styles from './Nav.module.scss';

const links = [
  { href: '#about', label: 'About' },
  { href: '#stack', label: 'Stack' },
  { href: '#how', label: 'Process' },
  { href: '#cases', label: 'Cases' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo}>
          <span className={styles.dot} />
          <span className="mono">Илья</span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={styles.cta}>
          Связаться
          <span aria-hidden>→</span>
        </a>

        <button
          className={styles.burger}
          aria-expanded={open}
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className={styles.mobilePanel}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            Связаться →
          </a>
        </div>
      )}
    </header>
  );
}
