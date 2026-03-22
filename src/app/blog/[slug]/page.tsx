import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/constants/site';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import JsonLd from '@/components/seo/JsonLd';
import PostCard from '@/components/post/PostCard';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts().filter((post) => post.status === 'published');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: '포스트를 찾을 수 없습니다' };
  }

  const ogImageUrl = post.thumbnail
    ? `${SITE_CONFIG.url}${post.thumbnail}`
    : `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: post.canonicalUrl || `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      publishedTime: post.publishAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.thumbnailAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  const formattedDate = format(new Date(post.publishAt), 'yyyy년 M월 d일', {
    locale: ko,
  });

  return (
    <>
      <JsonLd post={post} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* 포스트 헤더 */}
        <header className="mb-8">
          {/* 카테고리 배지 */}
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>

          {/* 제목 */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <time dateTime={post.publishAt}>{formattedDate}</time>
            {post.readingTime && <span>약 {post.readingTime}분 소요</span>}
            <span>작성: {post.author}</span>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 대표 이미지 */}
          {post.thumbnail && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-2">
              <Image
                src={post.thumbnail}
                alt={post.thumbnailAlt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}
          {post.thumbnailCredit && (
            <p className="text-xs text-gray-400 text-right mb-6">{post.thumbnailCredit}</p>
          )}
        </header>

        {/* 광고 - 상단 */}
        <div className="mb-10">
          <AdSenseUnit position="TOP" />
        </div>

        {/* MDX 본문 */}
        <div className="prose max-w-none">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        {/* 광고 - 중간 */}
        <div className="my-10">
          <AdSenseUnit position="MIDDLE" />
        </div>

        {/* 광고 - 하단 */}
        <div className="mt-10">
          <AdSenseUnit position="BOTTOM" />
        </div>

        {/* 관련 포스트 */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 레시피</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
