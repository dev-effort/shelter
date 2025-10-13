import { Link } from '@/shared/types/entities';

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_TAGS = 20;

export interface LinkValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Link 생성/수정 시 validation
 */
export function validateLink(link: Partial<Link>): LinkValidationResult {
  const errors: string[] = [];

  // 제목 검증
  if (!link.title || link.title.trim().length === 0) {
    errors.push('링크 제목은 필수입니다.');
  } else if (link.title.length > MAX_TITLE_LENGTH) {
    errors.push(`제목은 ${MAX_TITLE_LENGTH}자를 초과할 수 없습니다.`);
  }

  // URL 검증
  if (!link.url || link.url.trim().length === 0) {
    errors.push('URL은 필수입니다.');
  } else if (!isValidUrl(link.url)) {
    errors.push('유효한 URL이 아닙니다.');
  }

  // 설명 검증
  if (link.description && link.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`설명은 ${MAX_DESCRIPTION_LENGTH}자를 초과할 수 없습니다.`);
  }

  // 태그 검증
  if (link.tags && link.tags.length > MAX_TAGS) {
    errors.push(`태그는 최대 ${MAX_TAGS}개까지만 추가할 수 있습니다.`);
  }

  // 폴더 ID 검증
  if (!link.folderId) {
    errors.push('폴더는 필수입니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * URL 유효성 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}
