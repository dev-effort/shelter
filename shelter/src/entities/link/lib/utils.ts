import { Link } from '@/shared/types/entities';

/**
 * URL에서 도메인 추출
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Favicon URL 생성
 */
export function getFaviconUrl(url: string): string {
  const domain = extractDomain(url);
  if (!domain) return '';

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * URL이 특정 플랫폼인지 확인
 */
export function getPlatform(url: string): string | null {
  const domain = extractDomain(url);

  const platformMap: Record<string, string> = {
    'youtube.com': 'youtube',
    'youtu.be': 'youtube',
    'instagram.com': 'instagram',
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    'facebook.com': 'facebook',
    'github.com': 'github',
    'linkedin.com': 'linkedin',
  };

  return platformMap[domain] || null;
}

/**
 * Link 정렬
 */
export function sortLinks(
  links: Link[],
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'lastAccessedAt' = 'updatedAt',
  order: 'asc' | 'desc' = 'desc'
): Link[] {
  const sorted = [...links].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = a.createdAt - b.createdAt;
        break;
      case 'updatedAt':
        comparison = a.updatedAt - b.updatedAt;
        break;
      case 'lastAccessedAt':
        comparison = (a.lastAccessedAt || 0) - (b.lastAccessedAt || 0);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * 태그로 링크 필터링
 */
export function filterLinksByTags(links: Link[], tags: string[]): Link[] {
  if (tags.length === 0) return links;

  return links.filter((link) => {
    return tags.every((tag) => link.tags.includes(tag));
  });
}

/**
 * 검색어로 링크 필터링
 */
export function searchLinks(links: Link[], query: string): Link[] {
  if (!query.trim()) return links;

  const lowerQuery = query.toLowerCase();

  return links.filter((link) => {
    return (
      link.title.toLowerCase().includes(lowerQuery) ||
      link.url.toLowerCase().includes(lowerQuery) ||
      (link.description && link.description.toLowerCase().includes(lowerQuery)) ||
      link.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
