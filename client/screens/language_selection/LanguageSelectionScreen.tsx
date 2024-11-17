import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../routes/routes';
import { languages } from '../../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteParams } from '../../routes/types';

type RoutePropType = StackNavigationProp<RouteParams, Routes.LanguageSelection>;

const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<RoutePropType>();
  const [appLanguage, setAppLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);

  const handleSaveLanguages = async () => {
    if (appLanguage && targetLanguage) {
      await AsyncStorage.setItem('appLanguage', appLanguage);
      await AsyncStorage.setItem('targetLanguage', targetLanguage);

      navigation.navigate(Routes.Home); // Navigate to Home after saving languages
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo and App Name */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/applogo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>RushTranslate</Text>
      </View>

      {/* App Language Section */}
      <Text style={styles.sectionTitle}>Select App Language</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageCard,
              appLanguage === lang.code && styles.selectedCard,
            ]}
            onPress={() => setAppLanguage(lang.code)}
          >
            <Text style={styles.languageText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Target Language Section */}
      <Text style={styles.sectionTitle}>Select Translation Language</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageCard,
              targetLanguage === lang.code && styles.selectedCard,
            ]}
            onPress={() => setTargetLanguage(lang.code)}
          >
            <Text style={styles.languageText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          (!appLanguage || !targetLanguage) && styles.disabledButton,
        ]}
        onPress={handleSaveLanguages}
        disabled={!appLanguage || !targetLanguage}
      >
        <Text style={styles.saveButtonText}>Save and Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007F7F',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  languageCard: {
    padding: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
    minWidth: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  selectedCard: {
    borderColor: '#007F7F',
    backgroundColor: '#EAF4F4',
    shadowColor: '#007F7F',
    shadowOpacity: 0.4,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#007F7F',
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#AAA',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LanguageSelectionScreen;
