import { useState } from 'react';
import { urlService } from '@/shared/api/services/url';
import { useLinkStore } from '@/app/providers/stores';
import { useIonToast } from '@ionic/react';

export interface UseOpenLinkOptions {
  /**
   * URL 열기 후 콜백
   */
  onSuccess?: (linkId: string, url: string) => void;

  /**
   * 에러 발생 시 콜백
   */
  onError?: (error: Error) => void;

  /**
   * 네이티브 앱 우선 여부
   */
  preferNativeApp?: boolean;

  /**
   * lastAccessedAt 자동 업데이트 여부
   */
  updateLastAccessed?: boolean;
}

/**
 * 링크 열기 기능을 제공하는 Hook
 */
export const useOpenLink = (options: UseOpenLinkOptions = {}) => {
  const { onSuccess, onError, preferNativeApp = true, updateLastAccessed = true } = options;

  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { updateLink } = useLinkStore();
  const [present] = useIonToast();

  /**
   * 링크 열기
   */
  const openLink = async (linkId: string, url: string): Promise<void> => {
    try {
      setIsOpening(true);
      setError(null);

      console.log('🔗 Opening link:', { linkId, url });

      // URL 유효성 검증
      if (!urlService.validateURL(url)) {
        throw new Error('Invalid URL format');
      }

      // URL 열기
      await urlService.openURL(url, preferNativeApp);

      // lastAccessedAt 업데이트
      if (updateLastAccessed) {
        await updateLink(linkId, {
          lastAccessedAt: Date.now(),
        });
      }

      console.log('✅ Link opened successfully:', linkId);

      // 성공 콜백
      onSuccess?.(linkId, url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to open link');
      console.error('❌ Failed to open link:', error);

      setError(error);

      // 에러 토스트
      present({
        message: `링크를 열 수 없습니다: ${error.message}`,
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      });

      // 에러 콜백
      onError?.(error);

      throw error;
    } finally {
      setIsOpening(false);
    }
  };

  /**
   * URL만으로 링크 열기 (lastAccessedAt 업데이트 없음)
   */
  const openURL = async (url: string): Promise<void> => {
    try {
      setIsOpening(true);
      setError(null);

      if (!urlService.validateURL(url)) {
        throw new Error('Invalid URL format');
      }

      await urlService.openURL(url, preferNativeApp);

      console.log('✅ URL opened successfully:', url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to open URL');
      console.error('❌ Failed to open URL:', error);

      setError(error);

      present({
        message: `URL을 열 수 없습니다: ${error.message}`,
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      });

      onError?.(error);

      throw error;
    } finally {
      setIsOpening(false);
    }
  };

  return {
    openLink,
    openURL,
    isOpening,
    error,
  };
};
