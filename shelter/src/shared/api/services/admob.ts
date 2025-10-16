import { Capacitor } from '@capacitor/core';
import { SafeArea } from 'capacitor-plugin-safe-area';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdMobBannerSize,
} from '@capacitor-community/admob';

/**
 * ⚠️ 여기에 실제 AdMob ID를 입력하세요!
 *
 * AdMob 대시보드에서 받은 ID로 교체:
 * 1. https://admob.google.com 로그인
 * 2. 앱 선택 → App ID 복사
 * 3. 광고 단위 선택 → Ad Unit ID 복사
 *
 * 테스트 시에는 isTesting: true 설정 (아래 showBannerBelowHeader 참고)
 * 실제 배포 시에는 isTesting: false로 변경
 */
const AD_IDS = {
  android: {
    // TODO: 여기에 Android App ID 입력 (예: ca-app-pub-1234567890123456~1234567890)
    appId: 'ca-app-pub-6352567934659315~6702767075', // 👈 교체 필요!
    // TODO: 여기에 Android Banner Ad Unit ID 입력
    banner: 'ca-app-pub-6352567934659315/4777982320', // 👈 교체 필요!
  },
  ios: {
    // TODO: 여기에 iOS App ID 입력
    appId: 'ca-app-pub-3940256099942544~1458002511', // 👈 교체 필요!
    // TODO: 여기에 iOS Banner Ad Unit ID 입력
    banner: 'ca-app-pub-3940256099942544/2934735716', // 👈 교체 필요!
  },
};

class AdMobService {
  private initialized = false;
  private currentBannerId: string | null = null;

  /**
   * AdMob 초기화
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('✅ AdMob already initialized');
      return;
    }

    // 웹 환경에서는 초기화하지 않음
    if (!Capacitor.isNativePlatform()) {
      console.log('🌐 AdMob: Web platform detected, skipping initialization');
      return;
    }

    try {
      console.log('🔧 Initializing AdMob...');
      await AdMob.initialize({
        testingDevices: [], // 테스트 기기 ID (선택사항)
        initializeForTesting: false, // ⚠️ 실제 광고 사용 시 false로 설정!
      });

      this.initialized = true;
      console.log('✅ AdMob initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AdMob:', error);
      // 초기화 실패해도 앱은 계속 실행되도록 throw하지 않음
      // throw error;
    }
  }

  /**
   * Safe Area Top 값 가져오기
   */
  private async getSafeAreaTop(): Promise<number> {
    try {
      // 1. capacitor-plugin-safe-area를 사용하여 safe area 값 가져오기
      if (Capacitor.isNativePlatform()) {
        const safeAreaData = await SafeArea.getSafeAreaInsets();

        if (safeAreaData && safeAreaData.insets) {
          const topInset = safeAreaData.insets.top;
          console.log(`📏 Safe area top from SafeArea plugin: ${topInset}px`);
          return topInset;
        }
      }

      // 2. Fallback: CSS env(safe-area-inset-top) 확인
      const testDiv = document.createElement('div');
      testDiv.style.cssText =
        'padding-top: env(safe-area-inset-top); position: absolute; top: -9999px;';
      document.body.appendChild(testDiv);

      const paddingTop = parseFloat(getComputedStyle(testDiv).paddingTop);
      document.body.removeChild(testDiv);

      if (!isNaN(paddingTop) && paddingTop > 0) {
        console.log(`📏 Safe area top from CSS env(): ${paddingTop}px`);
        return paddingTop;
      }

      // 3. 최종 Fallback: 플랫폼별 기본값
      const platform = Capacitor.getPlatform();
      const defaultValue = platform === 'ios' ? 44 : 24; // iOS 노치 or Android 상태바
      console.log(`📏 Using default safe area top for ${platform}: ${defaultValue}px`);
      return defaultValue;
    } catch (error) {
      console.error('❌ Failed to get safe area top:', error);
      const platform = Capacitor.getPlatform();
      return platform === 'ios' ? 44 : 24;
    }
  }

  /**
   * 배너 광고 표시 (헤더 아래 고정)
   */
  async showBannerBelowHeader(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('🌐 AdMob: Web platform, skipping banner display');
      return;
    }

    if (!this.initialized) {
      console.log('⚠️ AdMob not initialized, initializing now...');
      await this.initialize();
    }

    if (!this.initialized) {
      console.log('⚠️ AdMob initialization failed, skipping banner display');
      return;
    }

    const platform = Capacitor.getPlatform();
    const adId = platform === 'android' ? AD_IDS.android.banner : AD_IDS.ios.banner;

    // Safe Area Top + 헤더 높이(50px) 계산
    const safeAreaTop = await this.getSafeAreaTop();
    const totalMargin = Math.round(safeAreaTop);

    const bannerOptions: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER, // 화면 너비에 맞춰 자동 조정
      position: BannerAdPosition.TOP_CENTER,
      margin: totalMargin,
      isTesting: false, // ⚠️ 테스트 완료 후 false로 변경!
    };

    try {
      console.log('📱 Showing banner with options:', bannerOptions);
      await AdMob.showBanner(bannerOptions);
      this.currentBannerId = adId;
      console.log('✅ Banner ad displayed successfully below header');
    } catch (error) {
      console.error('❌ Failed to show banner ad:', error);
      // 배너 표시 실패해도 앱은 계속 실행
      // throw error;
    }
  }

  /**
   * 배너 광고 숨기기
   */
  async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.currentBannerId) {
      return;
    }

    try {
      await AdMob.hideBanner();
      console.log('📍 Banner ad hidden');
    } catch (error) {
      console.error('❌ Failed to hide banner ad:', error);
    }
  }

  /**
   * 숨겨진 배너 광고 다시 표시
   */
  async resumeBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.currentBannerId) {
      return;
    }

    try {
      await AdMob.resumeBanner();
      console.log('📍 Banner ad resumed');
    } catch (error) {
      console.error('❌ Failed to resume banner ad:', error);
    }
  }

  /**
   * 배너 광고 제거
   */
  async removeBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.currentBannerId) {
      return;
    }

    try {
      await AdMob.removeBanner();
      this.currentBannerId = null;
      console.log('Banner ad removed');
    } catch (error) {
      console.error('Failed to remove banner ad:', error);
    }
  }

  /**
   * 현재 초기화 상태 확인
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const adMobService = new AdMobService();
