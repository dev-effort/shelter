import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { ShareService, SharedUrlInfo } from '@/shared/types/services';

/**
 * Share 서비스 구현
 * 외부 앱에서 공유된 링크를 수신하고 처리합니다.
 */
class ShareServiceImpl implements ShareService {
  private listeners: ((info: SharedUrlInfo) => void)[] = [];

  /**
   * 앱 URL Open 이벤트 리스너 등록
   */
  async initialize(): Promise<void> {
    try {
      // appUrlOpen 이벤트 리스너
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        try {
          const info = this.parseUrlEvent(event);
          if (info) {
            this.notifyListeners(info);
          }
        } catch (error) {
          console.error('Error in appUrlOpen listener:', error);
        }
      });

      // 앱 상태 변경 이벤트 리스너 (백그라운드에서 포그라운드로 전환 시)
      App.addListener('appStateChange', async (state) => {
        try {
          if (state.isActive) {
            // Android Share 데이터 확인
            const androidInfo = await this.checkAndroidShare();
            if (androidInfo) {
              this.notifyListeners(androidInfo);
              return;
            }

            // iOS URL Scheme 확인
            const launchUrl = await App.getLaunchUrl();
            if (launchUrl) {
              const info = this.parseUrl(launchUrl.url);
              if (info) {
                this.notifyListeners(info);
              }
            }
          }
        } catch (error) {
          console.error('Error in appStateChange listener:', error);
        }
      });

      // 초기화 시 공유 데이터 확인 (딜레이를 줘서 앱이 완전히 로드된 후 실행)
      setTimeout(async () => {
        try {
          const info = await this.checkAndroidShare();
          if (info) {
            console.log('Share data found on initialization:', info);
            this.notifyListeners(info);
          }
        } catch (error) {
          console.error('Error checking initial share data:', error);
        }
      }, 1000); // 1초 딜레이
    } catch (error) {
      console.error('Error initializing share service:', error);
    }
  }

  /**
   * URL Open 이벤트에서 공유 정보 추출
   */
  private parseUrlEvent(event: URLOpenListenerEvent): SharedUrlInfo | null {
    return this.parseUrl(event.url);
  }

  /**
   * URL에서 공유 정보 추출
   *
   * 예시 URL 형식:
   * - shelter://share?url=https://example.com&title=Example&text=Description
   * - shelter://add?url=https://example.com
   */
  private parseUrl(urlString: string): SharedUrlInfo | null {
    try {
      const url = new URL(urlString);

      // shelter:// 스킴 확인
      if (url.protocol !== 'shelter:') {
        return null;
      }

      // share 또는 add 경로 확인
      const host = url.host || url.pathname.split('/')[0];
      if (host !== 'share' && host !== 'add') {
        return null;
      }

      // URL 파라미터 추출
      const params = url.searchParams;
      const sharedUrl = params.get('url');

      if (!sharedUrl) {
        return null;
      }

      return {
        url: sharedUrl,
        title: params.get('title') || undefined,
        text: params.get('text') || undefined,
      };
    } catch (error) {
      console.error('Failed to parse share URL:', error);
      return null;
    }
  }

  /**
   * 공유 이벤트 리스너 등록
   */
  addListener(callback: (info: SharedUrlInfo) => void): void {
    this.listeners.push(callback);
  }

  /**
   * 공유 이벤트 리스너 제거
   */
  removeListener(callback: (info: SharedUrlInfo) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  /**
   * 등록된 리스너들에게 공유 정보 알림
   */
  private notifyListeners(info: SharedUrlInfo): void {
    this.listeners.forEach((listener) => {
      try {
        listener(info);
      } catch (error) {
        console.error('Share listener error:', error);
      }
    });
  }

  /**
   * 앱 시작 시 전달된 URL 확인 (처음 실행 시 공유로 시작된 경우)
   */
  async checkLaunchUrl(): Promise<SharedUrlInfo | null> {
    try {
      // Check Android Share first
      const androidShare = await this.checkAndroidShare();
      if (androidShare) {
        return androidShare;
      }

      // Check iOS URL scheme
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl) {
        return this.parseUrl(launchUrl.url);
      }
      return null;
    } catch (error) {
      console.error('Failed to check launch URL:', error);
      return null;
    }
  }

  /**
   * Android SharedPreferences에서 공유 데이터 확인
   */
  private async checkAndroidShare(): Promise<SharedUrlInfo | null> {
    try {
      // Check if there's a pending share
      const { value: sharePending } = await Preferences.get({ key: 'shelter_share_pending' });

      if (sharePending !== 'true') {
        return null;
      }

      // Get shared URL and title
      const { value: sharedUrl } = await Preferences.get({ key: 'shelter_shared_url' });
      const { value: sharedTitle } = await Preferences.get({ key: 'shelter_shared_title' });

      if (!sharedUrl) {
        return null;
      }

      // Clear the pending flag
      await Preferences.set({ key: 'shelter_share_pending', value: 'false' });

      return {
        url: sharedUrl,
        title: sharedTitle || undefined,
      };
    } catch (error) {
      console.error('Failed to check Android share:', error);
      return null;
    }
  }
}

export const shareService = new ShareServiceImpl();
