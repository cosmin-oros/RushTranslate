import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Stack, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RecognitionService from '../../services/recognition';

const RecordScreen: React.FC = () => {
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

  const handleStartRecording = async () => {
    try {
      setIsListening(true);
      setIsProcessing(true);
      await recognitionService.startVoiceRecognition('en-US'); // Use current app language
    } catch (error) {
      console.error('Start recording error:', error);
      setIsListening(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsProcessing(true);
      await recognitionService.stopVoiceRecognition();
      setIsListening(false);
    } catch (error) {
      console.error('Stop recording error:', error);
    } finally {
      setIsProcessing(false);
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
    <YStack flex={1} padding="$4" space="$4">
      <Stack flex={1} backgroundColor="$background">
        <YStack space="$4" padding="$4">
          <View style={styles.textContainer}>
            <Text style={styles.label}>{t('Recognized Text')}:</Text>
            <Text style={styles.text}>{recognizedText || t('Start speaking...')}</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>{t('Translation')}:</Text>
            <Text style={styles.text}>{translatedText || t('Translation will appear here')}</Text>
          </View>
        </YStack>
      </Stack>

      <XStack justifyContent="center" space="$4">
        <TouchableOpacity
          style={[
            styles.recordButton,
            isListening && styles.recordingButton
          ]}
          onPress={isListening ? handleStopRecording : handleStartRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Icon
              name={isListening ? 'stop' : 'mic'}
              size={36}
              color="white"
            />
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
              <Icon name="volume-up" size={36} color="white" />
            )}
          </TouchableOpacity>
        )}
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
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
});

export default RecordScreen; 