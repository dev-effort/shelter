import { Folder } from '@/shared/types/entities';

const MAX_DEPTH = 10;
const MAX_NAME_LENGTH = 100;

export interface FolderValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Folder 생성/수정 시 validation
 */
export function validateFolder(
  folder: Partial<Folder>,
  existingFolders: Folder[] = []
): FolderValidationResult {
  const errors: string[] = [];

  // 이름 검증
  if (!folder.name || folder.name.trim().length === 0) {
    errors.push('폴더 이름은 필수입니다.');
  } else if (folder.name.length > MAX_NAME_LENGTH) {
    errors.push(`폴더 이름은 ${MAX_NAME_LENGTH}자를 초과할 수 없습니다.`);
  }

  // 깊이 검증
  if (folder.parentId) {
    const depth = calculateFolderDepth(folder.parentId, existingFolders);
    if (depth >= MAX_DEPTH) {
      errors.push(`폴더 깊이는 최대 ${MAX_DEPTH}단계까지만 허용됩니다.`);
    }
  }

  // 순환 참조 검증 (수정 시)
  if (folder.id && folder.parentId) {
    if (hasCircularReference(folder.id, folder.parentId, existingFolders)) {
      errors.push('순환 참조가 발생합니다. 하위 폴더를 상위 폴더로 설정할 수 없습니다.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 폴더 깊이 계산
 */
export function calculateFolderDepth(folderId: string | null, folders: Folder[]): number {
  if (!folderId) return 0;

  const folder = folders.find((f) => f.id === folderId);
  if (!folder) return 0;

  return 1 + calculateFolderDepth(folder.parentId, folders);
}

/**
 * 순환 참조 검증
 */
export function hasCircularReference(
  folderId: string,
  parentId: string,
  folders: Folder[]
): boolean {
  if (folderId === parentId) return true;

  const parent = folders.find((f) => f.id === parentId);
  if (!parent || !parent.parentId) return false;

  return hasCircularReference(folderId, parent.parentId, folders);
}
