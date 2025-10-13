import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { TagInput } from '@/shared/ui/tag-input';
import { useLinkCreate } from '../model/use-link-create';

interface LinkCreateSheetProps {
  folderId: string;
  trigger?: string;
  onSuccess?: () => void;
}

export default function LinkCreateSheet({ folderId, trigger, onSuccess }: LinkCreateSheetProps) {
  const {
    isOpen,
    title,
    url,
    description,
    tags,
    isLoading,
    error,
    setTitle,
    setUrl,
    setDescription,
    addTag,
    removeTag,
    open,
    close,
    handleSubmit,
  } = useLinkCreate(folderId);

  const handleSave = async () => {
    await handleSubmit();
    if (!error) {
      onSuccess?.();
    }
  };

  return (
    <IonModal trigger={trigger} isOpen={isOpen} onDidDismiss={close}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>새 링크</IonTitle>
          <IonButton slot="end" fill="clear" onClick={close}>
            취소
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4">
          <IonItem>
            <IonLabel position="stacked">제목 *</IonLabel>
            <IonInput
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
              placeholder="예: React 공식 문서"
              clearInput
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">URL *</IonLabel>
            <IonInput
              value={url}
              onIonInput={(e) => setUrl(e.detail.value || '')}
              placeholder="https://example.com"
              type="url"
              clearInput
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">설명</IonLabel>
            <IonTextarea
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
              placeholder="링크에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </IonItem>

          <div>
            <IonLabel className="text-sm font-medium">태그</IonLabel>
            <TagInput tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <IonButton expand="block" onClick={handleSave} disabled={isLoading}>
            {isLoading ? '생성 중...' : '생성'}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
