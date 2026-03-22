# 애드센스 승인 목표 블로그 SW 설계서

**프로젝트명**: AdSense-Ready Blog
**작성일**: 2026-03-22
**버전**: v1.0.0

---

## 1. 기술 스택 선정 및 이유

### 1.1 핵심 기술 스택

| 분류 | 기술 | 선정 이유 |
|------|------|-----------|
| 프레임워크 | Next.js 15 (App Router) | SSG/SSR 혼합으로 SEO 최적화, 이미지 최적화, 메타데이터 API 내장 |
| 언어 | TypeScript | 타입 안전성, 유지보수성, IDE 자동완성 |
| 스타일링 | Tailwind CSS v4 | 유틸리티 퍼스트, 번들 크기 최소화, 반응형 설계 용이 |
| 콘텐츠 관리 | MDX (Markdown + JSX) | 마크다운으로 글 작성, 컴포넌트 삽입 가능, Git 기반 버전관리 |
| 형상관리 | GitHub | 예약 발행을 위한 GitHub Actions 활용, 무료 Private 저장소 |
| 배포 | Vercel | Next.js 공식 플랫폼, 자동 배포, Edge Network CDN, Analytics 무료 제공 |
| 패키지 관리 | pnpm | npm 대비 빠른 설치, 디스크 효율, workspace 지원 |

### 1.2 보조 라이브러리

| 분류 | 기술 | 용도 |
|------|------|------|
| MDX 처리 | next-mdx-remote + gray-matter | 프론트매터 파싱, MDX 렌더링 |
| 코드 하이라이팅 | rehype-pretty-code + shiki | 코드 블록 구문 강조 |
| SEO | next-sitemap | sitemap.xml, robots.txt 자동 생성 |
| 날짜 처리 | date-fns | 날짜 포맷, 예약 발행 로직 |
| 이미지 | Next.js Image (내장) + Plaiceholder | 이미지 최적화, 블러 플레이스홀더 |
| 분석 | Google Analytics 4 | 트래픽 분석, AdSense 연동 필수 |
| 검색 | Fuse.js | 클라이언트 사이드 전문 검색 |
| RSS | feed | RSS 2.0 / Atom 피드 생성 |
| 린팅 | ESLint + Prettier | 코드 품질 유지 |

### 1.3 기술 스택 선정 근거 (AdSense 관점)

- **Next.js SSG**: 크롤러가 읽을 수 있는 완전한 HTML 제공 → AdSense 정책 준수
- **MDX 파일 기반**: 외부 DB 없음 → 서버 비용 $0, Vercel 무료 티어로 운영 가능
- **Vercel CDN**: Core Web Vitals (LCP, FID, CLS) 자동 최적화 → 구글 품질 평가 통과
- **TypeScript**: 런타임 오류 방지 → 안정적인 사이트 운영

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    콘텐츠 작성 흐름                       │
│                                                         │
│  작성자 로컬 환경          GitHub                Vercel  │
│  ┌──────────────┐        ┌──────────┐         ┌──────┐  │
│  │ MDX 파일 작성 │──push──│  main    │─deploy──│ CDN  │  │
│  │ (VSCode)     │        │  branch  │         │ Edge │  │
│  └──────────────┘        └──────────┘         └──────┘  │
│                               │                    │    │
│  ┌──────────────┐             │                    │    │
│  │ 예약 발행 파일 │──push──│scheduled │─Actions──│build │  │
│  │ (publishAt)  │        │ branch   │         │      │  │
│  └──────────────┘        └──────────┘         └──────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    서비스 아키텍처                        │
│                                                         │
│  브라우저 (Chrome 최적화)                                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Next.js App Router (Static Site Generation)     │  │
│  │                                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │  │
│  │  │ 홈 페이지  │  │ 포스트   │  │  카테고리 페이지 │  │  │
│  │  │ (SSG)    │  │ (SSG)   │  │  (SSG)         │  │  │
│  │  └──────────┘  └──────────┘  └────────────────┘  │  │
│  │                                                   │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │              공통 레이아웃                     │ │  │
│  │  │  Header │ AdSense 광고 슬롯 │ Footer          │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  외부 서비스                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ Google   │  │ Google   │  │ Pixabay API             │ │
│  │ AdSense  │  │ Analytics│  │ (이미지 검색/다운로드)   │ │
│  └──────────┘  └──────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.1 빌드 및 배포 흐름

```
로컬 작성
    │
    ▼
git push (main 브랜치)
    │
    ▼
GitHub Actions 트리거
    ├── 예약 발행 검사 (publishAt <= 현재시간)
    ├── lint / type-check
    └── Vercel 자동 배포 트리거
            │
            ▼
        Next.js Build
            ├── MDX 파일 파싱 (gray-matter)
            ├── 정적 페이지 생성 (generateStaticParams)
            ├── sitemap.xml 생성
            └── RSS 피드 생성
                    │
                    ▼
                Vercel Edge Network 배포
```

### 2.2 예약 발행 아키텍처

```
GitHub Actions (Cron: 매시간 정각)
    │
    ▼
스크립트: check-scheduled-posts.ts
    │
    ├── posts/ 디렉토리의 모든 MDX 스캔
    ├── publishAt 필드가 현재 시각 이전인 파일 확인
    ├── status: "scheduled" → "published" 변경
    └── 변경사항 auto-commit → Vercel 재배포 트리거
```

---

## 3. 디렉토리 구조

```
blog/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Vercel 배포 워크플로우
│       └── scheduled-publish.yml  # 예약 발행 (매시간 실행)
│
├── public/
│   ├── images/
│   │   └── posts/                 # Pixabay 다운로드 이미지 (글당 1개)
│   │       └── {slug}/
│   │           └── thumbnail.webp
│   ├── ads.txt                    # AdSense 인증 파일
│   ├── robots.txt                 # 크롤러 제어
│   └── favicon.ico
│
├── content/
│   └── posts/                     # MDX 블로그 포스트
│       ├── 2026-03-22-post-slug.mdx
│       └── ...
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # 루트 레이아웃 (AdSense 스크립트 포함)
│   │   ├── page.tsx               # 홈 (포스트 목록)
│   │   ├── globals.css
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx           # 블로그 목록 페이지
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # 포스트 상세 페이지
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx           # 소개 페이지 (AdSense 필수)
│   │   │
│   │   ├── privacy-policy/
│   │   │   └── page.tsx           # 개인정보처리방침 (AdSense 필수)
│   │   │
│   │   ├── sitemap.ts             # Next.js 동적 사이트맵
│   │   ├── robots.ts              # Next.js robots 설정
│   │   └── feed.xml/
│   │       └── route.ts           # RSS 피드 엔드포인트
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── post/
│   │   │   ├── PostCard.tsx       # 목록 카드
│   │   │   ├── PostContent.tsx    # MDX 렌더러
│   │   │   ├── PostHeader.tsx     # H1, 메타 정보
│   │   │   └── TableOfContents.tsx
│   │   │
│   │   ├── ads/
│   │   │   ├── AdSenseUnit.tsx    # 광고 단위 컴포넌트
│   │   │   └── AdSenseInit.tsx    # AdSense 초기화 스크립트
│   │   │
│   │   ├── seo/
│   │   │   └── JsonLd.tsx         # 구조화 데이터 (Schema.org)
│   │   │
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Pagination.tsx
│   │       └── SearchBox.tsx
│   │
│   ├── lib/
│   │   ├── posts.ts               # MDX 파싱, 포스트 CRUD
│   │   ├── mdx.ts                 # MDX 컴파일 설정
│   │   ├── ai-humanizer.ts        # AI → 사람체 변환 유틸
│   │   └── pixabay.ts             # Pixabay API 클라이언트
│   │
│   ├── types/
│   │   └── post.ts                # TypeScript 타입 정의
│   │
│   └── constants/
│       ├── site.ts                # 사이트 메타데이터
│       └── adsense.ts             # AdSense 설정값
│
├── scripts/
│   ├── check-scheduled-posts.ts  # 예약 발행 실행 스크립트
│   └── new-post.ts               # 새 포스트 템플릿 생성 CLI
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local.example
```

---

## 4. 주요 기능 목록 (Feature List)

### 4.1 콘텐츠 관리

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| F-01 | MDX 포스트 작성 | P0 | 프론트매터 기반 메타데이터 + 마크다운 본문 |
| F-02 | 예약 발행 | P0 | `publishAt` 필드로 발행 시각 지정, GitHub Actions 처리 |
| F-03 | 포스트 목록 페이지네이션 | P1 | 10개씩, 이전/다음 페이지 |
| F-04 | 포스트 검색 | P2 | 제목/본문 클라이언트 사이드 전문검색 (Fuse.js) |
| F-05 | 관련 포스트 추천 | P2 | 태그 기반 하단 3개 표시 |
| F-06 | 목차 (TOC) 자동 생성 | P1 | H2/H3 헤딩 기반 네비게이션 |

### 4.2 SEO 기능

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| S-01 | 동적 메타데이터 | P0 | 포스트별 title, description, og:image 자동 설정 |
| S-02 | 사이트맵 자동 생성 | P0 | `sitemap.ts`로 빌드 시 생성 |
| S-03 | robots.txt | P0 | 크롤러 허용/차단 설정 |
| S-04 | Schema.org 구조화 데이터 | P1 | BlogPosting, BreadcrumbList JSON-LD |
| S-05 | Open Graph / Twitter Card | P0 | SNS 공유 미리보기 |
| S-06 | RSS 피드 | P1 | `/feed.xml` 엔드포인트 |
| S-07 | Canonical URL | P0 | 중복 콘텐츠 방지 |

### 4.3 AdSense 관련

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| A-01 | AdSense 스크립트 삽입 | P0 | `layout.tsx`의 `<head>`에 삽입 |
| A-02 | 광고 단위 배치 | P0 | 본문 상단/중간/하단 3곳 |
| A-03 | ads.txt 제공 | P0 | `/public/ads.txt` |
| A-04 | 개인정보처리방침 페이지 | P0 | AdSense 승인 필수 요건 |
| A-05 | 소개 페이지 | P0 | 운영자 정보, 블로그 소개 |

### 4.4 이미지 관리

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| I-01 | Pixabay 이미지 검색 CLI | P1 | 키워드로 이미지 검색, 자동 다운로드 |
| I-02 | 이미지 WebP 변환 | P1 | 빌드 시 자동 최적화 |
| I-03 | 블러 플레이스홀더 | P2 | Plaiceholder로 LCP 개선 |

### 4.5 AI 휴머나이저

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| H-01 | AI 텍스트 감지 회피 | P1 | 문장 패턴 변환, 경어체 통일 |
| H-02 | 맞춤법 검사 통합 | P1 | 공백/띄어쓰기 자동 교정 |
| H-03 | 글자 수 카운터 | P1 | 1500-1800자 범위 알림 |

---

## 5. 페이지 구성 (라우팅)

### 5.1 라우트 맵

```
/                           → 홈 (최신 포스트 6개 + 소개)
/blog                       → 포스트 전체 목록 (페이지네이션)
/blog/[slug]                → 포스트 상세
/about                      → 블로그 소개 및 운영자 정보
/privacy-policy             → 개인정보처리방침
/sitemap.xml                → 사이트맵 (Next.js 자동 생성)
/robots.txt                 → 크롤러 설정
/feed.xml                   → RSS 피드
```

### 5.2 페이지별 상세 설명

**홈 페이지 (`/`)**
- 블로그 한 줄 소개 (hero 섹션)
- 최신 포스트 카드 6개 (썸네일, 제목, 디스크립션 160자, 날짜)
- 광고 슬롯 1개 (포스트 목록 사이)
- 소개 섹션 링크

**블로그 목록 (`/blog`)**
- 포스트 카드 목록 (10개/페이지)
- 검색 박스
- 페이지네이션

**포스트 상세 (`/blog/[slug]`)**
- H1: 포스트 제목
- 대표 이미지 (Pixabay, WebP)
- 광고 슬롯 (상단)
- MDX 본문 (H2/H3/H4 구조)
- 광고 슬롯 (본문 중간)
- 맺음말
- 광고 슬롯 (하단)
- 관련 포스트 3개
- 목차 (우측 고정, 데스크탑)

**소개 페이지 (`/about`)**
- 블로그 목적, 운영자 소개
- 운영 원칙 (저작권, 출처 표기 등)
- 연락처

**개인정보처리방침 (`/privacy-policy`)**
- Google AdSense 쿠키 정책 안내
- Google Analytics 데이터 수집 안내
- 이용자 권리

---

## 6. 데이터 모델

### 6.1 포스트 프론트매터 스키마

```typescript
// src/types/post.ts

export type PostStatus = "draft" | "scheduled" | "published";

export interface PostFrontmatter {
  // 필수 필드
  title: string;           // 15-20자, 메인키워드 앞 배치
  description: string;     // 공백 포함 160자, 메인키워드 포함
  slug: string;            // URL 경로 (영문, 하이픈)
  publishAt: string;       // ISO 8601 (예약 발행용): "2026-03-22T10:00:00+09:00"
  status: PostStatus;      // "draft" | "scheduled" | "published"

  // 이미지
  thumbnail: string;       // "/images/posts/{slug}/thumbnail.webp"
  thumbnailAlt: string;    // 이미지 alt 텍스트 (SEO)
  thumbnailCredit: string; // Pixabay 출처 (예: "Photo by johndoe on Pixabay")

  // SEO
  keywords: string[];      // 주요 키워드 3-5개
  canonicalUrl?: string;   // 외부 원문 있을 경우

  // 분류
  category: string;        // 단일 카테고리 (예: "생활정보")
  tags: string[];          // 관련 태그

  // 포스트 메타
  author: string;          // 운영자명
  readingTime?: number;    // 자동 계산 (분)
  wordCount?: number;      // 자동 계산
}

export interface Post extends PostFrontmatter {
  content: string;         // MDX 원문
  excerpt: string;         // description 동일 또는 본문 앞 160자
}
```

### 6.2 MDX 파일 예시

```mdx
---
title: "간단한 김치찌개 레시피로 10분 만에 완성하기"
description: "간단한 김치찌개 레시피를 활용해 바쁜 평일 저녁에도 뚝딱 만들 수 있는 방법을 소개합니다. 재료 준비부터 불 조절까지 자세히 알려드립니다."
slug: "simple-kimchi-jjigae-recipe"
publishAt: "2026-03-22T10:00:00+09:00"
status: "scheduled"
thumbnail: "/images/posts/simple-kimchi-jjigae-recipe/thumbnail.webp"
thumbnailAlt: "뚝배기에 담긴 김치찌개"
thumbnailCredit: "Photo by koreanfood on Pixabay"
keywords: ["김치찌개 레시피", "간단한 레시피", "집밥"]
category: "요리"
tags: ["한식", "찌개", "레시피"]
author: "블로그 운영자"
---

# 간단한 김치찌개 레시피로 10분 만에 완성하기

![뚝배기에 담긴 김치찌개](/images/posts/...)

## 재료 준비하기

...본문 H2 섹션 (500자 내외)...

### 신선한 재료 고르는 법

...H3 서브섹션...

## 조리 순서

...

## 맺음말

...반드시 포함...
```

### 6.3 사이트 설정 모델

```typescript
// src/constants/site.ts

export const SITE_CONFIG = {
  name: string;
  url: string;            // https://yourdomain.com
  description: string;
  author: {
    name: string;
    email: string;
  };
  category: string;       // 단일 카테고리명
  postsPerPage: number;   // 10
  adsense: {
    publisherId: string;  // "ca-pub-xxxxxxxxxxxxxxxx"
    slots: {
      topBanner: string;
      inContent: string;
      bottomBanner: string;
    };
  };
  ga4MeasurementId: string; // "G-XXXXXXXXXX"
  pixabayApiKey: string;    // 환경변수로 관리
};
```

---

## 7. SEO 전략

### 7.1 온페이지 SEO 체크리스트

**타이틀 전략**
- 형식: `{메인키워드} - {보조설명} | {블로그명}`
- 길이: 15-20자 (한국어 기준)
- 메인키워드를 타이틀 앞에 배치
- 예시: `간단한 김치찌개 레시피 | 오늘의 집밥`

**메타 디스크립션**
- 공백 포함 정확히 160자 작성
- 첫 문장에 메인키워드 포함
- 클릭을 유도하는 행동 지향적 문장

**헤딩 구조**
```
H1 (1개): 포스트 제목 = 메타 타이틀
  H2 (2-4개): 주요 섹션 (500자 내외)
    H3: 세부 항목
      H4: 개념 설명
```

**이미지 SEO**
- `alt` 속성: 키워드 포함 자연스러운 설명
- 파일명: `{slug}-main.webp` (영문, 하이픈)
- WebP 포맷: 용량 최소화
- `width`, `height` 명시: CLS 방지

### 7.2 기술적 SEO

```typescript
// 포스트 페이지 메타데이터 생성 예시
// src/app/blog/[slug]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.description,           // 160자
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [{ url: post.thumbnail, alt: post.thumbnailAlt }],
      type: "article",
      publishedTime: post.publishAt,
    },
  };
}
```

**Schema.org 구조화 데이터 (JSON-LD)**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "포스트 제목",
  "description": "160자 디스크립션",
  "image": "썸네일 URL",
  "author": {
    "@type": "Person",
    "name": "운영자명"
  },
  "datePublished": "2026-03-22",
  "dateModified": "2026-03-22",
  "publisher": {
    "@type": "Organization",
    "name": "블로그명"
  }
}
```

### 7.3 Core Web Vitals 최적화

| 지표 | 목표값 | 전략 |
|------|--------|------|
| LCP | < 2.5초 | Next.js Image 우선 로딩, WebP, CDN |
| FID/INP | < 100ms | 클라이언트 JS 최소화, SSG 활용 |
| CLS | < 0.1 | 이미지 width/height 고정, 폰트 preload |
| TTFB | < 800ms | Vercel Edge, SSG 캐시 활용 |

### 7.4 AdSense 승인 필수 요건

1. **콘텐츠 충분성**: 20개 이상 포스트, 각 1500-1800자
2. **필수 페이지**: About, Privacy Policy
3. **독창적 콘텐츠**: AI 생성 후 반드시 사람 글 변환
4. **네비게이션**: 명확한 메뉴 구조
5. **광고 과다 배치 금지**: 본문당 최대 3개 슬롯
6. **모바일 친화적**: Tailwind 반응형 필수
7. **로딩 속도**: Core Web Vitals 통과
8. **ads.txt**: 도메인 루트에 올바른 형식 제공

---

## 8. 개발 단계 (Phase)

### Phase 1 — 기반 구축 (1-2일)

**목표**: 사이트 뼈대 완성, AdSense 신청 가능한 상태

```
[ ] Next.js 15 + TypeScript + Tailwind CSS 프로젝트 초기화
[ ] pnpm 설정, ESLint/Prettier 구성
[ ] GitHub 저장소 생성, Vercel 연동
[ ] 기본 레이아웃 (Header, Footer, Navigation)
[ ] MDX 파이프라인 구성 (gray-matter, next-mdx-remote)
[ ] 포스트 타입 정의 (TypeScript)
[ ] 홈 페이지 기본 구조
[ ] 블로그 목록 + 상세 페이지 라우팅
[ ] About 페이지
[ ] Privacy Policy 페이지
[ ] 도메인 연결 (Vercel Custom Domain)
```

### Phase 2 — SEO 최적화 (1일)

**목표**: 구글 인덱싱 준비 완료

```
[ ] 동적 메타데이터 생성 (generateMetadata)
[ ] Open Graph / Twitter Card
[ ] JSON-LD 구조화 데이터
[ ] sitemap.ts 동적 생성
[ ] robots.ts 설정
[ ] RSS 피드 (/feed.xml)
[ ] Canonical URL
[ ] 이미지 alt 속성 체계화
[ ] Google Search Console 등록
[ ] Google Analytics 4 연동
```

### Phase 3 — 콘텐츠 작성 (3-5일)

**목표**: 20개 이상 포스트 발행, AdSense 신청

```
[ ] Pixabay API 연동 및 이미지 다운로드 CLI
[ ] AI 휴머나이저 유틸 구성
[ ] new-post CLI 스크립트 (템플릿 자동 생성)
[ ] 예약 발행 GitHub Actions 구성
[ ] 포스트 20개 이상 작성 및 발행
    - 요리 레시피: 7개
    - 영화 리뷰: 7개
    - 스포츠 정보: 6개
[ ] Google AdSense 신청
```

### Phase 4 — 심화 기능 (승인 이후)

**목표**: 사용자 경험 개선, 트래픽 증대

```
[ ] 광고 단위 배치 최적화 (AdSense 승인 후)
[ ] 목차(TOC) 우측 고정 (데스크탑)
[ ] 관련 포스트 추천
[ ] 클라이언트 사이드 검색 (Fuse.js)
[ ] 다크모드
[ ] 페이지 뷰 카운터
[ ] 포스트 공유 버튼 (카카오, 네이버)
```

---

## 9. Sub-Agent 작업 분담 방안

### 9.1 분담 원칙

- **Agent A (인프라 & SEO)**: 기술 인프라, MDX 파이프라인, SEO 시스템 구축
- **Agent B (UI & 콘텐츠)**: UI/UX 컴포넌트, 페이지, 콘텐츠 파이프라인
- 두 에이전트는 `src/types/post.ts` 타입 정의를 공유 계약으로 삼아 병렬 작업

### 9.2 Agent A — 인프라 & SEO 에이전트

**담당 영역**

```
작업 범위:
├── next.config.ts              # 이미지 도메인, MDX 플러그인 설정
├── src/lib/posts.ts            # MDX 파싱 엔진, 포스트 CRUD
├── src/lib/mdx.ts              # rehype/remark 플러그인 체인
├── src/app/sitemap.ts          # 동적 사이트맵
├── src/app/robots.ts           # 크롤러 설정
├── src/app/feed.xml/route.ts   # RSS 피드
├── src/app/layout.tsx          # AdSense 스크립트, GA4 삽입
├── src/components/seo/         # JSON-LD 구조화 데이터
├── src/constants/              # 사이트 설정, AdSense 슬롯
├── scripts/                    # 예약 발행, new-post CLI
├── .github/workflows/          # CI/CD, 예약 발행 Actions
└── public/ads.txt
```

### 9.3 Agent B — UI/UX & 콘텐츠 에이전트

**담당 영역**

```
작업 범위:
├── src/app/page.tsx                  # 홈 페이지
├── src/app/blog/page.tsx             # 목록 페이지
├── src/app/blog/[slug]/page.tsx      # 상세 페이지
├── src/app/about/page.tsx            # 소개 페이지
├── src/app/privacy-policy/page.tsx   # 개인정보처리방침
├── src/components/layout/            # Header, Footer, Navigation
├── src/components/post/              # PostCard, PostContent, PostHeader, TOC
├── src/components/ads/               # AdSenseUnit, 광고 슬롯 배치
├── src/components/ui/                # Badge, Pagination, SearchBox
├── src/lib/ai-humanizer.ts           # AI → 사람체 변환 유틸
├── src/lib/pixabay.ts                # Pixabay API 클라이언트
└── content/posts/                    # 초기 20개 포스트 MDX 작성
```

### 9.4 에이전트 간 인터페이스 (공유 계약)

```typescript
// Agent A가 export하는 함수 (Agent B가 페이지에서 사용)
export async function getAllPosts(): Promise<Post[]>
export async function getPostBySlug(slug: string): Promise<Post>
export async function getPublishedPosts(): Promise<Post[]>
export async function getRelatedPosts(slug: string, limit: number): Promise<Post[]>
```

### 9.5 작업 순서 (의존성 그래프)

```
Day 1 (병렬)
├── Agent A: next.config.ts + src/lib/posts.ts + src/types/post.ts
└── Agent B: src/components/layout/ + Tailwind 기반 디자인 시스템

Day 2 (A 선행 필요)
├── Agent A: sitemap.ts + robots.ts + RSS + AdSense 스크립트
└── Agent B: PostCard + PostContent + 홈/목록/상세 페이지 (posts.ts 의존)

Day 3 (병렬)
├── Agent A: 예약 발행 Actions + 성능 최적화
└── Agent B: About + Privacy Policy + AI 휴머나이저 + Pixabay CLI

Day 4-5 (Agent B 중심)
└── Agent B: 포스트 20개 MDX 작성 (Agent A의 예약 발행 시스템 활용)
```

---

## 10. 환경 변수 목록

```bash
# .env.local.example

# 사이트
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=블로그명

# Google
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx

# Pixabay
PIXABAY_API_KEY=your_pixabay_api_key

# AdSense 광고 슬롯 ID
NEXT_PUBLIC_ADSENSE_SLOT_TOP=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=xxxxxxxxxx
```

---

## 11. AdSense 승인 체크리스트

```
콘텐츠
[ ] 포스트 20개 이상 발행 완료
[ ] 각 포스트 1500-1800자 (A4 한 장)
[ ] 경어체 통일 ("했습니다", "합니다")
[ ] 포스트당 이미지 1개 (Pixabay, alt 속성 포함)
[ ] 민감한 주제 (도박, 성인, 정치적 선동 등) 없음
[ ] AI 생성 텍스트 → 사람 글 변환 완료

페이지 구조
[ ] About 페이지 존재
[ ] Privacy Policy 페이지 존재
[ ] 명확한 네비게이션 메뉴
[ ] 푸터에 사이트명, 저작권 표시

기술 요건
[ ] ads.txt 루트 도메인에 존재
[ ] 사이트맵 Google Search Console에 제출
[ ] Core Web Vitals: 모두 "Good" 등급
[ ] HTTPS (Vercel 기본 제공)
[ ] 모바일 친화적 (Mobile-Friendly Test 통과)
[ ] 페이지 로딩 속도 3초 이내

SEO
[ ] 각 포스트 고유한 title (15-20자)
[ ] 각 포스트 고유한 description (160자)
[ ] canonical URL 설정
[ ] Google Search Console 인덱싱 요청 완료
```
