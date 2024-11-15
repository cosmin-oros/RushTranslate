import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Container, Title } from '../../../tamagui.config';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

const OfflineSettings: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const { t } = useTranslation();

  return (
    <Container style={{ backgroundColor: '#F7F8FA' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#007F7F" />
        </TouchableOpacity>
        <Title style={styles.title}>{t('offlineSettings.title')}</Title>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>{t('offlineSettings.description')}</Text>
        {/* Add any offline-specific settings here */}
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
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlign: 'left',
  },
  clearButton: {
    backgroundColor: '#007F7F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OfflineSettings;
