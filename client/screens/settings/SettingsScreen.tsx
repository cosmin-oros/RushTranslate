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
import LanguageSettings from './components/LanguageSettings';
import OfflineSettings from './components/OfflineSettings';
import PrivacyPolicy from './components/PrivacyPolicy';
import ClearAppData from './components/ClearAppData';
import Feedback from './components/Feedback';
import HelpCenter from './components/HelpCenter';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Settings>;

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RoutePropType>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Settings');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

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

  // Render the selected settings section
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'LanguageSettings':
        return <LanguageSettings onBackPress={() => setSelectedSection(null)} />;
      case 'OfflineSettings':
        return <OfflineSettings onBackPress={() => setSelectedSection(null)} />;
      case 'PrivacyPolicy':
        return <PrivacyPolicy onBackPress={() => setSelectedSection(null)} />;
      case 'ClearAppData':
        return <ClearAppData onBackPress={() => setSelectedSection(null)} />;
      case 'Feedback':
        return <Feedback onBackPress={() => setSelectedSection(null)} />;
      case 'HelpCenter':
        return <HelpCenter onBackPress={() => setSelectedSection(null)} />;
      default:
        return null;
    }
  };

  // Handle bottom tab navigation
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

  // Handle settings item selection to show specific section
  const handleNavigation = (route: string) => {
    setSelectedSection(route);
  };

  // Render either the selected section or the main settings list
  return (
    <Container style={{ backgroundColor: '#F2F5F8' }}>
      <Title style={styles.title}>{t('common.appName')}</Title>
      <Content>
        {selectedSection ? (
          <View>
            {renderSelectedSection()}
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={[styles.card, styles.darkModeContainer]}>
              <Icon name="moon-outline" size={24} color="#007F7F" style={styles.icon} />
              <Text style={styles.itemText}>{t('settings.dark_mode')}</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                style={styles.switch}
                thumbColor={isDarkMode ? '#007F7F' : '#F4F3F4'}
                trackColor={{ false: '#767577', true: '#AADFEF' }}
              />
            </View>

            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleNavigation(item.route)}
              >
                <Icon name={item.icon} size={24} color="#007F7F" style={styles.icon} />
                <Text style={styles.itemText}>{t(item.title)}</Text>
                <Icon name="chevron-forward-outline" size={24} color="#007F7F" />
              </TouchableOpacity>
            ))}

            <Text style={styles.appVersionText}>{t('settings.app_version', { version: '1.0.0' })}</Text>
          </ScrollView>
        )}
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
    color: '#333',
  },
  content: {
    paddingBottom: '7%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkModeContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
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
    transform: [{ scale: 1.1 }],
  },
  appVersionText: {
    color: '#666',
    fontSize: 14,
    marginTop: 20,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007F7F',
    marginLeft: 8,
  },
});

export default SettingsScreen;
