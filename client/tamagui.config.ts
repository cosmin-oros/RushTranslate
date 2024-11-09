import { createTamagui, createTokens, createFont, styled, View, Text, Button } from 'tamagui';
import { ScrollView, TouchableOpacity } from 'react-native';

const tokens = createTokens({
    size: { 0: 0, 1: 8, 2: 16, 3: 24, 4: 36, 5: 48, true: 16 },
    space: { 0: 0, 1: 8, 2: 16, 3: 24, 4: 36, true: 16 },
    color: {
        primary: '#EAF4F4',          // Light teal for background
        secondary: '#333333',        // Dark gray text
        accentBlue: '#007F7F',       // Teal accent for buttons and highlights
        accentCoral: '#FF5A5F',      // Coral for secondary highlights
        subtitleGray: '#6B6B6B',     // Soft gray for subtitle
        darkBackground: '#1C1C1E',   // Dark gray for dark theme background
        lightText: '#F5F5F5',        // Light color for text on dark background
    },
    radius: { 0: 0, 1: 8, 2: 16, true: 16 },
    zIndex: { 0: 0, 1: 10, 2: 20 },
});

const font = createFont({
  family: 'Inter, Arial, sans-serif',
  size: { 1: 16, 2: 20, 3: 28, 4: 36 },
  weight: { 400: 'normal', 700: 'bold' },
  lineHeight: { 1: 24, 2: 28, 3: 36 },
});

export const CenteredView = styled(View, {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  padding: '$space.3',
});

export const LogoWrapper = styled(View, {
  marginBottom: '$space.4',
});

export const Title = styled(Text, {
  fontFamily: '$body',
  fontSize: '$4',
  fontWeight: '700',
  color: '$color.secondary',
  textAlign: 'center',
});

export const Subtitle = styled(Text, {
  fontFamily: '$body',
  fontSize: '$2',
  color: '$color.subtitleGray',
  textAlign: 'center',
  marginTop: '$space.2',
});

export const Container = styled(View, {
  flex: 1,
  backgroundColor: '$color.primary',
});

export const Content = styled(ScrollView, {
  flex: 1,
  padding: '$space.3',
});

const config = createTamagui({
  tokens,
  fonts: {
    body: font,
  },
  themes: {
    light: {
      background: '$color.primary',
      primaryColor: '$color.accentBlue',
      secondaryColor: '$color.secondary',
      tertiaryColor: '$color.accentCoral',
    },
    dark: {
      background: '$color.darkBackground',
      color: '$color.lightText',
      primaryColor: '$color.accentBlue',
      secondaryColor: '$color.lightText',
      tertiaryColor: '$color.accentCoral',
    },
  },
});

export default config;
