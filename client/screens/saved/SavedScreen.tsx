import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Title } from '../../tamagui.config';
import BottomTabNavigation from '../home/components/BottomTabNavigation';
import { Routes } from '../../routes/routes';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RouteParams } from '../../routes/types';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Saved>;

const SavedScreen: React.FC = () => {
  const [downloads, setDownloads] = useState([
    { id: 1, title: 'saved.travel_essentials', size: '90', status: 'Download' },
    { id: 2, title: 'saved.business_essentials', size: '73', status: 'Remove' },
    { id: 3, title: 'saved.medical_care_essentials', size: '61', status: 'In Progress', progress: '23 / 61' },
  ]);
  const navigation = useNavigation<RoutePropType>();
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState('Saved');

  useFocusEffect(
    useCallback(() => {
      setSelectedTab('Saved');
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

  const handleDownloadAction = (id: number) => {
    console.log(`Download action for item ${id}`);
  };

  const handleRemoveAction = (id: number) => {
    console.log(`Remove action for item ${id}`);
  };

  const handleClearAllDownloads = () => {
    console.log('Clear all downloads');
  };

  return (
    <Container>
      <Title style={styles.title}>{t('common.appName')}</Title>
      <Content>
        <ScrollView contentContainerStyle={styles.content}>
          {downloads.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.titleText}>{t(item.title)}</Text>
              <Text style={styles.sizeText}>{t('saved.size_mb', { size: item.size })}</Text>
              {item.status === 'Download' ? (
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownloadAction(item.id)}
                >
                  <Text style={styles.buttonText}>{t('saved.download')}</Text>
                </TouchableOpacity>
              ) : item.status === 'Remove' ? (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveAction(item.id)}
                >
                  <Text style={styles.buttonText}>{t('saved.remove')}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>{t('saved.downloading')}</Text>
                  <Text style={styles.progressText}>{item.progress}</Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClearAllDownloads}>
            <Text style={styles.clearButtonText}>{t('saved.clear_all_downloads')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Content>

      {/* Bottom Navigation - positioned below Content */}
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
  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sizeText: {
    color: '#6B6B6B',
    marginBottom: 8,
  },
  downloadButton: {
    backgroundColor: '#007F7F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  removeButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default SavedScreen;
