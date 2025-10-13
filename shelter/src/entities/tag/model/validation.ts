const MAX_TAG_LENGTH = 30;

export interface TagValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Tag validation
 */
export function validateTag(name: string): TagValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('태그 이름은 필수입니다.');
  } else if (name.length > MAX_TAG_LENGTH) {
    errors.push(`태그 이름은 ${MAX_TAG_LENGTH}자를 초과할 수 없습니다.`);
  } else if (!/^[a-zA-Z0-9가-힣_-]+$/.test(name)) {
    errors.push('태그는 영문, 숫자, 한글, -, _만 사용할 수 있습니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 태그 이름 정규화 (공백 제거, 소문자 변환)
 */
export function normalizeTagName(name: string): string {
  return name.trim().toLowerCase();
}
