import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, ImageBackground } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Container, Content, Title } from '../../tamagui.config';
import RecognitionService from '../../services/recognition';
import { RecognizedText } from '../../types';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../home/components/Card';
import BottomTabNavigation from '../home/components/BottomTabNavigation';
import { useNavigation } from '@react-navigation/core';
import { Routes } from '../../routes/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteParams } from '../../routes/types';

type NavigationProp = StackNavigationProp<RouteParams>;

const CameraScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [selectedBottomTab, setSelectedBottomTab] = useState('Home');
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedTexts, setRecognizedTexts] = useState<RecognizedText[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState({ top: 'EN', bottom: 'FR' });
  const cameraRef = useRef<any>(null);

  const handleLanguageSwitch = () => {
    setLanguages(prev => ({
      top: prev.bottom,
      bottom: prev.top,
    }));
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync();
        setPreviewVisible(true);
        setCapturedImage(photo);
        await processImage(photo.uri);
      } catch (error) {
        console.error('Camera capture error:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleGalleryPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setIsProcessing(true);
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery pick error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      const recognitionService = RecognitionService.getInstance();
      const texts = await recognitionService.recognizeTextFromImage(imageUri);
      setRecognizedTexts(texts);
      const combinedText = texts.map(t => t.text).join(' ');
      setSourceText(combinedText);
      // Here you would call your translation service
      setTranslatedText('Translation will appear here'); // Replace with actual translation
    } catch (error) {
      console.error('Process image error:', error);
    }
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    setSourceText('');
    setTranslatedText('');
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

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'Write':
        navigation.navigate(Routes.Home);
        break;
      case 'Record':
        navigation.navigate(Routes.Voice);
        break;
      default:
        break;
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.message}>{t('Camera permission denied')}</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.buttonText}>{t('Grant permission')}</Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Title style={{ textAlign: 'center', fontSize: 32, marginTop: '15%' }}>
        {t('common.appName')}
      </Title>
      <Content contentContainerStyle={styles.content}>
        <Card
          title={languages.top}
          placeholder={t('Detected text will appear here')}
          textInputValue={sourceText}
          setTextInputValue={setSourceText}
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

        <View style={styles.cameraContainer}>
          {!previewVisible ? (
            <CameraView
              style={styles.camera}
              facing={type}
              enableTorch={false}
              onMountError={(error) => console.error('Camera mount error:', error)}
            >
              <View style={styles.overlay}>
                {recognizedTexts.map((text, index) => (
                  <View
                    key={index}
                    style={[
                      styles.textOverlay,
                      {
                        left: text.bounds.left,
                        top: text.bounds.top,
                        width: text.bounds.right - text.bounds.left,
                        height: text.bounds.bottom - text.bounds.top,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setType(type === 'back' ? 'front' : 'back')}
                >
                  <Icon name="flip-camera-ios" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton, styles.captureButton]}
                  onPress={handleCameraCapture}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Icon name="camera" size={36} color="white" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleGalleryPick}
                  disabled={isProcessing}
                >
                  <Icon name="photo-library" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.previewContainer}>
              <ImageBackground source={{ uri: capturedImage.uri }} style={styles.camera}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={__retakePicture} style={styles.iconButton}>
                    <Icon name="refresh" size={24} color="white" />
                    <Text style={styles.buttonText}>{t('Retake')}</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
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
            style={[styles.actionButton, styles.selectedButton]}
          >
            <Icon name="camera-alt" size={24} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.selectedButtonText]}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => handleActionPress('Record')}
          >
            <Icon name="mic" size={24} color="#A9A9A9" />
            <Text style={styles.actionButtonText}>Record</Text>
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
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#007F7F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  switchButton: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  cameraContainer: {
    aspectRatio: 3/4,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlay: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007F7F',
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

export default CameraScreen; 