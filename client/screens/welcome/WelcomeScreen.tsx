import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Content, CenteredView, LogoWrapper, Title, Subtitle } from '../../tamagui.config';
import { Image, TouchableOpacity, Text } from 'react-native';
import { Routes } from '../../routes/routes';
import { RouteParams } from '../../routes/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Home>;

const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RoutePropType>();

  const onGetStartedPress = () => {
    console.log('daaa')
    navigation.navigate(Routes.Home);
  };

  return (
    <Container>
      <Content contentContainerStyle={{ flexGrow: 1 }}>
        <CenteredView>
          {/* Logo or Illustration */}
          <LogoWrapper>
            <Image 
              source={require('../../assets/applogo.png')} 
              style={{ width: 120, height: 120, resizeMode: 'contain' }}
            />
          </LogoWrapper>

          {/* Title */}
          <Title>
            {t('common.appName')}
          </Title>

          {/* Subtitle */}
          <Subtitle>
            {t('welcome.subtitle')}
          </Subtitle>

          {/* Action Button */}
          <TouchableOpacity
            onPress={onGetStartedPress}
            style={{
              backgroundColor: '#007F7F',
              paddingVertical: 18,
              paddingHorizontal: 32,
              borderRadius: 20,
              marginTop: 24,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18 }}>
              {t('welcome.get_started')}
            </Text>
          </TouchableOpacity>
        </CenteredView>
      </Content>
    </Container>
  );
};

export default WelcomeScreen;