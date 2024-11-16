import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomTabNavigationProps } from '../../../types';
import { useTranslation } from 'react-i18next';

const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({ selectedTab, onTabPress }) => {
  const { t } = useTranslation();
  const tabs = [
    { tab: 'Home', label: t('home.home'), iconName: 'home' },
    { tab: 'Saved', label: t('home.saved'), iconName: 'bookmark' },
    { tab: 'Settings', label: t('home.settings'), iconName: 'settings' },
  ];

  return (
    <View style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: '#ffffff',
      borderRadius: 24,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8, 
    }}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          onPress={() => onTabPress(tab.tab)}
          style={{ alignItems: 'center', flex: 1 }}
        >
          <Icon name={tab.iconName} size={24} color={selectedTab === tab.tab ? '#007F7F' : '#A9A9A9'} />
          <Text style={{ color: selectedTab === tab.tab ? '#007F7F' : '#A9A9A9' }}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomTabNavigation;
