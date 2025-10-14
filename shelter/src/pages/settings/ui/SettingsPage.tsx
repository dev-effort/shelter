import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import { NavigationBar } from '@/widgets/navigation-bar';
import { useSettingsStore } from '@/app/providers/stores';

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const { settings, isLoading, loadSettings, updateSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  const handleViewModeChange = async (viewMode: 'list' | 'grid') => {
    try {
      await updateSettings({ viewMode });
    } catch (error) {
      console.error('Failed to update view mode:', error);
    }
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    try {
      await updateSettings({ theme });
      // 테마는 ThemeProvider에서 자동으로 적용됨
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleSortByChange = async (defaultSortBy: 'name' | 'createdAt' | 'updatedAt') => {
    try {
      await updateSettings({ defaultSortBy });
    } catch (error) {
      console.error('Failed to update sort by:', error);
    }
  };

  const handleSortOrderChange = async (defaultSortOrder: 'asc' | 'desc') => {
    try {
      await updateSettings({ defaultSortOrder });
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  if (isLoading || !settings) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>설정</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="flex justify-center py-8">
            <IonSpinner />
          </div>
        </IonContent>
        <NavigationBar onNavigate={handleNavigate} />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>설정</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4 pb-20">
          {/* 표시 설정 */}
          <IonCard>
            <IonCardHeader>
              <h2 className="text-base font-medium">표시 설정</h2>
            </IonCardHeader>
            <IonCardContent className="p-0">
              <IonList>
                <IonItem>
                  <IonLabel>보기 방식</IonLabel>
                  <IonSelect
                    value={settings.viewMode}
                    onIonChange={(e) => handleViewModeChange(e.detail.value)}
                    interface="popover"
                  >
                    <IonSelectOption value="list">리스트</IonSelectOption>
                    <IonSelectOption value="grid">그리드</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel>테마</IonLabel>
                  <IonSelect
                    value={settings.theme}
                    onIonChange={(e) => handleThemeChange(e.detail.value)}
                    interface="popover"
                  >
                    <IonSelectOption value="system">시스템 설정</IonSelectOption>
                    <IonSelectOption value="light">라이트 모드</IonSelectOption>
                    <IonSelectOption value="dark">다크 모드</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* 정렬 설정 */}
          <IonCard>
            <IonCardHeader>
              <h2 className="text-base font-medium">정렬 설정</h2>
            </IonCardHeader>
            <IonCardContent className="p-0">
              <IonList>
                <IonItem>
                  <IonLabel>정렬 기준</IonLabel>
                  <IonSelect
                    value={settings.defaultSortBy}
                    onIonChange={(e) => handleSortByChange(e.detail.value)}
                    interface="popover"
                  >
                    <IonSelectOption value="name">이름</IonSelectOption>
                    <IonSelectOption value="createdAt">생성일</IonSelectOption>
                    <IonSelectOption value="updatedAt">수정일</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel>정렬 순서</IonLabel>
                  <IonSelect
                    value={settings.defaultSortOrder}
                    onIonChange={(e) => handleSortOrderChange(e.detail.value)}
                    interface="popover"
                  >
                    <IonSelectOption value="asc">오름차순</IonSelectOption>
                    <IonSelectOption value="desc">내림차순</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* 앱 정보 */}
          <IonCard>
            <IonCardHeader>
              <h2 className="text-base font-medium">앱 정보</h2>
            </IonCardHeader>
            <IonCardContent className="p-0">
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3 className="text-sm font-medium">버전</h3>
                    <p className="text-sm text-muted-foreground">{settings.appVersion}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>

      <NavigationBar onNavigate={handleNavigate} />
    </IonPage>
  );
};

export default SettingsPage;
