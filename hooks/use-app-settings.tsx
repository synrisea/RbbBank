import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ru' | 'az';
type Theme = 'light' | 'dark';

interface AppSettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userAvatar: string | null;
  setUserAvatar: (avatar: string | null) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [userAvatar, setUserAvatarState] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) setLanguageState(savedLang as Language);

      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) setThemeState(savedTheme as Theme);

      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      if (savedAvatar) setUserAvatarState(savedAvatar);
    };
    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem('theme', t);
  };

  const setUserAvatar = async (avatar: string | null) => {
    setUserAvatarState(avatar);
    if (avatar) {
      await AsyncStorage.setItem('userAvatar', avatar);
    } else {
      await AsyncStorage.removeItem('userAvatar');
    }
  };

  return (
    <AppSettingsContext.Provider value={{
      language, setLanguage,
      theme, setTheme,
      userAvatar, setUserAvatar
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
