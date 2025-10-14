import { useEffect, useState, useMemo, useCallback } from 'react';
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
  IonModal,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  useIonToast,
} from '@ionic/react';
import { addOutline, folderOutline, createOutline } from 'ionicons/icons';
import { FolderList } from '@/widgets/folder-list';
import { LinkList } from '@/widgets/link-list';
import { TagInput } from '@/shared/ui/tag-input';
import { useFolderStore, useLinkStore, useSettingsStore } from '@/app/providers/stores';
import { Folder, Link } from '@/shared/types/entities';
import { useDeleteItem, DeleteConfirmDialog } from '@/features/item-delete';
import { sortFolders, sortLinks } from '@/shared/lib/utils/sort';

const FolderDetailPage: React.FC = () => {
  const history = useHistory();
  const { folderId } = useParams<{ folderId: string }>();
  const { folders, currentFolder, loadFolder, getSubfolders, createFolder, updateFolder } =
    useFolderStore();
  const { links, getLinksByFolder, createLink } = useLinkStore();
  const { settings } = useSettingsStore();

  const [showFolderCreate, setShowFolderCreate] = useState(false);
  const [showLinkCreate, setShowLinkCreate] = useState(false);
  const [showFolderEdit, setShowFolderEdit] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editFolderName, setEditFolderName] = useState('');

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
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(folderId);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkTags, setLinkTags] = useState<string[]>([]);

  useEffect(() => {
    if (folderId) {
      loadFolder(folderId);
    }
  }, [folderId, loadFolder]);

  useEffect(() => {
    if (currentFolder) {
      setEditFolderName(currentFolder.name);
    }
  }, [currentFolder]);

  // 정렬된 폴더와 링크
  const subfolders = useMemo(() => {
    const folderList = getSubfolders(folderId);
    return sortFolders(
      folderList,
      settings?.defaultSortBy || 'updatedAt',
      settings?.defaultSortOrder || 'desc'
    );
  }, [folders, folderId, settings?.defaultSortBy, settings?.defaultSortOrder]);

  const folderLinks = useMemo(() => {
    const linkList = getLinksByFolder(folderId);
    return sortLinks(
      linkList,
      settings?.defaultSortBy || 'updatedAt',
      settings?.defaultSortOrder || 'desc'
    );
  }, [links, folderId, settings?.defaultSortBy, settings?.defaultSortOrder]);

  const handleFolderClick = useCallback(
    (folder: Folder) => {
      history.push(`/folder/${folder.id}`);
    },
    [history]
  );

  const handleLinkClick = useCallback(
    (link: Link) => {
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
      // 현재 폴더가 삭제된 경우 상위 폴더로 이동
      if (itemToDelete?.type === 'folder' && itemToDelete.id === folderId) {
        if (currentFolder?.parentId) {
          history.replace(`/folder/${currentFolder.parentId}`);
        } else {
          history.replace('/home');
        }
      } else {
        // 하위 항목 삭제 시 현재 페이지 새로고침
        await loadFolder(folderId);
      }

      presentToast({
        message: `${itemToDelete?.type === 'folder' ? '폴더' : '링크'}가 삭제되었습니다`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder({ name: newFolderName.trim(), parentId: folderId });
      setNewFolderName('');
      setShowFolderCreate(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleOpenLinkCreate = () => {
    setSelectedFolderId(folderId); // 현재 폴더를 기본값으로 설정
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
        folderId: selectedFolderId, // 선택된 폴더에 저장
      });
      setLinkTitle('');
      setLinkUrl('');
      setLinkDescription('');
      setLinkTags([]);
      setShowLinkCreate(false);
      setSelectedFolderId(folderId); // 초기화
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
    const dots = '...'.repeat(folder.depth);
    return `📁 ${dots} ${folder.name}`;
  };

  const handleEditFolder = () => {
    setShowFolderEdit(true);
  };

  const handleSaveFolderEdit = async () => {
    if (!editFolderName.trim()) return;

    try {
      await updateFolder(folderId, { name: editFolderName.trim() });
      setShowFolderEdit(false);
      // 변경사항 반영을 위해 다시 로드
      await loadFolder(folderId);
    } catch (error) {
      console.error('Failed to update folder:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{currentFolder?.name || '폴더'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleEditFolder}>
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
            <IonButton onClick={() => setShowFolderCreate(true)}>
              <IonIcon slot="icon-only" icon={folderOutline} />
            </IonButton>
            <IonButton onClick={handleOpenLinkCreate}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4 pb-8">
          {/* 하위 폴더 */}
          {subfolders.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">폴더</h2>
              <FolderList
                folders={subfolders}
                onFolderClick={handleFolderClick}
                onFolderLongPress={handleFolderLongPress}
              />
            </div>
          )}

          {/* 링크 */}
          {folderLinks.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">링크</h2>
              <LinkList
                links={folderLinks}
                onLinkClick={handleLinkClick}
                onLinkLongPress={handleLinkLongPress}
              />
            </div>
          )}

          {/* 빈 상태 */}
          {subfolders.length === 0 && folderLinks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="mb-4 text-muted-foreground">아직 항목이 없습니다</p>
              <div className="flex gap-2">
                <IonButton onClick={() => setShowFolderCreate(true)}>
                  <IonIcon slot="start" icon={folderOutline} />
                  폴더 추가
                </IonButton>
                <IonButton onClick={() => setShowLinkCreate(true)}>
                  <IonIcon slot="start" icon={addOutline} />
                  링크 추가
                </IonButton>
              </div>
            </div>
          )}
        </div>
      </IonContent>

      {/* 폴더 생성 모달 */}
      <IonModal isOpen={showFolderCreate} onDidDismiss={() => setShowFolderCreate(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>새 폴더</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowFolderCreate(false)}>
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
                  <IonSelectOption key={folder.id} value={folder.id}>
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

      {/* 폴더 편집 모달 */}
      <IonModal isOpen={showFolderEdit} onDidDismiss={() => setShowFolderEdit(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>폴더 편집</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowFolderEdit(false)}>
              취소
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="space-y-4 p-4">
            <IonItem>
              <IonLabel position="stacked">폴더 이름</IonLabel>
              <IonInput
                value={editFolderName}
                onIonInput={(e) => setEditFolderName(e.detail.value || '')}
                placeholder="폴더 이름"
                clearInput
              />
            </IonItem>
            <IonButton expand="block" onClick={handleSaveFolderEdit}>
              저장
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
    </IonPage>
  );
};

export default FolderDetailPage;
