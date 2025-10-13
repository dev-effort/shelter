import { getDB } from '../db';
import { Link } from '@/shared/types/entities';
import { LinkService } from '@/shared/types/services';
import { validateLink } from '@/entities/link';
import { nanoid } from 'nanoid';
import { folderService } from './folder';
import { tagService } from './tag';

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
   * 폴더 내 링크들 조회
   */
  async getByFolderId(folderId: string): Promise<Link[]> {
    const db = await getDB();
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
    folderId: string;
  }): Promise<Link> {
    const db = await getDB();

    // Validation
    const validation = validateLink(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const now = Date.now();
    const link: Link = {
      id: nanoid(),
      title: data.title,
      url: data.url,
      description: data.description || '',
      tags: data.tags,
      folderId: data.folderId,
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: null,
    };

    await db.put('links', link);

    // 폴더의 linkCount 업데이트
    await folderService.updateLinkCount(data.folderId, 1);

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

    const validation = validateLink({ ...existing, ...data });
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const updated: Link = {
      ...existing,
      ...data,
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
