import { create } from 'zustand';
import { Settings } from '@/shared/types/entities';
import { SettingsStore } from '@/shared/types/stores';
import { getDB } from '@/shared/api/db';

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  // Settings 로드
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDB();
      const settings = await db.get('settings', 'user-settings');
      set({ settings: settings || null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Settings 업데이트
  updateSettings: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDB();
      const current = await db.get('settings', 'user-settings');

      if (!current) {
        throw new Error('설정을 찾을 수 없습니다.');
      }

      const updated: Settings = {
        ...current,
        ...data,
        updatedAt: Date.now(),
      };

      await db.put('settings', updated);
      set({ settings: updated, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
