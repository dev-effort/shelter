import { useEffect } from 'react';
import { useSettingsStore } from './stores';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const applyTheme = () => {
      const theme = settings?.theme || 'dark';

      // 수동 설정
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    applyTheme();
  }, [settings?.theme]);

  return <>{children}</>;
}
