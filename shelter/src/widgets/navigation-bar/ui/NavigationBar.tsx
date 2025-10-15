import { IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { home, pricetags, search, settings } from 'ionicons/icons';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: home },
    { id: 'tags', label: '태그', icon: pricetags },
    { id: 'search', label: '검색', icon: search },
    { id: 'settings', label: '설정', icon: settings },
  ];

  return (
    <IonTabBar slot="bottom" className="border-t border-border">
      {navItems.map((item) => (
        <IonTabButton
          key={item.id}
          tab={item.id}
          onClick={(e) => {
            e.preventDefault();
            onTabChange(item.id);
          }}
          selected={activeTab === item.id}
        >
          <IonIcon icon={item.icon} />
        </IonTabButton>
      ))}
    </IonTabBar>
  );
}
