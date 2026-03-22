import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostFrontmatter } from '@/types/post';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/posts');

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

function extractExcerpt(content: string, description: string): string {
  if (description) return description;
  const plainText = content.replace(/[#*`\[\]()]/g, '').replace(/\n+/g, ' ').trim();
  return plainText.slice(0, 160);
}

function parsePost(filePath: string): Post | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    return {
      ...frontmatter,
      content,
      excerpt: extractExcerpt(content, frontmatter.description),
      readingTime: frontmatter.readingTime ?? calculateReadingTime(content),
      wordCount: frontmatter.wordCount ?? calculateWordCount(content),
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const filePath = path.join(POSTS_DIRECTORY, fileName);
      return parsePost(filePath);
    })
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());

  return posts;
}

export function getPublishedPosts(): Post[] {
  const now = new Date();
  return getAllPosts().filter(
    (post) => post.status === 'published' && new Date(post.publishAt) <= now
  );
}

export function getPostBySlug(slug: string): Post | null {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const currentPost = getPostBySlug(slug);
  if (!currentPost) return [];

  const publishedPosts = getPublishedPosts().filter((post) => post.slug !== slug);

  const scored = publishedPosts.map((post) => {
    const commonTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
    const score = commonTags.length + (post.category === currentPost.category ? 1 : 0);
    return { post, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
