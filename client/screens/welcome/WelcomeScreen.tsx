import React from 'react';
import { Container, Content } from '../../tamagui.config';
import { useTranslation } from 'react-i18next';

const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      {/* Header */}

      <Content>

      </Content>

    </Container>
  );
};

export default WelcomeScreen;