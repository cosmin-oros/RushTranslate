import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Content, Title } from '../../tamagui.config';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from './components/Card';
import BottomTabNavigation from './components/BottomTabNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { Routes } from '../../routes/routes';
import { RouteParams } from '../../routes/types';
import { languages } from '../../constants';
import { translateText } from '../../services/translationService';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Home>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBottomTab, setSelectedBottomTab] = useState('Home');
  const [selectedAction, setSelectedAction] = useState('Write');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [languagesState, setLanguagesState] = useState({ top: 'EN', bottom: 'FR' });
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageModalPosition, setLanguageModalPosition] = useState<'top' | 'bottom'>('top');
  const navigation = useNavigation<RoutePropType>();

  useEffect(() => {
    const loadLanguages = async () => {
      const appLanguage = (await AsyncStorage.getItem('appLanguage') || 'en').toUpperCase();
      const targetLanguage = (await AsyncStorage.getItem('targetLanguage') || 'fr').toUpperCase();
      setLanguagesState({ top: appLanguage, bottom: targetLanguage });
    };

    loadLanguages();
  }, []);

  const handleTopTextChange = async (text: string) => {
    setTopText(text);
    if (text.trim()) {
      const translatedText = await translateText(
        languagesState.top,
        languagesState.bottom,
        text
      );
      setBottomText(translatedText);
    } else {
      setBottomText('');
    }
  };

  const handleBottomTextChange = async (text: string) => {
    setBottomText(text);
    if (text.trim()) {
      const translatedText = await translateText(
        languagesState.bottom,
        languagesState.top,
        text
      );
      setTopText(translatedText);
    } else {
      setTopText('');
    }
  };

  const handleBottomTabPress = (tab: string) => {
    setSelectedBottomTab(tab);
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

  useFocusEffect(
    useCallback(() => {
      setSelectedBottomTab('Home');
    }, [])
  );

  const handleActionPress = (action: string) => {
    if (action === 'Camera') {
      navigation.navigate(Routes.Camera);
    } else if (action === 'Record') {
      navigation.navigate(Routes.Voice);
    } else {
      setSelectedAction(action);
    }
  };

  const handleLanguageSwitch = () => {
    setLanguagesState((prev) => ({
      top: prev.bottom,
      bottom: prev.top,
    }));
    setTopText(bottomText);
    setBottomText(topText);
  };

  const handleLanguageCardPress = (position: 'top' | 'bottom') => {
    setLanguageModalPosition(position);
    setLanguageModalVisible(true);
  };

  const selectLanguage = (code: string) => {
    setLanguagesState((prev) => ({
      ...prev,
      [languageModalPosition]: code.toUpperCase(),
    }));
    setLanguageModalVisible(false);
  };

  return (
    <Container>
      <Title style={{ textAlign: 'center', fontSize: 32, marginTop: '15%' }}>
        {t('common.appName')}
      </Title>
      <Content
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: '7%',
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ gap: 16, width: '100%', alignItems: 'center' }}>
          {selectedAction === 'Write' && (
            <>
              <Card
                title={languagesState.top}
                placeholder={t('home.type_text_here')}
                textInputValue={topText}
                setTextInputValue={handleTopTextChange}
                onLanguagePress={() => handleLanguageCardPress('top')}
              />

              <TouchableOpacity onPress={handleLanguageSwitch} style={{ marginVertical: 16 }}>
                <Icon name="swap-horiz" size={30} color="#007F7F" />
              </TouchableOpacity>

              <Card
                title={languagesState.bottom}
                placeholder={t('home.type_text_here')}
                textInputValue={bottomText}
                setTextInputValue={handleBottomTextChange}
                onLanguagePress={() => handleLanguageCardPress('bottom')}
              />
            </>
          )}

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedAction === 'Write' && styles.selectedButton
              ]}
              onPress={() => handleActionPress('Write')}
            >
              <Icon
                name="edit"
                size={24}
                color={selectedAction === 'Write' ? '#FFFFFF' : '#A9A9A9'}
              />
              <Text style={[
                styles.actionButtonText,
                selectedAction === 'Write' && styles.selectedButtonText
              ]}>
                Write
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedAction === 'Camera' && styles.selectedButton
              ]}
              onPress={() => handleActionPress('Camera')}
            >
              <Icon
                name="camera-alt"
                size={24}
                color={selectedAction === 'Camera' ? '#FFFFFF' : '#A9A9A9'}
              />
              <Text style={[
                styles.actionButtonText,
                selectedAction === 'Camera' && styles.selectedButtonText
              ]}>
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedAction === 'Record' && styles.selectedButton
              ]}
              onPress={() => handleActionPress('Record')}
            >
              <Icon
                name="mic"
                size={24}
                color={selectedAction === 'Record' ? '#FFFFFF' : '#A9A9A9'}
              />
              <Text style={[
                styles.actionButtonText,
                selectedAction === 'Record' && styles.selectedButtonText
              ]}>
                Record
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Content>

      <BottomTabNavigation selectedTab={selectedBottomTab} onTabPress={handleBottomTabPress} />

      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => selectLanguage(item.code)}
                >
                  <Icon name={item.icon} size={24} color="#007F7F" style={{ marginRight: 10 }} />
                  <Text style={styles.languageText}>{item.label}</Text>
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#007F7F',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionButtonText: {
    color: '#A9A9A9',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedButtonText: {
    color: '#FFFFFF',
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
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007F7F',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default HomeScreen;
