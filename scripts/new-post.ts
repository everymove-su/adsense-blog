#!/usr/bin/env tsx
/**
 * 새 블로그 포스트 템플릿 생성 CLI
 *
 * 사용법:
 *   npx tsx scripts/new-post.ts "포스트 제목" "slug-name"
 *
 * 예시:
 *   npx tsx scripts/new-post.ts "김치찌개 레시피 초보도 쉽게" "kimchi-jjigae-recipe"
 */

import fs from 'fs';
import path from 'path';

function getKSTDateString(): string {
  const now = new Date();
  // KST = UTC+9
  const kstOffset = 9 * 60 * 60 * 1000;
  const kst = new Date(now.getTime() + kstOffset);
  return kst.toISOString().replace('Z', '+09:00');
}

function getDatePrefix(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kst = new Date(now.getTime() + kstOffset);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function generateTemplate(title: string, slug: string): string {
  const publishAt = getKSTDateString();
  const datePrefix = getDatePrefix();

  return `---
title: "${title}"
description: "여기에 포스트 설명을 입력하세요. 160자 이내로 작성하며 핵심 키워드를 포함해 주세요. 검색 결과에 표시되는 중요한 문구입니다."
slug: "${slug}"
publishAt: "${publishAt}"
status: "draft"
thumbnail: "/images/posts/${slug}/thumbnail.webp"
thumbnailAlt: "${title} 이미지"
thumbnailCredit: "Photo by photographer on Pixabay"
keywords: ["키워드1", "키워드2", "키워드3", "키워드4"]
category: "생활정보"
tags: ["태그1", "태그2", "태그3"]
author: "블로그 운영자"
---

<!-- 본문 목표: 공백 포함 1,500~1,800자 -->
<!-- 현재 작성 글자 수를 확인하려면: npx tsx scripts/count-chars.ts [파일경로] -->

# ${title}

<!-- H1 아래 도입부: 100~150자 목표 -->
[포스트 도입부를 작성해 주세요. 독자가 이 글을 왜 읽어야 하는지, 무엇을 얻을 수 있는지 간략히 안내합니다.]

## [소제목 1] <!-- 각 H2 섹션: 약 400~500자 목표 -->

[첫 번째 주요 섹션 내용을 작성해 주세요.]

### [세부 항목 1-1]

[세부 내용을 작성해 주세요.]

### [세부 항목 1-2]

[세부 내용을 작성해 주세요.]

## [소제목 2] <!-- 각 H2 섹션: 약 400~500자 목표 -->

[두 번째 주요 섹션 내용을 작성해 주세요.]

### [세부 항목 2-1]

[세부 내용을 작성해 주세요.]

## [소제목 3] <!-- 각 H2 섹션: 약 400~500자 목표 -->

[세 번째 주요 섹션 내용을 작성해 주세요.]

## 맺음말

[포스트를 마무리하는 내용을 작성해 주세요. 핵심 내용을 요약하고 독자에게 유용한 행동 지침이나 격려의 말로 마무리합니다. 약 150~200자를 목표로 작성합니다.]
`;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('사용법: npx tsx scripts/new-post.ts "포스트 제목" "slug-name"');
    console.error('예시: npx tsx scripts/new-post.ts "김치찌개 레시피" "kimchi-jjigae-recipe"');
    process.exit(1);
  }

  const [title, slug] = args;

  // slug 유효성 검사
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    console.error(`오류: slug는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다. 입력값: "${slug}"`);
    process.exit(1);
  }

  const datePrefix = getDatePrefix();
  const fileName = `${datePrefix}-${slug}.mdx`;
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const filePath = path.join(postsDir, fileName);

  // 디렉토리 생성
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
    console.log(`디렉토리 생성: ${postsDir}`);
  }

  // 파일 중복 확인
  if (fs.existsSync(filePath)) {
    console.error(`오류: 파일이 이미 존재합니다: ${filePath}`);
    process.exit(1);
  }

  // 같은 slug를 가진 파일 확인
  const existingFiles = fs.readdirSync(postsDir).filter((f) => f.includes(slug));
  if (existingFiles.length > 0) {
    console.warn(`경고: 같은 slug를 포함한 파일이 이미 존재합니다:`);
    existingFiles.forEach((f) => console.warn(`  - ${f}`));
    console.warn('계속 진행합니다...');
  }

  const template = generateTemplate(title, slug);
  fs.writeFileSync(filePath, template, 'utf8');

  console.log(`✓ 새 포스트 파일이 생성되었습니다:`);
  console.log(`  경로: ${filePath}`);
  console.log(`  제목: ${title}`);
  console.log(`  슬러그: ${slug}`);
  console.log(`  상태: draft`);
  console.log('');
  console.log('다음 단계:');
  console.log('  1. 파일을 열어 내용을 작성하세요');
  console.log('  2. description을 160자 이내로 작성하세요');
  console.log('  3. keywords와 tags를 설정하세요');
  console.log('  4. 본문을 1,500~1,800자로 작성하세요');
  console.log('  5. 완성 후 status를 "published" 또는 "scheduled"로 변경하세요');
}

main();
