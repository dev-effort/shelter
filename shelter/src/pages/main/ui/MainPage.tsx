import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonAlert } from '@ionic/react';
import { App } from '@capacitor/app';
import { NavigationBar } from '@/widgets/navigation-bar';
import HomeContent from './HomeContent';
import TagsContent from './TagsContent';
import SearchContent from './SearchContent';
import SettingsContent from './SettingsContent';

export type TabType = 'home' | 'tags' | 'search' | 'settings';

const MainPage: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showExitAlert, setShowExitAlert] = useState(false);

  // 뒤로가기 버튼 처리
  useEffect(() => {
    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      // 더 이상 뒤로 갈 수 없는 경우
      if (!canGoBack) {
        if (activeTab === 'home') {
          // 홈 탭에서는 앱 종료 확인
          setShowExitAlert(true);
        } else {
          // 다른 탭에서는 홈으로 이동
          setActiveTab('home');
        }
      }
    });

    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const handleExitApp = () => {
    App.exitApp();
  };

  return (
    <IonPage>
      {activeTab === 'home' && <HomeContent history={history} />}
      {activeTab === 'tags' && <TagsContent history={history} />}
      {activeTab === 'search' && <SearchContent history={history} onTabChange={handleTabChange} />}
      {activeTab === 'settings' && <SettingsContent history={history} />}

      <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 앱 종료 확인 Alert */}
      <IonAlert
        isOpen={showExitAlert}
        onDidDismiss={() => setShowExitAlert(false)}
        header="앱 종료"
        message="앱을 종료하시겠습니까?"
        buttons={[
          {
            text: '취소',
            role: 'cancel',
            handler: () => {
              setShowExitAlert(false);
            },
          },
          {
            text: '종료',
            role: 'destructive',
            handler: handleExitApp,
          },
        ]}
      />
    </IonPage>
  );
};

export default MainPage;
