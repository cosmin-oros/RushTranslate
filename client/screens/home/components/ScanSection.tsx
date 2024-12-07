import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import TextDetector from 'react-native-text-detector'; // OCR Library
import { languages as availableLanguages } from '../../../constants';
import { translateText } from '../../../services/translationService';

type ScanSectionProps = {
  languages: { top: string; bottom: string };
  handleLanguageSwitch: () => void;
};

const ScanSection: React.FC<ScanSectionProps> = ({
  languages,
  handleLanguageSwitch,
}) => {
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageModalPosition, setLanguageModalPosition] = useState<'top' | 'bottom'>('top');
  const [isProcessing, setIsProcessing] = useState(false); // For showing a loading indicator during OCR

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera access is needed to scan text');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;

      // Perform OCR on the selected image
      await performOCR(imageUri);
    }
  };

  const performOCR = async (imageUri: string) => {
    try {
      setIsProcessing(true);

      // Use react-native-text-detector to recognize text from the image
      const detectedText = await TextDetector.detectFromUri(imageUri);

      if (detectedText && detectedText.length > 0) {
        const recognizedText = detectedText.map((item) => item.text).join(' ');
        setScannedText(recognizedText);

        // Translate the recognized text
        const translated = await translateText(languages.top, languages.bottom, recognizedText);
        setTranslatedText(translated);
      } else {
        setScannedText('No text detected.');
      }
    } catch (error) {
      console.error('Error performing OCR:', error);
      alert('Failed to recognize text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLanguageCardPress = (position: 'top' | 'bottom') => {
    setLanguageModalPosition(position);
    setLanguageModalVisible(true);
  };

  const selectLanguage = (code: string) => {
    setLanguageModalVisible(false);
    if (languageModalPosition === 'top') {
      languages.top = code.toUpperCase();
    } else {
      languages.bottom = code.toUpperCase();
    }
  };

  return (
    <View style={styles.container}>
      {/* Language Switch Row */}
      <View style={styles.languageRow}>
        <TouchableOpacity
          onPress={() => handleLanguageCardPress('top')}
          style={styles.languageTextContainer}
        >
          <Text style={styles.languageText}>{languages.top}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLanguageSwitch} style={styles.switchIcon}>
          <Icon name="swap-horizontal" size={24} color="#007F7F" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLanguageCardPress('bottom')}
          style={styles.languageTextContainer}
        >
          <Text style={styles.languageText}>{languages.bottom}</Text>
        </TouchableOpacity>
      </View>

      {/* Scanned and Translated Text Display */}
      {isProcessing ? (
        <ActivityIndicator size="large" color="#007F7F" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.text}>
              {scannedText || 'Tap the camera icon to scan text...'}
            </Text>
          </View>
          {translatedText && (
            <View style={styles.card}>
              <Text style={styles.text}>{translatedText}</Text>
            </View>
          )}
        </>
      )}

      {/* Camera Button */}
      <TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
        <Icon name="camera" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal visible={isLanguageModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => selectLanguage(item.code)}
                >
                  <Icon name={item.icon} size={24} color="#007F7F" style={{ marginRight: 10 }} />
                  <Text style={styles.languageOptionText}>{item.label}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  languageTextContainer: {
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  switchIcon: {
    marginHorizontal: 16,
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 20,
  },
  text: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007F7F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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

export default ScanSection;
