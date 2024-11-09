import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';

const RecordSection: React.FC<{ onTextGenerated: (text: string) => void }> = ({ onTextGenerated }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState({ top: 'English', bottom: 'French' });

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
        const mockTranscription = "This is a simulated transcription of your recording.";
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
});

export default RecordSection;
