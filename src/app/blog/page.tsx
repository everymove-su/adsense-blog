import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPublishedPosts } from '@/lib/posts';
import PostCard from '@/components/post/PostCard';
import { SITE_CONFIG, POSTS_PER_PAGE } from '@/constants/site';

export const metadata: Metadata = {
  title: '블로그',
  description: `${SITE_CONFIG.name}의 모든 요리 레시피를 확인해 보세요.`,
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const allPosts = getPublishedPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* 페이지 헤더 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">블로그</h1>
        <p className="text-gray-500">총 {allPosts.length}개의 레시피가 있습니다.</p>
      </section>

      {/* 포스트 목록 */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">아직 작성된 포스트가 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2"
          aria-label="페이지 네비게이션"
        >
          {/* 이전 페이지 */}
          {currentPage > 1 && (
            <a
              href={`/blog?page=${currentPage - 1}`}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              ← 이전
            </a>
          )}

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={`/blog?page=${page}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              {page}
            </a>
          ))}

          {/* 다음 페이지 */}
          {currentPage < totalPages && (
            <a
              href={`/blog?page=${currentPage + 1}`}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              다음 →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <section className="mb-10">
        <div className="h-9 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-100 aspect-[4/3] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  );
}
