import { create } from 'zustand';
import { UIStore } from '@/shared/types/stores';

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],

  // Toast 추가
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // 자동 제거
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 3000);
    }

    return id;
  },

  // Toast 제거
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // 모든 Toast 제거
  clearToasts: () => {
    set({ toasts: [] });
  },
}));
