import { create } from 'zustand';
import { Link } from '@/shared/types/entities';
import { LinkStore } from '@/shared/types/stores';
import { linkService } from '@/shared/api/services';

export const useLinkStore = create<LinkStore>((set, get) => ({
  links: [],
  currentLink: null,
  isLoading: false,
  error: null,

  // Links 로드
  loadLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const links = await linkService.getAll();
      set({ links, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // 특정 링크 로드
  loadLink: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const link = await linkService.getById(id);
      set({ currentLink: link || null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // 링크 생성
  createLink: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const link = await linkService.create(data);
      set((state) => ({
        links: [...state.links, link],
        isLoading: false,
      }));
      return link;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // 링크 수정
  updateLink: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await linkService.update(id, data);
      set((state) => ({
        links: state.links.map((l) => (l.id === id ? updated : l)),
        currentLink: state.currentLink?.id === id ? updated : state.currentLink,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // 링크 삭제
  deleteLink: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await linkService.delete(id);
      set((state) => ({
        links: state.links.filter((l) => l.id !== id),
        currentLink: state.currentLink?.id === id ? null : state.currentLink,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // 폴더별 링크 조회
  getLinksByFolder: (folderId) => {
    const { links } = get();
    return links.filter((l) => l.folderId === folderId);
  },

  // 태그로 링크 필터링
  getLinksByTags: (tags) => {
    const { links } = get();
    return links.filter((link) => tags.every((tag) => link.tags.includes(tag)));
  },

  // 검색
  searchLinks: (query) => {
    const { links } = get();
    const lowerQuery = query.toLowerCase();

    return links.filter((link) => {
      return (
        link.title.toLowerCase().includes(lowerQuery) ||
        link.url.toLowerCase().includes(lowerQuery) ||
        (link.description && link.description.toLowerCase().includes(lowerQuery)) ||
        link.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  },
}));
