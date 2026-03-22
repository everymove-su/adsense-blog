import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

if (!PIXABAY_API_KEY) {
  console.error('PIXABAY_API_KEY 환경변수가 없습니다.');
  process.exit(1);
}

// 포스트별 검색 키워드 (영어로 검색해야 결과가 많음)
const posts: { slug: string; keyword: string }[] = [
  { slug: 'bulgogi-recipe', keyword: 'korean bulgogi beef' },
  { slug: 'doenjang-jjigae-recipe', keyword: 'korean soybean paste soup' },
  { slug: 'egg-fried-rice-recipe', keyword: 'egg fried rice' },
  { slug: 'kimchi-jjigae-recipe', keyword: 'kimchi stew soup' },
  { slug: 'mlb-rules-beginners-guide', keyword: 'baseball stadium' },
  { slug: 'sundubu-jjigae-recipe', keyword: 'korean tofu soup' },
  { slug: 'avengers-endgame-review', keyword: 'superhero action movie' },
  { slug: 'crime-city-series-review', keyword: 'action movie night city' },
  { slug: 'interstellar-review', keyword: 'space galaxy universe' },
  { slug: 'japchae-recipe', keyword: 'korean glass noodles japchae' },
  { slug: 'parasite-movie-review', keyword: 'korean cinema movie' },
  { slug: 'premier-league-big6-guide', keyword: 'soccer football stadium' },
  { slug: 'tteokbokki-recipe', keyword: 'tteokbokki korean rice cake' },
  { slug: 'easy-doenjang-jjigae-recipe', keyword: 'korean miso soup tofu' },
  { slug: 'harry-potter-series-guide', keyword: 'magic fantasy castle' },
  { slug: 'nba-greatest-teams-ranking', keyword: 'basketball court arena' },
  { slug: 'oldboy-movie-review', keyword: 'dramatic cinema film' },
  { slug: 'olympics-korea-medal-history', keyword: 'olympics ceremony medal' },
  { slug: 'son-heungmin-career-stats', keyword: 'soccer player football' },
  { slug: 'tennis-grand-slam-guide', keyword: 'tennis court player' },
  { slug: 'top-gun-maverick-review', keyword: 'fighter jet aircraft sky' },
];

async function searchPixabay(keyword: string): Promise<string | null> {
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keyword)}&image_type=photo&safesearch=true&per_page=5&orientation=horizontal`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`  API 오류: ${response.status}`);
    return null;
  }

  const data = await response.json() as { hits: { largeImageURL: string }[] };
  if (!data.hits || data.hits.length === 0) {
    console.error(`  검색 결과 없음: ${keyword}`);
    return null;
  }

  return data.hits[0].largeImageURL;
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`\n총 ${posts.length}개 포스트 이미지 다운로드 시작\n`);

  for (const post of posts) {
    const dir = path.join('public', 'images', 'posts', post.slug);
    const dest = path.join(dir, 'thumbnail.jpg');

    if (fs.existsSync(dest)) {
      console.log(`  [건너뜀] ${post.slug} (이미 존재)`);
      continue;
    }

    console.log(`  [${post.slug}] 검색 중: "${post.keyword}"`);

    try {
      const imageUrl = await searchPixabay(post.keyword);
      if (!imageUrl) continue;

      fs.mkdirSync(dir, { recursive: true });
      await downloadFile(imageUrl, dest);
      console.log(`  [완료] ${post.slug}`);

      // API 요청 제한 방지 (초당 1건)
      await new Promise(r => setTimeout(r, 1100));
    } catch (err) {
      console.error(`  [오류] ${post.slug}:`, err);
    }
  }

  console.log('\n모든 이미지 다운로드 완료!\n');
}

main();
