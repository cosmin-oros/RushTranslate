import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { Container, Content, Title } from '../../tamagui.config';
import BottomTabNavigation from '../home/components/BottomTabNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Routes } from '../../routes/routes';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RouteParams } from '../../routes/types';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Settings>;

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RoutePropType>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Settings');

  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);

  const settingsItems = [
    { id: 1, title: 'settings.language', icon: 'globe-outline', route: 'LanguageSettings' },
    { id: 2, title: 'settings.offline', icon: 'cloud-offline-outline', route: 'OfflineSettings' },
    { id: 3, title: 'settings.privacy', icon: 'shield-outline', route: 'PrivacyPolicy' },
    { id: 4, title: 'settings.clear_data', icon: 'trash-outline', route: 'ClearAppData' },
    { id: 5, title: 'settings.feedback', icon: 'chatbox-ellipses-outline', route: 'Feedback' },
    { id: 6, title: 'settings.help', icon: 'help-circle-outline', route: 'HelpCenter' },
  ];

  useFocusEffect(
    useCallback(() => {
      setSelectedTab('Settings');
    }, [])
  );

  const handleBottomTabPress = (tab: string) => {
    setSelectedTab(tab);
    switch (tab) {
      case 'Home':
        navigation.navigate(Routes.Home);
        break;
      case 'Saved':
        navigation.navigate(Routes.Saved);
        break;
      case 'Settings':
        navigation.navigate(Routes.Settings);
        break;
      default:
        break;
    }
  };

  const handleNavigation = (route: string) => {
    // Navigate to the respective route (for demo purposes, no actual routes are implemented here)
    console.log(`Navigating to ${route}`);
  };

  return (
    <Container style={{ backgroundColor: '#F7F8FA' }}>
      <Title style={styles.title}>{t('common.appName')}</Title>
      <Content>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.darkModeContainer}>
            <Icon name="moon-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>{t('settings.dark_mode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              style={styles.switch}
            />
          </View>

          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsItem}
              onPress={() => handleNavigation(item.route)}
            >
              <Icon name={item.icon} size={24} color="#333" style={styles.icon} />
              <Text style={styles.itemText}>{t(item.title)}</Text>
              <Icon name="chevron-forward-outline" size={24} color="#333" />
            </TouchableOpacity>
          ))}

          <Text style={styles.appVersionText}>{t('settings.app_version', { version: '1.0.0' })}</Text>
        </ScrollView>
      </Content>

      <BottomTabNavigation selectedTab={selectedTab} onTabPress={handleBottomTabPress} />
    </Container>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 32,
    marginTop: '15%',
  },
  content: {
    paddingBottom: '7%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  appVersionText: {
    color: '#333',
    fontSize: 14,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default SettingsScreen;
