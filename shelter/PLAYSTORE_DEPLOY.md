# 🚀 Google Play Store 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 완료된 항목

- [x] AdMob 실제 ID 적용
- [x] `isTesting: false` 설정

### 🔲 해야 할 작업

- [ ] AndroidManifest.xml App ID 업데이트
- [ ] 앱 아이콘 및 브랜딩
- [ ] 앱 서명 키 생성
- [ ] 버전 정보 설정
- [ ] Release APK/AAB 생성
- [ ] Play Console 계정 등록
- [ ] 개인정보 처리방침 작성
- [ ] 스토어 등록 정보 준비

---

## 1단계: 앱 정보 설정

### 1.1 앱 이름 및 버전 확인

**파일: `android/app/build.gradle`**

```gradle
android {
    defaultConfig {
        applicationId "com.shelter.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1          // 빌드 번호 (숫자만, 업데이트시 증가)
        versionName "1.0.0"    // 사용자에게 보이는 버전
    }
}
```

**업데이트 시 버전 규칙:**

- `versionCode`: 1, 2, 3... (매번 증가)
- `versionName`: "1.0.0" → "1.0.1" → "1.1.0" → "2.0.0"

### 1.2 앱 이름 설정

**파일: `android/app/src/main/res/values/strings.xml`**

```xml
<resources>
    <string name="app_name">SHELTER</string>
    <string name="title_activity_main">SHELTER</string>
</resources>
```

---

## 2단계: 앱 아이콘 준비

### 2.1 아이콘 이미지 준비

- **크기**: 최소 512x512px (권장: 1024x1024px)
- **형식**: PNG (투명 배경 가능)
- **디자인**: 앱을 대표하는 심플한 아이콘

### 2.2 아이콘 생성 도구

여러 크기의 아이콘 자동 생성:

- https://icon.kitchen/ (추천)
- https://www.appicon.co/
- https://romannurik.github.io/AndroidAssetStudio/

### 2.3 아이콘 적용

생성된 아이콘 파일들을 다음 위치에 복사:

```
android/app/src/main/res/
  ├── mipmap-hdpi/
  ├── mipmap-mdpi/
  ├── mipmap-xhdpi/
  ├── mipmap-xxhdpi/
  └── mipmap-xxxhdpi/
```

---

## 3단계: 앱 서명 키 생성

### 3.1 Keystore 생성

터미널에서 실행:

```bash
cd android/app

# Keystore 생성
keytool -genkey -v \
  -keystore shelter-release-key.keystore \
  -alias shelter-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 프롬프트에 답변:
# - 비밀번호: 안전한 비밀번호 입력 (반드시 기억!)
# - 이름/조직 정보: 입력
```

⚠️ **중요**:

- `shelter-release-key.keystore` 파일을 **안전한 곳에 백업**!
- 비밀번호를 **절대 잊지 마세요**!
- 분실 시 앱 업데이트 불가능!

### 3.2 서명 설정

**파일 생성: `android/key.properties`**

```properties
storePassword=여기에비밀번호입력
keyPassword=여기에비밀번호입력
keyAlias=shelter-key-alias
storeFile=shelter-release-key.keystore
```

⚠️ **보안**: `key.properties`를 `.gitignore`에 추가!

**파일: `android/.gitignore`에 추가**

```
key.properties
*.keystore
```

### 3.3 build.gradle 수정

**파일: `android/app/build.gradle`**

파일 상단에 추가:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 4단계: Release 빌드 생성

### 4.1 프로젝트 빌드

```bash
# 1. 웹 앱 빌드
cd shelter
pnpm run build

# 2. Capacitor 동기화
npx cap sync android

# 3. Android 프로젝트로 이동
cd android

# 4. Release AAB 생성
./gradlew bundleRelease

# AAB 파일 위치:
# android/app/build/outputs/bundle/release/app-release.aab
```

### 4.2 빌드 확인

```bash
# AAB 파일 확인
ls -lh app/build/outputs/bundle/release/app-release.aab
```

---

## 5단계: Google Play Console 설정

### 5.1 Play Console 계정 생성

1. https://play.google.com/console 접속
2. Google 계정으로 로그인
3. **개발자 등록 비용**: $25 (1회 결제, 평생 사용)
4. 결제 정보 입력 및 등록

### 5.2 새 앱 만들기

1. "앱 만들기" 클릭
2. 앱 정보 입력:
   - **앱 이름**: SHELTER
   - **기본 언어**: 한국어
   - **앱 유형**: 앱
   - **무료/유료**: 무료

### 5.3 앱 카테고리 및 태그

- **카테고리**: 도구 (Tools)
- **태그**: bookmark, link management, productivity

---

## 6단계: 스토어 등록 정보

### 6.1 필수 스크린샷

최소 2장 이상 필요:

**스마트폰 스크린샷**

- 크기: 1080 x 1920px 이상
- 형식: PNG 또는 JPEG
- 최소 2장, 최대 8장

**준비할 화면:**

1. 홈 화면 (폴더/링크 목록)
2. 링크 추가 화면
3. 폴더 상세 화면
4. 검색 화면
5. 설정 화면

### 6.2 기능 그래픽

- 크기: 1024 x 500px
- 형식: PNG 또는 JPEG
- 앱 로고/제목이 포함된 배너 이미지

### 6.3 앱 아이콘 (스토어용)

- 크기: 512 x 512px
- 형식: PNG
- 투명 배경 가능

### 6.4 앱 설명 작성

**짧은 설명 (80자 이내):**

```
웹 링크를 쉽게 저장하고 관리하세요. 폴더와 태그로 정리하는 스마트 북마크 앱
```

**전체 설명 (4000자 이내):**

```
📱 SHELTER - 나만의 링크 보관소

SHELTER는 웹에서 발견한 유용한 링크들을 체계적으로 저장하고
관리할 수 있는 스마트 북마크 앱입니다.

✨ 주요 기능

📂 폴더로 정리
• 계층형 폴더 구조로 링크 체계적 관리
• 폴더별로 링크를 그룹화
• 무제한 하위 폴더 생성

🏷️ 태그 시스템
• 여러 태그로 링크 분류
• 태그 필터로 빠른 검색
• 크로스 카테고리 관리

🔍 강력한 검색
• 제목, URL, 설명, 태그로 검색
• 실시간 검색 결과
• 빠른 접근

📤 간편한 공유
• 다른 앱에서 직접 링크 공유
• 브라우저와 연동
• 원터치 저장

🎨 깔끔한 디자인
• 직관적인 사용자 인터페이스
• 다크모드 지원
• 빠른 성능

🔒 개인정보 보호
• 모든 데이터는 기기에 저장
• 클라우드 동기화 없음 (선택사항)
• 안전한 로컬 저장소

📱 SHELTER와 함께 인터넷에서 발견한 모든 것을
   체계적으로 보관하세요!
```

---

## 7단계: 개인정보 처리방침

### 7.1 개인정보 처리방침 작성

Play Store는 **반드시** 개인정보 처리방침 URL을 요구합니다.

**간단한 방법:**

1. GitHub Pages 사용
2. Notion 공개 페이지
3. Google Sites
4. 블로그

**최소 포함 내용:**

```markdown
# SHELTER 개인정보 처리방침

## 1. 수집하는 정보

SHELTER 앱은 다음 정보를 수집하지 않습니다:

- 개인 식별 정보
- 위치 정보
- 연락처 정보

모든 데이터(링크, 폴더, 태그)는 사용자의 기기에만 저장됩니다.

## 2. 광고

본 앱은 Google AdMob을 사용하여 광고를 표시합니다.
AdMob은 다음 정보를 수집할 수 있습니다:

- 광고 ID
- IP 주소
- 기기 정보

자세한 내용은 Google 개인정보 처리방침을 참조하세요:
https://policies.google.com/privacy

## 3. 데이터 보안

모든 데이터는 기기의 로컬 스토리지에 안전하게 저장됩니다.
외부 서버로 전송되지 않습니다.

## 4. 문의

개인정보 관련 문의:
이메일: your-email@example.com

최종 업데이트: 2025-01-15
```

### 7.2 개인정보 처리방침 URL 등록

Play Console → 앱 콘텐츠 → 개인정보 처리방침에 URL 입력

---

## 8단계: 콘텐츠 등급

Play Console에서 설문 작성:

- 폭력성: 없음
- 성적 콘텐츠: 없음
- 약물: 없음
- 등등...

**예상 등급**: 전체 이용가 (Everyone)

---

## 9단계: 앱 배포

### 9.1 내부 테스트 (권장)

1. Play Console → 테스트 → 내부 테스트
2. AAB 파일 업로드
3. 테스터 이메일 추가
4. 내부 테스트로 먼저 확인

### 9.2 프로덕션 배포

1. Play Console → 프로덕션
2. AAB 파일 업로드
3. 출시 노트 작성:

   ```
   버전 1.0.0

   SHELTER 첫 출시!

   • 링크 저장 및 관리
   • 폴더 구조 지원
   • 태그 시스템
   • 검색 기능
   • 다른 앱에서 공유 가능
   ```

4. "국가/지역" 선택 (대한민국 또는 전 세계)
5. "검토하러 가기" 클릭
6. "출시 시작" 클릭

### 9.3 검토 대기

- 검토 시간: 보통 1~3일
- 승인 후 몇 시간 내 스토어 게시
- 이메일로 알림 받음

---

## 10단계: 출시 후 관리

### 10.1 모니터링

Play Console에서 확인:

- **통계**: 다운로드, 활성 사용자
- **평점 및 리뷰**: 사용자 피드백
- **비정상 종료 및 ANR**: 앱 안정성
- **AdMob**: 광고 수익

### 10.2 업데이트 배포

1. 버전 업데이트:

   ```gradle
   versionCode 2
   versionName "1.0.1"
   ```

2. 빌드 및 업로드:

   ```bash
   pnpm run build
   npx cap sync android
   cd android && ./gradlew bundleRelease
   ```

3. Play Console에서 새 버전 업로드

---

## 🚨 주의사항

### 반드시 지켜야 할 것

1. **Keystore 백업**
   - 분실 시 앱 업데이트 불가능!
   - 최소 3곳에 백업

2. **개인정보 처리방침**
   - 반드시 URL 제공
   - 광고 사용 명시

3. **스토어 정책 준수**
   - Google Play 정책 읽기
   - 저작권 준수
   - 금지 콘텐츠 확인

4. **테스트**
   - 내부 테스트 먼저 진행
   - 여러 기기에서 테스트
   - 광고 정상 작동 확인

---

## 📚 유용한 링크

- [Play Console](https://play.google.com/console)
- [AdMob](https://admob.google.com)
- [Google Play 정책](https://play.google.com/about/developer-content-policy/)
- [Android 개발자 가이드](https://developer.android.com/distribute)

---

## ✅ 최종 체크리스트

배포 전 확인:

- [ ] AdMob ID 실제 ID로 변경 완료
- [ ] AndroidManifest.xml 업데이트
- [ ] 앱 아이콘 설정
- [ ] Keystore 생성 및 백업
- [ ] Release AAB 빌드 성공
- [ ] 스크린샷 준비
- [ ] 앱 설명 작성
- [ ] 개인정보 처리방침 URL 준비
- [ ] 실제 기기에서 테스트 완료
- [ ] 광고 정상 작동 확인
- [ ] Play Console 계정 등록 ($25 결제)

모든 항목을 완료하면 배포 준비 완료! 🚀
