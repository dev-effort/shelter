import { useLocation } from 'react-router-dom';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { homeOutline, pricetagsOutline, searchOutline, settingsOutline } from 'ionicons/icons';

interface NavigationBarProps {
  onNavigate: (route: string) => void;
}

export default function NavigationBar({ onNavigate }: NavigationBarProps) {
  const location = useLocation();

  const navItems = [
    { id: '/home', label: '홈', icon: homeOutline },
    { id: '/tags', label: '태그', icon: pricetagsOutline },
    { id: '/search', label: '검색', icon: searchOutline },
    { id: '/settings', label: '설정', icon: settingsOutline },
  ];

  return (
    <IonTabBar slot="bottom" className="border-t border-border">
      {navItems.map((item) => (
        <IonTabButton
          key={item.id}
          tab={item.id}
          href={item.id}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.id);
          }}
          selected={location.pathname === item.id}
        >
          <IonIcon icon={item.icon} />
          <IonLabel>{item.label}</IonLabel>
        </IonTabButton>
      ))}
    </IonTabBar>
  );
}
