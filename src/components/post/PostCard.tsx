import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const truncatedDescription =
    post.description.length > 160
      ? post.description.slice(0, 160) + '...'
      : post.description;

  const formattedDate = format(new Date(post.publishAt), 'yyyy년 M월 d일', {
    locale: ko,
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* 썸네일 */}
        <div className="relative w-full aspect-[16/9] bg-gray-100">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.thumbnailAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <span className="text-blue-300 text-4xl">🍳</span>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="p-5">
          {/* 카테고리 배지 */}
          <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-3">
            {post.category}
          </span>

          {/* 제목 */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
            {post.title}
          </h2>

          {/* 설명 */}
          <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
            {truncatedDescription}
          </p>

          {/* 하단 메타 */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <time dateTime={post.publishAt}>{formattedDate}</time>
            {post.readingTime && (
              <span>약 {post.readingTime}분 소요</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
