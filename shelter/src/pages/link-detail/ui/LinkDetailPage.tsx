import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonModal,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
} from '@ionic/react';
import { createOutline, openOutline } from 'ionicons/icons';
import { TagInput } from '@/shared/ui/tag-input';
import { useLinkStore } from '@/app/providers/stores';
import { useOpenLink } from '@/features/link';
import { adMobService } from '@/shared/api/services/admob';

const LinkDetailPage: React.FC = () => {
  const history = useHistory();
  const { linkId } = useParams<{ linkId: string }>();
  const { currentLink, loadLink, updateLink } = useLinkStore();
  const { openLink, isOpening } = useOpenLink();

  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);

  useEffect(() => {
    if (linkId) {
      loadLink(linkId);
    }
  }, [linkId, loadLink]);

  useEffect(() => {
    if (currentLink) {
      setEditTitle(currentLink.title);
      setEditUrl(currentLink.url);
      setEditDescription(currentLink.description);
      setEditTags(currentLink.tags);
    }
  }, [currentLink]);

  // 페이지 진입 시 광고 숨김, 나갈 때 다시 표시
  useEffect(() => {
    adMobService.hideBanner();

    return () => {
      adMobService.resumeBanner();
    };
  }, []);

  const handleOpenLink = async () => {
    if (currentLink) {
      try {
        await openLink(currentLink.id, currentLink.url);
      } catch (error) {
        console.error('Failed to open link:', error);
      }
    }
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editUrl.trim()) return;

    try {
      await updateLink(linkId, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        description: editDescription.trim(),
        tags: editTags,
      });
      setShowEdit(false);
      // 변경사항 반영을 위해 다시 로드
      await loadLink(linkId);
    } catch (error) {
      console.error('Failed to update link:', error);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !editTags.includes(trimmedTag)) {
      setEditTags([...editTags, trimmedTag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  if (!currentLink) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>링크 상세</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground">링크를 찾을 수 없습니다</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>링크 상세</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleEdit}>
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4 pb-8">
          {/* 제목 */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{currentLink.title}</IonCardTitle>
            </IonCardHeader>
          </IonCard>

          {/* URL */}
          <IonCard>
            <IonCardHeader>
              <div className="text-sm font-medium text-muted-foreground">URL</div>
            </IonCardHeader>
            <IonCardContent>
              <a
                href={currentLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary"
              >
                {currentLink.url}
              </a>
            </IonCardContent>
          </IonCard>

          {/* 설명 */}
          {currentLink.description && (
            <IonCard>
              <IonCardHeader>
                <div className="text-sm font-medium text-muted-foreground">설명</div>
              </IonCardHeader>
              <IonCardContent>
                <p className="whitespace-pre-wrap">{currentLink.description}</p>
              </IonCardContent>
            </IonCard>
          )}

          {/* 태그 */}
          {currentLink.tags.length > 0 && (
            <IonCard>
              <IonCardHeader>
                <div className="text-sm font-medium text-muted-foreground">태그</div>
              </IonCardHeader>
              <IonCardContent>
                <div className="flex flex-wrap gap-2">
                  {currentLink.tags.map((tag) => (
                    <IonBadge key={tag} color="light">
                      #{tag}
                    </IonBadge>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* 링크 열기 버튼 - URL 클릭으로 충분히 잘 동작하므로 일단 주석처리 */}
          {/* <IonButton expand="block" onClick={handleOpenLink}>
            <IonIcon slot="start" icon={openOutline} />
            링크 열기
          </IonButton> */}

          {/* 메타 정보 */}
          <IonCard>
            <IonCardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>생성일: {new Date(currentLink.createdAt).toLocaleDateString('ko-KR')}</div>
                <div>수정일: {new Date(currentLink.updatedAt).toLocaleDateString('ko-KR')}</div>
                {currentLink.lastAccessedAt && (
                  <div>
                    마지막 접근: {new Date(currentLink.lastAccessedAt).toLocaleDateString('ko-KR')}
                  </div>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>

      {/* 링크 편집 모달 */}
      <IonModal isOpen={showEdit} onDidDismiss={() => setShowEdit(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>링크 편집</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowEdit(false)}>
              취소
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="space-y-4 p-4">
            <IonItem>
              <IonLabel position="stacked">제목 *</IonLabel>
              <IonInput
                value={editTitle}
                onIonInput={(e) => setEditTitle(e.detail.value || '')}
                placeholder="예: React 공식 문서"
                clearInput
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">URL *</IonLabel>
              <IonInput
                value={editUrl}
                onIonInput={(e) => setEditUrl(e.detail.value || '')}
                placeholder="https://example.com"
                type="url"
                clearInput
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">설명</IonLabel>
              <IonTextarea
                value={editDescription}
                onIonInput={(e) => setEditDescription(e.detail.value || '')}
                placeholder="링크에 대한 간단한 설명을 입력하세요"
                rows={3}
              />
            </IonItem>

            <div>
              <IonLabel className="text-sm font-medium">태그</IonLabel>
              <TagInput tags={editTags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
            </div>

            <IonButton expand="block" onClick={handleSaveEdit}>
              저장
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default LinkDetailPage;
