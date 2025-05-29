import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Container, Content, Title } from '../../tamagui.config';
import RecognitionService from '../../services/recognition';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../home/components/Card';
import BottomTabNavigation from '../home/components/BottomTabNavigation';
import { useNavigation } from '@react-navigation/core';
import { Routes } from '../../routes/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteParams } from '../../routes/types';

type NavigationProp = StackNavigationProp<RouteParams>;

const VoiceScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [selectedBottomTab, setSelectedBottomTab] = useState('Home');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState({ top: 'EN', bottom: 'FR' });
  const recognitionService = RecognitionService.getInstance();

  useEffect(() => {
    return () => {
      recognitionService.cleanup();
    };
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

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'Write':
        navigation.navigate(Routes.Home);
        break;
      case 'Camera':
        navigation.navigate(Routes.Camera);
        break;
      default:
        break;
    }
  };

  const handleStartListening = async () => {
    try {
      setIsListening(true);
      setIsProcessing(true);
      await recognitionService.startVoiceRecognition(languages.top.toLowerCase());
    } catch (error) {
      console.error('Start listening error:', error);
      setIsListening(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopListening = async () => {
    try {
      setIsProcessing(true);
      await recognitionService.stopVoiceRecognition();
      setIsListening(false);
    } catch (error) {
      console.error('Stop listening error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayTranslation = async () => {
    if (translatedText) {
      try {
        setIsProcessing(true);
        await recognitionService.speakText(translatedText, languages.bottom.toLowerCase());
      } catch (error) {
        console.error('Play translation error:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleLanguageSwitch = () => {
    setLanguages(prev => ({
      top: prev.bottom,
      bottom: prev.top,
    }));
    const tempText = recognizedText;
    setRecognizedText(translatedText);
    setTranslatedText(tempText);
  };

  return (
    <Container>
      <Title style={{ textAlign: 'center', fontSize: 32, marginTop: '15%' }}>
        {t('common.appName')}
      </Title>
      <Content contentContainerStyle={styles.content}>
        <Card
          title={languages.top}
          placeholder={t('Speak to see recognized text here')}
          textInputValue={recognizedText}
          setTextInputValue={setRecognizedText}
          onLanguagePress={() => {}}
        />

        <TouchableOpacity onPress={handleLanguageSwitch} style={styles.switchButton}>
          <Icon name="swap-vertical" size={30} color="#007F7F" />
        </TouchableOpacity>

        <Card
          title={languages.bottom}
          placeholder={t('Translation will appear here')}
          textInputValue={translatedText}
          setTextInputValue={setTranslatedText}
          onLanguagePress={() => {}}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isListening && styles.recordingButton
            ]}
            onPress={isListening ? handleStopListening : handleStartListening}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <>
                <Icon
                  name={isListening ? 'stop' : 'mic'}
                  size={36}
                  color="white"
                />
                <Text style={styles.buttonText}>
                  {isListening ? t('Stop') : t('Start')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {translatedText && (
            <TouchableOpacity
              style={[styles.recordButton, styles.playButton]}
              onPress={handlePlayTranslation}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <>
                  <Icon name="volume-up" size={36} color="white" />
                  <Text style={styles.buttonText}>{t('Play')}</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => handleActionPress('Write')}
          >
            <Icon name="edit" size={24} color="#A9A9A9" />
            <Text style={styles.actionButtonText}>Write</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => handleActionPress('Camera')}
          >
            <Icon name="camera-alt" size={24} color="#A9A9A9" />
            <Text style={styles.actionButtonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.selectedButton]}
          >
            <Icon name="mic" size={24} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.selectedButtonText]}>Record</Text>
          </TouchableOpacity>
        </View>
      </Content>

      <BottomTabNavigation selectedTab={selectedBottomTab} onTabPress={handleBottomTabPress} />
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  switchButton: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007F7F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  playButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
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
});

export default VoiceScreen; 