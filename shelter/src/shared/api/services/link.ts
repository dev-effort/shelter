import { getDB } from '../db';
import { Link } from '@/shared/types/entities';
import { LinkService } from '@/shared/types/services';
import { nanoid } from 'nanoid';
import { folderService } from './folder';
import { tagService } from './tag';
import { validateLink as validateLinkEntity, normalizeURL } from '@/entities/link/model/validation';

// Helper function - 강화된 validation 사용
function validateLink(data: Partial<Link>): void {
  const validation = validateLinkEntity(data);

  if (!validation.valid) {
    // 첫 번째 에러 메시지를 throw
    throw new Error(validation.errors[0]);
  }

  // 경고가 있으면 콘솔에 출력
  if (validation.warnings && validation.warnings.length > 0) {
    validation.warnings.forEach((warning) => {
      console.warn('⚠️ URL 경고:', warning);
    });
  }
}

class LinkServiceImpl implements LinkService {
  /**
   * 모든 링크 조회
   */
  async getAll(): Promise<Link[]> {
    const db = await getDB();
    return await db.getAll('links');
  }

  /**
   * ID로 링크 조회
   */
  async getById(id: string): Promise<Link | undefined> {
    const db = await getDB();
    return await db.get('links', id);
  }

  /**
   * 폴더 내 링크들 조회 (folderId가 null이면 홈의 루트 링크들)
   */
  async getByFolderId(folderId: string | null): Promise<Link[]> {
    const db = await getDB();
    if (folderId === null) {
      return await db.getAllFromIndex('links', 'by-folder', null as any);
    }
    return await db.getAllFromIndex('links', 'by-folder', folderId);
  }

  /**
   * 태그로 링크 필터링
   */
  async getByTags(tags: string[]): Promise<Link[]> {
    const allLinks = await this.getAll();

    return allLinks.filter((link) => {
      return tags.every((tag) => link.tags.includes(tag));
    });
  }

  /**
   * 검색
   */
  async search(query: string): Promise<Link[]> {
    const allLinks = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return allLinks.filter((link) => {
      return (
        link.title.toLowerCase().includes(lowerQuery) ||
        link.url.toLowerCase().includes(lowerQuery) ||
        (link.description && link.description.toLowerCase().includes(lowerQuery)) ||
        link.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * 링크 생성
   */
  async create(data: {
    title: string;
    url: string;
    description?: string;
    tags: string[];
    folderId: string | null;
  }): Promise<Link> {
    const db = await getDB();

    // URL 정규화 (http:// 또는 https:// 자동 추가)
    const normalizedUrl = normalizeURL(data.url);
    const normalizedData = { ...data, url: normalizedUrl };

    // Validation
    validateLink(normalizedData);

    const now = Date.now();
    const link: Link = {
      id: nanoid(),
      title: normalizedData.title,
      url: normalizedData.url,
      description: normalizedData.description || '',
      tags: normalizedData.tags,
      folderId: normalizedData.folderId,
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: null,
    };

    await db.put('links', link);

    // 폴더의 linkCount 업데이트 (폴더가 있는 경우만)
    if (data.folderId) {
      await folderService.updateLinkCount(data.folderId, 1);
    }

    // 태그 카운트 업데이트
    await tagService.incrementTagCounts(data.tags);

    return link;
  }

  /**
   * 링크 수정
   */
  async update(id: string, data: Partial<Link>): Promise<Link> {
    const db = await getDB();
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error('링크를 찾을 수 없습니다.');
    }

    // URL이 수정되는 경우 정규화
    const normalizedData = data.url ? { ...data, url: normalizeURL(data.url) } : data;

    // Validation
    validateLink({ ...existing, ...normalizedData });

    const updated: Link = {
      ...existing,
      ...normalizedData,
      id, // ID는 변경 불가
      updatedAt: Date.now(),
    };

    await db.put('links', updated);

    // 태그가 변경된 경우 카운트 업데이트
    if (data.tags) {
      const oldTags = existing.tags;
      const newTags = data.tags;

      const removedTags = oldTags.filter((tag) => !newTags.includes(tag));
      const addedTags = newTags.filter((tag) => !oldTags.includes(tag));

      await tagService.decrementTagCounts(removedTags);
      await tagService.incrementTagCounts(addedTags);
    }

    // 폴더가 변경된 경우 카운트 업데이트
    if (data.folderId && data.folderId !== existing.folderId) {
      await folderService.updateLinkCount(existing.folderId, -1);
      await folderService.updateLinkCount(data.folderId, 1);
    }

    return updated;
  }

  /**
   * 링크 삭제
   */
  async delete(id: string): Promise<void> {
    const db = await getDB();
    const link = await this.getById(id);

    if (!link) {
      throw new Error('링크를 찾을 수 없습니다.');
    }

    await db.delete('links', id);

    // 폴더의 linkCount 업데이트
    await folderService.updateLinkCount(link.folderId, -1);

    // 태그 카운트 업데이트
    await tagService.decrementTagCounts(link.tags);
  }

  /**
   * 링크 접근 시각 업데이트
   */
  async updateLastAccessed(id: string): Promise<void> {
    const link = await this.getById(id);
    if (!link) return;

    await this.update(id, {
      lastAccessedAt: Date.now(),
    });
  }
}

export const linkService = new LinkServiceImpl();
