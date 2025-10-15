import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  useIonToast,
} from '@ionic/react';
import { addOutline, folderOutline } from 'ionicons/icons';
import { FolderList } from '@/widgets/folder-list';
import { LinkList } from '@/widgets/link-list';
import { TagInput } from '@/shared/ui/tag-input';
import { useFolderStore, useLinkStore, useSettingsStore } from '@/app/providers/stores';
import { Folder, Link } from '@/shared/types/entities';
import { useDeleteItem, DeleteConfirmDialog } from '@/features/item-delete';
import { sortFolders, sortLinks } from '@/shared/lib/utils/sort';

interface HomeContentProps {
  history: any;
}

const HomeContent: React.FC<HomeContentProps> = ({ history }) => {
  const { folders, loadFolders, getRootFolders, createFolder } = useFolderStore();
  const { links, loadLinks, createLink, getLinksByFolder } = useLinkStore();
  const { settings } = useSettingsStore();
  const [showFolderCreate, setShowFolderCreate] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [showLinkCreate, setShowLinkCreate] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // 삭제 기능
  const {
    isOpen,
    itemToDelete,
    isDeleting,
    error,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  } = useDeleteItem();
  const [presentToast] = useIonToast();

  // 링크 생성 폼 상태
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkTags, setLinkTags] = useState<string[]>([]);

  useEffect(() => {
    loadFolders();
    loadLinks();
  }, [loadFolders, loadLinks]);

  // 정렬된 폴더와 링크
  const rootFolders = useMemo(() => {
    const folderList = getRootFolders();
    return sortFolders(
      folderList,
      settings?.defaultSortBy || 'updatedAt',
      settings?.defaultSortOrder || 'desc'
    );
  }, [folders, settings?.defaultSortBy, settings?.defaultSortOrder]);

  const rootLinks = useMemo(() => {
    const linkList = getLinksByFolder(null);
    return sortLinks(
      linkList,
      settings?.defaultSortBy || 'updatedAt',
      settings?.defaultSortOrder || 'desc'
    );
  }, [links, settings?.defaultSortBy, settings?.defaultSortOrder]);

  const handleFolderClick = useCallback(
    (folder: Folder) => {
      history.push(`/folder/${folder.id}`);
    },
    [history]
  );

  const handleLinkClick = useCallback(
    (link: any) => {
      history.push(`/link/${link.id}`);
    },
    [history]
  );

  const handleFolderLongPress = useCallback(
    (folder: Folder) => {
      openDeleteDialog({
        id: folder.id,
        type: 'folder',
        name: folder.name,
      });
    },
    [openDeleteDialog]
  );

  const handleLinkLongPress = useCallback(
    (link: Link) => {
      openDeleteDialog({
        id: link.id,
        type: 'link',
        name: link.title,
      });
    },
    [openDeleteDialog]
  );

  const handleConfirmDelete = async () => {
    const success = await confirmDelete();
    if (success) {
      await loadFolders();
      await loadLinks();

      presentToast({
        message: `${itemToDelete?.type === 'folder' ? '폴더' : '링크'}가 삭제되었습니다`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
    }
  };

  const openFolderCreate = () => {
    setShowFolderCreate(true);
  };

  const closeFolderCreate = () => {
    setShowFolderCreate(false);
    setNewFolderName('');
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder({ name: newFolderName.trim(), parentId: null });
      closeFolderCreate();
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleQuickAddLink = () => {
    // 홈에 직접 링크를 추가 (folderId = null)
    setSelectedFolderId(null);
    setShowLinkCreate(true);
  };

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setShowFolderSelect(false);
    setShowLinkCreate(true);
  };

  const handleCreateLink = async () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    try {
      await createLink({
        title: linkTitle.trim(),
        url: linkUrl.trim(),
        description: linkDescription.trim(),
        tags: linkTags,
        folderId: selectedFolderId, // null이면 홈에 직접 저장
      });
      setLinkTitle('');
      setLinkUrl('');
      setLinkDescription('');
      setLinkTags([]);
      setShowLinkCreate(false);
      setSelectedFolderId(null);
    } catch (error) {
      console.error('Failed to create link:', error);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !linkTags.includes(trimmedTag)) {
      setLinkTags([...linkTags, trimmedTag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setLinkTags(linkTags.filter((t) => t !== tag));
  };

  // 폴더를 계층구조 순서로 정렬 (부모 먼저, 그 다음 자식)
  const sortedFoldersForSelect = useMemo(() => {
    const sorted: Folder[] = [];

    const addFolderAndChildren = (parentId: string | null, depth: number = 0) => {
      const children = folders
        .filter((f) => f.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name));

      children.forEach((folder) => {
        sorted.push({ ...folder, depth });
        addFolderAndChildren(folder.id, depth + 1);
      });
    };

    addFolderAndChildren(null, 0);
    return sorted;
  }, [folders]);

  // 폴더 이름에 계층 표시 추가
  const getFolderDisplayName = (folder: Folder) => {
    // 모든 폴더에 아이콘, depth에 따라 점으로 구분
    if (folder.depth === 0) {
      return `📁 ${folder.name}`;
    }
    // depth에 따라 점(...)으로 계층 표시
    const dots = '\u00A0\u00A0'.repeat(folder.depth);
    return `${dots} ⤷ 📁 ${folder.name}`;
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SHELTER</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openFolderCreate}>
              <IonIcon slot="icon-only" icon={folderOutline} />
            </IonButton>
            <IonButton onClick={handleQuickAddLink}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 px-4 pb-32 pt-4">
          {/* 폴더 섹션 */}
          {rootFolders.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">폴더</h2>
              <FolderList
                folders={rootFolders}
                onFolderClick={handleFolderClick}
                onFolderLongPress={handleFolderLongPress}
              />
            </div>
          )}

          {/* 링크 섹션 */}
          {rootLinks.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">링크</h2>
              <LinkList
                links={rootLinks}
                onLinkClick={handleLinkClick}
                onLinkLongPress={handleLinkLongPress}
              />
            </div>
          )}

          {/* 빈 상태 */}
          {rootFolders.length === 0 && rootLinks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="mb-4 text-muted-foreground">아직 저장된 항목이 없습니다</p>
              <div className="flex gap-2">
                <IonButton onClick={openFolderCreate}>
                  <IonIcon slot="start" icon={folderOutline} />
                  폴더 추가
                </IonButton>
                <IonButton onClick={handleQuickAddLink}>
                  <IonIcon slot="start" icon={addOutline} />
                  링크 추가
                </IonButton>
              </div>
            </div>
          )}
        </div>
      </IonContent>

      {/* 폴더 생성 모달 */}
      <IonModal isOpen={showFolderCreate} onDidDismiss={closeFolderCreate}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>새 폴더</IonTitle>
            <IonButton slot="end" fill="clear" onClick={closeFolderCreate}>
              취소
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="space-y-4 p-4">
            <IonItem>
              <IonLabel position="stacked">폴더 이름</IonLabel>
              <IonInput
                value={newFolderName}
                onIonInput={(e) => setNewFolderName(e.detail.value || '')}
                placeholder="예: 개발 자료"
                clearInput
              />
            </IonItem>
            <IonButton expand="block" onClick={handleCreateFolder}>
              생성
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* 폴더 선택 모달 */}
      <IonModal isOpen={showFolderSelect} onDidDismiss={() => setShowFolderSelect(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>폴더 선택</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowFolderSelect(false)}>
              취소
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">
            <p className="mb-4 text-sm text-muted-foreground">링크를 저장할 폴더를 선택하세요</p>
            <IonList>
              {folders.map((folder) => (
                <IonItem
                  key={folder.id}
                  button
                  onClick={() => handleSelectFolder(folder.id)}
                  className="cursor-pointer"
                >
                  <IonIcon icon={folderOutline} slot="start" />
                  <IonLabel>{folder.name}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </div>
        </IonContent>
      </IonModal>

      {/* 링크 생성 모달 */}
      <IonModal isOpen={showLinkCreate} onDidDismiss={() => setShowLinkCreate(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>새 링크</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowLinkCreate(false)}>
              취소
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="space-y-4 p-4">
            <IonItem>
              <IonLabel position="stacked">저장 위치</IonLabel>
              <IonSelect
                value={selectedFolderId || 'home'}
                onIonChange={(e) =>
                  setSelectedFolderId(e.detail.value === 'home' ? null : e.detail.value)
                }
                interface="popover"
              >
                <IonSelectOption value="home">홈 (폴더 없음)</IonSelectOption>
                {sortedFoldersForSelect.map((folder) => (
                  <IonSelectOption
                    key={folder.id}
                    value={folder.id}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {getFolderDisplayName(folder)}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">제목 *</IonLabel>
              <IonInput
                value={linkTitle}
                onIonInput={(e) => setLinkTitle(e.detail.value || '')}
                placeholder="예: React 공식 문서"
                clearInput
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">URL *</IonLabel>
              <IonInput
                value={linkUrl}
                onIonInput={(e) => setLinkUrl(e.detail.value || '')}
                placeholder="https://example.com"
                type="url"
                clearInput
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">설명</IonLabel>
              <IonTextarea
                value={linkDescription}
                onIonInput={(e) => setLinkDescription(e.detail.value || '')}
                placeholder="링크에 대한 간단한 설명을 입력하세요"
                rows={3}
              />
            </IonItem>

            <div>
              <IonLabel className="text-sm font-medium">태그</IonLabel>
              <TagInput tags={linkTags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
            </div>

            <IonButton expand="block" onClick={handleCreateLink}>
              생성
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        isOpen={isOpen}
        item={itemToDelete}
        isDeleting={isDeleting}
        error={error}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
};

export default HomeContent;
