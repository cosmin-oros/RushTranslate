import React from 'react';
import { Text } from '@tamagui/core';
import { StyledButton } from '../../../tamagui.config';

const ActionButton: React.FC<{ label: string }> = ({ label }) => (
    <StyledButton style={{ width: 80, height: 80, borderRadius: 40 }}>
      <Text>{label}</Text>
    </StyledButton>
  );
  
export default ActionButton;