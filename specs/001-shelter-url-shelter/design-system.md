# Shelter App - Design System

**Version**: 1.0.0  
**Last Updated**: 2025-10-13  
**Philosophy**: 모던 미니멀리즘 - 최대한 심플하고 깔끔한 디자인

## 디자인 철학

### 핵심 원칙

**"Less is More"** - 불필요한 요소를 제거하고 본질에 집중합니다.

1. **콘텐츠 우선** (Content First)

   - 사용자의 링크와 폴더가 주인공
   - UI는 콘텐츠를 돋보이게 하는 조연

2. **명확한 계층** (Clear Hierarchy)

   - 중요한 것은 크고 선명하게
   - 부차적인 것은 작고 은은하게

3. **일관성** (Consistency)

   - 같은 액션은 항상 같은 위치, 같은 모양
   - 예측 가능한 사용자 경험

4. **여유** (Breathing Room)
   - 충분한 여백으로 시각적 편안함 제공
   - 복잡해 보이지 않도록

## 컬러 시스템

### Light Mode (기본)

```typescript
const lightColors = {
  background: "hsl(0, 0%, 100%)", // 순백색
  foreground: "hsl(0, 0%, 3.9%)", // 거의 검정색
  card: "hsl(0, 0%, 100%)", // 카드 배경
  cardForeground: "hsl(0, 0%, 3.9%)", // 카드 텍스트

  primary: "hsl(221, 83%, 53%)", // 생생한 파란색
  primaryForeground: "hsl(0, 0%, 100%)", // 흰색

  secondary: "hsl(210, 40%, 96%)", // 연한 회색
  secondaryForeground: "hsl(0, 0%, 3.9%)",

  muted: "hsl(210, 40%, 96%)", // 은은한 배경
  mutedForeground: "hsl(215, 16%, 47%)", // 은은한 텍스트

  accent: "hsl(210, 40%, 96%)", // 강조 배경
  accentForeground: "hsl(0, 0%, 3.9%)",

  destructive: "hsl(0, 84%, 60%)", // 빨간색 (삭제)
  destructiveForeground: "hsl(0, 0%, 100%)",

  border: "hsl(214, 32%, 91%)", // 은은한 테두리
  input: "hsl(214, 32%, 91%)", // 입력 테두리
  ring: "hsl(221, 83%, 53%)", // 포커스 링
};
```

### Dark Mode

```typescript
const darkColors = {
  background: "hsl(0, 0%, 3.9%)", // 진한 배경
  foreground: "hsl(0, 0%, 98%)", // 밝은 텍스트
  card: "hsl(0, 0%, 3.9%)",
  cardForeground: "hsl(0, 0%, 98%)",

  primary: "hsl(217, 91%, 60%)", // 밝은 파란색
  primaryForeground: "hsl(0, 0%, 98%)",

  secondary: "hsl(217, 33%, 17%)", // 어두운 회색
  secondaryForeground: "hsl(0, 0%, 98%)",

  muted: "hsl(217, 33%, 17%)",
  mutedForeground: "hsl(215, 20%, 65%)",

  accent: "hsl(217, 33%, 17%)",
  accentForeground: "hsl(0, 0%, 98%)",

  destructive: "hsl(0, 63%, 31%)",
  destructiveForeground: "hsl(0, 0%, 98%)",

  border: "hsl(217, 33%, 17%)",
  input: "hsl(217, 33%, 17%)",
  ring: "hsl(217, 91%, 60%)",
};
```

### 태그 컬러 팔레트

부드럽고 은은한 8가지 색상:

```typescript
const tagColors = {
  red: {
    bg: "hsl(0, 84%, 97%)", // 라이트 배경
    text: "hsl(0, 84%, 40%)", // 진한 텍스트
    border: "hsl(0, 84%, 90%)", // 테두리
  },
  amber: {
    bg: "hsl(38, 92%, 95%)",
    text: "hsl(38, 92%, 35%)",
    border: "hsl(38, 92%, 85%)",
  },
  green: {
    bg: "hsl(142, 76%, 95%)",
    text: "hsl(142, 76%, 30%)",
    border: "hsl(142, 76%, 85%)",
  },
  blue: {
    bg: "hsl(221, 83%, 95%)",
    text: "hsl(221, 83%, 40%)",
    border: "hsl(221, 83%, 85%)",
  },
  purple: {
    bg: "hsl(263, 70%, 95%)",
    text: "hsl(263, 70%, 40%)",
    border: "hsl(263, 70%, 85%)",
  },
  pink: {
    bg: "hsl(330, 81%, 95%)",
    text: "hsl(330, 81%, 40%)",
    border: "hsl(330, 81%, 85%)",
  },
  cyan: {
    bg: "hsl(188, 94%, 95%)",
    text: "hsl(188, 94%, 30%)",
    border: "hsl(188, 94%, 85%)",
  },
  orange: {
    bg: "hsl(24, 95%, 95%)",
    text: "hsl(24, 95%, 35%)",
    border: "hsl(24, 95%, 85%)",
  },
};
```

## 타이포그래피

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
  "Segoe UI Emoji", "Segoe UI Symbol";
```

네이티브 시스템 폰트 사용으로:

- 빠른 로딩
- 플랫폼 일관성
- 최적의 가독성

### Font Scale

모바일에 최적화된 크기:

| 용도           | 크기 | 행간 | Weight | 사용처           |
| -------------- | ---- | ---- | ------ | ---------------- |
| **H1**         | 28px | 1.2  | 700    | 페이지 타이틀    |
| **H2**         | 24px | 1.3  | 600    | 섹션 헤더        |
| **H3**         | 20px | 1.4  | 600    | 서브 헤더        |
| **Body Large** | 18px | 1.6  | 400    | 강조 텍스트      |
| **Body**       | 16px | 1.6  | 400    | 기본 텍스트      |
| **Small**      | 14px | 1.5  | 400    | 보조 정보        |
| **Tiny**       | 12px | 1.4  | 400    | 타임스탬프, 라벨 |

### Font Weights

- **Regular (400)**: 본문 텍스트
- **Medium (500)**: 약간 강조
- **Semibold (600)**: 헤더, 중요 정보
- **Bold (700)**: 주요 타이틀

## 간격 시스템

Tailwind spacing scale 사용 (4px 단위):

```typescript
const spacing = {
  0: "0px", // 간격 없음
  1: "4px", // 최소 간격
  2: "8px", // 작은 간격
  3: "12px", // 중간 간격
  4: "16px", // 기본 간격 ⭐
  5: "20px", //
  6: "24px", // 큰 간격
  8: "32px", // 매우 큰 간격
  10: "40px", // 섹션 간격
  12: "48px", //
  16: "64px", // 페이지 간격
};
```

### 레이아웃 간격

```typescript
const layout = {
  pagePadding: "16px",      // 페이지 좌우 여백
  cardGap: "8px",           // 카드 간 간격
  sectionGap: "24px",       // 섹션 간 간격
  listItemHeight: "72px",   // 리스트 아이템 높이
  gridGap: "12px",          # 그리드 간격
};
```

## 아이콘 시스템

### lucide-react 사용

일관된 아이콘 스타일:

```tsx
import {
  Home, Tag, Search, Settings,      // Navigation
  Folder, FolderOpen, Link2,        // Content
  Plus, MoreVertical, ChevronRight, // Actions
  Check, X, AlertCircle,            // Status
} from "lucide-react";

// 사용 예시
<Home className="w-6 h-6" />          // 24x24px (네비게이션)
<Folder className="w-5 h-5" />        // 20x20px (리스트 아이템)
<Plus className="w-4 h-4" />          // 16x16px (버튼 내부)
```

### 아이콘 크기 가이드

| 크기  | 용도              | 클래스명    |
| ----- | ----------------- | ----------- |
| 16px  | 버튼 내부, 인라인 | `w-4 h-4`   |
| 20px  | 리스트 아이템     | `w-5 h-5`   |
| 24px  | 네비게이션, 헤더  | `w-6 h-6`   |
| 32px  | 대형 아이콘 버튼  | `w-8 h-8`   |
| 48px+ | 빈 상태 일러스트  | `w-12 h-12` |

## 그림자 시스템

심플하고 은은한 그림자:

```css
/* 카드 그림자 */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* 다이얼로그 그림자 */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* 네비게이션 바 그림자 */
.shadow-top {
  box-shadow: 0 -1px 3px 0 rgb(0 0 0 / 0.05);
}
```

## 둥근 모서리

일관된 border-radius:

```typescript
const borderRadius = {
  sm: "6px", // 작은 요소 (Badge)
  md: "8px", // 기본 (Button, Input) ⭐
  lg: "12px", // 카드, 다이얼로그
  xl: "16px", // 대형 카드
  full: "9999px", // 원형 (아바타, 일부 버튼)
};
```

## 컴포넌트 패턴

### 1. 폴더/링크 카드 - List 모드

```tsx
<Card className="mb-2 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
      {/* 아이콘 */}
      <div className="flex-shrink-0">
        <Folder className="w-5 h-5 text-primary" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base truncate">{folder.name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {folder.linkCount}개 링크 · {folder.folderCount}개 폴더
        </p>
      </div>

      {/* 액션 */}
      <button className="flex-shrink-0 p-2 -m-2 hover:bg-muted rounded-md">
        <MoreVertical className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  </CardContent>
</Card>
```

**디자인 포인트**:

- 깔끔한 1줄 레이아웃
- 왼쪽 아이콘으로 시각적 구분
- 제목 강조 (semibold)
- 메타정보는 작고 은은하게
- 오른쪽 액션 버튼 (옵션 메뉴)

### 2. 폴더/링크 카드 - Grid 모드

```tsx
<Card className="aspect-square shadow-sm hover:shadow-md transition-shadow active:scale-95">
  <CardContent className="p-4 flex flex-col h-full">
    {/* 상단 아이콘 */}
    <div className="mb-3">
      <Folder className="w-10 h-10 text-primary" />
    </div>

    {/* 제목 (2줄까지) */}
    <h3 className="font-semibold text-base line-clamp-2 flex-1">
      {folder.name}
    </h3>

    {/* 하단 메타정보 */}
    <div className="text-xs text-muted-foreground mt-2">
      {folder.linkCount}개 링크
    </div>
  </CardContent>
</Card>
```

**디자인 포인트**:

- 정사각형 비율로 통일감
- 큰 아이콘으로 시각성 강화
- 2줄 제목 표시 (line-clamp)
- 하단에 간결한 메타정보

### 3. 바텀 시트 (폴더/링크 생성)

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
    {/* 헤더 */}
    <SheetHeader className="border-b pb-4">
      <SheetTitle className="text-left text-xl">새 링크 추가</SheetTitle>
    </SheetHeader>

    {/* 폼 */}
    <div className="flex-1 overflow-y-auto py-6 space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">제목 *</label>
        <Input placeholder="링크 제목을 입력하세요" className="h-12" />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">URL *</label>
        <Input type="url" placeholder="https://example.com" className="h-12" />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">설명</label>
        <Textarea
          placeholder="링크에 대한 설명 (선택사항)"
          className="min-h-24 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">태그</label>
        <TagInput placeholder="태그 입력 후 Enter" />
      </div>
    </div>

    {/* 푸터 */}
    <SheetFooter className="border-t pt-4">
      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => setOpen(false)}
        >
          취소
        </Button>
        <Button size="lg" className="flex-1" onClick={handleSave}>
          저장
        </Button>
      </div>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**디자인 포인트**:

- 화면의 90% 높이로 충분한 공간
- 둥근 상단 모서리 (2xl = 16px)
- 헤더/푸터 구분 (border)
- 큰 입력 필드 (h-12 = 48px)
- 명확한 레이블
- 전체 너비 버튼

### 4. 하단 네비게이션

```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-top z-50">
  <div className="flex items-center justify-around h-16">
    {navItems.map((item) => (
      <button
        key={item.id}
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full gap-1",
          "transition-colors",
          isActive(item.id)
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => navigate(item.path)}
      >
        <item.icon className="w-6 h-6" />
        <span className="text-xs font-medium">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

**디자인 포인트**:

- 고정 하단 배치
- 64px 높이로 충분한 터치 영역
- 아이콘 + 레이블 조합
- 현재 페이지는 primary 색상
- 부드러운 호버 효과

### 5. 검색 바

```tsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
  <Input
    type="search"
    placeholder="링크, 폴더 검색..."
    className="pl-12 h-12 text-base"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  {query && (
    <button
      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
      onClick={() => setQuery("")}
    >
      <X className="w-4 h-4 text-muted-foreground" />
    </button>
  )}
</div>
```

**디자인 포인트**:

- 왼쪽 검색 아이콘
- 큰 입력 영역 (48px)
- 입력 시 오른쪽에 X 버튼 (지우기)
- 부드러운 플레이스홀더

### 6. 태그 배지

```tsx
<div className="flex flex-wrap gap-2">
  {tags.map((tag) => (
    <Badge
      key={tag.name}
      variant="secondary"
      className="rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: tag.color ? `${tag.color}15` : undefined,
        color: tag.color || undefined,
        borderColor: tag.color ? `${tag.color}30` : undefined,
      }}
    >
      {tag.displayName}
      {removable && (
        <button className="ml-1 hover:opacity-70" onClick={() => onRemove(tag)}>
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  ))}
</div>
```

**디자인 포인트**:

- 완전히 둥근 모서리 (full)
- 태그 색상 활용 (15% 투명도 배경)
- 작지만 터치 가능한 크기
- 제거 버튼 (X) 포함 가능

### 7. 삭제 확인 다이얼로그

```tsx
<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    {/* 아이콘 */}
    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
      <AlertCircle className="w-6 h-6 text-destructive" />
    </div>

    {/* 제목 */}
    <AlertDialogTitle className="text-center text-xl">
      정말 삭제하시겠어요?
    </AlertDialogTitle>

    {/* 설명 */}
    <AlertDialogDescription className="text-center text-base">
      <span className="font-semibold">{item.name}</span>과(와) 모든 하위 항목이
      삭제됩니다.
      <br />이 작업은 되돌릴 수 없습니다.
    </AlertDialogDescription>

    {/* 액션 */}
    <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full"
        onClick={handleDelete}
      >
        삭제하기
      </AlertDialogAction>
      <AlertDialogCancel className="w-full mt-0">취소</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**디자인 포인트**:

- 중앙 정렬로 시선 집중
- 경고 아이콘 (빨간색 배경)
- 명확한 제목과 설명
- 위험한 액션(삭제)을 위에 배치
- 취소 버튼은 덜 강조

### 8. 빈 상태 (Empty State)

```tsx
<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
  {/* 아이콘 */}
  <div className="mb-6">
    <Folder className="w-20 h-20 text-muted-foreground/50" />
  </div>

  {/* 제목 */}
  <h3 className="text-xl font-semibold mb-2">아직 링크가 없어요</h3>

  {/* 설명 */}
  <p className="text-muted-foreground mb-8 max-w-sm">
    첫 번째 링크를 추가하거나
    <br />
    다른 앱에서 공유해보세요
  </p>

  {/* 액션 버튼 */}
  <Button size="lg" className="min-w-[200px]">
    <Plus className="w-5 h-5 mr-2" />
    링크 추가
  </Button>
</div>
```

**디자인 포인트**:

- 중앙 정렬, 수직 중심
- 큰 아이콘 (80px)
- 친근한 메시지
- 명확한 다음 액션 제시

### 9. 로딩 스켈레톤

```tsx
<div className="space-y-3">
  {[1, 2, 3, 4, 5].map((i) => (
    <Card key={i}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

**디자인 포인트**:

- 실제 콘텐츠 구조와 동일
- 부드러운 애니메이션
- 적절한 개수 표시 (5개)

## 애니메이션

### Micro-interactions

```css
/* 버튼 press */
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}

/* 카드 hover */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: box-shadow 200ms ease;
}

/* 스켈레톤 shimmer */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  background-size: 200% 100%;
}
```

### Page Transitions (Stackflow)

```typescript
const stackflow = {
  transitionDuration: 300,
  activities: {
    push: {
      effect: "slide-in-right",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    pop: {
      effect: "slide-out-right",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};
```

## 접근성 (Accessibility)

### 색상 대비

- **텍스트 vs 배경**: 최소 4.5:1 (WCAG AA)
- **큰 텍스트 vs 배경**: 최소 3:1
- **UI 요소**: 최소 3:1

### 터치 타겟

- **최소 크기**: 44x44px
- **권장 간격**: 8px 이상

### 키보드 접근성

모든 인터랙티브 요소:

- Tab으로 접근 가능
- 명확한 focus ring
- Enter/Space로 활성화

### 스크린 리더

```tsx
<button aria-label="링크 추가">
  <Plus className="w-5 h-5" />
</button>

<img
  src={favicon}
  alt={`${title} 파비콘`}
/>

<div role="navigation" aria-label="메인 네비게이션">
  {/* navigation items */}
</div>
```

## 반응형 디자인

### 브레이크포인트

```typescript
const breakpoints = {
  sm: "640px", // 스마트폰 가로
  md: "768px", // 태블릿 세로
  lg: "1024px", // 태블릿 가로, 작은 노트북
  xl: "1280px", // 데스크톱
};
```

### 모바일 우선

```css
/* 모바일 (기본) */
.container {
  padding: 16px;
}

/* 태블릿 */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    max-width: 800px;
  }
}
```

## 구현 체크리스트

구현 시 확인사항:

- [ ] shadcn/ui 컴포넌트 설치
- [ ] Tailwind 설정에 디자인 토큰 추가
- [ ] 다크모드 설정
- [ ] 폰트 최적화
- [ ] 아이콘 시스템 구축
- [ ] 공통 컴포넌트 구현
- [ ] 애니메이션 적용
- [ ] 접근성 테스트
- [ ] 실제 디바이스 테스트

## 참고 자료

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide Icons](https://lucide.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://m3.material.io/)
