import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonModal,
  IonList,
  IonIcon,
  IonButtons,
} from '@ionic/react';
import { closeOutline, folderOutline } from 'ionicons/icons';
import { useShareReceiver } from '../model/use-share-receiver';
import { TagInput } from '@/shared/ui/tag-input';
import { useFolderStore } from '@/app/providers/stores';
import { adMobService } from '@/shared/api/services/admob';

const ShareReceiverPage: React.FC = () => {
  const { sharedInfo, isProcessing, saveSharedLink, cancelShare } = useShareReceiver();
  const { folders, loadFolders, createFolder } = useFolderStore();

  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('홈');
  const [newFolderName, setNewFolderName] = useState('');

  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  useEffect(() => {
    if (sharedInfo) {
      setTitle(sharedInfo.title || '');
      setDescription(sharedInfo.text || '');
    }
  }, [sharedInfo]);

  // 페이지 진입 시 광고 숨김, 나갈 때 다시 표시
  useEffect(() => {
    adMobService.hideBanner();

    return () => {
      adMobService.resumeBanner();
    };
  }, []);

  const handleSelectFolder = (folderId: string | null, folderName: string) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
    setShowFolderSelect(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const newFolder = await createFolder({ name: newFolderName.trim(), parentId: null });
      setNewFolderName('');
      setShowNewFolderModal(false);
      handleSelectFolder(newFolder.id, newFolder.name);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleSave = async () => {
    try {
      await saveSharedLink(selectedFolderId, {
        description: description.trim(),
        tags,
      });
    } catch (error) {
      console.error('Failed to save shared link:', error);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!sharedInfo) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>링크 공유</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={cancelShare} disabled={isProcessing}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4 pb-8">
          {/* 공유된 URL 표시 */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>공유된 링크</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="break-all text-sm text-primary">{sharedInfo.url}</p>
            </IonCardContent>
          </IonCard>

          {/* 폴더 선택 */}
          <IonItem button onClick={() => setShowFolderSelect(true)}>
            <IonIcon icon={folderOutline} slot="start" />
            <IonLabel>
              <h3>저장 위치</h3>
              <p>{selectedFolderName}</p>
            </IonLabel>
          </IonItem>

          {/* 제목 입력 */}
          <IonItem>
            <IonLabel position="stacked">제목</IonLabel>
            <IonInput
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
              placeholder="링크 제목을 입력하세요"
              clearInput
            />
          </IonItem>

          {/* 설명 입력 */}
          <IonItem>
            <IonLabel position="stacked">설명</IonLabel>
            <IonTextarea
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
              placeholder="링크에 대한 설명을 입력하세요"
              rows={3}
            />
          </IonItem>

          {/* 태그 입력 */}
          <div>
            <IonLabel className="ml-4 text-sm font-medium">태그</IonLabel>
            <div className="px-4 pt-2">
              <TagInput tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="px-4 pt-4">
            <IonButton expand="block" onClick={handleSave} disabled={isProcessing || !title.trim()}>
              {isProcessing ? '저장 중...' : '저장'}
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              onClick={cancelShare}
              disabled={isProcessing}
              className="mt-2"
            >
              취소
            </IonButton>
          </div>
        </div>
      </IonContent>

      {/* 폴더 선택 모달 */}
      <IonModal isOpen={showFolderSelect} onDidDismiss={() => setShowFolderSelect(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>폴더 선택</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowFolderSelect(false)}>
              닫기
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">
            <IonButton expand="block" onClick={() => setShowNewFolderModal(true)} className="mb-4">
              <IonIcon slot="start" icon={folderOutline} />새 폴더 만들기
            </IonButton>

            <IonList>
              {/* 홈 (루트) */}
              <IonItem
                button
                onClick={() => handleSelectFolder(null, '홈')}
                className="cursor-pointer"
              >
                <IonIcon icon={folderOutline} slot="start" />
                <IonLabel>홈</IonLabel>
              </IonItem>

              {/* 폴더 목록 */}
              {folders.map((folder) => (
                <IonItem
                  key={folder.id}
                  button
                  onClick={() => handleSelectFolder(folder.id, folder.name)}
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

      {/* 새 폴더 생성 모달 */}
      <IonModal isOpen={showNewFolderModal} onDidDismiss={() => setShowNewFolderModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>새 폴더</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowNewFolderModal(false)}>
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
    </IonPage>
  );
};

export default ShareReceiverPage;
