import { IonAlert } from '@ionic/react';
import { DeleteItemInfo } from '../model/use-delete-item';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  item: DeleteItemInfo | null;
  isDeleting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  item,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!item) return null;

  // 메시지 생성
  const getDeleteMessage = () => {
    if (item.type === 'folder') {
      const parts: string[] = [`"${item.name}" 폴더를 삭제하시겠습니까?`];

      if (item.folderCount || item.linkCount) {
        const items: string[] = [];
        if (item.folderCount) {
          items.push(`${item.folderCount}개의 폴더`);
        }
        if (item.linkCount) {
          items.push(`${item.linkCount}개의 링크`);
        }
        parts.push(`\n\n${items.join('와 ')}가 함께 삭제됩니다.`);
      }

      parts.push('\n\n이 작업은 되돌릴 수 없습니다.');

      return parts.join('');
    } else {
      return `"${item.name}" 링크를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`;
    }
  };

  // 에러가 있으면 에러 메시지 표시
  const message = error || getDeleteMessage();
  const header = error ? '삭제 실패' : '삭제 확인';

  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onCancel}
      header={header}
      message={message}
      buttons={
        error
          ? [
              {
                text: '확인',
                role: 'cancel',
                handler: onCancel,
              },
            ]
          : [
              {
                text: '취소',
                role: 'cancel',
                handler: onCancel,
              },
              {
                text: '삭제',
                role: 'destructive',
                cssClass: 'alert-button-destructive',
                handler: onConfirm,
              },
            ]
      }
      backdropDismiss={!isDeleting}
    />
  );
}
