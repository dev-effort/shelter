import { useState } from 'react';
import { IonButton } from '@ionic/react';
import { FolderCard } from '@/entities/folder';
import { Folder } from '@/shared/types/entities';
import { useSettingsStore } from '@/app/providers/stores';

interface FolderListProps {
  folders: Folder[];
  onFolderClick?: (folder: Folder) => void;
  onFolderLongPress?: (folder: Folder) => void;
  emptyMessage?: string;
}

const INITIAL_DISPLAY_COUNT = 100;
const LOAD_MORE_COUNT = 50;

export default function FolderList({
  folders,
  onFolderClick,
  onFolderLongPress,
  emptyMessage = '폴더가 없습니다',
}: FolderListProps) {
  const { settings } = useSettingsStore();
  const viewMode = settings?.viewMode || 'list';
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  if (folders.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  const displayedFolders = folders.slice(0, displayCount);
  const hasMore = displayCount < folders.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, folders.length));
  };

  // Grid 뷰
  if (viewMode === 'grid') {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          {displayedFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={onFolderClick}
              onLongPress={onFolderLongPress}
            />
          ))}
        </div>
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <IonButton fill="outline" onClick={handleLoadMore}>
              {folders.length - displayCount}개 더 보기
            </IonButton>
          </div>
        )}
      </>
    );
  }

  // List 뷰 (기본)
  return (
    <>
      <div className="space-y-2">
        {displayedFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onClick={onFolderClick}
            onLongPress={onFolderLongPress}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <IonButton fill="outline" onClick={handleLoadMore}>
            {folders.length - displayCount}개 더 보기
          </IonButton>
        </div>
      )}
    </>
  );
}
