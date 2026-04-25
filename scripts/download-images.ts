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
  { slug: 'galbitang-recipe', keyword: 'korean beef rib soup galbitang' },
  { slug: 'chadol-doenjang-jjigae-recipe', keyword: 'korean doenjang jjigae soybean paste soup' },
  { slug: 'gamjatang-recipe', keyword: 'korean pork bone soup stew' },
  { slug: 'tteokguk-recipe', keyword: 'korean rice cake soup tteokguk' },
  { slug: 'manduguk-recipe', keyword: 'korean dumpling soup' },
  { slug: 'godeungeo-jorim-recipe', keyword: 'braised mackerel fish korean' },
  { slug: 'dongtae-jjigae-recipe', keyword: 'korean fish stew soup spicy' },
  { slug: 'nakji-bokkeum-recipe', keyword: 'spicy stir fried octopus korean' },
  { slug: 'dubu-kimchi-recipe', keyword: 'korean tofu kimchi dish' },
  { slug: 'janchi-guksu-recipe', keyword: 'korean noodle soup anchovy broth' },
  { slug: 'bibim-guksu-recipe', keyword: 'korean spicy cold noodles' },
  { slug: 'kong-guksu-recipe', keyword: 'korean soybean cold noodle soup' },
  { slug: 'dubu-jorim-recipe', keyword: 'korean braised tofu spicy' },
  { slug: 'hobak-jeon-recipe', keyword: 'korean zucchini pancake jeon' },
  { slug: 'agujjim-recipe', keyword: 'korean spicy braised fish seafood' },
  { slug: 'dak-juk-recipe', keyword: 'korean chicken rice porridge juk' },
  { slug: 'jangjorim-recipe', keyword: 'korean soy braised beef eggs' },
  { slug: 'hwangtae-haejangguk-recipe', keyword: 'korean dried pollack soup' },
  { slug: 'cheonggukjang-recipe', keyword: 'korean fermented soybean paste stew' },
  { slug: 'eomuk-bokkeum-recipe', keyword: 'korean stir fried fish cake' },
  { slug: 'haemul-tang-recipe', keyword: 'korean seafood hot pot spicy' },
  { slug: 'dwaeji-gukbap-recipe', keyword: 'korean pork soup rice gukbap' },
  { slug: 'osam-bulgogi-recipe', keyword: 'korean spicy pork squid stir fry' },
  { slug: 'easy-doenjang-jjigae-recipe', keyword: 'korean miso soup tofu' },
  { slug: 'gyeran-jjim-recipe', keyword: 'korean steamed egg custard soft' },
  { slug: 'myulchi-bokkeum-recipe', keyword: 'korean stir fried dried anchovies' },
  { slug: 'dak-gangjeong-recipe', keyword: 'korean crispy sweet spicy chicken' },
  { slug: 'bossam-recipe', keyword: 'korean boiled pork belly wraps' },
  { slug: 'pajeon-recipe', keyword: 'korean green onion pancake jeon' },
  { slug: 'jjimdak-recipe', keyword: 'korean braised chicken soy sauce' },
  { slug: 'kalguksu-recipe', keyword: 'noodle soup bowl chopsticks korean' },
  { slug: 'gamja-jorim-recipe', keyword: 'cooked potato' },
  { slug: 'tangsuyuk-recipe', keyword: 'fried pork crispy' },
  { slug: 'jokbal-recipe', keyword: 'pork leg braised korean food' },
  { slug: 'sujebi-recipe', keyword: 'dumpling soup noodle broth bowl' },
  { slug: 'sigeumchi-namul-recipe', keyword: 'spinach salad sesame korean side' },
  { slug: 'ueong-jorim-recipe', keyword: 'korean side dish soy glazed' },
  { slug: 'kkanpungi-recipe', keyword: 'spicy crispy fried chicken sauce' },
  { slug: 'kongnamul-muchim-recipe', keyword: 'bean sprouts cooked korean' },
  { slug: 'musaengchae-recipe', keyword: 'radish salad spicy korean' },
  { slug: 'eomuk-tang-recipe', keyword: 'fish cake soup hot pot' },
  { slug: 'kkaennip-jorim-recipe', keyword: 'perilla leaves korean dish' },
  { slug: 'goguma-mattang-recipe', keyword: 'sweet potato fried snack' },
  { slug: 'oi-sobagi-recipe', keyword: 'cucumber kimchi korean' },
  { slug: 'hwangtae-gui-recipe', keyword: 'grilled dried fish korean' },
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

const MIN_FILE_SIZE = 1000; // 1KB 미만은 에러 응답으로 간주
const BATCH_SIZE = 5;       // 5개마다 긴 휴식
const BATCH_DELAY = 5000;   // 배치 간 5초 대기
const REQUEST_DELAY = 1500; // 요청 간 1.5초 대기

async function main() {
  console.log(`\n총 ${posts.length}개 포스트 이미지 다운로드 시작\n`);

  let downloadCount = 0;

  for (const post of posts) {
    const dir = path.join('public', 'images', 'posts', post.slug);
    const dest = path.join(dir, 'thumbnail.jpg');

    // 파일이 존재하고 크기가 정상이면 건너뜀
    if (fs.existsSync(dest) && fs.statSync(dest).size >= MIN_FILE_SIZE) {
      console.log(`  [건너뜀] ${post.slug} (이미 존재)`);
      continue;
    }

    // 깨진 파일이면 삭제 후 재다운로드
    if (fs.existsSync(dest)) {
      console.log(`  [재다운로드] ${post.slug} (깨진 파일 감지: ${fs.statSync(dest).size}bytes)`);
      fs.unlinkSync(dest);
    }

    console.log(`  [${post.slug}] 검색 중: "${post.keyword}"`);

    try {
      const imageUrl = await searchPixabay(post.keyword);
      if (!imageUrl) continue;

      fs.mkdirSync(dir, { recursive: true });
      await downloadFile(imageUrl, dest);

      const size = fs.statSync(dest).size;
      if (size < MIN_FILE_SIZE) {
        fs.unlinkSync(dest);
        console.error(`  [실패] ${post.slug} - 응답이 너무 작음 (${size}bytes), 건너뜀`);
        continue;
      }

      console.log(`  [완료] ${post.slug} (${(size / 1024).toFixed(0)}KB)`);
      downloadCount++;

      // 5개마다 5초 대기 (API 한도 초과 방지)
      if (downloadCount % BATCH_SIZE === 0) {
        console.log(`\n  ⏸ ${BATCH_DELAY / 1000}초 대기 중 (API 한도 초과 방지)...\n`);
        await new Promise(r => setTimeout(r, BATCH_DELAY));
      } else {
        await new Promise(r => setTimeout(r, REQUEST_DELAY));
      }
    } catch (err) {
      console.error(`  [오류] ${post.slug}:`, err);
    }
  }

  console.log('\n모든 이미지 다운로드 완료!\n');
}

main();
