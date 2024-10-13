import { createTamagui, createTokens, createFont, styled, View, Text } from 'tamagui';
import { ScrollView, Image, TouchableOpacity } from 'react-native';

// Define your design tokens
const tokens = createTokens({
    size: { 0: 0, 1: 8, 2: 16, 3: 24, 4: 36, 5: 48, true: 16 }, 
    space: { 0: 0, 1: 8, 2: 16, 3: 24, 4: 36, true: 16 }, 
    color: {
        primary: '#FFFFFF', // White
        secondary: '#000000', // Black
        tertiary: '#5F9FD7', // ! modify here
        quaternary: '#FFD700', // ! modify here
    },
    radius: { 0: 0, 1: 8, 2: 16, true: 16 }, 
    zIndex: { 0: 0, 1: 10, 2: 20 },
});

// Define your font settings
const font = createFont({
  family: 'Inter, Arial, sans-serif',
  size: { 1: 16, 2: 20, 3: 28, 4: 36 }, 
  weight: { 400: 'normal', 700: 'bold' },
  lineHeight: { 1: 24, 2: 28, 3: 36 }, 
});

// ! define components here

export const Container = styled(View, {
  flex: 1,
  backgroundColor: '$color.primary', 
});

export const Content = styled(ScrollView, {
  flex: 1,
  padding: '$space.3',
});

// Create your Tamagui configuration
const config = createTamagui({
  tokens,
  fonts: {
    body: font,
  },
  themes: {
    light: {
      background: '$color.primary',   // White background
      primaryColor: '$color.tertiary',
      secondaryColor: '$color.secondary',
      tertiaryColor: '$color.quaternary',      
    },
    dark: {
      background: '$color.secondary', // Black background
      color: '$color.primary',
      primaryColor: '$color.tertiary',
      secondaryColor: '$color.primary',
      tertiaryColor: '$color.quaternary',              
    },
  },
});

export default config;