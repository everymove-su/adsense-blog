#!/usr/bin/env tsx
/**
 * 예약 발행 스크립트
 *
 * content/posts/ 디렉토리의 모든 MDX 파일을 스캔하여
 * status: "scheduled" 이고 publishAt <= 현재시각인 파일을
 * status: "published" 로 변경합니다.
 *
 * 사용법:
 *   npx tsx scripts/check-scheduled-posts.ts
 */

import fs from 'fs';
import path from 'path';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

interface ScanResult {
  filePath: string;
  fileName: string;
  publishAt: string;
  oldStatus: string;
}

/**
 * 프론트매터에서 특정 필드 값을 추출합니다.
 */
function extractFrontmatterField(content: string, field: string): string | null {
  const regex = new RegExp(`^${field}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * 프론트매터의 status 필드를 교체합니다.
 */
function replaceStatus(content: string, newStatus: string): string {
  return content.replace(
    /^(status:\s*)["']?(?:scheduled|draft|published)["']?\s*$/m,
    `$1"${newStatus}"`
  );
}

/**
 * 파일에서 프론트매터 블록만 추출합니다.
 */
function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

function main() {
  const now = new Date();
  console.log(`[check-scheduled-posts] 실행 시각: ${now.toISOString()}`);
  console.log(`[check-scheduled-posts] 스캔 디렉토리: ${POSTS_DIRECTORY}`);
  console.log('');

  if (!fs.existsSync(POSTS_DIRECTORY)) {
    console.log('posts 디렉토리가 존재하지 않습니다. 종료합니다.');
    process.exit(0);
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  console.log(`총 ${fileNames.length}개 파일 스캔 중...`);

  const toPublish: ScanResult[] = [];
  const errors: string[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(POSTS_DIRECTORY, fileName);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = extractFrontmatter(content);

      if (!frontmatter) {
        continue;
      }

      const status = extractFrontmatterField(frontmatter, 'status');
      if (status !== 'scheduled') {
        continue;
      }

      const publishAtStr = extractFrontmatterField(frontmatter, 'publishAt');
      if (!publishAtStr) {
        errors.push(`${fileName}: publishAt 필드를 찾을 수 없습니다.`);
        continue;
      }

      const publishAt = new Date(publishAtStr);
      if (isNaN(publishAt.getTime())) {
        errors.push(`${fileName}: publishAt 날짜 파싱 실패 - "${publishAtStr}"`);
        continue;
      }

      if (publishAt <= now) {
        toPublish.push({
          filePath,
          fileName,
          publishAt: publishAtStr,
          oldStatus: status,
        });
      } else {
        const diff = publishAt.getTime() - now.getTime();
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        console.log(`  ⏰ 대기 중: ${fileName} (${hoursLeft}시간 ${minutesLeft}분 후 발행)`);
      }
    } catch (err) {
      errors.push(`${fileName}: 파일 읽기 오류 - ${err}`);
    }
  }

  console.log('');

  if (toPublish.length === 0) {
    console.log('발행할 예약 포스트가 없습니다.');
  } else {
    console.log(`${toPublish.length}개 포스트를 발행합니다:`);
    console.log('');

    const published: string[] = [];
    const failedToPublish: string[] = [];

    for (const item of toPublish) {
      try {
        const content = fs.readFileSync(item.filePath, 'utf8');
        const updated = replaceStatus(content, 'published');

        if (updated === content) {
          failedToPublish.push(`${item.fileName}: status 필드 교체 실패`);
          continue;
        }

        fs.writeFileSync(item.filePath, updated, 'utf8');
        published.push(item.fileName);
        console.log(`  ✓ 발행 완료: ${item.fileName}`);
        console.log(`    publishAt: ${item.publishAt}`);
        console.log(`    상태 변경: scheduled → published`);
        console.log('');
      } catch (err) {
        failedToPublish.push(`${item.fileName}: 파일 쓰기 오류 - ${err}`);
      }
    }

    console.log(`─────────────────────────────────`);
    console.log(`발행 완료: ${published.length}개`);
    if (failedToPublish.length > 0) {
      console.log(`발행 실패: ${failedToPublish.length}개`);
      failedToPublish.forEach((msg) => console.error(`  ✗ ${msg}`));
    }
  }

  if (errors.length > 0) {
    console.log('');
    console.log('오류 목록:');
    errors.forEach((err) => console.error(`  ✗ ${err}`));
  }

  console.log('');
  console.log('[check-scheduled-posts] 완료');
}

main();
