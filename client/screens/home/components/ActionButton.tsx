import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActionButtonProps } from '../../../types';

const ActionButton: React.FC<ActionButtonProps> = ({ label, isSelected, onPress }) => {
  const iconName = label === 'Write' ? 'pencil' : label === 'Record' ? 'mic' : 'scan';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: isSelected ? '#007F7F' : '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isSelected ? 0.2 : 0,
        shadowRadius: 6,
        marginHorizontal: 12, 
      }}
    >
      <Icon
        name={iconName}
        size={18}
        color={isSelected ? '#FFFFFF' : '#A9A9A9'}
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: isSelected ? '#FFFFFF' : '#A9A9A9', fontWeight: '700', fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
