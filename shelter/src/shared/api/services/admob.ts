import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdMobBannerSize,
} from '@capacitor-community/admob';

/**
 * AdMob 테스트 광고 ID
 * 실제 배포 시에는 실제 광고 ID로 교체해야 합니다.
 */
const TEST_AD_IDS = {
  android: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    banner: 'ca-app-pub-3940256099942544/6300978111',
  },
  ios: {
    appId: 'ca-app-pub-3940256099942544~1458002511',
    banner: 'ca-app-pub-3940256099942544/2934735716',
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
        testingDevices: [],
        initializeForTesting: true,
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
    const adId = platform === 'android' ? TEST_AD_IDS.android.banner : TEST_AD_IDS.ios.banner;

    const bannerOptions: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 62, // 헤더 + safe area를 고려한 높이
      isTesting: true,
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
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
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
   * 배너 광고 재개
   */
  async resumeBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.currentBannerId) {
      return;
    }

    try {
      await AdMob.resumeBanner();
      console.log('Banner ad resumed');
    } catch (error) {
      console.error('Failed to resume banner ad:', error);
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
