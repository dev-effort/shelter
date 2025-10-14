import { Browser } from '@capacitor/browser';
import { URLService } from '@/shared/types/services';

/**
 * 도메인별 네이티브 앱 스킴 매핑
 */
const APP_SCHEME_MAP: Record<string, string> = {
  'youtube.com': 'youtube://',
  'youtu.be': 'youtube://',
  'www.youtube.com': 'youtube://',
  'm.youtube.com': 'youtube://',
  'instagram.com': 'instagram://',
  'www.instagram.com': 'instagram://',
  'twitter.com': 'twitter://',
  'x.com': 'twitter://',
  'www.twitter.com': 'twitter://',
  'facebook.com': 'fb://',
  'www.facebook.com': 'fb://',
  'm.facebook.com': 'fb://',
  'spotify.com': 'spotify://',
  'open.spotify.com': 'spotify://',
  'reddit.com': 'reddit://',
  'www.reddit.com': 'reddit://',
  'tiktok.com': 'tiktok://',
  'www.tiktok.com': 'tiktok://',
};

/**
 * URL 서비스 구현
 * 링크를 네이티브 앱 또는 브라우저로 엽니다.
 */
class URLServiceImpl implements URLService {
  /**
   * URL 열기 (저장된 원본 URL을 그대로 사용)
   */
  async openURL(url: string, preferNativeApp: boolean = true): Promise<void> {
    try {
      if (!this.validateURL(url)) {
        throw new Error('Invalid URL format');
      }

      console.log('🔗 Opening URL (original):', url);

      // 원본 URL을 그대로 anchor 태그로 열기
      // 시스템이 자동으로 적절한 앱을 선택 (유튜브 앱, 인스타그램 앱 등)
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.style.display = 'none';

      document.body.appendChild(anchor);

      // 클릭 이벤트 트리거
      anchor.click();

      console.log('✅ URL opened via anchor tag');

      // 정리
      setTimeout(() => {
        if (document.body.contains(anchor)) {
          document.body.removeChild(anchor);
        }
      }, 500);
    } catch (error) {
      console.error('Failed to open URL:', error);
      throw error;
    }
  }

  /**
   * 네이티브 앱으로 열 수 있는지 확인
   */
  async canOpenInNativeApp(url: string): Promise<boolean> {
    try {
      const domain = this.extractDomain(url);
      if (!domain) return false;

      // APP_SCHEME_MAP에 등록된 도메인인지 확인
      return domain in APP_SCHEME_MAP;
    } catch (error) {
      console.error('Error checking native app availability:', error);
      return false;
    }
  }

  /**
   * URL을 앱 스킴으로 변환
   */
  private convertToAppUrl(url: string): string | null {
    try {
      const domain = this.extractDomain(url);
      if (!domain) return null;

      const appScheme = APP_SCHEME_MAP[domain];
      if (!appScheme) return null;

      const urlObj = new URL(url);

      // 유튜브 특수 처리
      if (domain.includes('youtube.com') || domain === 'youtu.be') {
        const videoId = this.extractYoutubeVideoId(url);
        if (videoId) {
          return `youtube://watch?v=${videoId}`;
        }
      }

      // 인스타그램 특수 처리
      if (domain.includes('instagram.com')) {
        // instagram://로 시작하고 경로를 그대로 유지
        return `instagram://instagram.com${urlObj.pathname}${urlObj.search}`;
      }

      // 기본: 앱 스킴 + 원본 URL
      return appScheme + url.replace(/^https?:\/\//, '');
    } catch (error) {
      console.error('Error converting to app URL:', error);
      return null;
    }
  }

  /**
   * 유튜브 비디오 ID 추출
   */
  private extractYoutubeVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);

      // youtu.be/VIDEO_ID 형식
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }

      // youtube.com/watch?v=VIDEO_ID 형식
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 앱 스킴 추출
   */
  extractAppScheme(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol;
    } catch {
      return null;
    }
  }

  /**
   * URL 유효성 검증
   */
  validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // http, https, 또는 앱 스킴만 허용
      return (
        urlObj.protocol === 'http:' ||
        urlObj.protocol === 'https:' ||
        urlObj.protocol.endsWith('://')
      );
    } catch {
      return false;
    }
  }

  /**
   * 도메인 추출
   */
  extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.toLowerCase();
    } catch {
      return null;
    }
  }

  /**
   * Favicon URL 생성
   */
  getFaviconURL(url: string): string {
    const domain = this.extractDomain(url);
    if (!domain) {
      return 'https://www.google.com/s2/favicons?domain=example.com&sz=64';
    }
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  /**
   * 앱 스킴 URL 열기 (anchor 태그 클릭 방식)
   */
  private async openAppScheme(url: string): Promise<void> {
    try {
      console.log('🔓 Attempting to open app scheme:', url);

      // 링크 상세 페이지와 동일한 방식: anchor 태그 생성 및 클릭
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.style.display = 'none';

      document.body.appendChild(anchor);

      // 클릭 이벤트 트리거
      anchor.click();

      // 정리
      setTimeout(() => {
        document.body.removeChild(anchor);
        console.log('✅ App scheme opened via anchor click');
      }, 500);
    } catch (error) {
      console.error('❌ Failed to open app scheme:', error);
      throw error;
    }
  }
}

export const urlService = new URLServiceImpl();
