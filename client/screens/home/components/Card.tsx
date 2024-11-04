import React from 'react';
import { View, Text } from '@tamagui/core';

const Card: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <View style={{ backgroundColor: '#E0E0E0', borderRadius: 16, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', color: '#333' }}>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );

export default Card;