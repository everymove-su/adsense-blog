import type { Metadata } from 'next';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${SITE_CONFIG.name}의 개인정보처리방침입니다. Google AdSense 및 Google Analytics 관련 쿠키 정책을 안내합니다.`,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '2026년 3월 22일';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* 페이지 헤더 */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">개인정보처리방침</h1>
        <p className="text-gray-500 text-sm">최종 업데이트: {lastUpdated}</p>
      </header>

      {/* 광고 */}
      <div className="mb-10">
        <AdSenseUnit position="TOP" />
      </div>

      <div className="prose max-w-none space-y-10">
        {/* 1조 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            제1조 (개인정보의 처리 목적)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {SITE_CONFIG.name}(이하 &quot;블로그&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다.
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
            별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>• 방문자 통계 분석 및 서비스 개선</li>
            <li>• 맞춤형 광고 제공 (Google AdSense)</li>
            <li>• 웹사이트 이용 현황 파악 (Google Analytics)</li>
          </ul>
        </section>

        {/* 2조 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            제2조 (개인정보의 처리 및 보유 기간)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            블로그는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Google Analytics 데이터는 기본적으로 26개월간 보유됩니다. 이 기간은 Google Analytics
            설정에서 변경될 수 있습니다.
          </p>
        </section>

        {/* 3조 - 쿠키 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            제3조 (쿠키(Cookie) 사용)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            본 블로그는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는
            &quot;쿠키(cookie)&quot;를 사용합니다.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에 보내는 소량의 정보이며
            이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-4">
            <h3 className="font-bold text-gray-900 mb-2">Google AdSense 쿠키</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              본 블로그는 Google AdSense를 통해 광고를 게재합니다. Google AdSense는 관련성 높은 광고를
              표시하기 위해 쿠키를 사용합니다. Google의 광고 쿠키 사용 방식에 대한 자세한 내용은
              아래 링크에서 확인하실 수 있습니다.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                •{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google 광고 정책
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  광고 설정 (맞춤 광고 비활성화 가능)
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
            <h3 className="font-bold text-gray-900 mb-2">Google Analytics 쿠키</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              본 블로그는 Google Analytics 4를 사용하여 웹사이트 트래픽을 분석합니다.
              Google Analytics는 쿠키를 사용하여 이용자가 웹사이트를 어떻게 이용하는지에 대한
              정보를 수집합니다. 수집되는 정보에는 IP 주소, 방문 페이지, 체류 시간 등이 포함됩니다.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                •{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google 개인정보처리방침
                </a>
              </li>
              <li>
                •{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Analytics 수집 거부 (옵트아웃 플러그인)
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* 4조 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            제4조 (정보주체의 권리·의무 및 행사방법)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• 개인정보 처리에 관한 정보를 제공받을 권리</li>
            <li>• 개인정보의 열람을 요구할 권리</li>
            <li>• 개인정보의 정정·삭제를 요구할 권리</li>
            <li>• 개인정보의 처리를 정지할 것을 요구할 권리</li>
            <li>• 개인정보의 처리로 인하여 발생한 피해에 대해 구제를 받을 권리</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            위와 같은 권리 행사는 이메일({' '}
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-blue-600 hover:underline">
              {SITE_CONFIG.email}
            </a>
            )을 통해 요청하실 수 있습니다.
          </p>
        </section>

        {/* 5조 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            제5조 (개인정보보호 책임자)
          </h2>
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-700">
              <strong>책임자:</strong> {SITE_CONFIG.author}
            </p>
            <p className="text-gray-700 mt-1">
              <strong>이메일:</strong>{' '}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-blue-600 hover:underline">
                {SITE_CONFIG.email}
              </a>
            </p>
          </div>
        </section>

        {/* 6조 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            제6조 (개인정보처리방침 변경)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이
            있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            본 방침은 {lastUpdated}부터 시행됩니다.
          </p>
        </section>
      </div>

      {/* 광고 - 하단 */}
      <div className="mt-12">
        <AdSenseUnit position="BOTTOM" />
      </div>
    </div>
  );
}
