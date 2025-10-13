import { getDB } from '../db';
import { Folder } from '@/shared/types/entities';
import { FolderService } from '@/shared/types/services';
import { nanoid } from 'nanoid';

// Helper functions
function validateFolder(data: Partial<Folder>): void {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('폴더 이름은 필수입니다');
  }
  if (data.name.trim().length > 100) {
    throw new Error('폴더 이름은 100자를 초과할 수 없습니다');
  }
}

async function calculateFolderDepth(parentId: string | null, db: any): Promise<number> {
  if (!parentId) return 0;

  const parent = await db.get('folders', parentId);
  if (!parent) return 0;

  return parent.depth + 1;
}

class FolderServiceImpl implements FolderService {
  /**
   * 모든 폴더 조회
   */
  async getAll(): Promise<Folder[]> {
    const db = await getDB();
    return await db.getAll('folders');
  }

  /**
   * ID로 폴더 조회
   */
  async getById(id: string): Promise<Folder | undefined> {
    const db = await getDB();
    return await db.get('folders', id);
  }

  /**
   * 부모 폴더의 하위 폴더들 조회
   */
  async getByParentId(parentId: string | null): Promise<Folder[]> {
    const db = await getDB();
    return await db.getAllFromIndex('folders', 'by-parent', parentId);
  }

  /**
   * 폴더 생성
   */
  async create(data: { name: string; parentId: string | null }): Promise<Folder> {
    const db = await getDB();

    // Validation
    validateFolder(data);

    const depth = await calculateFolderDepth(data.parentId, db);

    const now = Date.now();
    const folder: Folder = {
      id: nanoid(),
      name: data.name,
      parentId: data.parentId,
      depth,
      linkCount: 0,
      folderCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.put('folders', folder);

    // 부모 폴더의 folderCount 업데이트
    if (data.parentId) {
      await this.updateFolderCount(data.parentId, 1);
    }

    return folder;
  }

  /**
   * 폴더 수정
   */
  async update(id: string, data: Partial<Folder>): Promise<Folder> {
    const db = await getDB();
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error('폴더를 찾을 수 없습니다.');
    }

    // Validation
    validateFolder({ ...existing, ...data });

    const updated: Folder = {
      ...existing,
      ...data,
      id, // ID는 변경 불가
      updatedAt: Date.now(),
    };

    await db.put('folders', updated);

    return updated;
  }

  /**
   * 폴더 삭제 (cascade)
   */
  async delete(id: string): Promise<void> {
    const db = await getDB();
    const folder = await this.getById(id);

    if (!folder) {
      throw new Error('폴더를 찾을 수 없습니다.');
    }

    // 하위 폴더 재귀 삭제
    const subfolders = await this.getByParentId(id);
    for (const subfolder of subfolders) {
      await this.delete(subfolder.id);
    }

    // 폴더 내 링크 삭제
    const links = await db.getAllFromIndex('links', 'by-folder', id);
    const tx = db.transaction('links', 'readwrite');
    for (const link of links) {
      await tx.store.delete(link.id);
    }
    await tx.done;

    // 폴더 삭제
    await db.delete('folders', id);

    // 부모 폴더의 folderCount 업데이트
    if (folder.parentId) {
      await this.updateFolderCount(folder.parentId, -1);
    }
  }

  /**
   * 폴더 내 항목 개수 계산 (cascade delete용)
   */
  async countItemsRecursive(id: string): Promise<{ folderCount: number; linkCount: number }> {
    const db = await getDB();
    let folderCount = 0;
    let linkCount = 0;

    // 직접 링크 개수
    const directLinks = await db.getAllFromIndex('links', 'by-folder', id);
    linkCount += directLinks.length;

    // 하위 폴더 재귀
    const subfolders = await this.getByParentId(id);
    folderCount += subfolders.length;

    for (const subfolder of subfolders) {
      const counts = await this.countItemsRecursive(subfolder.id);
      folderCount += counts.folderCount;
      linkCount += counts.linkCount;
    }

    return { folderCount, linkCount };
  }

  /**
   * 폴더의 linkCount 업데이트
   */
  async updateLinkCount(folderId: string, delta: number): Promise<void> {
    const folder = await this.getById(folderId);
    if (!folder) return;

    await this.update(folderId, {
      linkCount: Math.max(0, folder.linkCount + delta),
    });
  }

  /**
   * 폴더의 folderCount 업데이트
   */
  async updateFolderCount(folderId: string, delta: number): Promise<void> {
    const folder = await this.getById(folderId);
    if (!folder) return;

    await this.update(folderId, {
      folderCount: Math.max(0, folder.folderCount + delta),
    });
  }
}

export const folderService = new FolderServiceImpl();
