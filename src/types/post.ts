export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface PostFrontmatter {
  title: string;
  description: string;
  slug: string;
  publishAt: string;
  status: PostStatus;
  thumbnail: string;
  thumbnailAlt: string;
  thumbnailCredit: string;
  keywords: string[];
  canonicalUrl?: string;
  category: string;
  tags: string[];
  author: string;
  readingTime?: number;
  wordCount?: number;
}

export interface Post extends PostFrontmatter {
  content: string;
  excerpt: string;
}
