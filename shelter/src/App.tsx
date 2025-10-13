import { useEffect, useRef } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import HomePage from '@/pages/home/ui/HomePage';
import FolderDetailPage from '@/pages/folder-detail/ui/FolderDetailPage';
import LinkDetailPage from '@/pages/link-detail/ui/LinkDetailPage';
import TagsPage from '@/pages/tags/ui/TagsPage';
import SearchPage from '@/pages/search/ui/SearchPage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import { ShareReceiverPage } from '@/pages/share-receiver';
import { Toaster } from '@/shared/ui/toaster';
import { shareService } from '@/shared/api/services/share';

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

  useEffect(() => {
    // Initialize share service
    shareService.initialize().catch((error) => {
      console.error('Failed to initialize share service:', error);
    });

    // Handle share events by redirecting to /share page
    const handleShare = () => {
      console.log('Share event received, navigating to /share');
      // Use push instead of replace to allow back navigation
      history.push('/share');
    };

    shareListenerRef.current = handleShare;
    shareService.addListener(handleShare);

    // Check if app was launched with a share
    shareService.checkLaunchUrl().then((info) => {
      if (info) {
        console.log('App launched with shared URL:', info);
        history.replace('/share');
      }
    });

    return () => {
      if (shareListenerRef.current) {
        shareService.removeListener(shareListenerRef.current);
      }
    };
  }, [history]);

  return (
    <>
      <IonRouterOutlet>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/folder/:folderId" component={FolderDetailPage} />
        <Route exact path="/link/:linkId" component={LinkDetailPage} />
        <Route exact path="/tags" component={TagsPage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/settings" component={SettingsPage} />
        <Route exact path="/share" component={ShareReceiverPage} />
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
      <Toaster />
    </>
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
