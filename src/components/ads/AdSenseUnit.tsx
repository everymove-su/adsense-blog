'use client';

import { useEffect } from 'react';
import { ADSENSE_CLIENT_ID, ADSENSE_SLOTS, AdSensePosition } from '@/constants/adsense';

interface AdSenseUnitProps {
  position: AdSensePosition;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseUnit({ position, className = '' }: AdSenseUnitProps) {
  const slotId = ADSENSE_SLOTS[position];

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 초기화 오류 무시
    }
  }, []);

  if (!ADSENSE_CLIENT_ID || ADSENSE_CLIENT_ID === 'ca-pub-0000000000000000') {
    return (
      <div className={`w-full bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center py-8 ${className}`}>
        <span className="text-gray-400 text-sm">광고 영역 ({position})</span>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
