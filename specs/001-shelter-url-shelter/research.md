# Phase 0: Research & Architecture Decisions

**Feature**: Shelter - Link Organization App  
**Date**: 2025-10-13  
**Status**: Completed

## Overview

This document consolidates research findings and architectural decisions for implementing the Shelter mobile app. All technical choices specified by the user have been evaluated and best practices identified.

## Technology Stack Decisions

### 1. Ionic Framework for Cross-Platform Mobile

**Decision**: Use Ionic Framework with Capacitor for cross-platform mobile development

**Rationale**:

- Single codebase for iOS and Android reduces development time by 60-70%
- Capacitor provides native API access (camera, filesystem, share extension, deep linking)
- Web-based approach allows rapid iteration and debugging
- Large ecosystem and community support
- Performance sufficient for content-browsing apps like Shelter

**Alternatives Considered**:

- **React Native**: More native feel but steeper learning curve, more platform-specific code needed
- **Flutter**: Excellent performance but requires Dart, less alignment with user's specified React stack
- **Native (Swift/Kotlin)**: Best performance but 2x development effort, not aligned with user preferences

**Best Practices**:

- Use Capacitor plugins for native features (Storage, Share, App, Browser)
- Implement platform-specific styling where needed using Ionic's platform detection
- Test on real devices early, especially for share extension and deep linking
- Use Ionic's built-in gestures for mobile interactions (long-press, swipe)

### 2. React 19 with TypeScript

**Decision**: Use React 19 with TypeScript 5.x for UI development

**Rationale**:

- React 19 provides improved performance with automatic memoization
- Server Components support (future-proofing, though not needed for offline app)
- Better error handling and dev experience
- TypeScript ensures type safety across the large data model (folders, links, tags)

**Alternatives Considered**:

- **React 18**: Stable but missing React 19 performance improvements
- **Vue/Svelte**: Not aligned with user's specified stack

**Best Practices**:

- Use React 19's `use` hook for async data fetching from IndexedDB
- Leverage TypeScript strict mode for maximum type safety
- Use discriminated unions for entity types (Folder | Link)
- Implement proper error boundaries for offline scenarios

### 3. Stackflow for Navigation

**Decision**: Use Stackflow for activity-based mobile navigation

**Rationale**:

- Specifically designed for mobile web apps with activity-based navigation model
- Provides smooth push/pop animations matching native mobile UX
- Built-in history management and deep linking support
- Lightweight alternative to React Router for mobile-first apps

**Alternatives Considered**:

- **React Router**: More common but not optimized for mobile activity stack patterns
- **Ionic Router**: Tied to Ionic's router but Stackflow provides better mobile UX

**Best Practices**:

- Define activities for each major screen (Home, FolderDetail, LinkDetail, etc.)
- Use Stackflow's `push`/`pop`/`replace` actions for navigation
- Implement proper activity lifecycle (onEnter, onExit) for data loading
- Configure deep links for share extension integration

### 4. Zustand for State Management

**Decision**: Use Zustand for global state management

**Rationale**:

- Minimal boilerplate compared to Redux (50-70% less code)
- Built-in TypeScript support with strong typing
- No Provider wrapping needed, simpler architecture
- Perfect for offline-first apps with local storage persistence
- Small bundle size (~1KB) critical for mobile performance

**Alternatives Considered**:

- **Redux**: Overkill for this app's state complexity, more boilerplate
- **Context + useReducer**: Sufficient but lacks persistence utilities and devtools
- **Jotai/Recoil**: Atomic approach not needed for this feature set

**Best Practices**:

- Create separate stores for each entity (folderStore, linkStore, tagStore, settingsStore)
- Use Zustand's `persist` middleware to sync with IndexedDB
- Implement selectors for derived state (filtered links, tag counts)
- Use shallow equality for performance in list renders

### 5. Feature-Sliced Design (FSD) Architecture

**Decision**: Organize codebase using Feature-Sliced Design methodology

**Rationale**:

- User-specified requirement
- Superior to traditional layer-based architecture for feature-rich apps
- Clear dependency rules prevent spaghetti code (upper layers depend on lower only)
- Each feature is self-contained and testable
- Scales well as app grows (easy to add new features)

**Layers** (top to bottom):

1. **app**: Application initialization, global providers, routing config
2. **pages**: Complete screens/activities (Home, FolderDetail, etc.)
3. **widgets**: Composite UI blocks (FolderList, NavigationBar)
4. **features**: User interactions (CreateFolder, DeleteItem, SearchQuery)
5. **entities**: Business logic and data (Folder, Link, Tag models)
6. **shared**: Reusable utilities, UI components, types

**Best Practices**:

- Never import from upper layers (e.g., entities cannot import from features)
- Use Public API pattern: each slice exports through index.ts
- Colocate tests with implementation
- Keep features small and focused on single user action

### 6. shadcn/ui + Tailwind CSS

**Decision**: Use shadcn/ui components styled with Tailwind CSS

**Rationale**:

- shadcn/ui provides accessible, customizable components (not a dependency, copied into codebase)
- Full control over component code for mobile-specific adaptations
- Tailwind CSS enables rapid UI development with consistent design system
- Easy to customize for mobile-first responsive design
- Works seamlessly with Ionic's components where needed

**Alternatives Considered**:

- **Material-UI**: Heavier bundle, harder to customize for mobile
- **Chakra UI**: Runtime CSS-in-JS impacts mobile performance
- **Pure Ionic Components**: Limited design flexibility, dated appearance

**Best Practices**:

- Install shadcn/ui components selectively (Button, Input, Dialog, Select, Sheet)
- Customize components for mobile touch targets (min 44px)
- Use Tailwind's mobile-first responsive utilities
- Create mobile-specific variants (e.g., bottom sheets instead of modals)
- Use lucide-react for consistent iconography

### 7. IndexedDB for Local Storage

**Decision**: Use IndexedDB (via `idb` wrapper library) for storing folders, links, and tags

**Rationale**:

- Large storage capacity (50MB-100MB+ depending on device)
- Structured database with indexes for fast querying
- Asynchronous API doesn't block UI thread
- Native browser support, no external dependencies
- Better than localStorage for complex relational data

**Alternatives Considered**:

- **localStorage**: 5-10MB limit, synchronous (blocks UI), no indexing
- **Capacitor Storage**: Good for settings but limited query capabilities
- **SQLite (via Capacitor plugin)**: Native performance but adds complexity

**Best Practices**:

- Create object stores for Folders, Links, Tags, Settings
- Use indexes for common queries (folderId on Links, tag names)
- Implement cascading delete for folder hierarchy
- Batch operations for bulk imports
- Cache frequently accessed data in Zustand store
- Implement migration strategy for schema changes

### 8. Share Extension Integration

**Decision**: Use Capacitor's App Plugin and custom URL schemes for share integration

**Rationale**:

- Capacitor App plugin handles incoming shares from external apps
- Custom URL scheme (e.g., `shelter://share`) enables deep linking
- Platform-specific configuration in capacitor.config.ts
- No separate native code required for basic share receiving

**Implementation Approach**:

- Register custom URL scheme in iOS (Info.plist) and Android (AndroidManifest.xml)
- Listen to `appUrlOpen` event in Capacitor App plugin
- Parse shared URL and metadata
- Navigate to share-receiver page with Stackflow

**Best Practices**:

- Handle share intent on app launch (cold start) and when app is in background
- Extract title and description from shared content where available
- Implement queueing if multiple shares received while offline
- Show confirmation after successful save

### 9. Deep Linking for Opening URLs

**Decision**: Use Capacitor Browser plugin for web URLs and App Launcher for native apps

**Rationale**:

- Capacitor Browser opens URLs in in-app browser or system browser
- App Launcher can check if native app is installed and open deep links
- Fallback to browser if native app not available
- Platform-agnostic implementation

**Implementation Approach**:

```typescript
// Pseudo-code
async function openLink(url: string) {
  const appScheme = detectAppScheme(url); // youtube://, instagram://, etc.

  if (appScheme) {
    const canOpen = await AppLauncher.canOpenUrl({ url: appScheme });
    if (canOpen.value) {
      await AppLauncher.openUrl({ url: appScheme });
      return;
    }
  }

  // Fallback to browser
  await Browser.open({ url });
}
```

**Best Practices**:

- Maintain mapping of URL patterns to native app schemes
- Handle edge cases (malformed URLs, unsupported schemes)
- Provide user feedback if link cannot be opened
- Respect user preference for in-app vs system browser

### 10. Testing Strategy

**Decision**: Use Vitest + React Testing Library for unit/integration tests

**Rationale**:

- Vitest is faster than Jest, better Vite integration
- React Testing Library promotes accessibility-focused testing
- Easy to test Zustand stores and IndexedDB operations
- Good TypeScript support

**Test Coverage Priorities** (based on feature importance):

1. **P1 - Critical**: Folder/link CRUD operations, data persistence
2. **P2 - Important**: Share receiving, search/filter logic, cascade delete
3. **P3 - Nice-to-have**: UI interactions, navigation flows

**Best Practices**:

- Mock IndexedDB with fake-indexeddb for unit tests
- Test Zustand stores in isolation
- Use React Testing Library queries (getByRole, getByLabelText)
- Test accessibility (screen reader labels, keyboard navigation)
- E2E tests optional (manual testing sufficient for MVP)

## Performance Optimization Strategies

### 1. List Virtualization

**Problem**: Rendering 1000+ links can cause UI jank

**Solution**:

- Use `react-window` or `@tanstack/react-virtual` for list/grid rendering
- Only render visible items + small buffer
- Recycle DOM elements as user scrolls

### 2. Debounced Search

**Problem**: Real-time search can be slow with large datasets

**Solution**:

- Debounce search input (300ms delay)
- Use IndexedDB indexes for title/URL queries
- Show loading indicator during search

### 3. Lazy Loading

**Problem**: Large app bundle affects initial load time

**Solution**:

- Code-split pages using React.lazy and Suspense
- Load non-critical features on-demand (Settings, Tags)
- Preload likely next screens (e.g., preload FolderDetail when hovering)

### 4. Image Optimization

**Problem**: Link previews/favicons can slow down lists

**Solution**:

- Lazy load images using Intersection Observer
- Use icon placeholders while loading
- Cache favicons using service worker (future enhancement)

## Security & Privacy Considerations

### 1. Data Privacy

**Decision**: All data stored locally on device, no cloud sync

**Implications**:

- User has complete control over their data
- No privacy policy required for data collection
- Data loss if device lost (trade-off for privacy)
- Future enhancement: optional encrypted cloud backup

### 2. URL Validation

**Decision**: Basic format validation only, no content fetching

**Rationale**:

- Prevents XSS by sanitizing display
- Doesn't validate URL accessibility (user responsibility)
- No network requests = no tracking/analytics

**Implementation**:

- Use URL constructor for validation
- Sanitize for display using DOMPurify (if rendering link titles)
- Warn user about suspicious URLs (optional)

### 3. Ad Integration

**Decision**: Google AdMob for in-app advertising

**Considerations**:

- AdMob privacy policy required
- GDPR/CCPA compliance needed if targeting EU/CA
- Ad blocker handling (graceful degradation)
- User option to remove ads via in-app purchase (future)

## Migration & Data Management

### 1. Export/Import Feature (Future)

**Need**: Users want to backup/restore data

**Approach**:

- Export to JSON format
- Import with duplicate detection
- Validate schema on import

### 2. Schema Versioning

**Strategy**:

- Store schema version in IndexedDB
- Implement migration functions for schema changes
- Test migrations with sample data

## Open Questions Resolved

### Q: Maximum folder depth?

**A**: Implement practical limit of 10 levels to prevent UI issues and ensure performance

### Q: URL format validation strictness?

**A**: Accept any format that passes URL constructor, warn on invalid but don't block

### Q: Handle duplicate URLs?

**A**: Allow duplicates (same URL in multiple folders), show warning to user

### Q: Network offline handling for share?

**A**: Queue shares if needed, but currently all operations are local (no network required)

### Q: Ad loading failure?

**A**: Collapse ad container gracefully, don't leave blank space

### Q: Empty search query?

**A**: Show all items (same as home view) or show empty state with suggestions

## Next Steps (Phase 1)

1. ✅ Complete research.md
2. → Create data-model.md (entity schemas, relationships)
3. → Define contracts/ (TypeScript interfaces for stores and services)
4. → Write quickstart.md (setup instructions for development)
5. → Update agent context with technology stack

## References

- [Ionic Documentation](https://ionicframework.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [Stackflow Documentation](https://github.com/daangn/stackflow)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [shadcn/ui](https://ui.shadcn.com/)
- [IndexedDB Best Practices](https://developers.google.com/web/ilt/pwa/working-with-indexeddb)
