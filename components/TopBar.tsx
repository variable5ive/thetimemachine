'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useEffect, useState } from 'react';

type TopBarProps = {
  leapUrls: string[];
};

export default function TopBar({ leapUrls }: TopBarProps) {
  const router = useRouter();
  const [trapOpen, setTrapOpen] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  const hasPosts = leapUrls.length > 0;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const awayFromTop = currentScrollY > 80;

      setHeaderHidden(scrollingDown && awayFromTop);
      lastScrollY = Math.max(currentScrollY, 0);
      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function triggerLightTrap() {
    setTrapOpen(true);
    setFlashing(true);
    window.setTimeout(() => setFlashing(false), 650);
  }

  function closeLightTrap() {
    setTrapOpen(false);
  }

  function leap(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (!hasPosts) return;

    const destination = leapUrls[Math.floor(Math.random() * leapUrls.length)];
    router.push(destination);
  }

  return (
    <>
      <header className={`site-header${headerHidden ? ' is-hidden' : ''}`}>
        <Link className="brand brand-stacked" href="/" aria-label="The Time Machine home">
          <span>THE</span>
          <span>TIME</span>
          <span>MACHINE</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <button
            className="icon-button"
            type="button"
            aria-label="Attempt light mode"
            title="Attempt light mode"
            onClick={triggerLightTrap}
          >
            <span aria-hidden="true" className="moon-icon">
              ☾
            </span>
            <span aria-hidden="true" className="sun-icon">
              ☀
            </span>
          </button>

          <Link
            className={`leap-button header-leap${hasPosts ? '' : ' is-disabled'}`}
            href="/"
            aria-disabled={!hasPosts}
            onClick={leap}
          >
            Leap
          </Link>
        </nav>
      </header>

      {flashing && <div className="light-flash" aria-hidden="true" />}

      {trapOpen && (
        <div className="light-trap" role="presentation" onClick={closeLightTrap}>
          <div
            className="light-trap-card"
            role="dialog"
            aria-modal="true"
            aria-label="Light mode unavailable"
            onClick={(event) => event.stopPropagation()}
          >
            <p>Travelling faster than light, light mode unavailable.</p>

            <button className="trap-ok-button" type="button" onClick={closeLightTrap}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
