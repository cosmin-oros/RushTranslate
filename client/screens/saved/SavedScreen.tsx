import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Container, Content, Title } from '../../tamagui.config';
import BottomTabNavigation from '../home/components/BottomTabNavigation';
import { Routes } from '../../routes/routes';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RouteParams } from '../../routes/types';
import Icon from 'react-native-vector-icons/Ionicons';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Saved>;

const SavedScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RoutePropType>();

  const [downloads, setDownloads] = useState<
    { id: number; title: string; size: string; status: string; progress: Animated.Value | number; icon: string; language: string; }[]
  >([
    { id: 1, title: 'saved.travel_essentials', size: '90 MB', status: 'Download', progress: 0, icon: 'airplane-outline', language: 'FR' },
    { id: 2, title: 'saved.business_essentials', size: '73 MB', status: 'Download', progress: 0, icon: 'briefcase-outline', language: 'FR' },
    { id: 3, title: 'saved.medical_care_essentials', size: '61 MB', status: 'Download', progress: 0, icon: 'medkit-outline', language: 'FR' },
  ]);

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

  const handleDownload = (id: number) => {
    const updatedDownloads = downloads.map((item) => {
      if (item.id === id) {
        return { ...item, status: 'In Progress', progress: new Animated.Value(0) };
      }
      return item;
    });
    setDownloads(updatedDownloads);

    const progressAnimation = updatedDownloads.find((item) => item.id === id)?.progress as Animated.Value;

    Animated.timing(progressAnimation, {
      toValue: 100,
      duration: 5000, // 5 seconds
      useNativeDriver: false,
    }).start(() => {
      setDownloads((prevDownloads) =>
        prevDownloads.map((item) =>
          item.id === id ? { ...item, status: 'Remove', progress: 100 } : item
        )
      );
    });
  };

  const handleRemove = (id: number) => {
    setDownloads((prevDownloads) =>
      prevDownloads.map((item) =>
        item.id === id ? { ...item, status: 'Download', progress: 0 } : item
      )
    );
  };

  const handleClearAllDownloads = () => {
    setDownloads((prevDownloads) =>
      prevDownloads.map((item) => ({ ...item, status: 'Download', progress: 0 }))
    );
  };

  return (
    <Container style={{ backgroundColor: '#EAF4F4' }}>
      <Title style={styles.title}>{t('common.appName')}</Title>
      <Content>
        <ScrollView contentContainerStyle={styles.content}>
          {downloads.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconAndText}>
                <Icon name={item.icon} size={28} color="#007F7F" style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>{t(item.title)}</Text>
                  <Text style={styles.sizeText}>{item.size}</Text>
                </View>
              </View>

              {item.status === 'Download' ? (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDownload(item.id)}
                >
                  <Text style={styles.buttonText}>{t('saved.download')}</Text>
                </TouchableOpacity>
              ) : item.status === 'Remove' ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={() => handleRemove(item.id)}
                >
                  <Text style={styles.buttonText}>{t('saved.remove')}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.progressSection}>
                  <Text style={styles.progressText}>{t('saved.downloading')}</Text>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      { width: item.progress instanceof Animated.Value ? item.progress.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "100%"],
                        }) : `${item.progress}%`
                      }
                    ]}
                  />
                </View>
              )}

              {/* Language Display at Bottom Left */}
              <View style={styles.languageContainer}>
                <Icon name="language-outline" size={16} color="#007F7F" />
                <Text style={styles.languageText}>{item.language}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClearAllDownloads}>
            <Text style={styles.clearButtonText}>{t('saved.clear_all_downloads')}</Text>
          </TouchableOpacity>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingTop: 16, 
    paddingHorizontal: 20,
    paddingBottom: 25, 
    marginVertical: 12,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32, 
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sizeText: {
    color: '#666',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#007F7F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  removeButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 20,
    alignItems: 'center', 
  },
  progressText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#007F7F',
    borderRadius: 4,
    width: '90%', 
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#F0F8F8',
    padding: 6,
    borderRadius: 8,
  },
  languageText: {
    color: '#007F7F',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  clearButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default SavedScreen;
