import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { Container, Content, Title } from '../../tamagui.config';
import BottomTabNavigation from '../home/components/BottomTabNavigation';
import { Routes } from '../../routes/routes';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RouteParams } from '../../routes/types';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  areTranslationsSaved,
  clearAllTranslationsFromStorage,
  fetchLanguageTranslations,
  removeTranslationsFromStorage,
  saveTranslationsToStorage,
} from '../../services/translationService';
import { languages as availableLanguages } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Saved>;

const SavedScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RoutePropType>();

  const [downloads, setDownloads] = useState<
    {
      id: number;
      title: string;
      size: string;
      status: string;
      progress: Animated.Value | number;
      icon: string;
      language: string;
    }[]
  >([]);
  const [selectedTab, setSelectedTab] = useState('Saved');
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('FR'); // Default language for all cards

  const initializeDownloads = useCallback(async (language: string) => {
    const initialDownloads = [
      {
        id: 1,
        title: 'saved.travel_essentials',
        size: '90 MB',
        status: 'Download',
        progress: 0,
        icon: 'airplane-outline',
        language: language.toUpperCase(),
      },
      {
        id: 2,
        title: 'saved.business_essentials',
        size: '73 MB',
        status: 'Download',
        progress: 0,
        icon: 'briefcase-outline',
        language: language.toUpperCase(),
      },
      {
        id: 3,
        title: 'saved.medical_care_essentials',
        size: '61 MB',
        status: 'Download',
        progress: 0,
        icon: 'medkit-outline',
        language: language.toUpperCase(),
      },
    ];

    // Check if each translation is saved locally and update the status accordingly
    const updatedDownloads = await Promise.all(
      initialDownloads.map(async (item) => {
        const isSaved = await areTranslationsSaved(item.title.replace('saved.', ''), language);
        return {
          ...item,
          status: isSaved ? 'Remove' : 'Download',
          progress: isSaved ? 100 : 0,
        };
      })
    );

    setDownloads(updatedDownloads);
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      const targetLanguage = (await AsyncStorage.getItem('targetLanguage')) || 'FR';
      setSelectedLanguage(targetLanguage.toUpperCase());
      await initializeDownloads(targetLanguage);
    };

    fetchLanguages();
  }, [initializeDownloads]);

  useFocusEffect(
    useCallback(() => {
      setSelectedTab('Saved');
      initializeDownloads(selectedLanguage);
    }, [selectedLanguage, initializeDownloads])
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

  const handleDownload = async (id: number) => {
    const downloadItem = downloads.find((item) => item.id === id);
    if (!downloadItem) return;

    const { title } = downloadItem;
    const language = selectedLanguage;

    try {
      // Set download progress to "In Progress"
      setDownloads((prevDownloads) =>
        prevDownloads.map((item) =>
          item.id === id
            ? { ...item, status: 'In Progress', progress: new Animated.Value(0) }
            : item
        )
      );

      // Check if translations are already saved locally
      const isSaved = await areTranslationsSaved(title.replace('saved.', ''), language);
      if (isSaved) {
        console.log(`Translations for ${title} (${language}) are already saved locally.`);
        setDownloads((prevDownloads) =>
          prevDownloads.map((item) =>
            item.id === id ? { ...item, status: 'Remove', progress: 100 } : item
          )
        );
        return;
      }

      // Fetch translations from the API
      const translations = await fetchLanguageTranslations(
        title.replace('saved.', ''),
        language
      );

      // Save translations locally
      await saveTranslationsToStorage(title.replace('saved.', ''), language, translations);

      console.log('Fetched Translations:', translations);

      // Start a static time animation for download progress
      const progressAnimation = new Animated.Value(0);
      Animated.timing(progressAnimation, {
        toValue: 100,
        duration: 3000, // Static duration for the download animation
        useNativeDriver: false,
      }).start(() => {
        // After animation is complete, set progress to 100% and update status
        setDownloads((prevDownloads) =>
          prevDownloads.map((item) =>
            item.id === id ? { ...item, status: 'Remove', progress: 100 } : item
          )
        );
      });

      // Update the progress animation in state
      setDownloads((prevDownloads) =>
        prevDownloads.map((item) =>
          item.id === id ? { ...item, progress: progressAnimation } : item
        )
      );
    } catch (error) {
      console.error('Error downloading translations:', error);

      // Reset download progress on failure
      setDownloads((prevDownloads) =>
        prevDownloads.map((item) =>
          item.id === id ? { ...item, status: 'Download', progress: 0 } : item
        )
      );
    }
  };

  const handleRemove = async (id: number) => {
    const downloadItem = downloads.find((item) => item.id === id);
    if (!downloadItem) return;

    const { title } = downloadItem;
    const language = selectedLanguage;

    try {
      // Remove translations from local storage
      await removeTranslationsFromStorage(title.replace('saved.', ''), language);

      // Reset download status
      setDownloads((prevDownloads) =>
        prevDownloads.map((item) =>
          item.id === id ? { ...item, status: 'Download', progress: 0 } : item
        )
      );
    } catch (error) {
      console.error('Error removing translations:', error);
    }
  };

  const handleClearAllDownloads = async () => {
    try {
      // Clear all translations from local storage
      await clearAllTranslationsFromStorage();

      // Reset all download statuses
      setDownloads((prevDownloads) =>
        prevDownloads.map((item) => ({ ...item, status: 'Download', progress: 0 }))
      );
    } catch (error) {
      console.error('Error clearing all downloads:', error);
    }
  };

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code.toUpperCase());
    setLanguageModalVisible(false);
    initializeDownloads(code); // Reset downloads to the selected language
  };

  return (
    <Container style={{ backgroundColor: '#EAF4F4' }}>
      <Title style={styles.title}>{t('common.appName')}</Title>
      <Content>
        <TouchableOpacity
          style={styles.languageSelector}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Icon name="language-outline" size={20} color="#007F7F" />
          <Text style={styles.languageSelectorText}>Language: {selectedLanguage}</Text>
        </TouchableOpacity>
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
                      {
                        width:
                          item.progress instanceof Animated.Value
                            ? item.progress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                              })
                            : `${item.progress}%`,
                      },
                    ]}
                  />
                </View>
              )}

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

      <Modal visible={isLanguageModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Icon name={item.icon} size={24} color="#007F7F" style={{ marginRight: 10 }} />
                  <Text style={styles.languageOptionText}>{item.code.toUpperCase()}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  languageSelectorText: {
    fontSize: 16,
    color: '#007F7F',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
    alignItems: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    width: '100%',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007F7F',
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SavedScreen;
