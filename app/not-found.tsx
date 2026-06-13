import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found">
      <div>
        <p className="eyebrow">Timeline error</p>
        <h1>404</h1>
        <p>This chamber does not exist in the machine.</p>
        <Link className="back-link" href="/">Return home</Link>
      </div>
    </section>
  );
}
