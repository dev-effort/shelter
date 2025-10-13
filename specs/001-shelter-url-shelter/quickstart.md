# Shelter App - Development Quickstart Guide

**Last Updated**: 2025-10-13  
**For**: Shelter Link Organization App  
**Tech Stack**: Ionic + React 19 + TypeScript + Capacitor

## Prerequisites

### Required Software

- **Node.js**: v20.x or later (LTS recommended)
- **pnpm**: v8.x or later (package manager)
- **Git**: Latest stable version

### Platform-Specific Requirements

#### iOS Development (macOS only)

- **Xcode**: 15.x or later
- **CocoaPods**: Latest version (`sudo gem install cocoapods`)
- iOS Simulator or physical device with iOS 14+

#### Android Development

- **Android Studio**: Latest stable version
- **Java JDK**: 17 or later
- **Android SDK**: API Level 26+ (Android 8.0+)
- Android Emulator or physical device

### Optional Tools

- **VS Code**: Recommended IDE with extensions:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin (Volar)
  - Tailwind CSS IntelliSense
  - Ionic snippets

## Quick Setup

### 1. Initialize Project

```bash
# Navigate to project root
cd /Users/mz01-seungjunkim/Documents/personal/private/shelter

# Create Ionic project with React
cd shelter
pnpm create @ionic/react shelter --type=blank --capacitor

# Or if starting from scratch:
ionic start shelter blank --type=react --capacitor --package-id=com.shelter.app
cd shelter
```

### 2. Install Dependencies

```bash
# Install core dependencies
pnpm add zustand stackflow @stackflow/plugin-basic-ui @stackflow/plugin-history-sync
pnpm add idb
pnpm add lucide-react

# Install Capacitor plugins
pnpm add @capacitor/app @capacitor/browser @capacitor/storage @capacitor/share

# Install Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p

# Install shadcn/ui CLI
pnpm add -D @shadcn/ui
pnpx shadcn-ui@latest init

# Install development dependencies
pnpm add -D vitest @testing-library/react @testing-library/user-event
pnpm add -D @vitest/ui jsdom fake-indexeddb
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D prettier prettier-plugin-tailwindcss
```

### 3. Configure Tailwind CSS

**tailwind.config.js**:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
        },
        // ... shadcn/ui color tokens
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 4. Configure TypeScript

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5. Setup FSD Architecture

```bash
# Create FSD directory structure
mkdir -p src/{app,pages,widgets,features,entities,shared}
mkdir -p src/app/{providers,routes}
mkdir -p src/pages/{home,folder-detail,link-detail,tags,search,settings,share-receiver}
mkdir -p src/widgets/{folder-list,link-list,navigation-bar,ad-banner}
mkdir -p src/features/{folder-create,link-create,link-open,item-delete,tag-filter,search-query}
mkdir -p src/entities/{folder,link,tag}
mkdir -p src/shared/{ui,lib,api,hooks,types}
```

### 6. Configure Capacitor

**capacitor.config.ts**:

```typescript
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shelter.app",
  appName: "Shelter",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    App: {
      urlScheme: "shelter",
    },
    Share: {
      // Share extension configuration
    },
  },
};

export default config;
```

### 7. Add Platforms

```bash
# Add iOS platform (macOS only)
pnpm exec cap add ios

# Add Android platform
pnpm exec cap add android

# Sync web assets to native projects
pnpm exec cap sync
```

### 8. Configure Share Extension (iOS)

**ios/App/App/Info.plist**:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>shelter</string>
    </array>
  </dict>
</array>
```

### 9. Configure Share Intent (Android)

**android/app/src/main/AndroidManifest.xml**:

```xml
<activity>
  <!-- Existing activity config -->
  <intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
  </intent-filter>
</activity>
```

## Development Workflow

### Running Development Server

```bash
# Start dev server (web preview)
pnpm dev

# Open in browser
open http://localhost:5173
```

### Building for Production

```bash
# Build web assets
pnpm build

# Sync to native projects
pnpm exec cap sync
```

### Running on iOS

```bash
# Open in Xcode
pnpm exec cap open ios

# Then run from Xcode (Cmd+R)
# Or use CLI:
pnpm exec cap run ios
```

### Running on Android

```bash
# Open in Android Studio
pnpm exec cap open android

# Then run from Android Studio
# Or use CLI:
pnpm exec cap run android
```

### Live Reload (Development)

```bash
# Start dev server
pnpm dev

# In another terminal, run on device with live reload
pnpm exec cap run ios --livereload --external
pnpm exec cap run android --livereload --external
```

## Testing

### Unit Tests

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Open UI
pnpm test:ui
```

**vitest.config.ts**:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**src/test/setup.ts**:

```typescript
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "fake-indexeddb/auto";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock Capacitor plugins
vi.mock("@capacitor/app", () => ({
  App: {
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}));

vi.mock("@capacitor/browser", () => ({
  Browser: {
    open: vi.fn(),
  },
}));

vi.mock("@capacitor/share", () => ({
  Share: {
    share: vi.fn(),
  },
}));
```

## Linting and Formatting

### ESLint

```bash
# Run linter
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix
```

**.eslintrc.cjs**:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
```

### Prettier

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check
```

**.prettierrc.json**:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## Project Scripts

**package.json**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit",
    "cap:sync": "cap sync",
    "cap:ios": "cap open ios",
    "cap:android": "cap open android"
  }
}
```

## Common Tasks

### Installing shadcn/ui Components

```bash
# Install specific components
pnpx shadcn-ui@latest add button
pnpx shadcn-ui@latest add input
pnpx shadcn-ui@latest add dialog
pnpx shadcn-ui@latest add select
pnpx shadcn-ui@latest add sheet
pnpx shadcn-ui@latest add toast
```

### Creating New Feature Slice

```bash
# Example: Create "bookmark-link" feature
mkdir -p src/features/bookmark-link/{ui,model,lib}
touch src/features/bookmark-link/index.ts
touch src/features/bookmark-link/ui/BookmarkButton.tsx
touch src/features/bookmark-link/model/use-bookmark.ts
```

### Database Inspection (Development)

Use browser DevTools:

1. Open DevTools (F12)
2. Go to Application tab
3. Expand IndexedDB → shelter-db
4. View object stores (folders, links, tags)

## Troubleshooting

### Issue: `Module not found: Can't resolve '@/...'`

**Solution**: Ensure `tsconfig.json` has correct path aliases and restart dev server

### Issue: iOS build fails with CocoaPods error

**Solution**:

```bash
cd ios/App
pod deintegrate
pod install
```

### Issue: Android build fails with Gradle error

**Solution**:

```bash
cd android
./gradlew clean
./gradlew build
```

### Issue: Capacitor plugins not working

**Solution**:

```bash
pnpm exec cap sync
# Rebuild native projects
```

### Issue: IndexedDB not persisting in tests

**Solution**: Ensure `fake-indexeddb` is imported in test setup

### Issue: TypeScript errors with Capacitor plugins

**Solution**: Install type definitions:

```bash
pnpm add -D @capacitor/core@latest
```

## Next Steps

1. ✅ Complete environment setup
2. → Implement core entities (Folder, Link, Tag)
3. → Create IndexedDB service layer
4. → Build Zustand stores
5. → Implement UI components
6. → Add Stackflow navigation
7. → Integrate Capacitor plugins
8. → Test on physical devices
9. → Add Google AdMob
10. → Prepare for deployment

## Resources

- [Ionic Documentation](https://ionicframework.com/docs)
- [React 19 Documentation](https://react.dev/blog/2024/04/25/react-19)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Stackflow Documentation](https://github.com/daangn/stackflow)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues related to:

- **Ionic**: [Ionic Forum](https://forum.ionicframework.com/)
- **Capacitor**: [Capacitor Discussions](https://github.com/ionic-team/capacitor/discussions)
- **React**: [React Community](https://react.dev/community)
- **Project-specific**: [Open GitHub Issue](https://github.com/your-repo/issues)
