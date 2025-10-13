import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import HomePage from '@/pages/home/ui/HomePage';
import FolderDetailPage from '@/pages/folder-detail/ui/FolderDetailPage';
import LinkDetailPage from '@/pages/link-detail/ui/LinkDetailPage';
import TagsPage from '@/pages/tags/ui/TagsPage';
import SearchPage from '@/pages/search/ui/SearchPage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import { Toaster } from '@/shared/ui/toaster';

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

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/folder/:folderId" component={FolderDetailPage} />
          <Route exact path="/link/:linkId" component={LinkDetailPage} />
          <Route exact path="/tags" component={TagsPage} />
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <Toaster />
    </IonApp>
  );
};

export default App;
