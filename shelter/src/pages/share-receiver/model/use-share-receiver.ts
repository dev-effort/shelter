import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shareService } from '@/shared/api/services/share';
import { useLinkStore } from '@/app/providers/stores';
import { SharedUrlInfo } from '@/shared/types/services';

/**
 * Share Receiver hook
 * 공유된 URL을 받아서 처리하는 로직
 */
export function useShareReceiver() {
  const history = useHistory();
  const { createLink } = useLinkStore();
  const [sharedInfo, setSharedInfo] = useState<SharedUrlInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 앱 시작 시 공유된 URL 확인
    const checkLaunchShare = async () => {
      console.log('========== SHARE RECEIVER HOOK DEBUG START ==========');
      const info = await shareService.checkLaunchUrl();
      console.log('📦 Received share info:', JSON.stringify(info, null, 2));
      console.log('🔗 URL:', info?.url);
      console.log('📄 Title:', info?.title);
      console.log('📊 Text:', info?.text);
      console.log('========== SHARE RECEIVER HOOK DEBUG END ==========');

      if (info) {
        setSharedInfo(info);
      }
    };

    checkLaunchShare();

    // 공유 이벤트 리스너 등록
    const handleShare = (info: SharedUrlInfo) => {
      console.log('========== SHARE EVENT RECEIVED ==========');
      console.log('📦 Event info:', JSON.stringify(info, null, 2));
      console.log('========== SHARE EVENT END ==========');
      setSharedInfo(info);
    };

    shareService.addListener(handleShare);

    return () => {
      shareService.removeListener(handleShare);
    };
  }, []);

  /**
   * 공유된 링크를 폴더에 저장
   */
  const saveSharedLink = async (
    folderId: string | null,
    additionalData?: { description?: string; tags?: string[] }
  ) => {
    if (!sharedInfo) return;

    setIsProcessing(true);

    try {
      await createLink({
        title: sharedInfo.title || '새 링크',
        url: sharedInfo.url,
        description: additionalData?.description || sharedInfo.text || '',
        tags: additionalData?.tags || [],
        folderId,
      });

      // Clear shared data from storage
      await shareService.clearSharedData();

      // 성공 시 메인으로 이동
      setSharedInfo(null);
      history.replace('/main');
    } catch (error) {
      console.error('Failed to save shared link:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 공유 취소
   */
  const cancelShare = async () => {
    // Clear shared data from storage
    await shareService.clearSharedData();

    setSharedInfo(null);
    history.replace('/main');
  };

  return {
    sharedInfo,
    isProcessing,
    saveSharedLink,
    cancelShare,
  };
}
