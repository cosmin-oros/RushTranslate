import React from 'react';
import { View, Text } from '@tamagui/core';

const BottomTabButton: React.FC<{ label: string }> = ({ label }) => (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 24, height: 24, backgroundColor: '#333', borderRadius: 4, marginBottom: 4 }} />
      <Text>{label}</Text>
    </View>
  );
  
export default BottomTabButton;