/**
 * Zustand Store Contracts
 *
 * These interfaces define the shape and actions of Zustand stores
 * used for state management in the Shelter app.
 *
 * Each store follows the pattern:
 * - State: data fields
 * - Actions: methods to mutate state
 * - Selectors: derived state (computed properties)
 */

import type { Folder, FolderWithMetadata, Link, Tag, Settings } from './entities';

/**
 * Folder Store - manages folder hierarchy and operations
 */
export interface FolderStore {
  // State
  folders: Folder[];
  currentFolder: Folder | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFolders: () => Promise<void>;
  loadFolder: (id: string) => Promise<void>;
  createFolder: (data: { name: string; parentId: string | null }) => Promise<Folder>;
  updateFolder: (id: string, data: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  // Selectors
  getSubfolders: (parentId: string | null) => Folder[];
  getRootFolders: () => Folder[];
}

/**
 * Link Store - manages link storage and retrieval
 */
export interface LinkStore {
  // State
  links: Link[];
  currentLink: Link | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadLinks: () => Promise<void>;
  loadLink: (id: string) => Promise<void>;
  createLink: (data: {
    title: string;
    url: string;
    description?: string;
    tags: string[];
    folderId: string | null;
  }) => Promise<Link>;
  updateLink: (id: string, data: Partial<Link>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;

  // Selectors
  getLinksByFolder: (folderId: string | null) => Link[];
  getLinksByTags: (tags: string[]) => Link[];
  searchLinks: (query: string) => Link[];
}

/**
 * Tag Store - manages tags and filtering
 */
export interface TagStore {
  // State
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTags: () => Promise<void>;
  getTopTags: (limit?: number) => Promise<Tag[]>;
  cleanupTags: () => Promise<number>;
}

/**
 * Settings Store - manages user preferences
 */
export interface SettingsStore {
  // State
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings>) => Promise<void>;
}

/**
 * Navigation Store - manages app navigation state (Stackflow integration)
 */
export interface NavigationStore {
  // State
  currentActivity: string | null;
  history: string[];

  // Actions
  push: (activity: string, params?: Record<string, unknown>) => void;
  pop: () => void;
  replace: (activity: string, params?: Record<string, unknown>) => void;
  reset: () => void;

  // Selectors
  canGoBack: () => boolean;
}

/**
 * UI Store - manages transient UI state
 */
export interface UIStore {
  // State
  toasts: Toast[];

  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Toast notification
 */
export interface Toast {
  id?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

/**
 * Combined root store type (if using a single store approach)
 */
export interface RootStore {
  folders: FolderStore;
  links: LinkStore;
  tags: TagStore;
  settings: SettingsStore;
  navigation: NavigationStore;
  ui: UIStore;
}
