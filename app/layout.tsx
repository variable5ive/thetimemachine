import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import { getAllPosts, postUrl } from '@/lib/posts';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: site.title,
    description: site.description,
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const posts = await getAllPosts();
  const leapUrls = posts.map(postUrl);

  return (
    <html lang="en">
      <body>
        <TopBar leapUrls={leapUrls} />
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
