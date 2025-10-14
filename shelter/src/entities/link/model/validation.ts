import { Link } from '@/shared/types/entities';

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_TAGS = 20;

export interface LinkValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * URL 형식 검증 (HTTP/HTTPS + 앱 스킴)
 */
function validateURL(url: string): { valid: boolean; error?: string; warning?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL은 필수입니다' };
  }

  const trimmedUrl = url.trim();

  if (trimmedUrl.length === 0) {
    return { valid: false, error: 'URL은 필수입니다' };
  }

  // 기본 형식 검증: http:// 또는 https://가 있어야 함
  if (trimmedUrl.startsWith('http:') || trimmedUrl.startsWith('https:')) {
    if (!trimmedUrl.includes('://')) {
      return {
        valid: false,
        error:
          'URL 형식이 올바르지 않습니다. http:// 또는 https://를 포함해야 합니다 (예: https://www.example.com)',
      };
    }
  }

  // URL 객체로 파싱 시도
  try {
    const urlObj = new URL(trimmedUrl);

    // HTTP/HTTPS 프로토콜 체크
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      // 도메인 형식 검증
      const hostname = urlObj.hostname;

      // 최소한의 도메인 형식 (예: example.com)
      if (!hostname || hostname.split('.').length < 2) {
        return {
          valid: false,
          error: '올바른 도메인 형식이 아닙니다 (예: example.com)',
        };
      }

      return { valid: true };
    }

    // 앱 스킴 체크 (youtube://, instagram:// 등)
    if (urlObj.protocol.endsWith(':')) {
      const scheme = urlObj.protocol.slice(0, -1); // Remove trailing ':'

      // 일반적인 앱 스킴 목록
      const supportedSchemes = [
        'youtube',
        'instagram',
        'twitter',
        'facebook',
        'fb',
        'spotify',
        'reddit',
        'tiktok',
        'tel',
        'mailto',
        'sms',
      ];

      if (!supportedSchemes.includes(scheme)) {
        return {
          valid: true,
          warning: `'${scheme}://' 스킴은 지원되지 않을 수 있습니다`,
        };
      }

      return { valid: true };
    }

    return {
      valid: false,
      error: 'HTTP, HTTPS 또는 앱 스킴만 지원됩니다',
    };
  } catch (error) {
    // URL 파싱 실패
    return {
      valid: false,
      error: '올바른 URL 형식이 아닙니다 (예: https://example.com)',
    };
  }
}

/**
 * Link 생성/수정 시 validation
 */
export function validateLink(link: Partial<Link>): LinkValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 제목 검증
  if (!link.title || link.title.trim().length === 0) {
    errors.push('링크 제목은 필수입니다.');
  } else if (link.title.length > MAX_TITLE_LENGTH) {
    errors.push(`제목은 ${MAX_TITLE_LENGTH}자를 초과할 수 없습니다.`);
  }

  // URL 검증 (강화된 validation)
  if (!link.url || link.url.trim().length === 0) {
    errors.push('URL은 필수입니다.');
  } else {
    const urlValidation = validateURL(link.url);
    if (!urlValidation.valid) {
      errors.push(urlValidation.error || '유효한 URL이 아닙니다.');
    } else if (urlValidation.warning) {
      warnings.push(urlValidation.warning);
    }
  }

  // 설명 검증
  if (link.description && link.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`설명은 ${MAX_DESCRIPTION_LENGTH}자를 초과할 수 없습니다.`);
  }

  // 태그 검증
  if (link.tags && link.tags.length > MAX_TAGS) {
    errors.push(`태그는 최대 ${MAX_TAGS}개까지만 추가할 수 있습니다.`);
  }

  // folderId는 null일 수 있으므로 검증 제거

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * URL 정규화 - http:// 또는 https://가 없으면 자동으로 추가
 */
export function normalizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  const trimmedUrl = url.trim();

  // 이미 프로토콜이 있으면 그대로 반환
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // 앱 스킴인 경우 (youtube://, instagram:// 등) 그대로 반환
  if (trimmedUrl.includes('://')) {
    return trimmedUrl;
  }

  // 프로토콜이 없으면 https:// 추가
  return `https://${trimmedUrl}`;
}
