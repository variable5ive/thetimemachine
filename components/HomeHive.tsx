import Link from 'next/link';
import { yearUrl } from '@/lib/posts';

type HomeHiveProps = {
  years: number[];
};

export default function HomeHive({ years }: HomeHiveProps) {
  if (years.length === 0) {
    return (
      <div className="blank-hex" aria-label="No published entries yet">
        <span className="blank-hex-inner" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="home-hex-grid" aria-label="Years with published entries">
      {years.map((year) => (
        <Link className="home-year-hex" href={yearUrl(year)} key={year} aria-label={`Open ${year}`}>
          <span className="home-year-hex-content">
            <strong>{year}</strong>
          </span>
        </Link>
      ))}
    </div>
  );
}