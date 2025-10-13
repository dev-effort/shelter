import { getDB } from '../db';
import { Tag } from '@/shared/types/entities';
import { TagService } from '@/shared/types/services';
import { validateTag, normalizeTagName } from '@/entities/tag';
import { nanoid } from 'nanoid';

class TagServiceImpl implements TagService {
  /**
   * 모든 태그 조회
   */
  async getAll(): Promise<Tag[]> {
    const db = await getDB();
    return await db.getAll('tags');
  }

  /**
   * ID로 태그 조회
   */
  async getById(id: string): Promise<Tag | undefined> {
    const db = await getDB();
    return await db.get('tags', id);
  }

  /**
   * 이름으로 태그 조회
   */
  async getByName(name: string): Promise<Tag | undefined> {
    const normalizedName = normalizeTagName(name);
    const allTags = await this.getAll();
    return allTags.find((tag) => normalizeTagName(tag.name) === normalizedName);
  }

  /**
   * 태그 생성 (내부 사용)
   */
  private async create(name: string): Promise<Tag> {
    const db = await getDB();

    const validation = validateTag(name);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const now = Date.now();
    const tag: Tag = {
      id: nanoid(),
      name: normalizeTagName(name),
      count: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.put('tags', tag);
    return tag;
  }

  /**
   * 태그 카운트 증가 (여러 태그)
   */
  async incrementTagCounts(tagNames: string[]): Promise<void> {
    for (const name of tagNames) {
      let tag = await this.getByName(name);

      if (!tag) {
        // 태그가 없으면 생성
        tag = await this.create(name);
      }

      // 카운트 증가
      await this.updateCount(tag.id, tag.count + 1);
    }
  }

  /**
   * 태그 카운트 감소 (여러 태그)
   */
  async decrementTagCounts(tagNames: string[]): Promise<void> {
    for (const name of tagNames) {
      const tag = await this.getByName(name);
      if (!tag) continue;

      const newCount = Math.max(0, tag.count - 1);

      if (newCount === 0) {
        // 카운트가 0이면 태그 삭제
        await this.delete(tag.id);
      } else {
        await this.updateCount(tag.id, newCount);
      }
    }
  }

  /**
   * 태그 카운트 업데이트
   */
  private async updateCount(id: string, count: number): Promise<void> {
    const db = await getDB();
    const tag = await this.getById(id);

    if (!tag) return;

    const updated: Tag = {
      ...tag,
      count,
      updatedAt: Date.now(),
    };

    await db.put('tags', updated);
  }

  /**
   * 태그 삭제
   */
  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('tags', id);
  }

  /**
   * 미사용 태그 정리 (카운트 0인 태그들)
   */
  async cleanupUnusedTags(): Promise<number> {
    const allTags = await this.getAll();
    const unusedTags = allTags.filter((tag) => tag.count === 0);

    for (const tag of unusedTags) {
      await this.delete(tag.id);
    }

    return unusedTags.length;
  }

  /**
   * 인기 태그 조회 (Top N)
   */
  async getTopTags(limit: number = 10): Promise<Tag[]> {
    const db = await getDB();
    const allTags = await db.getAll('tags');

    return allTags.sort((a, b) => b.count - a.count).slice(0, limit);
  }
}

export const tagService = new TagServiceImpl();
