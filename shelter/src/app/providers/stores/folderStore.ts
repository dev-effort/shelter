import { create } from 'zustand';
import { Folder } from '@/shared/types/entities';
import { FolderStore } from '@/shared/types/stores';
import { folderService } from '@/shared/api/services';

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  currentFolder: null,
  isLoading: false,
  error: null,

  // Folders 로드
  loadFolders: async () => {
    set({ isLoading: true, error: null });
    try {
      const folders = await folderService.getAll();
      set({ folders, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // 특정 폴더 로드
  loadFolder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const folder = await folderService.getById(id);
      set({ currentFolder: folder || null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // 폴더 생성
  createFolder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const folder = await folderService.create(data);
      set((state) => ({
        folders: [...state.folders, folder],
        isLoading: false,
      }));
      return folder;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // 폴더 수정
  updateFolder: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await folderService.update(id, data);
      set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? updated : f)),
        currentFolder: state.currentFolder?.id === id ? updated : state.currentFolder,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // 폴더 삭제
  deleteFolder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await folderService.delete(id);
      set((state) => ({
        folders: state.folders.filter((f) => f.id !== id),
        currentFolder: state.currentFolder?.id === id ? null : state.currentFolder,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // 하위 폴더 조회
  getSubfolders: (parentId) => {
    const { folders } = get();
    return folders.filter((f) => f.parentId === parentId);
  },

  // 루트 폴더 조회
  getRootFolders: () => {
    return get().getSubfolders(null);
  },
}));
