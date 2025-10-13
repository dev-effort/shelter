import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { NavigationBar } from '@/widgets/navigation-bar';
import { useFolderStore } from '@/app/providers/stores';
import { useLinkStore } from '@/app/providers/stores';
import { addOutline, folderOutline } from 'ionicons/icons';

const HomePage: React.FC = () => {
  const history = useHistory();
  const { folders, loadFolders, getRootFolders } = useFolderStore();
  const { links, loadLinks } = useLinkStore();

  useEffect(() => {
    loadFolders();
    loadLinks();
  }, [loadFolders, loadLinks]);

  const rootFolders = getRootFolders();

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shelter</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={folderOutline} />
            </IonButton>
            <IonButton>
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4 pb-20">
          {/* 폴더 섹션 */}
          {rootFolders.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">폴더</h2>
              <div className="space-y-2">
                {rootFolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => history.push(`/folder/${folder.id}`)}
                    className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{folder.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {folder.linkCount} 링크, {folder.folderCount} 폴더
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 빈 상태 */}
          {rootFolders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="mb-4 text-muted-foreground">아직 저장된 링크가 없습니다</p>
              <IonButton>
                <IonIcon slot="start" icon={addOutline} />첫 링크 추가하기
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>

      <NavigationBar onNavigate={handleNavigate} />
    </IonPage>
  );
};

export default HomePage;
