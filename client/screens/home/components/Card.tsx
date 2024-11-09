import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { CardProps } from '../../../types';

const Card: React.FC<CardProps> = ({ title, textInputValue, setTextInputValue }) => (
  <View style={styles.card}>
    <View style={styles.languageContainer}>
      <Text style={styles.languageText}>{title}</Text>
    </View>
    <TextInput
      style={styles.textInput}
      placeholder="Type text here..."
      value={textInputValue}
      onChangeText={setTextInputValue}
      multiline
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  languageContainer: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  languageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#333',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
});

export default Card;
