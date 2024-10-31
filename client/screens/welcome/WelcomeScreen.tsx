import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Content, CenteredView, LogoWrapper, Title, Subtitle, StyledButton } from '../../tamagui.config';
import { Image } from 'react-native';
import { Text } from '@tamagui/core';
import { Routes } from '../../routes/routes';
import { RouteParams } from '../../routes/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Home>;

const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RoutePropType>();

  const onGetStartedPress = () => {
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
          <StyledButton onPress={onGetStartedPress}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
              {t('welcome.get_started')}
            </Text>
          </StyledButton>
        </CenteredView>
      </Content>
    </Container>
  );
};

export default WelcomeScreen;