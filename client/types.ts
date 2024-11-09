export interface BottomTabNavigationProps {
  selectedTab: string;
  onTabPress: (tab: string) => void;
}

export interface ActionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}