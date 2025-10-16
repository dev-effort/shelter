import { useState } from 'react';
import { folderService } from '@/shared/api/services/folder';
import { useFolderStore } from '@/app/providers/stores/folderStore';
import { useLinkStore } from '@/app/providers/stores/linkStore';

export type DeleteItemType = 'folder' | 'link';

export interface DeleteItemInfo {
  id: string;
  type: DeleteItemType;
  name: string;
  folderCount?: number;
  linkCount?: number;
}

export function useDeleteItem() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItemInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand 스토어 훅 사용
  const { deleteFolder } = useFolderStore();
  const { deleteLink } = useLinkStore();

  /**
   * 삭제 다이얼로그 열기
   */
  const openDeleteDialog = async (info: Omit<DeleteItemInfo, 'folderCount' | 'linkCount'>) => {
    setError(null);

    // 폴더인 경우 하위 항목 개수 계산
    if (info.type === 'folder') {
      try {
        const counts = await folderService.countItemsRecursive(info.id);
        setItemToDelete({
          ...info,
          folderCount: counts.folderCount,
          linkCount: counts.linkCount,
        });
      } catch (err) {
        console.error('Failed to count items:', err);
        setItemToDelete({
          ...info,
          folderCount: 0,
          linkCount: 0,
        });
      }
    } else {
      setItemToDelete(info);
    }

    setIsOpen(true);
  };

  /**
   * 삭제 다이얼로그 닫기
   */
  const closeDeleteDialog = () => {
    if (isDeleting) return; // 삭제 진행 중에는 닫지 않음
    setIsOpen(false);
    setItemToDelete(null);
    setError(null);
  };

  /**
   * 항목 삭제 실행
   */
  const confirmDelete = async (): Promise<boolean> => {
    if (!itemToDelete) return false;

    setIsDeleting(true);
    setError(null);

    try {
      // Zustand 스토어의 delete 메소드 사용
      // 이 메소드들은 DB 삭제 + 스토어 상태 업데이트를 모두 수행
      if (itemToDelete.type === 'folder') {
        await deleteFolder(itemToDelete.id);
      } else {
        await deleteLink(itemToDelete.id);
      }

      setIsOpen(false);
      setItemToDelete(null);
      return true;
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isOpen,
    itemToDelete,
    isDeleting,
    error,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
}
