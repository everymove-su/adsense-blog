import type { Metadata } from 'next';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: '소개',
  description: `${SITE_CONFIG.name} 블로그 소개 페이지입니다. 10년 넘게 한식을 직접 만들어온 운영자가 실패와 시행착오를 통해 찾아낸 황금 비율 레시피를 공유합니다.`,
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
          블로그 소개
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            어릴 때부터 엄마가 해주시는 된장찌개 냄새, 갓 지은 밥에 얹어 먹던 깍두기 맛이 늘 좋았습니다.
            그게 당연한 일상인 줄만 알았는데, 혼자 살기 시작하면서 그 맛이 얼마나 특별한 것이었는지 비로소 알게 됐어요.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            처음 혼자 된장찌개를 끓였을 때는 정말 형편없었습니다. 간이 맞지 않아서 짜거나 싱겁고, 순서를 잘못 넣어서
            두부가 으스러지거나, 육수를 제대로 안 냈더니 감칠맛이 하나도 없었죠. 유명한 레시피를 따라해도
            &ldquo;왜 내가 만들면 이 맛이 안 나지?&rdquo; 하는 의문이 항상 있었어요.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            그때부터 같은 요리를 반복해서 만들면서 기록하기 시작했습니다. 재료의 양을 조금씩 바꿔보고,
            불 세기를 달리해보고, 넣는 순서를 바꿔보면서 &ldquo;이 비율일 때 제일 맛있다&rdquo;는 걸 하나씩 찾아나갔어요.
            이 블로그는 그 기록들을 모은 곳입니다. 저처럼 한식이 먹고 싶은데 어디서부터 시작해야 할지
            모르는 분들께 조금이라도 도움이 됐으면 해서 시작했습니다.
          </p>
        </div>
      </section>

      {/* 운영자 소개 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          운영자 소개
        </h2>
        <div className="bg-orange-50 rounded-xl p-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            한식 요리를 직접 만들어온 지 10년이 넘었습니다. 전문 셰프가 아니라 그냥 먹는 걸 좋아하는
            평범한 사람입니다. 요리학원을 다닌 적도 없고, 특별한 자격증이 있는 것도 아니에요.
            다만 &ldquo;어떻게 하면 집에서도 식당 맛이 날까&rdquo;를 고민하면서 수없이 만들어보고 실패하고
            다시 도전해왔습니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            제가 특히 집중하는 부분은 <strong className="text-gray-900">황금 비율</strong>입니다.
            간장은 몇 큰술, 설탕은 얼마나, 고춧가루는 어느 정도가 들어가야 균형이 맞는지—
            레시피마다 그 비율을 찾아내는 게 저한테는 일종의 취미이자 낙이 됐어요.
            블로그에 올리는 레시피는 최소 서너 번 이상 직접 만들어보고, 맛이 일정하게 재현된다고
            확인한 다음에 올립니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            집에서도 충분히 맛있는 한식을 만들 수 있다고 믿습니다. 비싼 재료나 특별한 도구가 없어도,
            비율과 방법만 제대로 알면 누구든지 가능하다는 걸 이 블로그를 통해 보여드리고 싶어요.
          </p>
        </div>
      </section>

      {/* 이 블로그만의 특징 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          이 블로그만의 특징
        </h2>
        <ul className="space-y-5">
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <div>
              <strong className="text-gray-900 block mb-1">황금 비율 공개</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                &ldquo;적당히&rdquo;, &ldquo;조금&rdquo; 같은 모호한 표현 대신, 실제로 맛있게 나온 정확한 계량을 공개합니다.
                여러 번 테스트해서 가장 일정하게 좋은 맛이 나오는 비율을 찾아낸 것들만 올립니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <div>
              <strong className="text-gray-900 block mb-1">실패 원인 분석</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                직접 실패해봤기 때문에 어디서 잘못되는지 압니다. 각 레시피마다 흔히 하는 실수와
                그 이유를 설명해서, 처음 만드는 분도 덜 헤매도록 했습니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <div>
              <strong className="text-gray-900 block mb-1">재료 대체 방법</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                구하기 어렵거나 비싼 재료는 대체할 수 있는 것들을 함께 알려드립니다.
                없는 재료 때문에 레시피를 포기하지 않아도 되도록요.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <div>
              <strong className="text-gray-900 block mb-1">보관 및 활용법</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                혼자 살거나 소량만 만들면 남은 음식이 고민이죠. 냉장·냉동 보관 방법과
                남은 재료나 음식을 다른 요리에 활용하는 방법도 함께 안내합니다.
              </p>
            </div>
          </li>
        </ul>
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
              <strong className="text-gray-900 block mb-1">직접 만들어보고 올립니다</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                블로그에 올라오는 모든 레시피는 제가 직접 여러 번 만들어보고 검증한 것들입니다.
                잘못된 내용이 있으면 알려주시면 바로 수정하겠습니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <div>
              <strong className="text-gray-900 block mb-1">저작권 준수</strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                블로그의 모든 이미지는 라이선스를 확인하여 사용하며, 출처를 명시합니다.
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
                블로그 운영을 위해 Google AdSense 광고를 게재하고 있습니다. 광고 수익은
                더 좋은 콘텐츠를 만드는 데 쓰입니다. 광고가 레시피 내용에 영향을 미치는 일은 없습니다.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* 연락처 */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
          연락처
        </h2>
        <p className="text-gray-700 leading-relaxed">
          레시피에 대한 질문, 수정 제안, 기타 문의는 이메일로 편하게 연락 주세요.{' '}
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
