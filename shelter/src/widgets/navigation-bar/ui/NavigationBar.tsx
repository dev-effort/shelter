import { IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { home, pricetags, settings } from 'ionicons/icons';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: home },
    { id: 'tags', label: '태그', icon: pricetags },
    { id: 'settings', label: '설정', icon: settings },
  ];

  return (
    <div
      slot="bottom"
      className="border-t border-border"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        height: '50px',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => (
        <div
          key={item.id}
          onClick={(e) => {
            e.preventDefault();
            onTabChange(item.id);
          }}
          style={{
            color: activeTab === item.id ? 'var(--ion-color-primary)' : 'var(--ion-color-medium)',
            height: '50px',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <IonIcon icon={item.icon} style={{ width: '30px', height: '30px', marginTop: '5px' }} />
        </div>
      ))}
    </div>
  );
}
