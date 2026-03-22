import { Post } from '@/types/post';
import { SITE_CONFIG } from '@/constants/site';

interface JsonLdProps {
  post: Post;
}

export default function JsonLd({ post }: JsonLdProps) {
  const baseUrl = SITE_CONFIG.url;
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.thumbnail ? `${baseUrl}${post.thumbnail}` : `${baseUrl}${SITE_CONFIG.ogImage}`,
    url: postUrl,
    datePublished: post.publishAt,
    dateModified: post.publishAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${SITE_CONFIG.ogImage}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    wordCount: post.wordCount,
    inLanguage: 'ko-KR',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '블로그',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
