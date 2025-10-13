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

const LinkDetailPage: React.FC = () => {
  const history = useHistory();
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>링크 상세</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <p className="text-muted-foreground">링크 ID: {linkId}</p>
          <p className="text-muted-foreground">링크 상세 페이지 (구현 예정)</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LinkDetailPage;
