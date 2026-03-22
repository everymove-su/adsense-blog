import type { Metadata } from 'next';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: '소개',
  description: `${SITE_CONFIG.name} 블로그 소개 페이지입니다. 블로그 목적, 운영 원칙, 저작권 정책을 안내합니다.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* 페이지 헤더 */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">블로그 소개</h1>
        <p className="text-gray-500 text-lg">
          {SITE_CONFIG.name}에 오신 것을 환영합니다.
        </p>
      </header>

      {/* 광고 */}
      <div className="mb-10">
        <AdSenseUnit position="TOP" />
      </div>

      {/* 블로그 소개 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          블로그 목적
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {SITE_CONFIG.name}은 일상에서 쉽게 만들 수 있는 요리 레시피와 주방 팁을 공유하는 블로그입니다.
            바쁜 현대인들도 건강하고 맛있는 식사를 즐길 수 있도록 간단하고 실용적인 레시피를 소개해 드립니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            식재료의 영양 정보, 조리 방법, 보관 방법 등 요리에 관련된 다양한 정보도 함께 제공합니다.
            요리 초보자부터 경험 있는 분들까지 누구나 유용하게 활용할 수 있는 콘텐츠를 만들기 위해 노력하고 있습니다.
          </p>
        </div>
      </section>

      {/* 운영 원칙 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          운영 원칙
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <div>
              <strong className="text-gray-900 block mb-1">정확한 정보 제공</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                모든 레시피는 직접 테스트하거나 신뢰할 수 있는 출처를 기반으로 작성됩니다.
                부정확한 정보가 발견되면 즉시 수정합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <div>
              <strong className="text-gray-900 block mb-1">저작권 준수</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                본 블로그의 모든 이미지는 라이선스를 확인하여 사용하며, 출처를 명시합니다.
                타인의 저작물을 무단으로 사용하지 않습니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <div>
              <strong className="text-gray-900 block mb-1">개인정보 보호</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                방문자의 개인정보 보호를 중요시합니다. 수집되는 데이터와 사용 방법은
                개인정보처리방침 페이지에서 확인하실 수 있습니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <div>
              <strong className="text-gray-900 block mb-1">광고 정책</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                본 블로그는 Google AdSense를 통해 광고를 게재합니다. 광고 수익은 블로그 운영과
                콘텐츠 제작에 활용됩니다. 광고 콘텐츠는 블로그의 편집 방침에 영향을 미치지 않습니다.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* 저작권 정책 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          저작권 정책
        </h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-gray-700 leading-relaxed mb-3">
            본 블로그의 모든 콘텐츠(텍스트, 이미지, 영상 등)는 별도의 표시가 없는 한 블로그 운영자에게
            저작권이 있습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            콘텐츠를 인용하거나 공유하실 경우 반드시 출처를 명시해 주시기 바랍니다.
            상업적 목적의 무단 복제 및 배포는 금지됩니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            블로그에 사용된 이미지 중 외부 출처의 이미지는 각 이미지 하단에 출처를 표기하고 있습니다.
          </p>
        </div>
      </section>

      {/* 연락처 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          연락처
        </h2>
        <p className="text-gray-700 leading-relaxed">
          문의사항이 있으시면 이메일로 연락 주시기 바랍니다:{' '}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {SITE_CONFIG.email}
          </a>
        </p>
      </section>

      {/* 광고 - 하단 */}
      <div className="mt-10">
        <AdSenseUnit position="BOTTOM" />
      </div>
    </div>
  );
}
