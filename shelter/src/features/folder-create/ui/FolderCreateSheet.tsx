import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useFolderCreate } from '../model/use-folder-create';

interface FolderCreateSheetProps {
  parentId?: string | null;
  trigger?: string;
  onSuccess?: () => void;
}

export default function FolderCreateSheet({
  parentId = null,
  trigger,
  onSuccess,
}: FolderCreateSheetProps) {
  const { isOpen, name, isLoading, error, setName, open, close, handleSubmit } =
    useFolderCreate(parentId);

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
          <IonTitle>새 폴더</IonTitle>
          <IonButton slot="end" fill="clear" onClick={close}>
            취소
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4">
          <IonItem>
            <IonLabel position="stacked">폴더 이름</IonLabel>
            <IonInput
              value={name}
              onIonInput={(e) => setName(e.detail.value || '')}
              placeholder="예: 개발 자료"
              clearInput
            />
          </IonItem>

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
