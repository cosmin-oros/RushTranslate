export interface BottomTabNavigationProps {
  selectedTab: string;
  onTabPress: (tab: string) => void;
}

export interface ActionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export interface CardProps {
  title: string;
  textInputValue: string;
  setTextInputValue: (value: string) => void;
  placeholder: string;
  onLanguagePress: () => void;
}

export type ScanSectionProps = {
  languages: { top: string; bottom: string };
  handleLanguageSwitch: () => void;
};

export interface Translation {
  key: string;
  text: string;
}

export interface LanguageTranslations {
  language: string;
  translations: Translation[];
}
