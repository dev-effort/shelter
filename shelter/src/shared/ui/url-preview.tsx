import { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonSpinner } from '@ionic/react';
import { ogService, OGMetadata } from '@/shared/api/services/og';

interface URLPreviewProps {
  url: string;
}

export const URLPreview: React.FC<URLPreviewProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<OGMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);

      const result = await ogService.fetchOGMetadata(url);

      if (!isMounted) return;

      if (result.success && result.data) {
        setMetadata(result.data);
      } else {
        setError(result.error || '미리보기를 불러올 수 없습니다');
      }

      setLoading(false);
    };

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, [url]);

  // 로딩 중
  if (loading) {
    return (
      <IonCard>
        <IonCardHeader>
          <div className="text-sm font-medium text-muted-foreground">URL 미리보기</div>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex items-center justify-center py-8">
            <IonSpinner name="crescent" />
            <span className="ml-2 text-sm text-muted-foreground">미리보기 로딩 중...</span>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  // 에러 발생
  if (error || !metadata) {
    return (
      <IonCard>
        <IonCardHeader>
          <div className="text-sm font-medium text-muted-foreground">URL 미리보기</div>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-12 w-12 text-muted-foreground opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || '미리보기를 불러올 수 없습니다'}
            </p>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  // 성공: 메타데이터 표시
  const hasImage = metadata.image;
  const hasTitle = metadata.title;

  // 제목과 이미지가 모두 없으면 에러 상태로 표시
  if (!hasTitle && !hasImage) {
    return (
      <IonCard>
        <IonCardHeader>
          <div className="text-sm font-medium text-muted-foreground">URL 미리보기</div>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-12 w-12 text-muted-foreground opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">미리보기 정보를 찾을 수 없습니다</p>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <div className="text-sm font-medium text-muted-foreground">URL 미리보기</div>
      </IonCardHeader>
      <IonCardContent>
        <div className="space-y-3">
          {/* 미리보기 이미지 */}
          {hasImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={metadata.image}
                alt={metadata.title || 'Preview'}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 숨김
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* 제목 */}
          {hasTitle && (
            <div>
              <h3 className="line-clamp-2 text-base font-semibold">{metadata.title}</h3>
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};
