import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { languages as availableLanguages } from '../../../constants';

const RecordSection: React.FC<{ onTextGenerated: (text: string) => void }> = ({ onTextGenerated }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState({ top: 'EN', bottom: 'FR' }); // Use abbreviations here
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageModalPosition, setLanguageModalPosition] = useState<'top' | 'bottom'>('top');

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);

    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();

      if (uri) {
        const transcription = await transcribeAudio(uri); // Mock transcription
        setTranscribedText(transcription);
        onTextGenerated(transcription);
      }

      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock transcription function with a delay
  const transcribeAudio = async (uri: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockTranscription = 'This is a simulated transcription of your recording.';
        resolve(mockTranscription);
      }, 2000); // 2-second delay to simulate processing time
    });
  };

  const handleLanguageSwitch = () => {
    setLanguages((prev) => ({
      top: prev.bottom,
      bottom: prev.top,
    }));
  };

  const handleLanguageCardPress = (position: 'top' | 'bottom') => {
    setLanguageModalPosition(position);
    setLanguageModalVisible(true);
  };

  const selectLanguage = (code: string) => {
    setLanguageModalVisible(false);
    if (languageModalPosition === 'top') {
      setLanguages((prev) => ({ ...prev, top: code.toUpperCase() }));
    } else {
      setLanguages((prev) => ({ ...prev, bottom: code.toUpperCase() }));
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

      {/* Recording Card */}
      <View style={styles.card}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007F7F" />
        ) : (
          <Text style={styles.text}>{transcribedText || 'Press record to start speaking...'}</Text>
        )}
      </View>

      {/* Record Button */}
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recording]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Icon name={isRecording ? 'stop' : 'mic'} size={30} color="#FFF" />
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
                  <Text style={styles.languageOptionText}>{item.code.toUpperCase()}</Text> {/* Abbreviation */}
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
    backgroundColor: '#F9F9F9',
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
  },
  text: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  recordButton: {
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
    marginTop: 20,
  },
  recording: {
    backgroundColor: '#FF5A5F',
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

export default RecordSection;
