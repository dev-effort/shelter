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

