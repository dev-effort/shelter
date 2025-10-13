import { create } from 'zustand';
import { Tag } from '@/shared/types/entities';
import { TagStore } from '@/shared/types/stores';
import { tagService } from '@/shared/api/services';

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  isLoading: false,
  error: null,

  // Tags 로드
  loadTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const tags = await tagService.getAll();
      set({ tags, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // 인기 태그 조회
  getTopTags: async (limit = 10) => {
    try {
      return await tagService.getTopTags(limit);
    } catch (error) {
      set({ error: (error as Error).message });
      return [];
    }
  },

  // 미사용 태그 정리
  cleanupTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const count = await tagService.cleanupUnusedTags();
      await tagService.getAll().then((tags) => set({ tags }));
      set({ isLoading: false });
      return count;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return 0;
    }
  },
}));
