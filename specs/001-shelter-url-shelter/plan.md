# Implementation Plan: Shelter - Link Organization App

**Branch**: `001-shelter-url-shelter` | **Date**: 2025-10-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-shelter-url-shelter/spec.md`
**Design Requirement**: 모던하고 심플한 디자인 (shadcn/ui 기반)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Shelter is a mobile link organization app that allows users to save and categorize URLs in a hierarchical folder structure. Each link contains metadata (title, URL, description, tags) and can be shared from external apps. The app provides tag filtering, search functionality, and smart link opening (native app vs browser). Implementation uses Ionic + React 19 for cross-platform mobile development with TypeScript, following Feature-Sliced Design architecture. **Design philosophy: Modern minimalism using shadcn/ui components with clean, uncluttered interfaces.**

## Technical Context

**Language/Version**: TypeScript 5.x (latest stable with React 19 compatibility)
**Primary Framework**: Ionic Framework (latest) with React 19, Capacitor for native capabilities
**UI Components**: shadcn/ui (customized for mobile), Tailwind CSS for styling, lucide-react for icons
**Routing**: Stackflow (activity-based navigation for mobile)
**State Management**: Zustand (lightweight state management)
**Storage**: IndexedDB (via idb or similar) for local data persistence, Capacitor Storage for settings
**Testing**: Vitest for unit tests, React Testing Library for component tests, Capacitor test utilities
**Target Platform**: iOS and Android mobile devices (cross-platform via Ionic/Capacitor)
**Project Type**: Mobile application (hybrid)
**Architecture**: Feature-Sliced Design (FSD) - organized by features, not technical layers
**Performance Goals**:

- App launch: < 2 seconds on mid-range devices
- Search/filter: < 500ms response time for 1000+ links
- Smooth 60fps scrolling for lists/grids
  **Constraints**:
- Offline-first architecture (no cloud dependency)
- Support for 100+ folders and 1,000+ links
- Share extension integration with external apps
- Deep linking support for opening native apps
  **Scale/Scope**:
- Single-user mobile app
- ~10-15 screens/activities
- Local-only data (no backend)
- Support for iOS 14+ and Android 8+

## Design System & UI Guidelines

### Design Philosophy

**Modern Minimalism**: 최대한 심플하고 깔끔한 디자인을 추구합니다.
- 불필요한 장식 요소 제거
- 콘텐츠 중심의 레이아웃
- 명확한 시각적 계층 구조
- 충분한 여백(white space) 활용

### Core Design Principles

1. **Simplicity First (심플함 우선)**
   - 한 화면에 하나의 주요 작업에 집중
   - 복잡한 기능은 단계적으로 표시
   - 불필요한 버튼이나 옵션 숨기기

2. **Content-Focused (콘텐츠 중심)**
   - 링크와 폴더가 주인공
   - UI 요소는 최소화하고 콘텐츠 강조
   - 광고 영역도 자연스럽게 통합

3. **Touch-Friendly (터치 친화적)**
   - 최소 터치 영역 44x44px
   - 제스처 기반 인터랙션 (스와이프, 롱프레스)
   - 손가락으로 쉽게 닿는 위치에 주요 액션 배치

4. **Consistent & Predictable (일관성과 예측 가능성)**
   - 동일한 액션은 항상 같은 방식으로 작동
   - 표준 모바일 패턴 사용
   - 명확한 피드백 제공

### shadcn/ui Components Usage

**Primary Components**:
- **Button**: 주요 액션 (폴더/문서 생성, 저장, 삭제)
  - Variant: `default`, `ghost`, `outline`
  - Size: `lg` (모바일 터치 최적화)
  
- **Sheet**: 모바일에 최적화된 바텀 시트
  - 폴더/링크 생성 양식
  - 상세 정보 표시
  - 필터/정렬 옵션

- **Dialog**: 중요한 확인 (삭제 등)
  - 간결한 메시지
  - 명확한 액션 버튼

- **Input**: 텍스트 입력
  - 제목, URL, 설명 입력
  - 검색 바
  - 큰 터치 영역 확보

- **Card**: 폴더/링크 표시
  - List 모드: 전체 너비 카드
  - Grid 모드: 2열 그리드
  - 깔끔한 그림자 효과

- **Badge**: 태그 표시
  - 둥근 모서리
  - 부드러운 색상
  - 터치 가능한 크기

- **Select**: 드롭다운 선택
  - 폴더 선택
  - 정렬 옵션
  - 네이티브 느낌 유지

- **Toast**: 알림
  - 성공/오류 피드백
  - 자동 사라짐
  - 하단 중앙 배치

### Color Palette

**Light Mode** (기본):
```css
--background: 0 0% 100%;          /* 순백색 배경 */
--foreground: 0 0% 3.9%;          /* 거의 검정색 텍스트 */
--primary: 221.2 83.2% 53.3%;     /* 생동감 있는 파란색 */
--primary-foreground: 0 0% 100%;  /* 흰색 */
--muted: 210 40% 96.1%;           /* 연한 회색 */
--muted-foreground: 215.4 16.3% 46.9%; /* 중간 회색 */
--border: 214.3 31.8% 91.4%;      /* 연한 테두리 */
```

**Dark Mode**:
```css
--background: 0 0% 3.9%;          /* 진한 배경 */
--foreground: 0 0% 98%;           /* 거의 흰색 텍스트 */
--primary: 217.2 91.2% 59.8%;     /* 밝은 파란색 */
--muted: 217.2 32.6% 17.5%;       /* 어두운 회색 */
--border: 217.2 32.6% 17.5%;      /* 어두운 테두리 */
```

**Tag Colors** (from entities.ts):
- 사전 정의된 8가지 색상 팔레트 사용
- 부드러운 파스텔 톤
- 접근성 고려 (충분한 대비)

### Typography

**Font Stack**:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

**Font Sizes** (mobile-optimized):
- **Heading 1**: 28px (폰트 크기 큼, 페이지 타이틀)
- **Heading 2**: 24px (섹션 헤더)
- **Heading 3**: 20px (서브 헤더)
- **Body**: 16px (기본 텍스트, 가독성 우선)
- **Small**: 14px (메타 정보, 설명)
- **Tiny**: 12px (타임스탬프 등)

**Line Heights**:
- Headings: 1.2
- Body: 1.6 (가독성 향상)

### Spacing System

Tailwind의 spacing scale 사용:
- **xs**: 4px (아주 작은 간격)
- **sm**: 8px (작은 간격)
- **md**: 16px (기본 간격)
- **lg**: 24px (큰 간격)
- **xl**: 32px (매우 큰 간격)

**Layout Padding**:
- Mobile: 16px 좌우 여백
- Content: 최대 너비 제한 없음 (전체 화면 활용)

### Component Patterns

#### 1. Folder/Link Card (List View)

```tsx
<Card className="mb-2 active:scale-[0.98] transition-transform">
  <CardContent className="p-4 flex items-center gap-3">
    <Icon className="w-5 h-5 text-muted-foreground" />
    <div className="flex-1 min-w-0">
      <h3 className="font-medium truncate">{title}</h3>
      <p className="text-sm text-muted-foreground truncate">{url}</p>
    </div>
    <Badge variant="secondary">{count}</Badge>
  </CardContent>
</Card>
```

**특징**:
- 깔끔한 1줄 레이아웃
- 터치 피드백 (scale 효과)
- 아이콘으로 타입 구분
- 메타정보는 오른쪽 배치

#### 2. Folder/Link Card (Grid View)

```tsx
<Card className="aspect-square active:scale-95 transition-transform">
  <CardContent className="p-4 flex flex-col h-full">
    <Icon className="w-8 h-8 mb-3 text-primary" />
    <h3 className="font-medium line-clamp-2 flex-1">{title}</h3>
    <div className="text-xs text-muted-foreground">{meta}</div>
  </CardContent>
</Card>
```

**특징**:
- 정사각형 비율
- 아이콘 강조
- 2줄 제목 표시
- 하단에 메타정보

#### 3. Bottom Sheet (Create/Edit Form)

```tsx
<Sheet>
  <SheetContent side="bottom" className="h-[90vh]">
    <SheetHeader>
      <SheetTitle>링크 추가</SheetTitle>
    </SheetHeader>
    <div className="space-y-4 py-4">
      <Input placeholder="제목" />
      <Input placeholder="URL" type="url" />
      <Textarea placeholder="설명 (선택사항)" />
      <TagInput />
    </div>
    <SheetFooter>
      <Button size="lg" className="w-full">저장</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**특징**:
- 하단에서 올라오는 시트 (모바일 표준)
- 큰 입력 필드
- 전체 너비 버튼
- 충분한 여백

#### 4. Navigation Bar

```tsx
<nav className="fixed bottom-0 w-full border-t bg-background">
  <div className="flex justify-around py-2">
    <Button variant="ghost" size="lg">
      <Icon className="w-6 h-6" />
      <span className="text-xs">홈</span>
    </Button>
    {/* ... 기타 네비게이션 */}
  </div>
</nav>
```

**특징**:
- 하단 고정
- 아이콘 + 레이블
- 동일한 간격
- 현재 페이지 강조

#### 5. Search Bar

```tsx
<div className="relative">
  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
  <Input 
    className="pl-10 h-12" 
    placeholder="검색..."
  />
</div>
```

**특징**:
- 왼쪽 검색 아이콘
- 큰 입력 높이 (12)
- 부드러운 플레이스홀더

### Animation & Transitions

**Micro-interactions**:
```css
/* 버튼 press 효과 */
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}

/* 부드러운 전환 */
.transition-all {
  transition: all 150ms ease-in-out;
}

/* 스켈레톤 로딩 */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

**Page Transitions** (Stackflow):
- Push: 오른쪽에서 슬라이드
- Pop: 왼쪽으로 슬라이드
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Accessibility

1. **Color Contrast**: WCAG AA 이상 준수
2. **Touch Targets**: 최소 44x44px
3. **Focus States**: 키보드 네비게이션 지원
4. **Screen Reader**: 적절한 ARIA 레이블
5. **Dark Mode**: 자동 시스템 감지

### Responsive Breakpoints

모바일 우선 디자인:
- **Mobile**: 320px - 767px (기본)
- **Tablet**: 768px - 1023px (넓은 레이아웃)
- **Desktop**: 1024px+ (웹 프리뷰, 중앙 정렬)

### Empty States

빈 상태도 아름답게:
```tsx
<div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
  <Icon className="w-16 h-16 text-muted-foreground mb-4" />
  <h3 className="text-lg font-medium mb-2">아직 링크가 없어요</h3>
  <p className="text-muted-foreground mb-6">
    첫 번째 링크를 추가해보세요
  </p>
  <Button size="lg">
    <Plus className="w-5 h-5 mr-2" />
    링크 추가
  </Button>
</div>
```

### Loading States

```tsx
<div className="space-y-2">
  <Skeleton className="h-20 w-full rounded-lg" />
  <Skeleton className="h-20 w-full rounded-lg" />
  <Skeleton className="h-20 w-full rounded-lg" />
</div>
```

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Note**: Constitution file is not configured for this project. Proceeding with standard mobile app best practices:

- ✅ Feature-based architecture (FSD) for maintainability
- ✅ Component testing for UI reliability
- ✅ Type safety with TypeScript
- ✅ Performance monitoring for 60fps target
- ✅ Offline-first data architecture
- ✅ Modern minimalist design system (shadcn/ui)
- ✅ Accessibility compliance (WCAG AA)

## Project Structure

### Documentation (this feature)

```
specs/001-shelter-url-shelter/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── design-system.md     # UI/UX design guidelines (this plan)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
shelter/                            # Ionic/Capacitor project root
├── src/
│   ├── app/                       # FSD Layer: App configuration
│   │   ├── providers/             # Global providers (Zustand, theme)
│   │   ├── routes/                # Stackflow configuration
│   │   └── App.tsx                # Root component
│   │
│   ├── pages/                     # FSD Layer: Full pages/activities
│   │   ├── home/                  # Home page with folder/link list
│   │   ├── folder-detail/         # Folder contents view
│   │   ├── link-detail/           # Link detail/edit view
│   │   ├── tags/                  # Tag list and filter
│   │   ├── search/                # Search interface
│   │   ├── settings/              # App settings
│   │   └── share-receiver/        # Share extension handler
│   │
│   ├── widgets/                   # FSD Layer: Complex UI blocks
│   │   ├── folder-list/           # List/grid folder display
│   │   ├── link-list/             # List/grid link display
│   │   ├── navigation-bar/        # Bottom navigation
│   │   └── ad-banner/             # Google AdMob integration
│   │
│   ├── features/                  # FSD Layer: User interactions
│   │   ├── folder-create/         # Create folder form
│   │   ├── link-create/           # Create link form
│   │   ├── link-open/             # Smart URL opener logic
│   │   ├── item-delete/           # Delete confirmation & cascade
│   │   ├── tag-filter/            # Tag filtering logic
│   │   └── search-query/          # Search implementation
│   │
│   ├── entities/                  # FSD Layer: Business entities
│   │   ├── folder/                # Folder model, store, queries
│   │   ├── link/                  # Link model, store, queries
│   │   └── tag/                   # Tag model, store, queries
│   │
│   ├── shared/                    # FSD Layer: Reusable utilities
│   │   ├── ui/                    # shadcn/ui components (Button, Input, etc.)
│   │   ├── lib/                   # Utilities (validation, formatting)
│   │   ├── api/                   # Storage abstraction layer
│   │   ├── hooks/                 # Common React hooks
│   │   └── types/                 # Shared TypeScript types
│   │
│   └── index.tsx                  # Entry point
│
├── public/                        # Static assets
├── capacitor.config.ts            # Capacitor configuration
├── ionic.config.json              # Ionic configuration
├── tailwind.config.js             # Tailwind CSS configuration (with design tokens)
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
└── package.json                   # Dependencies

tests/
├── unit/                          # Unit tests for utilities, models
├── integration/                   # Integration tests for features
└── e2e/                           # End-to-end tests (optional)
```

**Structure Decision**:
Selected Feature-Sliced Design (FSD) architecture as specified by user requirements. FSD organizes code by features and business domains rather than technical layers, improving:

- **Maintainability**: Each feature is self-contained
- **Scalability**: Easy to add new features without impacting existing code
- **Team collaboration**: Clear boundaries between features
- **Testing**: Features can be tested in isolation

The hierarchy (app → pages → widgets → features → entities → shared) ensures proper dependency flow and prevents circular dependencies.

## Complexity Tracking

_No constitution violations to track._

This is a standard mobile application following industry best practices for hybrid mobile development. The chosen stack (Ionic + React + Capacitor) is appropriate for the requirements:

- Cross-platform mobile support (iOS + Android)
- Offline-first architecture
- Native integration (share extension, deep linking)
- Modern minimalist UI with shadcn/ui + Tailwind
- Accessibility compliance
