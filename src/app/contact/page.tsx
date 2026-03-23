import type { Metadata } from 'next';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: '문의하기',
  description: `${SITE_CONFIG.name}에 문의사항이 있으시면 이메일로 연락해 주세요. 레시피 제안, 오류 신고, 광고 문의 등을 받고 있습니다.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* 페이지 헤더 */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">문의하기</h1>
        <p className="text-gray-500 text-lg">
          궁금한 점이 있으시면 언제든지 연락해 주세요.
        </p>
      </header>

      {/* 광고 */}
      <div className="mb-10">
        <AdSenseUnit position="TOP" />
      </div>

      {/* 이메일 문의 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          이메일 문의
        </h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            문의사항은 아래 이메일로 보내 주시면 확인 후 빠르게 답변드리겠습니다.
          </p>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {SITE_CONFIG.email}
          </a>
        </div>
      </section>

      {/* 문의 유형 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          이런 문의를 받고 있어요
        </h2>
        <ul className="space-y-3">
          {[
            { title: '레시피 제안', desc: '소개해 드렸으면 하는 레시피가 있으신가요? 알려 주세요.' },
            { title: '오류 신고', desc: '레시피 내용 중 잘못된 부분이 있다면 알려 주시면 바로 수정하겠습니다.' },
            { title: '저작권 문의', desc: '콘텐츠 사용 및 저작권 관련 문의는 이메일로 해주세요.' },
            { title: '광고 및 협업 문의', desc: '광고, 협찬, 콜라보레이션 관련 문의도 환영합니다.' },
          ].map((item) => (
            <li key={item.title} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-lg">
              <span className="mt-0.5 text-blue-500 font-bold shrink-0">•</span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 안내 */}
      <section className="mb-10">
        <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-800 leading-relaxed">
          문의 내용에 따라 답변까지 1~3 영업일이 소요될 수 있습니다. 스팸으로 분류되는 경우가 있으니
          답장이 없을 경우 스팸함을 확인해 주세요.
        </div>
      </section>

      {/* 광고 - 하단 */}
      <div className="mt-10">
        <AdSenseUnit position="BOTTOM" />
      </div>
    </div>
  );
}
