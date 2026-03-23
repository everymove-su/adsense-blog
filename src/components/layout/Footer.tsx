import Link from 'next/link';
import { SITE_CONFIG } from '@/constants/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 저작권 */}
          <p className="text-sm text-gray-500">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>

          {/* 링크 목록 */}
          <nav className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              소개
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              개인정보처리방침
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/contact"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              문의하기
            </Link>
          </nav>
        </div>

        {/* 면책 문구 */}
        <p className="text-xs text-gray-400 text-center mt-4">
          본 블로그의 콘텐츠는 정보 제공 목적으로 작성되었습니다.
        </p>
      </div>
    </footer>
  );
}
