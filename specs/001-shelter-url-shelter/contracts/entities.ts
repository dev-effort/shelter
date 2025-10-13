/**
 * Core Data Entities for Shelter App
 *
 * These TypeScript interfaces define the shape of data stored in IndexedDB.
 * All entities use Unix timestamps (milliseconds) for date fields.
 *
 * @see data-model.md for detailed entity specifications
 */

/**
 * Folder entity - hierarchical container for links and sub-folders
 */
export interface Folder {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Display name (1-100 characters) */
  name: string;

  /** Parent folder ID, null for root folders */
  parentId: string | null;

  /** Creation timestamp (Unix milliseconds) */
  createdAt: number;

  /** Last update timestamp (Unix milliseconds) */
  updatedAt: number;
}

/**
 * Extended folder with computed metadata
 * Used for display purposes, not stored in database
 */
export interface FolderWithMetadata extends Folder {
  /** Number of direct child links */
  linkCount: number;

  /** Number of direct child folders */
  folderCount: number;

  /** Array of ancestor folder names (for breadcrumb navigation) */
  path: string[];

  /** Depth level from root (0 = root folder) */
  depth: number;
}

/**
 * Link entity - bookmarked URL with metadata
 */
export interface Link {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Display title (1-200 characters) */
  title: string;

  /** Full URL (validated format) */
  url: string;

  /** Optional description (0-1000 characters) */
  description: string;

  /** Array of tag names (normalized to lowercase, max 20 tags) */
  tags: string[];

  /** Parent folder ID (required) */
  folderId: string;

  /** Creation timestamp (Unix milliseconds) */
  createdAt: number;

  /** Last update timestamp (Unix milliseconds) */
  updatedAt: number;

  /** Last access timestamp, null if never opened */
  lastAccessedAt: number | null;

  // Optional fields for future enhancements
  /** Cached favicon URL */
  faviconUrl?: string;

  /** Link preview image URL */
  previewImage?: string;
}

/**
 * Tag entity - categorization label with usage statistics
 */
export interface Tag {
  /** Unique tag name (lowercase, alphanumeric + hyphen/underscore) */
  name: string;

  /** Display name preserving original capitalization */
  displayName: string;

  /** Hex color code (e.g., "#3B82F6") or null for default */
  color: string | null;

  /** Number of links with this tag (denormalized for performance) */
  count: number;

  /** Creation timestamp (Unix milliseconds) */
  createdAt: number;

  /** Last time tag was applied to a link */
  lastUsedAt: number;
}

/**
 * Settings entity - user preferences and app configuration
 */
export interface Settings {
  // Display preferences
  /** List or grid view mode */
  viewMode: "list" | "grid";

  /** Theme preference */
  theme: "light" | "dark" | "system";

  // Behavior preferences
  /** Default folder for shared links, null = prompt user */
  defaultFolderId: string | null;

  /** Try to open links in native apps first */
  openLinksInApp: boolean;

  /** Show confirmation dialog before deleting */
  confirmDelete: boolean;

  // Sorting preferences
  /** Folder sort field */
  folderSortBy: "name" | "created" | "updated";

  /** Folder sort direction */
  folderSortOrder: "asc" | "desc";

  /** Link sort field */
  linkSortBy: "title" | "created" | "accessed";

  /** Link sort direction */
  linkSortOrder: "asc" | "desc";

  // App metadata
  /** Current app version */
  version: string;

  /** Database schema version (for migrations) */
  schemaVersion: number;

  /** Last export timestamp, null if never exported */
  lastBackupAt: number | null;
}

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS: Settings = {
  viewMode: "list",
  theme: "system",
  defaultFolderId: null,
  openLinksInApp: true,
  confirmDelete: true,
  folderSortBy: "name",
  folderSortOrder: "asc",
  linkSortBy: "created",
  linkSortOrder: "desc",
  version: "1.0.0",
  schemaVersion: 1,
  lastBackupAt: null,
};

/**
 * Tag color palette for auto-assignment
 */
export const TAG_COLORS = [
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
] as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
  FOLDER: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    MAX_DEPTH: 10,
  },
  LINK: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    MAX_TAGS: 20,
  },
  TAG: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 50,
    NAME_PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
} as const;
