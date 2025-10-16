import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { adMobService } from '@/shared/api/services/admob';

/**
 * AdMob 배너 광고 컴포넌트 (헤더 아래 고정)
 */
const AdBanner: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 웹 환경에서는 광고를 표시하지 않음
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let mounted = true;

    const loadAd = async () => {
      try {
        console.log('🎯 Starting AdMob initialization...');
        await adMobService.initialize();
        console.log('✅ AdMob initialized');

        if (mounted) {
          console.log('📱 Showing banner ad...');
          await adMobService.showBannerBelowHeader();
          console.log('✅ Banner ad shown');
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('❌ Failed to load ad:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load ad');
        }
        // 광고 로드 실패해도 앱은 계속 실행
      }
    };

    // 딜레이를 주어 앱이 완전히 로드된 후 광고 로드
    const timer = setTimeout(() => {
      loadAd();
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
      // 컴포넌트 언마운트 시 광고 제거 (에러 무시)
      adMobService.removeBanner().catch(() => {
        // 에러 무시
      });
    };
  }, []);

  // 네이티브 플랫폼이 아니면 웹용 플레이스홀더 표시
  if (!Capacitor.isNativePlatform()) {
    return (
      <div
        style={{
          width: '100%',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '12px',
          color: '#999',
        }}
      >
        [광고 영역 - 웹에서는 표시되지 않음]
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    console.error('Ad error:', error);
  }

  // 네이티브 광고는 플러그인이 직접 렌더링하므로
  // 광고 높이만큼 공간만 확보 (ADAPTIVE_BANNER는 최대 90px)
  return (
    <div
      style={{
        width: '100%',
        height: '90px',
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default AdBanner;
