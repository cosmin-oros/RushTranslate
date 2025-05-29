import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'tamagui';
import RecognitionService from '../../services/recognition';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VoiceScreen: React.FC = () => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const recognitionService = RecognitionService.getInstance();

  useEffect(() => {
    return () => {
      // Cleanup voice recognition when component unmounts
      recognitionService.cleanup();
    };
  }, []);

  const handleStartListening = async () => {
    try {
      setIsListening(true);
      await recognitionService.startVoiceRecognition('en-US'); // Use current app language
    } catch (error) {
      console.error('Start listening error:', error);
      setIsListening(false);
    }
  };

  const handleStopListening = async () => {
    try {
      await recognitionService.stopVoiceRecognition();
      setIsListening(false);
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  };

  const handlePlayTranslation = async () => {
    if (translatedText) {
      try {
        setIsProcessing(true);
        await recognitionService.speakText(translatedText, 'es-ES'); // Use target language
      } catch (error) {
        console.error('Play translation error:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack space={4} padding={16}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{t('Recognized Text')}:</Text>
          <Text style={styles.text}>{recognizedText || t('Start speaking...')}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>{t('Translation')}:</Text>
          <Text style={styles.text}>{translatedText || t('Translation will appear here')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isListening && styles.activeButton]}
            onPress={isListening ? handleStopListening : handleStartListening}
          >
            <Icon
              name={isListening ? 'mic-off' : 'mic'}
              size={32}
              color="white"
            />
            <Text style={styles.buttonText}>
              {isListening ? t('Stop') : t('Start')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={handlePlayTranslation}
            disabled={!translatedText || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Icon name="volume-up" size={32} color="white" />
                <Text style={styles.buttonText}>{t('Play')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  activeButton: {
    backgroundColor: '#FF3B30',
  },
  playButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
});

export default VoiceScreen; 