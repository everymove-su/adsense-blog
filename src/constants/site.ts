export const SITE_CONFIG = {
  name: '오늘의 생활정보',
  description: '요리 레시피, 영화 리뷰, 스포츠 정보까지 일상에 유용한 생활정보를 매일 업데이트합니다.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-blog-url.vercel.app',
  ogImage: '/og-image.png',
  author: '블로그 운영자',
  email: 'contact@your-blog-url.vercel.app',
} as const;

export const CATEGORIES = ['생활정보', '요리', '영화', '스포츠'] as const;

export type Category = typeof CATEGORIES[number];

export const POSTS_PER_PAGE = 10;
export const HOME_POSTS_LIMIT = 6;
