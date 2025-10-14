import { useLocation } from 'react-router-dom';
import { IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { home, pricetags, search, settings } from 'ionicons/icons';

interface NavigationBarProps {
  onNavigate: (route: string) => void;
}

export default function NavigationBar({ onNavigate }: NavigationBarProps) {
  const location = useLocation();

  const navItems = [
    { id: '/home', label: '홈', icon: home },
    { id: '/tags', label: '태그', icon: pricetags },
    { id: '/search', label: '검색', icon: search },
    { id: '/settings', label: '설정', icon: settings },
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
        </IonTabButton>
      ))}
    </IonTabBar>
  );
}
