import React from 'react';
import { View, Text } from 'react-native';

const Card: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <View style={{ backgroundColor: '#E0E0E0', borderRadius: 16, padding: 16, width: '100%' }}>
    <Text style={{ fontWeight: 'bold', color: '#333', marginBottom: 8 }}>{title}</Text>
    <Text>{subtitle}</Text>
  </View>
);

export default Card;
