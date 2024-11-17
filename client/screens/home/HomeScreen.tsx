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
import Icon from 'react-native-vector-icons/Ionicons';
import Card from './components/Card';
import ActionButton from './components/ActionButton';
import BottomTabNavigation from './components/BottomTabNavigation';
import RecordSection from './components/RecordSection';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { Routes } from '../../routes/routes';
import { RouteParams } from '../../routes/types';
import ScanSection from './components/ScanSection';
import { languages } from '../../constants'; 

type RoutePropType = StackNavigationProp<RouteParams, Routes.Home>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBottomTab, setSelectedBottomTab] = useState('Home');
  const [selectedAction, setSelectedAction] = useState('Write');
  const [textInputValue, setTextInputValue] = useState('');
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
    setSelectedAction(action);
  };

  const handleLanguageSwitch = () => {
    setLanguagesState((prev) => ({
      top: prev.bottom,
      bottom: prev.top,
    }));
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
        {/* Main Content Area */}
        <View style={{ gap: 16, width: '100%', alignItems: 'center' }}>
          {selectedAction === 'Write' ? (
            <>
              <Card
                title={languagesState.top}
                placeholder={t('home.type_text_here')}
                textInputValue={textInputValue}
                setTextInputValue={setTextInputValue}
                onLanguagePress={() => handleLanguageCardPress('top')}
              />

              {/* Language Switch Icon */}
              <TouchableOpacity onPress={handleLanguageSwitch} style={{ marginVertical: 16 }}>
                <Icon name="swap-vertical" size={30} color="#007F7F" />
              </TouchableOpacity>

              <Card
                title={languagesState.bottom}
                placeholder={t('home.type_text_here')}
                textInputValue={textInputValue}
                setTextInputValue={setTextInputValue}
                onLanguagePress={() => handleLanguageCardPress('bottom')}
              />
            </>
          ) : selectedAction === 'Record' ? (
            <RecordSection onTextGenerated={(text) => setTextInputValue(text)} />
          ) : (
            <ScanSection languages={languagesState} handleLanguageSwitch={handleLanguageSwitch} />
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
            <ActionButton
              label="Write"
              isSelected={selectedAction === 'Write'}
              onPress={() => handleActionPress('Write')}
            />
            <ActionButton
              label="Record"
              isSelected={selectedAction === 'Record'}
              onPress={() => handleActionPress('Record')}
            />
            <ActionButton
              label="Scan"
              isSelected={selectedAction === 'Scan'}
              onPress={() => handleActionPress('Scan')}
            />
          </View>
        </View>
      </Content>

      <BottomTabNavigation selectedTab={selectedBottomTab} onTabPress={handleBottomTabPress} />

      {/* Language Selection Modal */}
      <Modal visible={isLanguageModalVisible} transparent animationType="slide">
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
    alignItems: 'center',
    maxHeight: '50%',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    width: '100%',
  },
  languageText: {
    fontSize: 18,
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
