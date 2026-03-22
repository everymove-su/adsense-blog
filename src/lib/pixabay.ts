interface PixabayImage {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
}

interface PixabayApiResponse {
  totalHits: number;
  hits: Array<{
    id: number;
    webformatURL: string;
    largeImageURL: string;
    tags: string;
    user: string;
  }>;
}

export async function searchPixabayImages(
  keyword: string,
  perPage: number = 10
): Promise<PixabayImage[]> {
  const apiKey = process.env.PIXABAY_API_KEY;

  if (!apiKey) {
    console.error(
      '[pixabay] PIXABAY_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일에 PIXABAY_API_KEY를 추가해 주세요.'
    );
    return [];
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: keyword,
    per_page: String(Math.min(Math.max(perPage, 3), 200)),
    image_type: 'photo',
    safesearch: 'true',
    lang: 'ko',
  });

  const url = `https://pixabay.com/api/?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[pixabay] API 요청 실패: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PixabayApiResponse = await response.json();
    return data.hits.map((hit) => ({
      id: hit.id,
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      user: hit.user,
    }));
  } catch (error) {
    console.error('[pixabay] 이미지 검색 중 오류가 발생했습니다:', error);
    return [];
  }
}

export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`이미지 다운로드 실패: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
