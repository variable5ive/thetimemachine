import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAllPosts, getPostBySlug, postUrl, yearUrl } from '@/lib/posts';
import { site } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
};

type PostWithOptionalTags = {
  tags?: string[];
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: `Not found | ${site.title}` };
  }

  return {
    title: `${post.title} | ${site.title}`,
    description: post.abstract,
    openGraph: {
      title: post.title,
      description: post.abstract,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.cover ? [post.cover] : undefined,
      url: postUrl(post)
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const displayDate = formatDate(post.publishedAt).replace(',', '');
  const tags = Array.isArray((post as PostWithOptionalTags).tags) ? (post as PostWithOptionalTags).tags : [];

  return (
    <article className="article">
      <header className="article-header">
        <div className="article-meta">
          <time dateTime={post.publishedAt}>{displayDate}</time>
        </div>

        <h1 className="article-title">{post.title}</h1>

        {post.abstract && <p className="article-abstract">{post.abstract}</p>}

        {tags.length > 0 && (
          <div className="article-tags" aria-label="Article tags">
            {tags.map((tag) => (
              <span className="article-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.cover && (
        <figure className="cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.coverAlt ?? ''} />
        </figure>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      <a className="back-link" href={yearUrl(post.year)}>
        Back to {post.year}
      </a>
    </article>
  );
}