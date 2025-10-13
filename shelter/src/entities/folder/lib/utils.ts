import { Folder } from '@/shared/types/entities';

/**
 * 폴더 경로 생성 (breadcrumb용)
 */
export function getFolderPath(folderId: string | null, folders: Folder[]): Folder[] {
  if (!folderId) return [];

  const path: Folder[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = folders.find((f) => f.id === currentId);
    if (!folder) break;

    path.unshift(folder);
    currentId = folder.parentId;
  }

  return path;
}

/**
 * 폴더의 모든 하위 폴더 ID 가져오기 (재귀적)
 */
export function getAllSubfolderIds(folderId: string, folders: Folder[]): string[] {
  const subfolderIds: string[] = [];
  const directChildren = folders.filter((f) => f.parentId === folderId);

  for (const child of directChildren) {
    subfolderIds.push(child.id);
    subfolderIds.push(...getAllSubfolderIds(child.id, folders));
  }

  return subfolderIds;
}

/**
 * 폴더 정렬
 */
export function sortFolders(
  folders: Folder[],
  sortBy: 'name' | 'createdAt' | 'updatedAt' = 'updatedAt',
  order: 'asc' | 'desc' = 'desc'
): Folder[] {
  const sorted = [...folders].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = a.createdAt - b.createdAt;
        break;
      case 'updatedAt':
        comparison = a.updatedAt - b.updatedAt;
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
