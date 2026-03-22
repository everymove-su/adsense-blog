export const SITE_CONFIG = {
  name: '오늘의 레시피',
  description: '매일 새로운 요리 레시피를 소개합니다. 한식부터 간편 요리까지 집에서 쉽게 만들 수 있는 레시피를 매일 업데이트합니다.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-blog-url.vercel.app',
  ogImage: '/og-image.png',
  author: '블로그 운영자',
  email: 'contact@your-blog-url.vercel.app',
} as const;

export const CATEGORIES = ['요리'] as const;

export type Category = typeof CATEGORIES[number];

export const POSTS_PER_PAGE = 10;
export const HOME_POSTS_LIMIT = 6;
