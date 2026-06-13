import HomeHive from '@/components/HomeHive';
import { getAllPosts, getYears, groupPostsByYear } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getAllPosts();
  const years = await getYears();
  const groups = groupPostsByYear(posts);

  return (
    <section className="home-stage" aria-label="The Time Machine homepage">
      <HomeHive years={years} />
    </section>
  );
}
