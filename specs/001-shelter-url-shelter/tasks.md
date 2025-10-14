# Implementation Tasks: Shelter - Link Organization App

**Feature Branch**: `001-shelter-url-shelter`  
**Date**: 2025-10-13  
**Architecture**: Feature-Sliced Design (FSD)  
**Design System**: Modern Minimalism (shadcn/ui + Tailwind CSS)

## 목차

- [개요](#개요)
- [실행 전략](#실행-전략)
- [작업 목록](#작업-목록)
  - [Phase 1: 프로젝트 설정](#phase-1-프로젝트-설정)
  - [Phase 2: 기초 인프라](#phase-2-기초-인프라)
  - [Phase 3: US1 - 링크 저장 및 폴더 구성 (P1 - MVP)](#phase-3-us1---링크-저장-및-폴더-구성-p1---mvp)
  - [Phase 4: US2 - 외부 앱 공유 연동 (P2)](#phase-4-us2---외부-앱-공유-연동-p2)
  - [Phase 5: US3 - 링크 열기 및 실행 (P3)](#phase-5-us3---링크-열기-및-실행-p3)
  - [Phase 6: US4 - 태그 필터링 (P3)](#phase-6-us4---태그-필터링-p3)
  - [Phase 7: US5 - 검색 기능 (P3)](#phase-7-us5---검색-기능-p3)
  - [Phase 8: US6 - 문서 및 폴더 삭제 (P3)](#phase-8-us6---문서-및-폴더-삭제-p3)
  - [Phase 9: US7 - 홈 화면 표시 설정 (P4)](#phase-9-us7---홈-화면-표시-설정-p4)
  - [Phase 10: 최적화 및 마무리](#phase-10-최적화-및-마무리)
- [의존성 그래프](#의존성-그래프)
- [병렬 실행 기회](#병렬-실행-기회)
- [체크포인트](#체크포인트)

## 개요

**총 작업 수**: 73개  
**MVP 범위**: Phase 1-3 (US1까지) = 33개 작업  
**예상 기간**:

- MVP: 2-3주
- 전체: 6-8주

### 사용자 스토리별 작업 수

| Phase | User Story                  | Priority   | 작업 수 | 독립 테스트 가능 |
| ----- | --------------------------- | ---------- | ------- | ---------------- |
| 1     | 프로젝트 설정               | Setup      | 8       | N/A              |
| 2     | 기초 인프라                 | Foundation | 10      | N/A              |
| 3     | US1: 링크 저장 및 폴더 구성 | P1         | 15      | ✅ MVP           |
| 4     | US2: 외부 앱 공유 연동      | P2         | 6       | ✅               |
| 5     | US3: 링크 열기 및 실행      | P3         | 4       | ✅               |
| 6     | US4: 태그 필터링            | P3         | 7       | ✅               |
| 7     | US5: 검색 기능              | P3         | 5       | ✅               |
| 8     | US6: 문서 및 폴더 삭제      | P3         | 6       | ✅               |
| 9     | US7: 홈 화면 표시 설정      | P4         | 5       | ✅               |
| 10    | 최적화 및 마무리            | Polish     | 7       | N/A              |

## 실행 전략

### MVP 우선 접근

1. **Phase 1-3 완료 = 사용 가능한 MVP**

   - 기본적인 폴더/링크 관리
   - 계층적 폴더 구조
   - 로컬 데이터 저장

2. **점진적 기능 추가**

   - 각 Phase는 독립적으로 테스트 및 배포 가능
   - 사용자 피드백을 받으며 우선순위 조정 가능

3. **병렬 작업 활용**
   - 서로 다른 파일/모듈은 동시 작업 가능
   - `[P]` 마커로 표시

## 작업 목록

---

## Phase 1: 프로젝트 설정

**목표**: Ionic + React 19 + TypeScript 개발 환경 구축  
**의존성**: 없음  
**예상 기간**: 1일

### T001: Ionic React 프로젝트 초기화 [P]

**파일**: `/shelter/`

```bash
cd shelter
pnpm create @ionic/react shelter --type=blank --capacitor
cd shelter
```

- Ionic CLI로 React 프로젝트 생성
- Capacitor 통합 설정
- 기본 디렉토리 구조 확인

### T002: 핵심 의존성 설치 [P]

**파일**: `/shelter/package.json`

```bash
# 핵심 라이브러리
pnpm add zustand stackflow @stackflow/plugin-basic-ui @stackflow/plugin-history-sync
pnpm add idb
pnpm add lucide-react

# Capacitor 플러그인
pnpm add @capacitor/app @capacitor/browser @capacitor/storage @capacitor/share
```

### T003: Tailwind CSS 및 shadcn/ui 설정

**파일**: `/shelter/tailwind.config.js`, `/shelter/src/index.css`

```bash
# Tailwind 설치
pnpm add -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p

# shadcn/ui 설정
pnpm add -D @shadcn/ui
pnpx shadcn-ui@latest init
```

- `tailwind.config.js` 설정 (design-system.md 참고)
- 디자인 토큰 추가 (색상, 간격 등)

### T004: TypeScript 설정 최적화

**파일**: `/shelter/tsconfig.json`

- FSD path aliases 설정
- Strict mode 활성화
- React 19 타입 지원 확인

### T005: Vitest 및 테스팅 라이브러리 설정

**파일**: `/shelter/vitest.config.ts`, `/shelter/src/test/setup.ts`

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event
pnpm add -D @vitest/ui jsdom fake-indexeddb
```

- Vitest 설정
- fake-indexeddb 모킹
- Capacitor 플러그인 모킹

### T006: ESLint 및 Prettier 설정

**파일**: `/shelter/.eslintrc.cjs`, `/shelter/.prettierrc.json`

- ESLint 규칙 설정
- Prettier + Tailwind CSS 플러그인
- 자동 포맷팅 스크립트 추가

### T007: FSD 디렉토리 구조 생성

**파일**: `/shelter/src/`

```bash
mkdir -p src/{app,pages,widgets,features,entities,shared}
mkdir -p src/app/{providers,routes}
mkdir -p src/pages/{home,folder-detail,link-detail,tags,search,settings,share-receiver}
mkdir -p src/widgets/{folder-list,link-list,navigation-bar,ad-banner}
mkdir -p src/features/{folder-create,link-create,link-open,item-delete,tag-filter,search-query}
mkdir -p src/entities/{folder,link,tag}
mkdir -p src/shared/{ui,lib,api,hooks,types}
```

### T008: Capacitor 플랫폼 추가 및 설정

**파일**: `/shelter/capacitor.config.ts`

```bash
# iOS 추가 (macOS만)
pnpm exec cap add ios

# Android 추가
pnpm exec cap add android

# 동기화
pnpm exec cap sync
```

- URL scheme 설정 (shelter://)
- Share extension 설정

**✅ Checkpoint 1**: 개발 서버가 정상 실행되고 빈 Ionic 앱이 표시됨

---

## Phase 2: 기초 인프라

**목표**: 모든 User Story에서 사용할 공통 인프라 구축  
**의존성**: Phase 1 완료  
**예상 기간**: 2-3일

### T009: TypeScript 타입 정의 복사 [P]

**파일**: `/shelter/src/shared/types/`

```bash
cp -r specs/001-shelter-url-shelter/contracts/*.ts shelter/src/shared/types/
```

- entities.ts
- stores.ts
- services.ts

### T010: shadcn/ui 기본 컴포넌트 설치 [P]

**파일**: `/shelter/src/shared/ui/`

```bash
pnpx shadcn-ui@latest add button
pnpx shadcn-ui@latest add input
pnpx shadcn-ui@latest add card
pnpx shadcn-ui@latest add sheet
pnpx shadcn-ui@latest add dialog
pnpx shadcn-ui@latest add select
pnpx shadcn-ui@latest add badge
pnpx shadcn-ui@latest add toast
pnpx shadcn-ui@latest add skeleton
```

### T011: IndexedDB 래퍼 구현

**파일**: `/shelter/src/shared/api/db.ts`

- idb 라이브러리를 사용한 IndexedDB 초기화
- Object stores 생성 (folders, links, tags, settings)
- Indexes 설정
- 마이그레이션 로직

### T012: Folder 엔티티 레이어 구현 [P]

**파일**: `/shelter/src/entities/folder/`

```
entities/folder/
├── index.ts              # Public API
├── model/
│   ├── types.ts          # Folder 타입 재export
│   └── validation.ts     # Validation 함수
└── lib/
    └── utils.ts          # 유틸리티 (depth 계산 등)
```

### T013: Link 엔티티 레이어 구현 [P]

**파일**: `/shelter/src/entities/link/`

```
entities/link/
├── index.ts
├── model/
│   ├── types.ts
│   └── validation.ts     # URL 검증 등
└── lib/
    └── utils.ts          # URL 파싱, favicon 등
```

### T014: Tag 엔티티 레이어 구현 [P]

**파일**: `/shelter/src/entities/tag/`

```
entities/tag/
├── index.ts
├── model/
│   ├── types.ts
│   └── validation.ts
└── lib/
    └── utils.ts          # 색상 할당 등
```

### T015: Folder 서비스 레이어 구현

**파일**: `/shelter/src/shared/api/services/folder.ts`

- FolderService 인터페이스 구현
- CRUD 작업
- 계층 구조 처리
- Validation (depth, circular reference)

### T016: Link 서비스 레이어 구현

**파일**: `/shelter/src/shared/api/services/link.ts`

- LinkService 인터페이스 구현
- CRUD 작업
- Tag 업데이트 처리

### T017: Tag 서비스 레이어 구현

**파일**: `/shelter/src/shared/api/services/tag.ts`

- TagService 인터페이스 구현
- Tag 카운트 관리
- 자동 생성/삭제 로직

### T018: Zustand Store 구현

**파일**: `/shelter/src/app/providers/stores/`

```
stores/
├── index.ts              # Store exports
├── folderStore.ts        # Folder 상태 관리
├── linkStore.ts          # Link 상태 관리
├── tagStore.ts           # Tag 상태 관리
├── settingsStore.ts      # Settings 상태 관리
└── uiStore.ts            # UI 상태 (toasts 등)
```

- IndexedDB persistence 연동

**✅ Checkpoint 2**: 데이터 저장/조회가 IndexedDB에서 정상 작동

---

## Phase 3: US1 - 링크 저장 및 폴더 구성 (P1 - MVP)

**목표**: 사용자가 폴더를 생성하고 링크를 저장할 수 있는 핵심 기능 구현  
**의존성**: Phase 2 완료  
**예상 기간**: 4-5일

**독립 테스트 기준**:
✅ 사용자가 앱을 열고 폴더를 생성한 후 링크를 추가하고, 추가된 링크가 폴더 내에서 제목, URL, 설명, 태그와 함께 표시되는지 확인

### T019: Stackflow 네비게이션 설정

**파일**: `/shelter/src/app/routes/stackflow.tsx`

- Stackflow 초기화
- Activity 정의 (Home, FolderDetail, LinkDetail)
- 네비게이션 헬퍼 함수

### T020: 앱 루트 컴포넌트 구성

**파일**: `/shelter/src/app/App.tsx`

- Zustand Provider 설정
- Stackflow Provider 설정
- 전역 스타일 적용

### T021: [US1] 하단 네비게이션 바 위젯 [P]

**파일**: `/shelter/src/widgets/navigation-bar/`

```
navigation-bar/
├── index.ts
├── ui/
│   └── NavigationBar.tsx
└── model/
    └── navigation-items.ts
```

- 4개 탭: 홈, 태그, 검색, 설정
- 현재 페이지 강조
- design-system.md 패턴 참고

### T022: [US1] 폴더/링크 카드 컴포넌트 [P]

**파일**: `/shelter/src/shared/ui/item-card/`

```
item-card/
├── FolderCard.tsx        # List용
├── FolderCardGrid.tsx    # Grid용
├── LinkCard.tsx          # List용
└── LinkCardGrid.tsx      # Grid용
```

- 메타정보 표시
- 롱프레스 지원
- design-system.md 패턴 참고

### T023: [US1] 폴더 생성 feature 구현

**파일**: `/shelter/src/features/folder-create/`

```
folder-create/
├── index.ts
├── ui/
│   ├── FolderCreateButton.tsx   # 헤더 버튼
│   └── FolderCreateSheet.tsx    # 바텀 시트
└── model/
    └── use-create-folder.ts     # Hook
```

- 이름 입력 폼
- Validation
- Store 연동

### T024: [US1] 링크 생성 feature 구현

**파일**: `/shelter/src/features/link-create/`

```
link-create/
├── index.ts
├── ui/
│   ├── LinkCreateButton.tsx
│   └── LinkCreateSheet.tsx      # 제목, URL, 설명, 태그 입력
└── model/
    └── use-create-link.ts
```

- 태그 입력 컴포넌트
- URL validation
- Store 연동

### T025: [US1] 폴더 리스트 위젯 구현

**파일**: `/shelter/src/widgets/folder-list/`

```
folder-list/
├── index.ts
├── ui/
│   ├── FolderList.tsx           # List 모드
│   └── FolderGrid.tsx           # Grid 모드
└── model/
    └── use-folder-list.ts
```

- Folder 카드 사용
- 정렬 기능
- 빈 상태 처리

### T026: [US1] 링크 리스트 위젯 구현

**파일**: `/shelter/src/widgets/link-list/`

```
link-list/
├── index.ts
├── ui/
│   ├── LinkList.tsx
│   └── LinkGrid.tsx
└── model/
    └── use-link-list.ts
```

- Link 카드 사용
- 정렬 기능
- 빈 상태 처리

### T027: [US1] 홈 페이지 구현

**파일**: `/shelter/src/pages/home/`

```
home/
├── index.ts
├── ui/
│   └── HomePage.tsx
└── model/
    └── use-home-page.ts
```

- 루트 폴더 표시
- 폴더 생성 버튼
- 링크 생성 버튼
- 네비게이션 바 통합

### T028: [US1] 폴더 상세 페이지 구현

**파일**: `/shelter/src/pages/folder-detail/`

```
folder-detail/
├── index.ts
├── ui/
│   └── FolderDetailPage.tsx
└── model/
    └── use-folder-detail.ts
```

- Breadcrumb (경로 표시)
- 폴더/링크 리스트
- 하위 폴더 생성 가능

### T029: [US1] 링크 상세 페이지 구현

**파일**: `/shelter/src/pages/link-detail/`

```
link-detail/
├── index.ts
├── ui/
│   └── LinkDetailPage.tsx
└── model/
    └── use-link-detail.ts
```

- 제목, URL, 설명 표시
- 태그 목록
- 편집 기능 (Sheet)

### T030: [US1] 링크 편집 기능 추가

**파일**: `/shelter/src/features/link-create/ui/LinkEditSheet.tsx`

- LinkCreateSheet 재사용
- 초기값 설정
- 업데이트 로직

### T031: [US1] 폴더 편집 기능 추가

**파일**: `/shelter/src/features/folder-create/ui/FolderEditSheet.tsx`

- FolderCreateSheet 재사용
- 이름 수정
- 이동 기능 (추후)

### T032: [US1] 로딩 스켈레톤 UI 추가 [P]

**파일**: `/shelter/src/shared/ui/skeleton-cards/`

- FolderListSkeleton
- LinkListSkeleton
- 3-5개 표시

### T033: [US1] 에러 처리 및 Toast 알림 [P]

**파일**: `/shelter/src/shared/ui/toast/`

- 성공/오류 메시지
- UIStore 연동
- 자동 dismiss

**✅ Checkpoint 3 (MVP)**: 사용자가 폴더를 생성하고 링크를 저장할 수 있으며, 계층 구조가 작동함

---

## Phase 4: US2 - 외부 앱 공유 연동 (P2)

**목표**: 외부 앱에서 링크를 Shelter로 공유할 수 있음  
**의존성**: Phase 3 완료  
**예상 기간**: 2일

**독립 테스트 기준**:
✅ 외부 앱(예: 유튜브)에서 공유 버튼을 누르고 Shelter 앱을 선택한 후, 폴더를 선택하거나 생성하여 링크가 저장되는지 확인

### T034: [US2] Share 서비스 구현

**파일**: `/shelter/src/shared/api/services/share.ts`

- Capacitor App plugin 연동
- appUrlOpen 이벤트 리스너
- URL 파싱

### T035: [US2] Share Receiver 페이지 구현

**파일**: `/shelter/src/pages/share-receiver/`

```
share-receiver/
├── index.ts
├── ui/
│   └── ShareReceiverPage.tsx
└── model/
    └── use-share-receiver.ts
```

- 공유된 URL 표시
- 폴더 선택 UI
- 제목/설명 입력

### T036: [US2] 폴더 선택 컴포넌트

**파일**: `/shelter/src/features/folder-select/`

```
folder-select/
├── index.ts
├── ui/
│   └── FolderSelectSheet.tsx
└── model/
    └── use-folder-select.ts
```

- 계층 구조 표시
- 검색 기능 (추후)
- 새 폴더 생성 버튼

### T037: [US2] iOS Info.plist 설정

**파일**: `/shelter/ios/App/App/Info.plist`

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

### T038: [US2] Android Manifest 설정

**파일**: `/shelter/android/app/src/main/AndroidManifest.xml`

```xml
<intent-filter>
  <action android:name="android.intent.action.SEND" />
  <category android:name="android.intent.category.DEFAULT" />
  <data android:mimeType="text/plain" />
</intent-filter>
```

### T039: [US2] Share 통합 테스트

- 실제 디바이스에서 테스트
- 다양한 앱에서 공유 테스트
- Edge case 처리

**✅ Checkpoint 4**: 외부 앱에서 Shelter로 링크 공유가 정상 작동

---

## Phase 5: US3 - 링크 열기 및 실행 (P3) ✅ **COMPLETED**

**목표**: 링크 클릭 시 네이티브 앱 또는 브라우저로 열기  
**의존성**: Phase 3 완료  
**예상 기간**: 1일  
**실제 완료**: 2025-10-13

**독립 테스트 기준**:
✅ 저장된 유튜브 링크를 클릭하여 유튜브 앱이 열리는지, 일반 웹사이트 링크는 브라우저로 열리는지 확인

### T040: [US3] URL 서비스 구현 ✅

**파일**: `/shelter/src/shared/api/services/url.ts`

- URLService 인터페이스 구현
- APP_SCHEMES 매핑 활용
- Capacitor Browser/AppLauncher 플러그인 연동

### T041: [US3] Link Open feature 구현 ✅

**파일**: `/shelter/src/features/link/`

```
link/
├── index.ts
└── use-open-link.ts
```

- ✅ 앱 실행 여부 확인
- ✅ Fallback to browser
- ✅ 에러 처리 (IonToast 사용)

### T042: [US3] Link 카드에 클릭 핸들러 추가 ✅

**파일**: LinkDetailPage

- ✅ 클릭 이벤트 연결 (useOpenLink hook)
- ✅ 로딩 상태 표시
- ✅ lastAccessedAt 업데이트

### T043: [US3] URL validation 강화 ✅

**파일**: `/shelter/src/entities/link/model/validation.ts`

- ✅ URL 형식 검증 (HTTP/HTTPS + 앱 스킴)
- ✅ 도메인 형식 검증
- ✅ 지원되지 않는 scheme 경고
- ✅ 사용자 피드백 (console.warn)

**✅ Checkpoint 5**: 링크 클릭 시 올바른 앱/브라우저로 열림

---

## Phase 6: US4 - 태그 필터링 (P3) ✅ **COMPLETED**

**목표**: 태그로 링크를 필터링하고 찾을 수 있음  
**의존성**: Phase 3 완료  
**예상 기간**: 2일  
**실제 완료**: 2025-10-14

**독립 테스트 기준**:
✅ 여러 링크에 동일한 태그를 추가한 후, 태그 화면에서 해당 태그를 선택하여 필터링된 결과가 올바르게 표시되는지 확인

### T044: [US4] Tag filter feature 구현 ✅

**파일**: `/shelter/src/features/tag-filter/`

- ✅ TagBadge 컴포넌트 (클릭 가능, 선택 상태 표시)
- ✅ use-tag-filter hook (필터링 로직)

### T045: [US4] 태그 페이지 구현 ✅

**파일**: `/shelter/src/pages/tags/`

- ✅ TagsPage (모든 태그 목록, 개수순 정렬)
- ✅ TaggedLinksView (필터링된 링크 표시)
- ✅ 태그 클릭 시 필터링

### T046: [US4] Tag 입력 컴포넌트 개선 ✅

**파일**: TagInput (기존 사용)

- ✅ Enter로 추가
- ✅ X 버튼으로 제거

### T047: [US4] Link 카드에 태그 표시 ✅

**파일**: `/shelter/src/entities/link/ui/LinkCard.tsx`

- ✅ TagBadge 컴포넌트로 태그 표시
- ✅ 클릭 이벤트 지원
- ✅ 최대 3개만 표시 (+N)

### T048-T050: 추후 개선 사항 ⏸️

- Tag 관리 기능 (색상 변경, 이름 변경)
- Tag 통계 표시
- 고급 정렬/검색 (Phase 7과 통합)

**✅ Checkpoint 6**: 태그로 링크를 효과적으로 필터링하고 관리할 수 있음

---

## Phase 7: US5 - 검색 기능 (P3)

**목표**: 키워드로 링크를 빠르게 검색  
**의존성**: Phase 3 완료  
**예상 기간**: 2일

**독립 테스트 기준**:
✅ 여러 링크를 저장한 후 검색 화면에서 특정 키워드를 입력하여 관련 결과가 표시되는지 확인

### T051: [US5] Search query feature 구현

**파일**: `/shelter/src/features/search-query/`

```
search-query/
├── index.ts
├── ui/
│   ├── SearchBar.tsx
│   └── SearchFilters.tsx        # 고급 필터 (추후)
└── model/
    └── use-search.ts
```

- 실시간 검색 (debounced)
- 제목, URL, 설명 검색
- 하이라이팅

### T052: [US5] 검색 페이지 구현

**파일**: `/shelter/src/pages/search/`

```
search/
├── index.ts
├── ui/
│   ├── SearchPage.tsx
│   └── SearchResults.tsx
└── model/
    ├── use-search-page.ts
    └── use-search-history.ts    # 검색 히스토리 (추후)
```

- 검색 바
- 결과 목록
- 빈 상태 / 결과 없음 상태

### T053: [US5] IndexedDB 검색 최적화

**파일**: `/shelter/src/shared/api/services/link.ts`

- 검색 인덱스 활용
- 퍼지 매칭 (추후)
- 성능 최적화 (1000+ 링크)

### T054: [US5] 검색 결과 하이라이팅

**파일**: `/shelter/src/shared/ui/highlight/Highlight.tsx`

- 매치된 텍스트 강조
- 여러 키워드 지원

### T055: [US5] 최근 검색어 기능 [P]

**파일**: `/shelter/src/features/search-query/model/search-history.ts`

- Capacitor Storage에 저장
- 최대 10개
- 삭제 기능

**✅ Checkpoint 7**: 검색 기능으로 링크를 빠르게 찾을 수 있음

---

## Phase 8: US6 - 문서 및 폴더 삭제 (P3)

**목표**: 링크와 폴더를 안전하게 삭제  
**의존성**: Phase 3 완료  
**예상 기간**: 1-2일

**독립 테스트 기준**:
✅ 폴더나 문서를 길게 눌러 삭제 팝업이 나타나고 삭제 확인 후 해당 항목이 목록에서 제거되는지 확인

### T056: [US6] Item delete feature 구현

**파일**: `/shelter/src/features/item-delete/`

```
item-delete/
├── index.ts
├── ui/
│   ├── DeleteConfirmDialog.tsx
│   └── DeleteButton.tsx         # 옵션 메뉴에 통합
└── model/
    └── use-delete-item.ts
```

- 롱프레스 이벤트 처리
- 삭제 확인 다이얼로그
- design-system.md 패턴 참고

### T057: [US6] Cascade delete 로직 구현

**파일**: `/shelter/src/shared/api/services/folder.ts`

- 재귀적 삭제
- 하위 항목 카운트 계산
- Tag 카운트 업데이트

### T058: [US6] 삭제 경고 메시지

**파일**: DeleteConfirmDialog 컴포넌트

- 하위 항목 수 표시
- "N개의 폴더와 M개의 링크가 삭제됩니다"
- 되돌릴 수 없음 경고

### T059: [US6] Item 카드에 삭제 옵션 추가

**파일**: 기존 카드 컴포넌트들

- 롱프레스 핸들러
- 옵션 메뉴 (MoreVertical 아이콘)
- 삭제 외 편집, 이동 등 (추후)

### T060: [US6] 삭제 후 처리

**파일**: 각 페이지 컴포넌트

- 목록 업데이트
- 상위 폴더로 네비게이션 (현재 폴더 삭제 시)
- 성공 Toast

### T061: [US6] Undo 기능 (선택사항)

**파일**: `/shelter/src/features/item-delete/model/delete-history.ts`

- 최근 삭제 항목 임시 저장
- Toast에 "실행 취소" 버튼
- 5초 내 복원 가능

**✅ Checkpoint 8**: 안전하게 링크와 폴더를 삭제할 수 있음

---

## Phase 9: US7 - 홈 화면 표시 설정 (P4)

**목표**: 리스트/그리드 뷰 전환  
**의존성**: Phase 3 완료  
**예상 기간**: 1일

**독립 테스트 기준**:
✅ 설정 화면에서 표시 방식을 변경한 후 홈 화면으로 돌아가 실제로 리스트/그리드 구조가 변경되는지 확인

### T062: [US7] Settings 페이지 구현

**파일**: `/shelter/src/pages/settings/`

```
settings/
├── index.ts
├── ui/
│   ├── SettingsPage.tsx
│   └── SettingSection.tsx
└── model/
    └── use-settings.ts
```

- 표시 방식 선택 (List/Grid)
- 테마 설정 (Light/Dark/System)
- 앱 버전 표시
- 정렬 기본값 설정

### T063: [US7] View mode toggle 구현

**파일**: `/shelter/src/features/view-mode-toggle/`

```
view-mode-toggle/
├── index.ts
├── ui/
│   └── ViewModeToggle.tsx       # Switch 컴포넌트
└── model/
    └── use-view-mode.ts
```

- Settings store 연동
- 즉시 반영

### T064: [US7] List/Grid 뷰 전환 로직

**파일**: FolderList, LinkList 위젯

- viewMode 설정 읽기
- 조건부 렌더링
- 애니메이션 (선택사항)

### T065: [US7] 다크모드 지원

**파일**: `/shelter/src/app/providers/theme-provider.tsx`

- Tailwind dark: 클래스 활용
- System 설정 감지
- 수동 전환 지원

### T066: [US7] 정렬 기본값 설정

**파일**: Settings 페이지 내

- 폴더 정렬 (이름/생성일/수정일)
- 링크 정렬 (제목/생성일/접근일)
- 오름차순/내림차순

**✅ Checkpoint 9**: 사용자가 표시 방식과 테마를 커스터마이즈할 수 있음

---

## Phase 10: 최적화 및 마무리

**목표**: 성능 최적화 및 폴리싱  
**의존성**: Phase 3-9 완료  
**예상 기간**: 2-3일

### T067: 광고 통합 (Google AdMob)

**파일**: `/shelter/src/widgets/ad-banner/`

```
ad-banner/
├── index.ts
├── ui/
│   └── AdBanner.tsx
└── model/
    └── use-ad.ts
```

- Capacitor AdMob 플러그인 연동
- 하단 배너 광고
- 로드 실패 시 graceful degradation

### T068: 리스트 가상화 (성능 최적화)

**파일**: FolderList, LinkList 위젯

```bash
pnpm add @tanstack/react-virtual
```

- 1000+ 항목에서 60fps 유지
- 스크롤 성능 최적화

### T069: 이미지 최적화 (Favicon)

**파일**: Link 엔티티

- Favicon 캐싱
- Lazy loading
- Placeholder 아이콘

### T070: 오프라인 지원 확인

**파일**: 전역

- IndexedDB 의존성 확인
- 네트워크 없이 모든 기능 작동
- 에러 핸들링

### T071: 접근성 개선

**파일**: 모든 UI 컴포넌트

- ARIA 레이블 추가
- 키보드 네비게이션 지원
- 색상 대비 확인 (WCAG AA)
- 스크린 리더 테스트

### T072: 성능 프로파일링

- React DevTools Profiler 사용
- 불필요한 리렌더링 제거
- Zustand selector 최적화
- Bundle 크기 분석

### T073: E2E 테스트 작성 (선택사항)

**파일**: `/shelter/e2e/`

- Playwright 또는 Cypress
- 주요 사용자 플로우 테스트
- 실제 디바이스에서 검증

**✅ Final Checkpoint**: 프로덕션 준비 완료

---

## 의존성 그래프

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation)
    ↓
Phase 3 (US1 - MVP) ← 핵심 차단점
    ↓
    ├─→ Phase 4 (US2 - Share)
    ├─→ Phase 5 (US3 - Open Links)
    ├─→ Phase 6 (US4 - Tags)
    ├─→ Phase 7 (US5 - Search)
    ├─→ Phase 8 (US6 - Delete)
    └─→ Phase 9 (US7 - Settings)
         ↓
    Phase 10 (Polish)
```

**핵심 차단점**: Phase 3 (US1)

- Phase 4-9는 US1 완료 후 **병렬로 진행 가능**
- 각 Phase는 독립적으로 테스트 및 배포 가능

---

## 병렬 실행 기회

### Phase 1-2: 설정 단계

```
병렬 그룹 1:
- T001: Ionic 프로젝트 생성
- T002: 의존성 설치     [P]

병렬 그룹 2:
- T003: Tailwind 설정
- T004: TypeScript 설정 [P]
- T005: Vitest 설정     [P]
- T006: Lint 설정       [P]

병렬 그룹 3:
- T009: 타입 정의 복사   [P]
- T010: shadcn/ui 설치  [P]

병렬 그룹 4:
- T012: Folder 엔티티   [P]
- T013: Link 엔티티     [P]
- T014: Tag 엔티티      [P]
```

### Phase 3: US1 구현

```
병렬 그룹:
- T021: 네비게이션 바    [P]
- T022: 카드 컴포넌트    [P]
- T032: 스켈레톤 UI      [P]
- T033: Toast 알림       [P]
```

### Phase 4-9: 기능 추가

Phase 3 완료 후:

```
병렬 가능:
- Phase 4 (US2): Share 연동
- Phase 5 (US3): Link 열기
- Phase 6 (US4): 태그 필터링
- Phase 7 (US5): 검색
- Phase 8 (US6): 삭제
- Phase 9 (US7): 설정

각 Phase는 서로 독립적!
```

---

## 체크포인트

### ✅ Checkpoint 1: 프로젝트 설정 완료

**검증**:

- `pnpm dev` 실행 시 개발 서버 정상 구동
- 빈 Ionic 앱이 브라우저에 표시
- Hot reload 작동 확인

### ✅ Checkpoint 2: 기초 인프라 완료

**검증**:

```typescript
// IndexedDB 테스트
const folder = await folderService.create({ name: "Test", parentId: null });
const folders = await folderService.getAll();
console.log(folders); // [{ id: ..., name: "Test", ... }]
```

- 데이터가 IndexedDB에 저장되고 조회됨
- Store가 정상 작동

### ✅ Checkpoint 3: MVP 완료

**검증**:

1. 앱 실행
2. 루트 폴더에서 "새 폴더" 버튼 클릭
3. 폴더 이름 입력 후 저장
4. 폴더 클릭하여 진입
5. "링크 추가" 버튼 클릭
6. 제목, URL, 설명, 태그 입력 후 저장
7. 링크가 목록에 표시되는지 확인
8. 앱 재시작 후 데이터 유지 확인

**성공 조건**:

- 모든 단계가 정상 작동
- 데이터가 영구 저장됨
- 계층 구조가 정상 표시됨

### ✅ Checkpoint 4: 외부 공유 작동

**검증**:

1. Safari 또는 Chrome에서 웹사이트 열기
2. 공유 버튼 클릭
3. Shelter 앱 선택
4. 폴더 선택 화면 표시 확인
5. 폴더 선택 후 저장
6. Shelter 앱에서 저장된 링크 확인

### ✅ Checkpoint 5: 링크 열기 작동

**검증**:

1. 유튜브 링크 저장
2. 링크 클릭
3. 유튜브 앱이 열리는지 확인 (설치된 경우)
4. 일반 웹사이트 링크는 브라우저로 열림 확인

### ✅ Checkpoint 6: 태그 필터링 작동

**검증**:

1. 여러 링크에 동일한 태그 추가
2. 태그 탭 선택
3. 태그 목록 표시 확인
4. 태그 클릭 시 필터링된 링크 표시 확인

### ✅ Checkpoint 7: 검색 작동

**검증**:

1. 검색 탭 선택
2. 키워드 입력
3. 실시간 검색 결과 표시 확인
4. 매치된 텍스트 하이라이팅 확인

### ✅ Checkpoint 8: 삭제 작동

**검증**:

1. 폴더/링크 롱프레스
2. 삭제 확인 다이얼로그 표시
3. 하위 항목 수 경고 확인 (폴더의 경우)
4. 삭제 확인 후 항목 제거 확인

### ✅ Checkpoint 9: 설정 작동

**검증**:

1. 설정 탭 선택
2. 리스트/그리드 전환
3. 홈 화면으로 돌아가서 변경 확인
4. 다크모드 전환 확인

### ✅ Final Checkpoint: 프로덕션 준비

**검증**:

- [ ] 모든 기능이 오프라인에서 작동
- [ ] 1000개 링크에서도 60fps 유지
- [ ] 접근성 테스트 통과
- [ ] 실제 디바이스에서 검증 (iOS + Android)
- [ ] 앱 스토어 제출 준비 완료

---

## 구현 팁

### FSD 아키텍처 준수

```
❌ 잘못된 예:
pages/home/ui/HomePage.tsx에서 직접 IndexedDB 접근

✅ 올바른 예:
pages/home/ui/HomePage.tsx
  → entities/folder/model (비즈니스 로직)
    → shared/api/services/folder.ts (데이터 접근)
      → shared/api/db.ts (IndexedDB)
```

### 디자인 시스템 활용

모든 UI는 `design-system.md`를 참고:

- 색상: HSL 값 사용
- 간격: Tailwind spacing (4px 단위)
- 컴포넌트: shadcn/ui 기반
- 패턴: 9가지 주요 패턴 활용

### 성능 고려사항

- 리스트 가상화 (1000+ 항목)
- Zustand selector 최적화
- IndexedDB 인덱스 활용
- 이미지 lazy loading

### 모바일 최적화

- 최소 터치 영역 44x44px
- 롱프레스 제스처 지원
- 네이티브 느낌의 애니메이션
- 오프라인 우선 접근

---

## 다음 단계

1. **MVP 완료 (Phase 1-3)** → 내부 테스트
2. **Phase 4-6 추가** → 베타 테스트
3. **Phase 7-9 추가** → 최종 폴리싱
4. **Phase 10 완료** → 앱 스토어 제출

**예상 일정**:

- 주차 1-2: MVP (Phase 1-3)
- 주차 3-4: 핵심 기능 추가 (Phase 4-6)
- 주차 5-6: 추가 기능 (Phase 7-9)
- 주차 7-8: 최적화 및 배포 준비 (Phase 10)

**총 기간**: 6-8주
