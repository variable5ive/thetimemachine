import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getPostsByYear, getYears, postUrl } from '@/lib/posts';
import { site } from '@/lib/site';
import YearMonthSlider from '@/components/YearMonthSlider';

type PageProps = {
  params: Promise<{ year: string }>;
};

type PostWithOptionalTags = {
  tags?: string[];
};

export async function generateStaticParams() {
  const years = await getYears();
  return years.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `${year} | ${site.title}`,
    description: `Entries published in ${year}.`
  };
}

export default async function YearPage({ params }: PageProps) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);

  if (!Number.isInteger(year)) notFound();

  const posts = await getPostsByYear(year);

  if (posts.length === 0) notFound();

  const yearString = String(year);
  const yearStart = yearString.slice(0, -2);
  const yearEnd = yearString.slice(-2);

  const entries = posts.map((post) => {
    const date = new Date(post.publishedAt);
    const rawTags = (post as PostWithOptionalTags).tags;
    const tags: string[] = Array.isArray(rawTags) ? rawTags : [];

    return {
      title: post.title,
      abstract: post.abstract,
      publishedAt: post.publishedAt,
      displayDate: formatDate(post.publishedAt),
      url: postUrl(post),
      monthIndex: date.getMonth(),
      tags
    };
  });

  return (
    <section className="year-page" aria-labelledby="year-title">
      <h1 className="page-title year-page-title" id="year-title">
        <span>{yearStart}</span>
        <span className="year-title-outline">{yearEnd}</span>
      </h1>

      <p className="page-intro year-page-count">
        {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
      </p>

      <YearMonthSlider entries={entries} />
    </section>
  );
}
