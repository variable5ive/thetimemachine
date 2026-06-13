import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export type PostStatus = 'draft' | 'published';

export type Post = {
  slug: string;
  title: string;
  abstract: string;
  publishedAt: string;
  updatedAt?: string;
  cover?: string;
  coverAlt?: string;
  tags: string[];
  status: PostStatus;
  content: string;
  html: string;
  year: number;
};

type Frontmatter = {
  title?: string;
  abstract?: string;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  cover?: string;
  coverAlt?: string;
  tags?: string[];
  draft?: boolean;
  status?: PostStatus;
};

function toIsoDate(value: string | Date | undefined, fallback = new Date()): string {
  if (!value) return fallback.toISOString();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback.toISOString();
  return date.toISOString();
}

function normalizeSlug(filename: string) {
  return filename.replace(/\.mdx?$/, '');
}

async function getPostFiles() {
  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /\.mdx?$/.test(name) && !name.startsWith('_'));
  } catch {
    return [];
  }
}

async function readPost(filename: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, filename);
  const raw = await fs.readFile(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;
  const publishedAt = toIsoDate(frontmatter.publishedAt);
  const status: PostStatus = frontmatter.status ?? (frontmatter.draft ? 'draft' : 'published');
  const html = await marked.parse(content, {
    async: true,
    gfm: true,
    breaks: false
  });

  return {
    slug: normalizeSlug(filename),
    title: frontmatter.title ?? normalizeSlug(filename),
    abstract: frontmatter.abstract ?? '',
    publishedAt,
    updatedAt: frontmatter.updatedAt ? toIsoDate(frontmatter.updatedAt) : undefined,
    cover: frontmatter.cover,
    coverAlt: frontmatter.coverAlt ?? '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    status,
    content,
    html,
    year: new Date(publishedAt).getFullYear()
  };
}

export async function getAllPosts({ includeDrafts = false } = {}) {
  const files = await getPostFiles();
  const posts = await Promise.all(files.map(readPost));

  return posts
    .filter((post) => includeDrafts || post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts({ includeDrafts: false });
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getYears() {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((post) => post.year))).sort((a, b) => b - a);
}

export async function getPostsByYear(year: number) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.year === year);
}

export function groupPostsByYear(posts: Post[]) {
  return posts.reduce<Record<number, Post[]>>((groups, post) => {
    groups[post.year] ??= [];
    groups[post.year].push(post);
    return groups;
  }, {});
}

export function postUrl(post: Pick<Post, 'slug'>) {
  return `/blog/${post.slug}/`;
}

export function yearUrl(year: number) {
  return `/year/${year}/`;
}

export function formatDate(isoDate: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options
  }).format(new Date(isoDate));
}

export function timelinePosition(isoDate: string) {
  const date = new Date(isoDate);
  const start = new Date(date.getFullYear(), 0, 1).getTime();
  const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59).getTime();
  const current = date.getTime();
  const position = ((current - start) / (end - start)) * 100;
  return `${Math.min(100, Math.max(0, position))}%`;
}
