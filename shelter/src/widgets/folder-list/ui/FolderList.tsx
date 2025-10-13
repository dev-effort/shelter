import { FolderCard } from '@/entities/folder';
import { Folder } from '@/shared/types/entities';

interface FolderListProps {
  folders: Folder[];
  onFolderClick?: (folder: Folder) => void;
  onFolderLongPress?: (folder: Folder) => void;
  emptyMessage?: string;
}

export default function FolderList({
  folders,
  onFolderClick,
  onFolderLongPress,
  emptyMessage = '폴더가 없습니다',
}: FolderListProps) {
  if (folders.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onClick={onFolderClick}
          onLongPress={onFolderLongPress}
        />
      ))}
    </div>
  );
}
