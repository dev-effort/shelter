import { useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { NavigationBar } from '@/widgets/navigation-bar';

const TagsPage: React.FC = () => {
  const history = useHistory();

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>태그</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <p className="text-muted-foreground">태그 페이지 (구현 예정)</p>
        </div>
      </IonContent>

      <NavigationBar onNavigate={handleNavigate} />
    </IonPage>
  );
};

export default TagsPage;
