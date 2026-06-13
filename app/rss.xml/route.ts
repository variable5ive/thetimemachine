import { getAllPosts, postUrl } from '@/lib/posts';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map((post) => {
    const url = `${site.url}${postUrl(post)}`;

    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <description>${escapeXml(post.abstract)}</description>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(site.title)}</title>
        <description>${escapeXml(site.description)}</description>
        <link>${escapeXml(site.url)}</link>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
