import { Tag } from '@/shared/types/entities';

// 8가지 파스텔 색상 (design-system.md 참고)
const TAG_COLORS = [
  '#FFE5E5', // Pastel Red
  '#FFE8CC', // Pastel Orange
  '#FFF4CC', // Pastel Yellow
  '#E5F5E5', // Pastel Green
  '#E5F3FF', // Pastel Blue
  '#F0E5FF', // Pastel Purple
  '#FFE5F5', // Pastel Pink
  '#F5E5E5', // Pastel Brown
];

/**
 * 태그에 색상 할당 (해시 기반)
 */
export function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

/**
 * Tag 정렬
 */
export function sortTags(
  tags: Tag[],
  sortBy: 'name' | 'count' | 'updatedAt' = 'count',
  order: 'asc' | 'desc' = 'desc'
): Tag[] {
  const sorted = [...tags].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'count':
        comparison = a.count - b.count;
        break;
      case 'updatedAt':
        comparison = a.updatedAt - b.updatedAt;
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * 인기 태그 필터링 (Top N)
 */
export function getTopTags(tags: Tag[], limit: number = 10): Tag[] {
  return sortTags(tags, 'count', 'desc').slice(0, limit);
}
