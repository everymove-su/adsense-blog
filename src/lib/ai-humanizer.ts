/**
 * AI 텍스트를 사람이 쓴 것처럼 자연스럽게 변환하는 유틸리티
 */

/** 경어체 통일: ~했어요/~해요 → ~했습니다/~합니다 */
function normalizeHonorific(text: string): string {
  return (
    text
      // ~했어요 → ~했습니다
      .replace(/했어요/g, '했습니다')
      .replace(/됐어요/g, '됐습니다')
      .replace(/됐어요/g, '되었습니다')
      // ~해요 → ~합니다
      .replace(/해요\b/g, '합니다')
      .replace(/이에요\b/g, '입니다')
      .replace(/예요\b/g, '입니다')
      // ~이에요 → ~입니다
      .replace(/([가-힣])이에요/g, '$1입니다')
      // ~세요 → ~십시오
      .replace(/하세요\b/g, '하십시오')
      // ~가요 → ~갑니다
      .replace(/가요\b/g, '갑니다')
      // ~와요/~와요 → ~옵니다
      .replace(/와요\b/g, '옵니다')
      // ~봐요 → ~봅니다
      .replace(/봐요\b/g, '봅니다')
      // ~줘요 → ~줍니다
      .replace(/줘요\b/g, '줍니다')
  );
}

/** 구어체 패턴 제거 및 자연스러운 문어체로 변환 */
function removeColloquialPatterns(text: string): string {
  return (
    text
      // "근데" → "그런데"
      .replace(/\b근데\b/g, '그런데')
      // "근데요" → "그런데"
      .replace(/\b근데요\b/g, '그런데')
      // "그리고" (문장 시작에 단독 사용) → "또한"
      .replace(/^그리고\s+/gm, '또한 ')
      // "또한" 중복 → "아울러"
      .replace(/또한\s+또한/g, '아울러')
      // "일단" → "우선"
      .replace(/\b일단\b/g, '우선')
      // "근본적으로" 앞 접속사 정리 — 불필요한 "그리고" 반복 줄이기
      .replace(/그리고 그리고/g, '그리고')
      // "뭔가" → "무언가"
      .replace(/\b뭔가\b/g, '무언가')
      // "좀" → "조금" (문장 내에서)
      .replace(/\s좀\s/g, ' 조금 ')
      // "진짜" → "정말"
      .replace(/\b진짜\b/g, '정말')
      // "엄청" → "매우"
      .replace(/\b엄청\b/g, '매우')
      // "완전히" 과용 → "전적으로" 또는 그대로
      // "어쨌든" → "어쨌든" (유지, 이미 문어체)
      // "막" → "마구" or 제거
      .replace(/\s막\s/g, ' 마구 ')
  );
}

/** 중복 공백 및 줄바꿈 정리 */
function cleanWhitespace(text: string): string {
  return (
    text
      // 연속된 공백 → 단일 공백
      .replace(/[ \t]+/g, ' ')
      // 3개 이상 연속 줄바꿈 → 2개
      .replace(/\n{3,}/g, '\n\n')
      // 줄 끝 공백 제거
      .replace(/[ \t]+$/gm, '')
      .trim()
  );
}

/**
 * AI가 생성한 텍스트를 사람이 쓴 것처럼 자연스럽게 변환합니다.
 */
export function humanizeText(text: string): string {
  let result = text;
  result = normalizeHonorific(result);
  result = removeColloquialPatterns(result);
  result = cleanWhitespace(result);
  return result;
}

/**
 * 글자 수를 카운트합니다.
 * @param text 대상 텍스트
 * @param includeSpaces 공백 포함 여부 (기본값: true)
 */
export function countChars(text: string, includeSpaces: boolean = true): number {
  if (includeSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, '').length;
}

/**
 * 본문 글자 수가 1,500~1,800자 범위 내에 있는지 확인합니다.
 * 마크다운 헤더, 프론트매터, 코드블록을 제외한 순수 본문 기준입니다.
 */
export function checkWordCount(text: string): {
  count: number;
  isValid: boolean;
  message: string;
} {
  // 마크다운 문법 요소 제거
  const cleaned = text
    .replace(/^---[\s\S]*?---/m, '') // 프론트매터 제거
    .replace(/```[\s\S]*?```/g, '') // 코드블록 제거
    .replace(/`[^`]+`/g, '') // 인라인 코드 제거
    .replace(/^#{1,6}\s+/gm, '') // 헤더 마크다운 기호 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 → 텍스트만
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // 이미지 제거
    .replace(/[*_~]/g, '') // 강조 기호 제거
    .replace(/^\s*[-*+]\s+/gm, '') // 목록 기호 제거
    .replace(/^\s*\d+\.\s+/gm, '') // 번호 목록 기호 제거
    .trim();

  const count = countChars(cleaned, true);
  const MIN = 1500;
  const MAX = 1800;

  if (count < MIN) {
    return {
      count,
      isValid: false,
      message: `글자 수 부족: ${count}자 (최소 ${MIN}자 필요, ${MIN - count}자 추가 필요)`,
    };
  }

  if (count > MAX) {
    return {
      count,
      isValid: false,
      message: `글자 수 초과: ${count}자 (최대 ${MAX}자, ${count - MAX}자 초과)`,
    };
  }

  return {
    count,
    isValid: true,
    message: `글자 수 적합: ${count}자 (${MIN}~${MAX}자 범위 내)`,
  };
}
