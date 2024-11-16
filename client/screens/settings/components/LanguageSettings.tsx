import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Container, Title } from '../../../tamagui.config';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

const LanguageSettings: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const { t, i18n } = useTranslation();
  const languages = [
    { code: 'en', label: 'English', icon: 'flag-outline' },
    { code: 'ro', label: 'Romanian', icon: 'flag-outline' },
    { code: 'fr', label: 'French', icon: 'flag-outline' },
    { code: 'de', label: 'German', icon: 'flag-outline' },
    { code: 'it', label: 'Italian', icon: 'flag-outline' },
    { code: 'es', label: 'Spanish', icon: 'flag-outline' },
    { code: 'pt', label: 'Portuguese', icon: 'flag-outline' },
    { code: 'ru', label: 'Russian', icon: 'flag-outline' },
    { code: 'zh', label: 'Chinese', icon: 'flag-outline' },
    { code: 'ja', label: 'Japanese', icon: 'flag-outline' },
    { code: 'ar', label: 'Arabic', icon: 'flag-outline' },
    { code: 'hi', label: 'Hindi', icon: 'flag-outline' },
    { code: 'bn', label: 'Bengali', icon: 'flag-outline' },
    { code: 'ko', label: 'Korean', icon: 'flag-outline' },
    { code: 'tr', label: 'Turkish', icon: 'flag-outline' },
    { code: 'vi', label: 'Vietnamese', icon: 'flag-outline' },
    { code: 'nl', label: 'Dutch', icon: 'flag-outline' },
    { code: 'pl', label: 'Polish', icon: 'flag-outline' },
    { code: 'sv', label: 'Swedish', icon: 'flag-outline' },
    { code: 'th', label: 'Thai', icon: 'flag-outline' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <Container style={{ backgroundColor: '#F7F8FA' }}>
      {/* Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#007F7F" />
        </TouchableOpacity>
        <Title style={styles.title}>{t('settings.language')}</Title>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {languages.map((lang) => (
          <TouchableOpacity 
            key={lang.code} 
            style={styles.optionCard} 
            onPress={() => handleLanguageChange(lang.code)}
          >
            <View style={styles.optionContent}>
              <Icon name={lang.icon} size={24} color="#007F7F" style={styles.icon} />
              <Text style={styles.optionText}>{lang.label}</Text>
            </View>
            {i18n.language === lang.code && (
              <Icon name="checkmark-circle" size={24} color="#007F7F" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    color: '#333',
    flex: 1,
    marginRight: 16
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#007F7F',
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
});

export default LanguageSettings;
