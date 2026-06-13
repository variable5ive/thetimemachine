'use client';

import Link from 'next/link';
import { useState } from 'react';

type TopBarProps = {
  leapUrls: string[];
};

export default function TopBar({ leapUrls }: TopBarProps) {
  const [trapOpen, setTrapOpen] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const hasPosts = leapUrls.length > 0;

  function triggerLightTrap() {
    setTrapOpen(true);
    setFlashing(true);
    window.setTimeout(() => setFlashing(false), 650);
  }

  function closeLightTrap() {
    setTrapOpen(false);
  }

  function leap(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (!hasPosts) return;

    const destination = leapUrls[Math.floor(Math.random() * leapUrls.length)];
    window.location.href = destination;
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand brand-stacked" href="/" aria-label="The Time Machine home">
          <span>the</span>
          <span>time</span>
          <span>machine</span>
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