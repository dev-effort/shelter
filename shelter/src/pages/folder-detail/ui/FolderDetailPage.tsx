import { useHistory, useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
} from '@ionic/react';

const FolderDetailPage: React.FC = () => {
  const history = useHistory();
  const { folderId } = useParams<{ folderId: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>폴더 상세</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <p className="text-muted-foreground">폴더 ID: {folderId}</p>
          <p className="text-muted-foreground">폴더 상세 페이지 (구현 예정)</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FolderDetailPage;
