import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { folderOutline } from 'ionicons/icons';
import { Folder } from '@/shared/types/entities';
import { useFolderStore, useLinkStore } from '@/app/providers/stores';

interface FolderCardProps {
  folder: Folder;
  onClick?: (folder: Folder) => void;
  onLongPress?: (folder: Folder) => void;
}

const FolderCard = React.memo(function FolderCard({
  folder,
  onClick,
  onLongPress,
}: FolderCardProps) {
  const { getSubfolders } = useFolderStore();
  const { getLinksByFolder } = useLinkStore();

  // 실시간으로 하위 아이템 개수 계산
  const subfolderCount = getSubfolders(folder.id).length;
  const linkCount = getLinksByFolder(folder.id).length;

  let longPressTimer: NodeJS.Timeout;

  const handleTouchStart = () => {
    longPressTimer = setTimeout(() => {
      onLongPress?.(folder);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
  };

  const handleClick = () => {
    onClick?.(folder);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(folder);
    }
  };

  return (
    <IonCard
      className="m-0 mb-2 cursor-pointer transition-transform active:scale-[0.98]"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`폴더: ${folder.name}, ${linkCount}개의 링크, ${subfolderCount}개의 하위 폴더`}
    >
      <IonCardHeader className="flex flex-row items-center justify-between pb-2">
        <IonCardTitle className="flex items-center gap-2 text-base font-medium">
          <IonIcon icon={folderOutline} className="h-5 w-5 text-muted-foreground" />
          {folder.name}
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="text-sm text-muted-foreground">
          {linkCount} 링크, {subfolderCount} 폴더
        </div>
      </IonCardContent>
    </IonCard>
  );
});

export default FolderCard;
