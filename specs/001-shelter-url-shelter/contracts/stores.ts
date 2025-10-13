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

import type {
  Folder,
  FolderWithMetadata,
  Link,
  Tag,
  Settings,
} from "./entities";

/**
 * Folder Store - manages folder hierarchy and operations
 */
export interface FolderStore {
  // State
  folders: Map<string, Folder>;
  loading: boolean;
  error: string | null;

  // Actions
  loadFolders: () => Promise<void>;
  getFolder: (id: string) => Folder | undefined;
  getFolderWithMetadata: (
    id: string
  ) => Promise<FolderWithMetadata | undefined>;
  getRootFolders: () => Folder[];
  getChildFolders: (parentId: string | null) => Folder[];
  getFolderPath: (id: string) => Promise<Folder[]>;
  createFolder: (name: string, parentId: string | null) => Promise<Folder>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveFolder: (id: string, newParentId: string | null) => Promise<void>;

  // Selectors (derived state)
  getFolderDepth: (id: string) => Promise<number>;
  canCreateSubfolder: (parentId: string | null) => Promise<boolean>;
}

/**
 * Link Store - manages link storage and retrieval
 */
export interface LinkStore {
  // State
  links: Map<string, Link>;
  loading: boolean;
  error: string | null;

  // Actions
  loadLinks: () => Promise<void>;
  getLink: (id: string) => Link | undefined;
  getLinksByFolder: (folderId: string) => Link[];
  getLinksByTag: (tagName: string) => Link[];
  searchLinks: (query: string) => Link[];
  createLink: (
    data: Omit<Link, "id" | "createdAt" | "updatedAt" | "lastAccessedAt">
  ) => Promise<Link>;
  updateLink: (id: string, updates: Partial<Link>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  markLinkAccessed: (id: string) => Promise<void>;

  // Bulk operations
  deleteLinksByFolder: (folderId: string) => Promise<void>;

  // Selectors
  getRecentLinks: (limit: number) => Link[];
  getLinkCount: (folderId: string) => number;
}

/**
 * Tag Store - manages tags and filtering
 */
export interface TagStore {
  // State
  tags: Map<string, Tag>;
  loading: boolean;
  error: string | null;

  // Actions
  loadTags: () => Promise<void>;
  getTag: (name: string) => Tag | undefined;
  getAllTags: () => Tag[];
  updateTagCounts: (
    addedTags: string[],
    removedTags: string[]
  ) => Promise<void>;
  setTagColor: (name: string, color: string | null) => Promise<void>;

  // Selectors
  getPopularTags: (limit: number) => Tag[];
  getRecentTags: (limit: number) => Tag[];
  suggestTags: (query: string) => Tag[];
}

/**
 * Settings Store - manages user preferences
 */
export interface SettingsStore {
  // State
  settings: Settings;
  loading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;

  // Convenience setters
  setViewMode: (mode: "list" | "grid") => Promise<void>;
  setTheme: (theme: "light" | "dark" | "system") => Promise<void>;
  setDefaultFolder: (folderId: string | null) => Promise<void>;
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
  isNavOpen: boolean;
  activeBottomSheet: string | null;
  toasts: Toast[];

  // Actions
  setNavOpen: (open: boolean) => void;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: () => void;
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

/**
 * Toast notification
 */
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
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
