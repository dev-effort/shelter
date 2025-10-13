/**
 * Service Layer Contracts
 *
 * These interfaces define the API for data services that interact
 * with IndexedDB, Capacitor APIs, and external systems.
 *
 * Services provide a clean abstraction over storage and native capabilities.
 */

import type { Folder, FolderWithMetadata, Link, Tag, Settings } from './entities';

/**
 * Storage Service - IndexedDB abstraction layer
 */
export interface StorageService {
  /**
   * Initialize database connection and run migrations
   */
  init(): Promise<void>;

  /**
   * Close database connection
   */
  close(): Promise<void>;

  /**
   * Clear all data (for testing or reset)
   */
  clear(): Promise<void>;

  /**
   * Export all data as JSON
   */
  export(): Promise<ExportData>;

  /**
   * Import data from JSON
   */
  import(data: ExportData): Promise<void>;
}

/**
 * Folder Service - folder CRUD operations
 */
export interface FolderService {
  getAll(): Promise<Folder[]>;
  getById(id: string): Promise<Folder | undefined>;
  getByParentId(parentId: string | null): Promise<Folder[]>;
  create(data: { name: string; parentId: string | null }): Promise<Folder>;
  update(id: string, data: Partial<Folder>): Promise<Folder>;
  delete(id: string): Promise<void>;
  countItemsRecursive(id: string): Promise<{ folderCount: number; linkCount: number }>;
  updateLinkCount(folderId: string, delta: number): Promise<void>;
  updateFolderCount(folderId: string, delta: number): Promise<void>;
}

/**
 * Link Service - link CRUD operations
 */
export interface LinkService {
  getAll(): Promise<Link[]>;
  getById(id: string): Promise<Link | undefined>;
  getByFolderId(folderId: string): Promise<Link[]>;
  getByTags(tags: string[]): Promise<Link[]>;
  search(query: string): Promise<Link[]>;
  create(data: {
    title: string;
    url: string;
    description?: string;
    tags: string[];
    folderId: string;
  }): Promise<Link>;
  update(id: string, data: Partial<Link>): Promise<Link>;
  delete(id: string): Promise<void>;
  updateLastAccessed(id: string): Promise<void>;
}

/**
 * Tag Service - tag management operations
 */
export interface TagService {
  getAll(): Promise<Tag[]>;
  getById(id: string): Promise<Tag | undefined>;
  getByName(name: string): Promise<Tag | undefined>;
  incrementTagCounts(tagNames: string[]): Promise<void>;
  decrementTagCounts(tagNames: string[]): Promise<void>;
  delete(id: string): Promise<void>;
  cleanupUnusedTags(): Promise<number>;
  getTopTags(limit: number): Promise<Tag[]>;
}

/**
 * Settings Service - settings persistence
 */
export interface SettingsService {
  get(): Promise<Settings>;
  update(updates: Partial<Settings>): Promise<Settings>;
  reset(): Promise<Settings>;
}

/**
 * URL Service - URL opening and deep linking
 */
export interface URLService {
  /**
   * Open URL in native app if available, otherwise browser
   */
  openURL(url: string, preferNativeApp: boolean): Promise<void>;

  /**
   * Check if URL can be opened in a native app
   */
  canOpenInNativeApp(url: string): Promise<boolean>;

  /**
   * Extract app scheme from URL (e.g., "youtube://")
   */
  extractAppScheme(url: string): string | null;

  /**
   * Validate URL format
   */
  validateURL(url: string): boolean;

  /**
   * Extract domain from URL
   */
  extractDomain(url: string): string | null;

  /**
   * Fetch favicon URL for domain
   */
  getFaviconURL(url: string): string;
}

/**
 * Share Service - handle incoming shares from external apps
 */
export interface ShareService {
  /**
   * Initialize share service and register listeners
   */
  initialize(): Promise<void>;

  /**
   * Add listener for share events
   */
  addListener(callback: (info: SharedUrlInfo) => void): void;

  /**
   * Remove listener for share events
   */
  removeListener(callback: (info: SharedUrlInfo) => void): void;

  /**
   * Check if app was launched with a shared URL
   */
  checkLaunchUrl(): Promise<SharedUrlInfo | null>;

  /**
   * Clear shared data from storage
   */
  clearSharedData(): Promise<void>;
}

/**
 * Shared URL information
 */
export interface SharedUrlInfo {
  url: string;
  title?: string;
  text?: string;
}

/**
 * Export/Import Service - data backup
 */
export interface ExportService {
  /**
   * Export all data to JSON file
   */
  exportToJSON(): Promise<Blob>;

  /**
   * Import data from JSON file
   */
  importFromJSON(file: File): Promise<ImportResult>;

  /**
   * Validate import data format
   */
  validateImportData(data: unknown): ImportValidation;
}

/**
 * Validation Service - data validation utilities
 */
export interface ValidationService {
  validateFolder(data: Partial<Folder>): ValidationResult;
  validateLink(data: Partial<Link>): ValidationResult;
  validateTag(name: string): ValidationResult;
  validateSettings(data: Partial<Settings>): ValidationResult;
}

/**
 * Migration Service - database schema migrations
 */
export interface MigrationService {
  /**
   * Get current schema version
   */
  getCurrentVersion(): Promise<number>;

  /**
   * Run pending migrations
   */
  migrate(fromVersion: number, toVersion: number): Promise<void>;

  /**
   * Check if migration is needed
   */
  needsMigration(): Promise<boolean>;
}

/**
 * Ad Service - Google AdMob integration
 */
export interface AdService {
  /**
   * Initialize AdMob
   */
  initialize(): Promise<void>;

  /**
   * Load banner ad
   */
  loadBanner(adUnitId: string): Promise<void>;

  /**
   * Hide banner ad
   */
  hideBanner(): Promise<void>;

  /**
   * Show banner ad
   */
  showBanner(): Promise<void>;
}

// ==================== Supporting Types ====================

/**
 * Share data from external apps
 */
export interface ShareData {
  url: string;
  title?: string;
  description?: string;
  timestamp: number;
}

/**
 * Export data format
 */
export interface ExportData {
  version: string;
  exportedAt: number;
  folders: Folder[];
  links: Link[];
  tags: Tag[];
  settings: Settings;
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean;
  foldersImported: number;
  linksImported: number;
  tagsImported: number;
  errors: string[];
}

/**
 * Import validation result
 */
export interface ImportValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * App scheme mapping for deep links
 */
export interface AppSchemeMap {
  [domain: string]: string;
}

/**
 * Common app schemes
 */
export const APP_SCHEMES: AppSchemeMap = {
  'youtube.com': 'youtube://',
  'youtu.be': 'youtube://',
  'instagram.com': 'instagram://',
  'twitter.com': 'twitter://',
  'x.com': 'twitter://',
  'facebook.com': 'fb://',
  'spotify.com': 'spotify://',
  'reddit.com': 'reddit://',
  'tiktok.com': 'tiktok://',
};

/**
 * URL validation patterns
 */
export const URL_PATTERNS = {
  HTTP: /^https?:\/\/.+/,
  DOMAIN: /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/,
} as const;
