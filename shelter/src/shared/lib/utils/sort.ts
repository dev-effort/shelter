import { Folder, Link } from '@/shared/types/entities';

export type SortBy = 'name' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

/**
 * 폴더 정렬 함수
 */
export function sortFolders(
  folders: Folder[],
  sortBy: SortBy = 'updatedAt',
  sortOrder: SortOrder = 'desc'
): Folder[] {
  const sorted = [...folders].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        compareValue = a.createdAt - b.createdAt;
        break;
      case 'updatedAt':
        compareValue = a.updatedAt - b.updatedAt;
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
}

/**
 * 링크 정렬 함수
 */
export function sortLinks(
  links: Link[],
  sortBy: SortBy = 'updatedAt',
  sortOrder: SortOrder = 'desc'
): Link[] {
  const sorted = [...links].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        // 링크의 경우 title을 name으로 간주
        compareValue = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        compareValue = a.createdAt - b.createdAt;
        break;
      case 'updatedAt':
        compareValue = a.updatedAt - b.updatedAt;
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
}
