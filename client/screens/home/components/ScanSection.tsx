import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

type ScanSectionProps = {
  languages: { top: string; bottom: string };
  handleLanguageSwitch: () => void;
};

const ScanSection: React.FC<ScanSectionProps> = ({ languages, handleLanguageSwitch }) => {
  const [scannedText, setScannedText] = useState<string | null>(null);

  const handleOpenCamera = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera access is needed to scan text');
      return;
    }

    // Launch the camera to take a picture
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      // Simulate OCR processing with mock text
      const mockScannedText = "This is a simulated transcription of the scanned image.";
      setScannedText(mockScannedText);

      // In a real implementation, send result.uri to an OCR API to get actual text.
    }
  };

  return (
    <View style={styles.container}>
      {/* Language Switch Row */}
      <View style={styles.languageRow}>
        <Text style={styles.languageText}>{languages.top}</Text>
        <TouchableOpacity onPress={handleLanguageSwitch} style={styles.switchIcon}>
          <Icon name="swap-horizontal" size={24} color="#007F7F" />
        </TouchableOpacity>
        <Text style={styles.languageText}>{languages.bottom}</Text>
      </View>

      {/* Scanned Text Display */}
      <View style={styles.card}>
        <Text style={styles.text}>
          {scannedText || 'Tap the camera icon to scan text...'}
        </Text>
      </View>

      {/* Camera Button */}
      <TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
        <Icon name="camera" size={30} color="#FFF" />
      </TouchableOpacity>
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
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
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
});

export default ScanSection;
