'use client';

import { type CSSProperties, type KeyboardEvent, type PointerEvent, useMemo, useState } from 'react';

type YearEntry = {
  title: string;
  abstract: string;
  publishedAt: string;
  displayDate: string;
  url: string;
  monthIndex: number;
  tags: string[];
};

type YearMonthSliderProps = {
  entries: YearEntry[];
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function clampMonth(value: number) {
  return Math.min(11, Math.max(0, value));
}

export default function YearMonthSlider({ entries }: YearMonthSliderProps) {
  const firstEntryMonth = entries[0]?.monthIndex ?? 0;
  const [activeMonth, setActiveMonth] = useState(firstEntryMonth);

  const activeEntries = useMemo(() => {
    return entries.filter((entry) => entry.monthIndex === activeMonth);
  }, [entries, activeMonth]);

  function selectMonthFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const progress = (event.clientX - rect.left) / rect.width;
    const nextMonth = clampMonth(Math.round(progress * 11));

    setActiveMonth(nextMonth);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    selectMonthFromPointer(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;
    selectMonthFromPointer(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveMonth((month) => clampMonth(month - 1));
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveMonth((month) => clampMonth(month + 1));
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveMonth(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveMonth(11);
    }
  }

  return (
    <div className="month-slider-shell">
      <div
        className="month-slider"
        style={{ '--active-month': activeMonth } as CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label="Select month"
        aria-valuemin={0}
        aria-valuemax={11}
        aria-valuenow={activeMonth}
        aria-valuetext={months[activeMonth]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      >
        <span className="month-slider-line" aria-hidden="true" />
        <span className="month-slider-thumb" aria-hidden="true" />

        {months.map((month, index) => (
          <span
            className="month-slider-mark"
            style={{ '--month-index': index } as CSSProperties}
            key={month}
            aria-hidden="true"
          >
            <span className="month-slider-month">{month}</span>
          </span>
        ))}
      </div>

      <div className="month-entry-list" aria-live="polite">
        {activeEntries.length > 0 ? (
          activeEntries.map((entry) => {
            const cleanDisplayDate = entry.displayDate.replace(',', '');

            return (
              <article className="post-card" key={entry.url}>
                <time dateTime={entry.publishedAt}>{cleanDisplayDate}</time>

                <div>
                  <h2>
                    <a href={entry.url}>{entry.title}</a>
                  </h2>

                  {entry.tags.length > 0 && (
                    <div className="year-entry-tags" aria-label="Entry tags">
                      {entry.tags.map((tag) => (
                        <span className="year-entry-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p>{entry.abstract}</p>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-month">
            <p>No entries in {months[activeMonth]}.</p>
          </div>
        )}
      </div>
    </div>
  );
}