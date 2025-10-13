# Phase 1: Data Model

**Feature**: Shelter - Link Organization App  
**Date**: 2025-10-13  
**Status**: Completed

## Overview

This document defines the data entities, their relationships, and storage schema for the Shelter app. All data is stored locally using IndexedDB with proper indexing for query performance.

## Entity Relationship Diagram

```
┌─────────────┐
│   Folder    │
│             │◄───┐
│ - id        │    │
│ - name      │    │ parent_id (self-reference)
│ - parent_id │────┘
│ - created   │
│ - updated   │
└──────┬──────┘
       │
       │ 1:N (contains)
       │
       ▼
┌─────────────┐         ┌──────────┐
│    Link     │ N:M     │   Tag    │
│             ├─────────┤          │
│ - id        │         │ - name   │
│ - title     │         │ - count  │
│ - url       │         │ - color  │
│ - desc      │         └──────────┘
│ - tags[]    │
│ - folder_id │
│ - created   │
│ - accessed  │
└─────────────┘

┌──────────────┐
│   Settings   │
│              │
│ - view_mode  │
│ - theme      │
│ - ...        │
└──────────────┘
```

## Core Entities

### 1. Folder

**Purpose**: Hierarchical container for organizing links and sub-folders

**Schema**:

```typescript
interface Folder {
  id: string; // UUID v4
  name: string; // Display name, required
  parentId: string | null; // null for root folders
  createdAt: number; // Unix timestamp (ms)
  updatedAt: number; // Unix timestamp (ms)

  // Computed fields (not stored, calculated on read)
  linkCount?: number; // Number of direct child links
  folderCount?: number; // Number of direct child folders
  path?: string[]; // Array of ancestor folder names (for breadcrumb)
}
```

**Validation Rules**:

- `name`: 1-100 characters, required
- `parentId`: Must reference existing folder or be null
- Cannot set `parentId` to self or create circular references
- Maximum depth: 10 levels (enforced at creation)

**Indexes** (IndexedDB):

- Primary key: `id`
- Index: `parentId` (for querying children)
- Index: `createdAt` (for sorting)

**Business Rules**:

- Root folders have `parentId = null`
- Deleting folder cascades to all children (folders + links)
- Moving folder validates depth limit for new location
- Folder name must be unique within same parent (optional enforcement)

---

### 2. Link (Document)

**Purpose**: Stores bookmarked URL with metadata

**Schema**:

```typescript
interface Link {
  id: string; // UUID v4
  title: string; // Display title, required
  url: string; // Full URL, required (validated)
  description: string; // Optional description
  tags: string[]; // Array of tag names (normalized to lowercase)
  folderId: string; // Parent folder, required

  // Metadata
  createdAt: number; // Unix timestamp (ms)
  updatedAt: number; // Unix timestamp (ms)
  lastAccessedAt: number | null; // Last time link was opened

  // Optional fields (future enhancements)
  faviconUrl?: string; // Cached favicon URL
  previewImage?: string; // Link preview image
}
```

**Validation Rules**:

- `title`: 1-200 characters, required
- `url`: Valid URL format (uses URL constructor for validation), required
- `description`: 0-1000 characters
- `tags`: Array of strings, each 1-50 characters, max 20 tags per link
- `folderId`: Must reference existing folder

**Indexes** (IndexedDB):

- Primary key: `id`
- Index: `folderId` (for querying links in a folder)
- Index: `tags` (multiEntry: true, for tag filtering)
- Index: `[title, url, description]` (compound, for search)
- Index: `createdAt` (for sorting)
- Index: `lastAccessedAt` (for "recently accessed")

**Business Rules**:

- Duplicate URLs allowed (same URL can exist in multiple folders)
- Tags are case-insensitive (stored lowercase, displayed with title case)
- Orphaned links (folder deleted) are also deleted (cascade)
- Opening link updates `lastAccessedAt`

---

### 3. Tag

**Purpose**: Categorization labels for links, with usage statistics

**Schema**:

```typescript
interface Tag {
  name: string; // Unique tag name (lowercase), primary key
  displayName: string; // Original case for display (e.g., "JavaScript")
  color: string | null; // Hex color code (e.g., "#3B82F6") or null
  count: number; // Number of links with this tag (denormalized)

  createdAt: number; // Unix timestamp (ms)
  lastUsedAt: number; // Last time tag was applied to a link
}
```

**Validation Rules**:

- `name`: 1-50 characters, unique (case-insensitive), alphanumeric + hyphen/underscore
- `displayName`: Preserves original capitalization
- `color`: Valid hex color or null (uses default)
- `count`: Auto-calculated, read-only

**Indexes** (IndexedDB):

- Primary key: `name`
- Index: `count` (for "popular tags" sorting)
- Index: `lastUsedAt` (for "recent tags")

**Business Rules**:

- Tag created automatically when first used on a link
- `count` incremented/decremented when link tags change
- Tag deleted automatically when `count` reaches 0 (optional)
- Tag color can be user-customized or auto-assigned

**Tag Color Palette** (auto-assigned):

```typescript
const TAG_COLORS = [
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
];
```

---

### 4. Settings

**Purpose**: User preferences and app configuration

**Schema**:

```typescript
interface Settings {
  // Display preferences
  viewMode: "list" | "grid"; // Default: "list"
  theme: "light" | "dark" | "system"; // Default: "system"

  // Behavior preferences
  defaultFolderId: string | null; // Default folder for shares (null = prompt)
  openLinksInApp: boolean; // Try native app first (true) or always browser (false)
  confirmDelete: boolean; // Show delete confirmation (default: true)

  // Sorting preferences
  folderSortBy: "name" | "created" | "updated"; // Default: "name"
  folderSortOrder: "asc" | "desc"; // Default: "asc"
  linkSortBy: "title" | "created" | "accessed"; // Default: "created"
  linkSortOrder: "asc" | "desc"; // Default: "desc"

  // App metadata
  version: string; // App version (for migrations)
  schemaVersion: number; // Database schema version
  lastBackupAt: number | null; // Last export timestamp (future)
}
```

**Storage**: Capacitor Storage (key-value) or single IndexedDB record

**Default Values**:

```typescript
const DEFAULT_SETTINGS: Settings = {
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
```

---

## Derived Data & Aggregations

### Folder Metadata

Computed fields for folder display:

```typescript
interface FolderWithMetadata extends Folder {
  linkCount: number; // SELECT COUNT(*) FROM links WHERE folderId = folder.id
  folderCount: number; // SELECT COUNT(*) FROM folders WHERE parentId = folder.id
  path: string[]; // Recursive query to get ancestor names
  depth: number; // Number of levels from root (for depth limit)
}
```

### Tag Statistics

```typescript
interface TagStatistics {
  totalTags: number; // Total unique tags
  averageTagsPerLink: number; // AVG(LENGTH(tags))
  mostUsedTags: Tag[]; // Top 10 by count
  recentTags: Tag[]; // Top 10 by lastUsedAt
}
```

### Search Index

For full-text search across title, URL, description:

```typescript
interface SearchableLink extends Link {
  searchText: string; // Concatenated title + url + description (lowercase)
}
```

**Implementation**: Create computed field on read or maintain separate index

---

## IndexedDB Schema Definition

### Object Stores

```typescript
// Database: "shelter-db", version: 1

const dbSchema = {
  folders: {
    keyPath: "id",
    indexes: [
      { name: "parentId", keyPath: "parentId", unique: false },
      { name: "createdAt", keyPath: "createdAt", unique: false },
      { name: "name", keyPath: "name", unique: false },
    ],
  },

  links: {
    keyPath: "id",
    indexes: [
      { name: "folderId", keyPath: "folderId", unique: false },
      { name: "tags", keyPath: "tags", unique: false, multiEntry: true },
      { name: "createdAt", keyPath: "createdAt", unique: false },
      { name: "lastAccessedAt", keyPath: "lastAccessedAt", unique: false },
      {
        name: "search",
        keyPath: ["title", "url", "description"],
        unique: false,
      },
    ],
  },

  tags: {
    keyPath: "name",
    indexes: [
      { name: "count", keyPath: "count", unique: false },
      { name: "lastUsedAt", keyPath: "lastUsedAt", unique: false },
    ],
  },

  settings: {
    keyPath: "id", // Single record with id = "app-settings"
    indexes: [],
  },
};
```

---

## Data Operations & Queries

### Common Queries

#### 1. Get Folder Contents

```typescript
// Query: Get all items in a folder (folders + links)
async function getFolderContents(folderId: string) {
  const folders = await db.folders.index("parentId").getAll(folderId);

  const links = await db.links.index("folderId").getAll(folderId);

  return { folders, links };
}
```

#### 2. Get Folder Path (Breadcrumb)

```typescript
// Query: Get path from root to folder
async function getFolderPath(folderId: string): Promise<Folder[]> {
  const path: Folder[] = [];
  let currentId: string | null = folderId;

  while (currentId !== null) {
    const folder = await db.folders.get(currentId);
    if (!folder) break;
    path.unshift(folder);
    currentId = folder.parentId;
  }

  return path;
}
```

#### 3. Search Links

```typescript
// Query: Full-text search across title, URL, description
async function searchLinks(query: string): Promise<Link[]> {
  const allLinks = await db.links.getAll();
  const lowerQuery = query.toLowerCase();

  return allLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(lowerQuery) ||
      link.url.toLowerCase().includes(lowerQuery) ||
      link.description.toLowerCase().includes(lowerQuery)
  );
}

// Note: For better performance, consider maintaining a pre-computed searchText field
```

#### 4. Filter Links by Tag

```typescript
// Query: Get all links with a specific tag
async function getLinksByTag(tagName: string): Promise<Link[]> {
  return await db.links.index("tags").getAll(tagName.toLowerCase());
}
```

#### 5. Cascade Delete Folder

```typescript
// Query: Delete folder and all descendants (recursive)
async function deleteFolderCascade(folderId: string) {
  // Get all child folders
  const childFolders = await db.folders.index("parentId").getAll(folderId);

  // Recursively delete children
  for (const child of childFolders) {
    await deleteFolderCascade(child.id);
  }

  // Delete all links in this folder
  const links = await db.links.index("folderId").getAll(folderId);

  for (const link of links) {
    await db.links.delete(link.id);
    // Update tag counts
    await updateTagCounts(link.tags, -1);
  }

  // Finally, delete the folder itself
  await db.folders.delete(folderId);
}
```

#### 6. Update Tag Counts

```typescript
// Helper: Update tag counts when link tags change
async function updateTagCounts(tagNames: string[], delta: number) {
  for (const name of tagNames) {
    const tag = await db.tags.get(name.toLowerCase());

    if (tag) {
      tag.count += delta;
      tag.lastUsedAt = Date.now();

      if (tag.count <= 0) {
        await db.tags.delete(tag.name); // Remove unused tag
      } else {
        await db.tags.put(tag);
      }
    } else if (delta > 0) {
      // Create new tag
      await db.tags.add({
        name: name.toLowerCase(),
        displayName: name,
        color: null, // Auto-assigned later
        count: 1,
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
      });
    }
  }
}
```

---

## Data Validation

### Validation Functions

```typescript
// Validation utilities
const Validators = {
  folder: {
    name: (name: string) => name.length >= 1 && name.length <= 100,
    depth: async (parentId: string | null): Promise<boolean> => {
      if (!parentId) return true;
      const path = await getFolderPath(parentId);
      return path.length < 10; // Max depth
    },
  },

  link: {
    title: (title: string) => title.length >= 1 && title.length <= 200,
    url: (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    description: (desc: string) => desc.length <= 1000,
    tags: (tags: string[]) =>
      tags.length <= 20 && tags.every((t) => t.length >= 1 && t.length <= 50),
  },

  tag: {
    name: (name: string) =>
      /^[a-zA-Z0-9_-]+$/.test(name) && name.length >= 1 && name.length <= 50,
  },
};
```

---

## Migration Strategy

### Schema Versioning

```typescript
interface Migration {
  fromVersion: number;
  toVersion: number;
  migrate: (db: IDBDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate: async (db) => {
      // Example: Add new field to links
      const tx = db.transaction(["links"], "readwrite");
      const store = tx.objectStore("links");
      const allLinks = await store.getAll();

      for (const link of allLinks) {
        link.lastAccessedAt = link.lastAccessedAt || null;
        await store.put(link);
      }
    },
  },
  // Add more migrations as schema evolves
];
```

---

## Performance Considerations

### 1. Indexing Strategy

- **Index frequently queried fields**: `folderId`, `tags`, `createdAt`
- **Avoid over-indexing**: Don't index rarely queried fields (increases write cost)
- **Use compound indexes** for complex queries (e.g., sort + filter)

### 2. Denormalization

- **Tag counts**: Stored in Tag entity (avoids expensive COUNT queries)
- **Folder metadata**: Computed on-demand, cached in Zustand store

### 3. Batch Operations

- Use transactions for multiple writes (atomic + faster)
- Batch read operations when loading folder contents

### 4. Caching

- Cache frequently accessed data in Zustand store (folders, settings)
- Invalidate cache on mutations
- Use React Query for automatic cache management (optional)

---

## Next Steps

1. ✅ Complete data-model.md
2. → Create TypeScript interfaces in contracts/
3. → Define Zustand store schemas
4. → Implement IndexedDB wrapper with typed API
5. → Write unit tests for data operations
