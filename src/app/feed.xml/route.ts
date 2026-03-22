import { Feed } from 'feed';
import { getPublishedPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/constants/site';

export async function GET() {
  const baseUrl = SITE_CONFIG.url;
  const posts = getPublishedPosts();

  const feed = new Feed({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    id: baseUrl,
    link: baseUrl,
    language: 'ko',
    image: `${baseUrl}${SITE_CONFIG.ogImage}`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${SITE_CONFIG.name}`,
    updated: posts.length > 0 ? new Date(posts[0].publishAt) : new Date(),
    feedLinks: {
      rss2: `${baseUrl}/feed.xml`,
    },
    author: {
      name: SITE_CONFIG.author,
      email: SITE_CONFIG.email,
      link: baseUrl,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/${post.slug}`,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.description,
      content: post.excerpt,
      date: new Date(post.publishAt),
      image: post.thumbnail ? `${baseUrl}${post.thumbnail}` : undefined,
      category: [{ name: post.category }],
      author: [
        {
          name: post.author,
          email: SITE_CONFIG.email,
          link: baseUrl,
        },
      ],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
