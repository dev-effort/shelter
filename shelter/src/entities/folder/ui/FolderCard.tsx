import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { folderOutline } from 'ionicons/icons';
import { Folder } from '@/shared/types/entities';

interface FolderCardProps {
  folder: Folder;
  onClick?: (folder: Folder) => void;
  onLongPress?: (folder: Folder) => void;
}

export default function FolderCard({ folder, onClick, onLongPress }: FolderCardProps) {
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

  return (
    <IonCard
      className="m-0 mb-2 cursor-pointer transition-transform active:scale-[0.98]"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <IonCardHeader className="flex flex-row items-center justify-between pb-2">
        <IonCardTitle className="flex items-center gap-2 text-base font-medium">
          <IonIcon icon={folderOutline} className="h-5 w-5 text-muted-foreground" />
          {folder.name}
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="text-sm text-muted-foreground">
          {folder.linkCount} 링크, {folder.folderCount} 폴더
        </div>
      </IonCardContent>
    </IonCard>
  );
}
