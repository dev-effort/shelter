import { useEffect } from 'react';
import { useSettingsStore } from './stores';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const applyTheme = () => {
      const theme = settings?.theme || 'system';

      if (theme === 'system') {
        // 시스템 설정 따르기
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      } else {
        // 수동 설정
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    applyTheme();

    // 시스템 테마 변경 감지
    if (settings?.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [settings?.theme]);

  return <>{children}</>;
}
