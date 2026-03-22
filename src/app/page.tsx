import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts';
import PostCard from '@/components/post/PostCard';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { SITE_CONFIG, HOME_POSTS_LIMIT } from '@/constants/site';

export default function HomePage() {
  const posts = getPublishedPosts().slice(0, HOME_POSTS_LIMIT);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero 섹션 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {SITE_CONFIG.name}
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          {SITE_CONFIG.description}
        </p>
      </section>

      {/* 광고 슬롯 - 상단 */}
      <div className="mb-10">
        <AdSenseUnit position="TOP" />
      </div>

      {/* 최신 포스트 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">최신 레시피</h2>
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            전체 보기 →
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">아직 작성된 포스트가 없습니다.</p>
            <p className="text-sm mt-2">곧 새로운 레시피로 찾아오겠습니다!</p>
          </div>
        )}
      </section>

      {/* 소개 섹션 */}
      <section className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">블로그 소개</h2>
        <p className="text-gray-600 mb-5 leading-relaxed">
          {SITE_CONFIG.name}은 매일 새로운 요리 레시피와 함께 더 맛있고 풍요로운 식탁을
          만들어가는 블로그입니다. 집에서도 쉽게 따라 할 수 있는 레시피를 소개해 드립니다.
        </p>
        <Link
          href="/about"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          더 알아보기
        </Link>
      </section>
    </div>
  );
}
