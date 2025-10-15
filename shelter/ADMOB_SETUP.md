# 📱 AdMob 실제 광고 ID 적용 가이드

## 🎯 개요

이 가이드는 Google AdMob에서 실제 광고 ID를 받아서 앱에 적용하는 방법을 설명합니다.

---

## 1단계: Google AdMob 계정 생성

### 1.1 AdMob 계정 만들기

1. https://admob.google.com 접속
2. Google 계정으로 로그인
3. "시작하기" 클릭
4. 정보 입력:
   - 국가/지역: **대한민국**
   - 통화: **KRW (원)**
5. 이용약관 동의
6. "AdMob 계정 만들기" 클릭

---

## 2단계: Android 앱 등록

### 2.1 앱 추가

1. AdMob 대시보드에서 **"앱"** 메뉴 클릭
2. **"앱 추가"** 버튼 클릭

### 2.2 플랫폼 선택

1. **"Android"** 선택

### 2.3 앱 정보 입력

1. "앱이 아직 출시되지 않았나요?" 체크 (Play Store에 없다면)
2. 앱 이름 입력: **SHELTER** (또는 원하는 이름)
3. "앱 추가" 클릭

### 2.4 App ID 저장

- 생성된 **App ID** 복사 및 저장
- 형식: `ca-app-pub-1234567890123456~1234567890`
- 📝 메모장에 저장해두세요!

---

## 3단계: 배너 광고 단위 생성

### 3.1 광고 단위 추가

1. 방금 만든 앱 클릭
2. **"광고 단위"** 탭 클릭
3. **"광고 단위 추가"** 버튼 클릭

### 3.2 광고 형식 선택

1. **"배너"** 선택

### 3.3 광고 단위 설정

1. 광고 단위 이름: **Banner - Home** (구분하기 쉬운 이름)
2. 배너 크기: **"표준 배너" (320x50)** 선택
3. "광고 단위 만들기" 클릭

### 3.4 Ad Unit ID 저장

- 생성된 **광고 단위 ID** 복사 및 저장
- 형식: `ca-app-pub-1234567890123456/9876543210`
- 📝 메모장에 저장해두세요!
- "완료" 클릭

---

## 4단계: iOS 앱 등록 (나중에 iOS 빌드 시 필요)

### 4.1 iOS 앱 추가

1. "앱" 메뉴 → "앱 추가"
2. **"iOS"** 선택
3. 같은 앱 이름으로 등록
4. iOS **App ID** 저장

### 4.2 iOS 배너 광고 단위 생성

1. iOS 앱에서 "광고 단위 추가"
2. "배너" 선택
3. iOS **Ad Unit ID** 저장

---

## 5단계: 코드에 ID 적용

### 5.1 admob.ts 파일 수정

파일: `src/shared/api/services/admob.ts`

```typescript
const AD_IDS = {
  android: {
    // ⚠️ 여기에 Android App ID 입력
    appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',
    // ⚠️ 여기에 Android Banner Ad Unit ID 입력
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
  },
  ios: {
    // ⚠️ 여기에 iOS App ID 입력
    appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~AAAAAAAAAA',
    // ⚠️ 여기에 iOS Banner Ad Unit ID 입력
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB',
  },
};
```

**수정 방법:**

1. `XXXXXXXXXXXXXXXX` 부분을 AdMob에서 받은 숫자로 교체
2. `~` 뒤의 숫자도 교체 (App ID)
3. `/` 뒤의 숫자도 교체 (Ad Unit ID)

### 5.2 AndroidManifest.xml 수정

파일: `android/app/src/main/AndroidManifest.xml`

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

**수정 방법:**

- `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY` 부분을 **Android App ID**로 교체

### 5.3 테스트 모드 설정

처음에는 테스트 모드로 실행하세요:

**admob.ts에서:**

```typescript
isTesting: true,  // 테스트 광고 표시
```

**실제 배포 시:**

```typescript
isTesting: false, // 실제 광고 표시
```

---

## 6단계: 빌드 및 테스트

### 6.1 빌드

```bash
cd shelter
pnpm run build
npx cap sync android
```

### 6.2 Android Studio에서 실행

1. Android Studio 열기
2. 실제 디바이스에서 테스트
3. Chrome Remote Devices로 로그 확인

### 6.3 광고 확인

- **테스트 모드 (isTesting: true)**: 테스트 광고 표시
- **실제 모드 (isTesting: false)**: 실제 광고 표시 (수익 발생)

---

## ⚠️ 중요 사항

### 1. 테스트 광고 사용

- 개발/테스트 단계에서는 **반드시** `isTesting: true` 사용
- 본인의 광고를 클릭하면 계정이 정지될 수 있습니다!

### 2. 실제 광고 전환 시기

- 앱이 완전히 완성되고
- Play Store에 출시할 준비가 되었을 때
- `isTesting: false`로 변경

### 3. 광고 수익 발생 시기

- 앱이 Play Store에 출시된 후
- 실제 사용자가 광고를 보거나 클릭할 때
- AdMob 대시보드에서 수익 확인 가능

### 4. 광고 승인 대기

- 처음 설정 후 광고가 바로 표시되지 않을 수 있음
- Google의 검토 과정 (보통 24시간 이내)
- 승인 전까지는 테스트 광고 사용

---

## 📊 수익 확인

1. https://admob.google.com 로그인
2. "수익" 메뉴 클릭
3. 일별/월별 수익 확인

---

## 🆘 문제 해결

### 광고가 표시되지 않을 때

1. **App ID 확인**: AndroidManifest.xml의 ID가 올바른지 확인
2. **Ad Unit ID 확인**: admob.ts의 ID가 올바른지 확인
3. **로그 확인**: Chrome Remote Devices에서 에러 메시지 확인
4. **네트워크 확인**: 인터넷 연결 상태 확인
5. **테스트 모드**: `isTesting: true`로 설정하여 테스트 광고 확인

### 계정 문제

- AdMob 계정이 활성화되어 있는지 확인
- 결제 정보가 등록되어 있는지 확인 (수익 지급을 위해)

---

## 📚 추가 참고자료

- [Google AdMob 공식 문서](https://support.google.com/admob)
- [AdMob Android 시작 가이드](https://developers.google.com/admob/android/quick-start)
- [AdMob iOS 시작 가이드](https://developers.google.com/admob/ios/quick-start)

---

## ✅ 체크리스트

- [ ] AdMob 계정 생성 완료
- [ ] Android 앱 등록 완료
- [ ] Android App ID 받음
- [ ] Android Banner Ad Unit ID 받음
- [ ] iOS 앱 등록 완료 (선택)
- [ ] iOS App ID 받음 (선택)
- [ ] iOS Banner Ad Unit ID 받음 (선택)
- [ ] `admob.ts` 파일에 ID 입력
- [ ] `AndroidManifest.xml`에 App ID 입력
- [ ] `isTesting: true`로 테스트 완료
- [ ] 실제 디바이스에서 광고 표시 확인
- [ ] Play Store 출시 전 `isTesting: false`로 변경

---

**🎉 축하합니다! AdMob 설정이 완료되었습니다!**
