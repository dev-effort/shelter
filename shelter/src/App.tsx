import { useEffect, useRef } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonPage,
  IonContent,
  IonSpinner,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, useHistory } from 'react-router-dom';
import HomePage from '@/pages/home/ui/HomePage';
import FolderDetailPage from '@/pages/folder-detail/ui/FolderDetailPage';
import LinkDetailPage from '@/pages/link-detail/ui/LinkDetailPage';
import TagsPage from '@/pages/tags/ui/TagsPage';
import SearchPage from '@/pages/search/ui/SearchPage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import { ShareReceiverPage } from '@/pages/share-receiver';
import { Toaster } from '@/shared/ui/toaster';
import { shareService } from '@/shared/api/services/share';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { useSettingsStore } from '@/app/providers/stores';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'ios',
});

// App content that has access to router history
const AppContent: React.FC = () => {
  const history = useHistory();
  const shareListenerRef = useRef<((info: any) => void) | null>(null);
  const isCheckingShareRef = useRef(false);
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    let mounted = true;

    // Load settings for theme
    loadSettings();

    // Initialize share service
    shareService.initialize().catch((error) => {
      console.error('Failed to initialize share service:', error);
    });

    // Handle share events by redirecting to /share page
    const handleShare = (info: any) => {
      if (!mounted) return;
      console.log('Share event received, navigating to /share', info);
      // Use push instead of replace to allow back navigation
      history.push('/share');
    };

    shareListenerRef.current = handleShare;
    shareService.addListener(handleShare);

    // Check for shared data multiple times with delays - FASTER!
    const checkShare = async () => {
      if (isCheckingShareRef.current) return;
      isCheckingShareRef.current = true;

      console.log('🔄 Starting share data check...');

      // Try after 800ms (MainActivity saves after 500ms)
      await new Promise((resolve) => setTimeout(resolve, 800));
      let info = await shareService.checkLaunchUrl();
      if (info && mounted) {
        console.log('✅ Share data found after 0.8s:', info);
        history.replace('/share');
        return;
      }

      // Try after another 400ms (total 1.2s)
      await new Promise((resolve) => setTimeout(resolve, 400));
      info = await shareService.checkLaunchUrl();
      if (info && mounted) {
        console.log('✅ Share data found after 1.2s:', info);
        history.replace('/share');
        return;
      }

      // Try after another 400ms (total 1.6s)
      await new Promise((resolve) => setTimeout(resolve, 400));
      info = await shareService.checkLaunchUrl();
      if (info && mounted) {
        console.log('✅ Share data found after 1.6s:', info);
        history.replace('/share');
        return;
      }

      // No share data found - go to home
      console.log('❌ No share data found - navigating to home');
      if (mounted) {
        history.replace('/home');
      }
    };

    checkShare().catch((error) => {
      console.error('Error checking share:', error);
      // On error, navigate to home
      if (mounted) {
        history.replace('/home');
      }
    });

    return () => {
      mounted = false;
      if (shareListenerRef.current) {
        shareService.removeListener(shareListenerRef.current);
      }
    };
  }, [history]);

  return (
    <ThemeProvider>
      <IonRouterOutlet>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/folder/:folderId" component={FolderDetailPage} />
        <Route exact path="/link/:linkId" component={LinkDetailPage} />
        <Route exact path="/tags" component={TagsPage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/settings" component={SettingsPage} />
        <Route exact path="/share" component={ShareReceiverPage} />
        <Route exact path="/">
          {/* Show loading while checking for shared data */}
          <IonPage>
            <IonContent className="ion-padding ion-text-center">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <IonSpinner name="crescent" />
                <p style={{ marginTop: '16px', color: 'var(--ion-color-medium)' }}>Loading...</p>
              </div>
            </IonContent>
          </IonPage>
        </Route>
      </IonRouterOutlet>
      <Toaster />
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <AppContent />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
