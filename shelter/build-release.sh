#!/bin/bash

# SHELTER Release 빌드 스크립트
# Play Store 배포용 AAB 파일 생성

set -e  # 에러 발생 시 중단

echo "🚀 SHELTER Release 빌드 시작..."
echo ""

# 현재 디렉토리 확인
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📂 작업 디렉토리: $SCRIPT_DIR"
echo ""

# 0단계: 버전 자동 증가
echo "0️⃣  버전 자동 증가 중..."
BUILD_GRADLE="android/app/build.gradle"

# 현재 versionCode 읽기
CURRENT_VERSION_CODE=$(grep "versionCode" "$BUILD_GRADLE" | awk '{print $2}')
CURRENT_VERSION_NAME=$(grep "versionName" "$BUILD_GRADLE" | awk '{print $2}' | tr -d '"')

# versionCode 증가
NEW_VERSION_CODE=$((CURRENT_VERSION_CODE + 1))

# versionName 증가 (1.0.1 -> 1.0.2)
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION_NAME"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]:-0}
NEW_PATCH=$((PATCH + 1))
NEW_VERSION_NAME="$MAJOR.$MINOR.$NEW_PATCH"

echo "  현재 버전: versionCode $CURRENT_VERSION_CODE, versionName \"$CURRENT_VERSION_NAME\""
echo "  새 버전: versionCode $NEW_VERSION_CODE, versionName \"$NEW_VERSION_NAME\""

# build.gradle 파일 업데이트
sed -i.bak "s/versionCode $CURRENT_VERSION_CODE/versionCode $NEW_VERSION_CODE/" "$BUILD_GRADLE"
sed -i.bak "s/versionName \"$CURRENT_VERSION_NAME\"/versionName \"$NEW_VERSION_NAME\"/" "$BUILD_GRADLE"
rm "${BUILD_GRADLE}.bak"

echo "✅ 버전 증가 완료"
echo ""

# 1단계: 웹 앱 빌드
echo "1️⃣  웹 앱 빌드 중..."
pnpm run build
echo "✅ 웹 앱 빌드 완료"
echo ""

# 2단계: Capacitor 동기화
echo "2️⃣  Capacitor 동기화 중..."
npx cap sync android
echo "✅ Capacitor 동기화 완료"
echo ""

# 3단계: Android Release 빌드
echo "3️⃣  Android Release AAB 생성 중..."
cd android
./gradlew bundleRelease
cd ..
echo "✅ Release AAB 생성 완료"
echo ""

# 빌드 결과 확인
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 빌드 성공!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📦 파일 위치: $AAB_PATH"
    echo "📊 파일 크기: $AAB_SIZE"
    echo "🔢 버전: $NEW_VERSION_NAME (코드: $NEW_VERSION_CODE)"
    echo ""
    echo "다음 단계:"
    echo "  1. Play Console에 로그인"
    echo "  2. 앱 선택 → 프로덕션 → 새 버전 만들기"
    echo "  3. AAB 파일 업로드"
    echo ""
else
    echo "❌ AAB 파일을 찾을 수 없습니다"
    exit 1
fi

