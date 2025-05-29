import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, ImageBackground } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'tamagui';
import RecognitionService from '../../services/recognition';
import { RecognizedText } from '../../types';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CameraScreen: React.FC = () => {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedTexts, setRecognizedTexts] = useState<RecognizedText[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const cameraRef = useRef<any>(null);

  const __startCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
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
    } catch (error) {
      console.error('Process image error:', error);
    }
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t('Camera permission denied')}</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>{t('Grant permission')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (previewVisible && capturedImage) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: capturedImage.uri }}
          style={styles.camera}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={__retakePicture}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{t('Re-take')}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            >
              <Text style={styles.overlayText}>{text.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setType(type === 'back' ? 'front' : 'back')}
          >
            <Icon name="flip-camera-ios" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.captureButton]}
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
            style={styles.button}
            onPress={handleGalleryPick}
            disabled={isProcessing}
          >
            <Icon name="photo-library" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  overlayText: {
    color: '#00ff00',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  captureButton: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
});

export default CameraScreen; 