import { FolderCard } from '@/entities/folder';
import { Folder } from '@/shared/types/entities';
import { useSettingsStore } from '@/app/providers/stores';

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
  const { settings } = useSettingsStore();
  const viewMode = settings?.viewMode || 'list';

  if (folders.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  // Grid 뷰
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2">
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

  // List 뷰 (기본)
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
