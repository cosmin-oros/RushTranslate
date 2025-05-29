import TextRecognition from '@react-native-ml-kit/text-recognition';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { RecognizedText, VoiceRecognitionResult } from '../types';

class RecognitionService {
  private static instance: RecognitionService;
  private isVoiceListening: boolean = false;

  private constructor() {
    Voice.onSpeechResults = this.handleVoiceResults.bind(this);
    Voice.onSpeechError = this.handleVoiceError.bind(this);
  }

  public static getInstance(): RecognitionService {
    if (!RecognitionService.instance) {
      RecognitionService.instance = new RecognitionService();
    }
    return RecognitionService.instance;
  }

  public async recognizeTextFromImage(imageUri: string): Promise<RecognizedText[]> {
    try {
      const result = await TextRecognition.recognize(imageUri);
      return result.blocks.map((block: any) => ({
        text: block.text,
        bounds: block.frame,
        confidence: block.confidence || 0
      }));
    } catch (error) {
      console.error('Text recognition error:', error);
      throw error;
    }
  }

  public async startVoiceRecognition(language: string): Promise<void> {
    try {
      if (!this.isVoiceListening) {
        await Voice.start(language);
        this.isVoiceListening = true;
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
      throw error;
    }
  }

  public async stopVoiceRecognition(): Promise<void> {
    try {
      if (this.isVoiceListening) {
        await Voice.stop();
        this.isVoiceListening = false;
      }
    } catch (error) {
      console.error('Voice stop error:', error);
      throw error;
    }
  }

  public async speakText(text: string, language: string): Promise<void> {
    try {
      await Speech.speak(text, {
        language,
        pitch: 1,
        rate: 0.8,
      });
    } catch (error) {
      console.error('Speech error:', error);
      throw error;
    }
  }

  private handleVoiceResults(event: SpeechResultsEvent): void {
    if (event.value) {
      console.log('Voice results:', event.value);
    }
  }

  private handleVoiceError(error: any): void {
    console.error('Voice error:', error);
    this.isVoiceListening = false;
  }

  public async cleanup(): Promise<void> {
    try {
      await Voice.destroy();
    } catch (error) {
      console.error('Voice cleanup error:', error);
    }
  }
}

export default RecognitionService; 