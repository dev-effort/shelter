# Shelter App - TypeScript Contracts

**Purpose**: Define type-safe interfaces for all data entities, stores, and services

**Last Updated**: 2025-10-13

## Overview

This directory contains TypeScript interface definitions that serve as contracts for the Shelter app's data layer and business logic. These contracts ensure type safety and provide clear API boundaries.

## Files

### 1. `entities.ts`

**Purpose**: Core data entities stored in IndexedDB

**Contents**:

- `Folder` - Hierarchical folder structure
- `FolderWithMetadata` - Folder with computed fields
- `Link` - Bookmarked URL with metadata
- `Tag` - Categorization label with statistics
- `Settings` - User preferences and app configuration
- Constants: `DEFAULT_SETTINGS`, `TAG_COLORS`, `VALIDATION`

**Usage**:

```typescript
import type { Folder, Link, Tag, Settings } from "@/shared/types/entities";
```

### 2. `stores.ts`

**Purpose**: Zustand store interfaces for state management

**Contents**:

- `FolderStore` - Folder state and operations
- `LinkStore` - Link state and operations
- `TagStore` - Tag state and operations
- `SettingsStore` - Settings state and operations
- `NavigationStore` - Navigation state (Stackflow)
- `UIStore` - Transient UI state
- `RootStore` - Combined store type

**Usage**:

```typescript
import { create } from "zustand";
import type { FolderStore } from "@/shared/types/stores";

export const useFolderStore = create<FolderStore>((set, get) => ({
  // implementation
}));
```

### 3. `services.ts`

**Purpose**: Service layer interfaces for data access and external APIs

**Contents**:

- `StorageService` - IndexedDB abstraction
- `FolderService` - Folder CRUD operations
- `LinkService` - Link CRUD operations
- `TagService` - Tag management
- `SettingsService` - Settings persistence
- `URLService` - URL opening and deep linking
- `ShareService` - Handle incoming shares
- `ExportService` - Data backup/restore
- `ValidationService` - Data validation
- `MigrationService` - Schema migrations
- `AdService` - Google AdMob integration

**Usage**:

```typescript
import type { FolderService } from "@/shared/api/services";

export class FolderServiceImpl implements FolderService {
  // implementation
}
```

## Implementation Guidelines

### 1. Type Safety

All implementations **MUST** strictly adhere to these contracts:

```typescript
// ✅ GOOD: Implements contract
class FolderServiceImpl implements FolderService {
  async getById(id: string): Promise<Folder | undefined> {
    // implementation
  }
}

// ❌ BAD: Doesn't implement contract
class FolderServiceImpl {
  getById(id: string) {
    // implementation
  }
}
```

### 2. Immutability

Entity objects should be treated as immutable:

```typescript
// ✅ GOOD: Create new object
const updatedFolder = { ...folder, name: "New Name" };

// ❌ BAD: Mutate existing object
folder.name = "New Name";
```

### 3. Null Safety

Use strict null checks and handle undefined cases:

```typescript
// ✅ GOOD: Check for undefined
const folder = await folderService.getById(id);
if (!folder) {
  throw new Error("Folder not found");
}

// ❌ BAD: Assume defined
const folder = await folderService.getById(id);
console.log(folder.name); // Possible runtime error
```

### 4. Async/Await

All database operations are asynchronous:

```typescript
// ✅ GOOD: Await async operations
const folder = await folderService.create({ name: "Test" });

// ❌ BAD: Forget await
const folder = folderService.create({ name: "Test" }); // Returns Promise!
```

## Architecture Layers

### Layer 1: Entities (`entities.ts`)

- Pure data structures
- No business logic
- Stored in IndexedDB
- Used across all layers

### Layer 2: Stores (`stores.ts`)

- Global state management (Zustand)
- Reactive state updates
- Cached data from services
- UI state coordination

### Layer 3: Services (`services.ts`)

- Business logic layer
- Data persistence (IndexedDB)
- External API integration (Capacitor)
- Validation and transformation

### Data Flow

```
User Action (UI)
    ↓
Feature Component
    ↓
Store (Zustand) ←→ Service Layer
    ↓                   ↓
UI Update          IndexedDB / Capacitor
```

## FSD Integration

These contracts map to Feature-Sliced Design layers:

### `entities/` layer

- Uses `entities.ts` types
- Implements data models and business logic
- Example: `entities/folder/model/store.ts`

### `shared/` layer

- Exports contracts for use by upper layers
- Implements services
- Example: `shared/api/services/folder.ts`

### `features/` layer

- Consumes stores and services
- Implements user interactions
- Example: `features/folder-create/model/use-create-folder.ts`

## Validation Rules

All validation constraints are defined in `entities.ts`:

```typescript
import { VALIDATION } from "@/shared/types/entities";

// Check folder name length
if (name.length > VALIDATION.FOLDER.NAME_MAX_LENGTH) {
  throw new Error("Folder name too long");
}

// Check folder depth
if (depth >= VALIDATION.FOLDER.MAX_DEPTH) {
  throw new Error("Maximum folder depth exceeded");
}
```

## Testing

Contracts should be used in tests to ensure type safety:

```typescript
import type { Folder } from "@/shared/types/entities";
import type { FolderService } from "@/shared/types/services";

describe("FolderService", () => {
  let service: FolderService;

  it("should create a folder", async () => {
    const folder: Folder = await service.create({
      name: "Test",
      parentId: null,
    });

    expect(folder.id).toBeDefined();
    expect(folder.name).toBe("Test");
  });
});
```

## Migration Strategy

When schema changes are needed:

1. **Add new field** (backward compatible):

   ```typescript
   interface Link {
     // ... existing fields
     newField?: string; // Optional initially
   }
   ```

2. **Update migration service**:

   ```typescript
   const migration = {
     fromVersion: 1,
     toVersion: 2,
     migrate: async (db) => {
       // Add newField to existing links
     },
   };
   ```

3. **Update schema version**:
   ```typescript
   const DEFAULT_SETTINGS = {
     // ...
     schemaVersion: 2, // Increment
   };
   ```

## Best Practices

### 1. Use Discriminated Unions

```typescript
type Item = { type: "folder"; data: Folder } | { type: "link"; data: Link };
```

### 2. Use Branded Types for IDs

```typescript
type FolderId = string & { readonly __brand: "FolderId" };
type LinkId = string & { readonly __brand: "LinkId" };
```

### 3. Use Readonly for Immutability

```typescript
interface Folder {
  readonly id: string;
  // ...
}
```

### 4. Use Zod for Runtime Validation

```typescript
import { z } from "zod";

const FolderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  // ...
});
```

## References

- [data-model.md](../data-model.md) - Detailed data model specification
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Feature-Sliced Design](https://feature-sliced.design/)
